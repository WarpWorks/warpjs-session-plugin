const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const casSSO = require('./../middlewares/cas-sso');
const constants = require('./../constants');
// const debug = require('./debug')('get');
const findProperRedirectPage = require('./../../lib/find-proper-redirect-page');
const fullUrl = require('./../../lib/full-url');
const libConstants = require('./../../lib/constants');

module.exports = (req, res) => {
    const config = req.app.get('warpjs-config');

    const isCasSSO = casSSO.isCasSSO(config);

    warpjsUtils.wrapWith406(res, {
        html: () => {
            if (isCasSSO) {
                const properRedirectUrl = findProperRedirectPage(req);
                // debug(`properRedirectUrl=${properRedirectUrl}`);

                const returnURL = fullUrl.fromBase(properRedirectUrl, fullUrl.fromReq(req));
                casSSO.login(config, req, res, returnURL);
            } else {
                const baseUrl = req.app.get('base-url');

                warpjsUtils.sendPortalIndex(req, res, RoutesInfo, 'Login',
                    [
                        `${baseUrl}/assets/${libConstants.assets.js}`
                    ],
                    `${baseUrl}/assets/${libConstants.assets.css}`
                );
            }
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const resource = warpjsUtils.createResource(req, {
                messages: {}
            });

            resource.hideLoginHeader = true;

            resource.redirectUrl = req.query.redirect;

            resource.messages.error = constants.ERROR_MESSAGES[req.query.error];
            if (req[constants.WARPJS_USER_REQ_KEY]) {
                resource.messages.alreadyConnected = `Already logged in as '${req[constants.WARPJS_USER_REQ_KEY].UserName}'. Log in below to switch user.`;
            }

            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
