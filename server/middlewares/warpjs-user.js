const jwt = require('jsonwebtoken');

const constants = require('./../constants');

module.exports = (config, warpCore, Persistence, req, res, next) => {
    if (req.signedCookies) {
        const cookie = req.signedCookies[config.jwtCookieName];

        if (cookie) {
            try {
                const data = jwt.verify(cookie, config.jwtSecret, {
                    algorithms: ['HS256']
                });
                req[constants.WARPJS_USER_REQ_KEY] = data.user;
            } catch (e) {
                // TODO: Log this error
                req[constants.WARPJS_USER_INVALID_REQ_KEY] = 'Invalid token';
            }
        }
    }
    next();
};
