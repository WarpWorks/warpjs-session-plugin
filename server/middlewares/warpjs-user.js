const casSSO = require('./cas-sso');
const constants = require('./../constants');
const cookies = require('./../../lib/cookies');
const debug = require('./debug.js')('warpjs-user');

module.exports = async (config, warpCore, Persistence, req, res, next) => {
    const isCasSSO = casSSO.isCasSSO(config);

    if (isCasSSO && req.query.returnSSO) {
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
            next(); // DEBUG
        } else {
            debug(`all set, go to next middleware`);
            next();
        }
    }
};
