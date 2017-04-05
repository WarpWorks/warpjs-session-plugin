const jwt = require('jsonwebtoken');
const routesInfo = require('@quoin/expressjs-routes-info');

const config = require('./../config');
const utils = require('./../utils');

function i3cUser(req, res, next) {
    if (req.signedCookies) {
        const cookie = req.signedCookies[config.jwtCookieName];

        if (cookie) {
            try {
                const data = jwt.verify(cookie, config.jwtSecret, {
                    algorithms: ['HS256']
                });
                req.i3cUser = data.user;
            } catch (e) {
                // TODO: Log this error
                req.i3cUserInvalid = 'Invalid token';
            }
        }
    }
    next();
}

function requiresI3cUser(perms, req, res, next) {
    if (!req.i3cUser) {
        const redirectUrl = utils.urlFormat(routesInfo.expand('login'), {
            error: '403',
            redirect: req.originalUrl
        });
        res.redirect(redirectUrl);
    } else {
        // TODO: Need to check permissions.
        next();
    }
}

module.exports = {
    i3cUser,
    requiresI3cUser
};
