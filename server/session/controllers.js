const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const url = require('url');

const config = require('./../config');
const utils = require('./../utils');

const MOCK_USERS = [{
    username: 'member',
    password: bcrypt.hashSync('member'),
    firstName: 'regular',
    lastName: 'member',
    roles: [
        'member'
    ]
}, {
    username: 'content',
    password: bcrypt.hashSync('content'),
    firstName: 'content',
    lastName: 'manager',
    roles: [
        'member',
        'content'
    ]
}, {
    username: 'admin',
    password: bcrypt.hashSync('admin'),
    firstName: 'site',
    lastName: 'administrator',
    roles: [
        'member',
        'content',
        'admin'
    ]
}];

function validUser(username, password, user) {
    return user.username === username && bcrypt.compareSync(password, user.password);
}

function redirectToProperPage(req, res) {
    const referrer = req.headers.referer;
    if (req.body.redirect) {
        res.redirect(req.body.redirect);
    } else if (referrer) {
        // TODO: During logout, if user is in protected page, login out would
        // bring him to the login page.
        const referrerUrl = url.parse(referrer);

        if (referrerUrl.host !== req.headers.host) {
            // They logged in from another site?
            res.redirect('/');
        } else if (referrerUrl.pathname === '/session') {
            // We are on the login form, so just send to home page.
            res.redirect('/');
        } else {
            res.redirect(referrer);
        }
    } else {
        res.redirect('/');
    }
}

const ERROR_MESSAGES = {
    'invalid': "Failed authentication",
    '401': "You are not authorized. Switch user?",
    '403': "You must be logged in to continue"
};

function loginPage(req, res) {
    res.format({
        'html': () => {
            res.status(200).render('index', {
                title: 'Login',
                bundle: 'session'
            });
        },

        [utils.HAL_CONTENT_TYPE]: () => {
            const resource = utils.createResource(req, {
                messages: {}
            });

            resource.hideLoginHeader = true;

            resource.redirectUrl = req.query.redirect;

            resource.messages.error = ERROR_MESSAGES[req.query.error];
            if (req.i3cUser) {
                resource.messages.alreadyConnected = `Already logged in as '${req.i3cUser.username}'. Log in below to switch user.`;
            }

            utils.sendHal(req, res, resource);
        },

        'default': () => {
            res.status(406).send('Unknown accept');
        }
    });
}

function login(req, res) {
    const username = req.body && req.body.username;
    const password = req.body && req.body.password;
    const user = MOCK_USERS.find(validUser.bind(null, username, password));
    // console.log("login(): user=", user);

    if (user) {
        const payload = {};

        // TODO: What other things we want to add here?
        payload.user = _.cloneDeep(_.omit(user, ['password']));

        const token = jwt.sign(payload, config.jwtSecret);

        res.cookie(config.jwtCookieName, token, { signed: true, httpOnly: true, sameSite: true });
        res.format({
            'html': () => {
                redirectToProperPage(req, res);
            },

            [utils.HAL_CONTENT_TYPE]: () => {
                const resource = utils.createResource(req, {
                });
                utils.sendHal(req, res, resource);
            },

            'default': () => {
                res.status(406).send('Unknown accept');
            }
        });
    } else {
        res.format({
            html: () => {
                const redirectUrl = utils.urlFormat('/session', {
                    error: 'invalid',
                    redirect: req.body.redirect || req.headers.referer
                });

                res.redirect(redirectUrl);
            },

            [utils.HAL_CONTENT_TYPE]: () => {
                const resource = utils.createResource(req, {
                    message: ERROR_MESSAGES.invalid
                });
                utils.sendHal(req, res, resource, 403);
            },

            'default': () => {
                res.status(406).send('Unknown accept');
            }
        });
    }
}

function logout(req, res) {
    res.clearCookie(config.jwtCookieName);

    res.format({
        'html': () => {
            redirectToProperPage(req, res);
        },

        [utils.HAL_CONTENT_TYPE]: () => {
            res.status(204)
                .header('Content-Type', utils.HAL_CONTENT_TYPE)
                .send();
        },

        'default': () => {
            res.status(406).send('Unknown accept');
        }
    });
}

module.exports = {
    loginPage,
    login,
    logout
};
