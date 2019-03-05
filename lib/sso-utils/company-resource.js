const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const fullUrl = require('./../../lib/full-url');
const { routes } = require('./../../server/constants');

const DISABLED_STATUS = [ 'Draft', 'Retired', 'Declined' ];

const convertStatus = (status) => (DISABLED_STATUS.indexOf(status) === -1) ? 'enabled' : 'disabled';

module.exports = (req, instance) => warpjsUtils.createResource(
    fullUrl.fromBase(RoutesInfo.expand(routes.company, { id: instance.id }), fullUrl.fromReq(req)).toString(),
    {
        id: instance.ssoId || instance.id,
        name: instance.Name,
        status: convertStatus(instance.Status),
        lastUpdated: instance.lastUpdated
    }
);