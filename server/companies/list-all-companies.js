// const debug = require('./debug')('list-all-companies');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const resource = ssoUtils.makeResource(req, {
        description: "List of all companies"
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const config = req.app.get('warpjs-config');
        const warpCore = req.app.get('warpjs-core');

        const domain = await warpCore.getDomainByName(config.domainName);
        const memberEntity = domain.getEntityByName(ssoUtils.ENTITIES.MEMBER);

        const memberInstances = await memberEntity.getDocuments(persistence);

        const memberResources = memberInstances.map((memberInstance) => ssoUtils.companyResource(req, memberInstance));

        resource.embed('items', memberResources);

        ssoUtils.sendResource(res, 200, resource);
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
