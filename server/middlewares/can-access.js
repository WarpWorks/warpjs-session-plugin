const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');

module.exports = (impl, config, warpCore, Persistence, req, res, next) => {
    const warpjsUser = req[constants.WARPJS_USER_REQ_KEY];

    if (!warpjsUser) {
        next(new warpjsUtils.WarpJSError("Unauthenticated user."));
    } else {
        const authorizedRoles = Boolean(warpjsUser.Roles && warpjsUser.Roles.filter(impl).length);
        next(authorizedRoles ? undefined : new warpjsUtils.WarpJSError("Unauthorized user."));
    }
};
