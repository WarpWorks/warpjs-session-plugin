const jwt = require('jsonwebtoken');

const config = require('./../config');
const utils = require('./../utils');

function i3cUser(req, res, next) {
    const cookie = req.signedCookies[config.jwtCookieName];

    if (cookie) {
        const data = jwt.verify(cookie, config.jwtSecret);
        if (data) {
            req.i3cUser = data.user;
        }
    }
    next();
}

function requiresI3cUser(perms, req, res, next) {
    if (!req.i3cUser) {
        const redirectUrl = utils.urlFormat('/session', {
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
