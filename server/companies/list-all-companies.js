// const debug = require('./debug')('list-all-companies');
const instanceResource = require('./../company/resource');
const { ENTITIES, makeResource, sendResource } = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const config = req.app.get('warpjs-config');

    const resource = makeResource(req, {
        description: "List of all companies"
    });

    const warpCore = req.app.get('warpjs-core');
    const Persistence = req.app.get('warpjs-persistence');

    const persistence = new Persistence(config.persistence.host, config.persistence.name);

    try {
        const domain = await warpCore.getDomainByName(config.domainName);
        const memberEntity = domain.getEntityByName(ENTITIES.MEMBER);

        const memberInstances = await memberEntity.getDocuments(persistence);

        const memberResources = memberInstances.map((memberInstance) => instanceResource(req, memberInstance));

        resource.embed('companies', memberResources);

        sendResource(res, 200, resource);
    } catch (err) {
        resource.message = err.message;
        sendResource(res, 500, resource);
    } finally {
        persistence.close();
    }
};
