const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');

module.exports = (config, warpCore, Persistence, req, res, next) => {
    if (!req[constants.WARPJS_USER_REQ_KEY]) {
        const redirectUrl = warpjsUtils.urlFormat(RoutesInfo.expand('W2:plugin:session:login'), {
            error: '401',
            redirect: req.originalUrl
        });
        res.redirect(redirectUrl);
    } else {
        next();
    }
};
