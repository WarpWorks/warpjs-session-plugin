const warpjsUtils = require('@warp-works/warpjs-utils');

const redirectToProperPage = require('./redirect-to-proper-page');

module.exports = (config, warpCore, Persistence, req, res) => {
    res.clearCookie(config.jwtCookieName);

    warpjsUtils.wrapWith406(res, {
        html: () => {
            redirectToProperPage(req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            res.status(204)
                .header('Content-Type', warpjsUtils.constants.HAL_CONTENT_TYPE)
                .send();
        }
    });
};
