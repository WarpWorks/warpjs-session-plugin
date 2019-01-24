const warpjsUtils = require('@warp-works/warpjs-utils');

const casSSO = require('./../middlewares/cas-sso');
// const debug = require('./../debug')('logout/get');
const redirectToProperPage = require('./../redirect-to-proper-page');

module.exports = (req, res) => {
    const config = req.app.get('warpjs-config');

    res.clearCookie(config.jwtCookieName);

    const isCasSSO = casSSO.isCasSSO(config);
    // debug(`isCasSSO=${isCasSSO}`);

    warpjsUtils.wrapWith406(res, {
        html: () => {
            if (isCasSSO) {
                casSSO.logout(config, req, res);
            } else {
                redirectToProperPage(req, res);
            }
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            res.status(204)
                .header('content-type', warpjsUtils.constants.HAL_CONTENT_TYPE)
                .send();
        }
    });
};
