const casSSO = require('./cas-sso');
const constants = require('./../constants');
const cookies = require('./../../lib/cookies');
const debug = require('./debug.js')('warpjs-user');

module.exports = async (config, warpCore, Persistence, req, res, next) => {
    // debug(`url=${req.originalUrl}: start`);
    const isCasSSO = casSSO.isCasSSO(config);
    // debug(`isCasSSO=${isCasSSO}`);

    if (isCasSSO && casSSO.isValidKey(config, req)) {
        // If the system has a key and is valid, then just by pass the user SSO
        // check.
        next();
    } else if (isCasSSO && req.query.returnSSO) {
        await casSSO.returnSSO(config, warpCore, Persistence, req, res);
    } else {
        const data = cookies.get(config, req, res);

        if (data.error) {
            // TODO: Log this error
            debug(`got data.error:`, data.error);
            req[constants.WARPJS_USER_INVALID_REQ_KEY] = 'Invalid token';
        } else {
            req[constants.WARPJS_USER_REQ_KEY] = data.user;
        }

        if (isCasSSO && !data.casSSO) {
            casSSO.checkSSO(config, req, res);
        } else {
            next();
        }
    }
};
