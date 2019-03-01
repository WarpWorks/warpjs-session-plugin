// const debug = require('./debug')('info');
const instanceResource = require('./../company/resource');
const { ENTITIES, makeResource, sendResource } = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const config = req.app.get('warpjs-config');

    const resource = makeResource(req, {
        description: `Info on company '${req.params.id}'`
    });

    const warpCore = req.app.get('warpjs-core');
    const Persistence = req.app.get('warpjs-persistence');

    const persistence = new Persistence(config.persistence.host, config.persistence.name);

    try {
        const domain = await warpCore.getDomainByName(config.domainName);
        const memberEntity = domain.getEntityByName(ENTITIES.MEMBER);
        const { id } = req.params;

        const memberInstance = await memberEntity.getInstance(persistence, id);

        const memberResource = instanceResource(req, memberInstance);
        memberResource.timestamp = resource.timestamp;

        sendResource(res, 200, memberResource);
    } catch (err) {
        resource.message = err.message;
        sendResource(res, 500, resource);
    } finally {
        persistence.close();
    }
};
