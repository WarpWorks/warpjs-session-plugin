const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (config, warpCore, Persistence, err, req, res, next) => {
    const redirectUrl = warpjsUtils.urlFormat(RoutesInfo.expand('W2:plugin:session:login'), {
        error: 403,
        redirect: req.originalUrl
    });
    res.redirect(redirectUrl);
};
