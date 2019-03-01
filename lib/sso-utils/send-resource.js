const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('send-resource');

module.exports = (res, status, resource) => {
    // debug(`resource=`, resource.toJSON());
    res.status(status)
        .header('Content-Type', warpjsUtils.constants.HAL_CONTENT_TYPE)
        .send(resource.toJSON())
    ;
};
