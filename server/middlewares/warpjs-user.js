const casSSO = require('./cas-sso');
const constants = require('./../constants');
const cookies = require('./../../lib/cookies');
const debug = require('./debug.js')('warpjs-user');

module.exports = async (config, warpCore, Persistence, req, res, next) => {
    debug(`url=${req.originalUrl}: start`);
    const isCasSSO = casSSO.isCasSSO(config);

    if (isCasSSO && req.query.returnSSO) {
        debug(`url=${req.originalUrl}: isCasSSO && returnSSO START`);
        await casSSO.returnSSO(config, warpCore, Persistence, req, res);
        debug(`url=${req.originalUrl}: isCasSSO && returnSSO DONE`);
    } else {
        debug(`url=${req.originalUrl}: Normal flow START`);
        const data = cookies.get(config, req, res);

        if (data.error) {
            // TODO: Log this error
            debug(`got data.error:`, data.error);
            req[constants.WARPJS_USER_INVALID_REQ_KEY] = 'Invalid token';
        } else {
            req[constants.WARPJS_USER_REQ_KEY] = data.user;
        }

        if (isCasSSO && !data.casSSO) {
            debug(`url=${req.originalUrl}: Need checkSSO() START`);
            casSSO.checkSSO(config, req, res);
            debug(`url=${req.originalUrl}: Need checkSSO() DONE`);
        } else {
            debug(`all set, go to next middleware`);
            next();
        }
    }
};
