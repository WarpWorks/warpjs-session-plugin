const jwt = require('jsonwebtoken');

const config = require('./../config');

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

module.exports = {
    i3cUser
};
