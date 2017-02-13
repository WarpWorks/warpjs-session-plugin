const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const config = require('./../config');

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
        res.redirect(referrer);
    } else {
        res.redirect('/');
    }
}

function loginPage(req, res) {
    res.format({
        'html': () => {
            res.status(200).render('index', {
                title: 'Login',
                bundle: 'session'
            });
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

            'application/hal+json': () => {
                res.status(200)
                    .header('Content-Type', 'application/hal+json')
                    .json({some: "HAL data"});
            },

            'default': () => {
                res.status(406).send('Unknown accept');
            }
        });
    } else {
        res.format({
            html: () => {
                res.redirect('/session?error=invalid');
            },

            'application/hal+json': () => {
                res.status(403)
                    .header('Content-Type', 'application/hal+json')
                    .json({message: "Failed authentication"});
            },

            'default': () => {
                res.status(406).send('Unknown accept');
            }
        });
    }
}

function logout(req, res) {
    res.clearCookie('i3cPortalJWT');

    res.format({
        'html': () => {
            redirectToProperPage(req, res);
        },

        'application/hal+json': () => {
            res.status(204).send();
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
