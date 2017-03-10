const _ = require('lodash');
const jwt = require('jsonwebtoken');
const url = require('url');

const config = require('./../config');
const mongoData = require('./mongo-data');
const utils = require('./../utils');

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
    utils.wrapWith406(res, {
        html: () => utils.sendIndex(res, 'Login', 'session'),

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
        }
    });
}

function login(req, res) {
    const username = req.body && req.body.username;
    const password = req.body && req.body.password;

    mongoData.getUserData(config.persistence, username, password)
        .then((user) => {
            const payload = {};

            // TODO: What other things we want to add here?
            payload.user = _.cloneDeep(_.omit(user, ['Password']));

            const token = jwt.sign(payload, config.jwtSecret, {
                algorithm: 'HS256',
                expiresIn: '1d'
            });

            res.cookie(config.jwtCookieName, token, { signed: true, httpOnly: true, sameSite: true });
            utils.wrapWith406(res, {
                'html': () => {
                    redirectToProperPage(req, res);
                },

                [utils.HAL_CONTENT_TYPE]: () => {
                    const resource = utils.createResource(req, {
                    });
                    utils.sendHal(req, res, resource);
                }
            });
        })
        .catch(() => {
            utils.wrapWith406(res, {
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
                }
            });
        });
}

function logout(req, res) {
    res.clearCookie(config.jwtCookieName);

    utils.wrapWith406(res, {
        'html': () => {
            redirectToProperPage(req, res);
        },

        [utils.HAL_CONTENT_TYPE]: () => {
            res.status(204)
                .header('Content-Type', utils.HAL_CONTENT_TYPE)
                .send();
        }
    });
}

module.exports = {
    loginPage,
    login,
    logout
};
