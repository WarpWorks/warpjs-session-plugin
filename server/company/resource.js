const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const fullUrl = require('./../../lib/full-url');
const { routes } = require('./../constants');

module.exports = (req, instance) => warpjsUtils.createResource(
    fullUrl.fromBase(RoutesInfo.expand(routes.company, { id: instance.id }), fullUrl.fromReq(req)).toString(),
    {
        id: instance.ssoId || instance.id,
        name: instance.Name,
        lastUpdated: instance.lastUpdated
    }
);
