const extend = require('lodash/extend');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('make-resource');
const fullUrl = require('./../full-url');

module.exports = (req, data = {}) => {
    // debug(`data=`, data);
    const selfUrl = fullUrl.fromReq(req);
    return warpjsUtils.createResource(selfUrl.toString(), extend({}, data, {
        timestamp: Date.now()
    }));
};
