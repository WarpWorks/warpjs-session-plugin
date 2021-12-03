const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const categories = require('./categories');
const fullUrl = require('./../../lib/full-url');
const { routes } = require('./../../server/constants');

const DISABLED_STATUS = [ 'Draft', 'Retired', 'Declined' ];

const convertStatus = (status) => (DISABLED_STATUS.indexOf(status) === -1);

const convertCategory = async (req, category) => {
    const converedCategory = await categories.fromRhToSso(req, category);
    console.log('converedCategory:::', converedCategory);
    return converedCategory;
};

module.exports = async (req, instance) => {
    const company = warpjsUtils.createResource(
        fullUrl.fromBase(RoutesInfo.expand(routes.company, { id: instance.id }), fullUrl.fromReq(req)).toString(),
        {
            id: instance.ssoId || instance.id,
            name: instance.Name,
            enabled: convertStatus(instance.Status),
            lastUpdated: instance.lastUpdated
        }
    );

    company.category = await convertCategory(req, instance.Category);

    return company;
};
