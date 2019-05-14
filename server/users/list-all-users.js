const Promise = require('bluebird');

// const debug = require('./debug')('list-all-users');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const resource = ssoUtils.makeResource(req, {
        description: "List of all users"
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const config = req.app.get('warpjs-config');
        const warpCore = req.app.get('warpjs-core');

        const domain = await warpCore.getDomainByName(config.domainName);
        const userEntity = domain.getEntityByName(ssoUtils.ENTITIES.USER);

        const userDocuments = await userEntity.getDocuments(persistence);
        // debug(`userDocuments=`, userDocuments);
        const userResources = await Promise.map(
            userDocuments,
            async (userDocument) => ssoUtils.userResource(req, persistence, userEntity, userDocument)
        );

        resource.embed('items', userResources);

        ssoUtils.sendResource(res, 200, resource);
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        await persistence.close();
    }
};
