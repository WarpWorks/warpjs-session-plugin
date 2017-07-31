const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');

module.exports = (config, warpCore, Persistence, req, res) => {
    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendIndex(res, 'Login', 'session'),

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
