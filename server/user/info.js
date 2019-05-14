// const debug = require('./debug')('info');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { id } = req.params;

    const resource = ssoUtils.makeResource(req, {
        description: `Info for user '${id}'`
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const config = req.app.get('warpjs-config');
        const warpCore = req.app.get('warpjs-core');

        const domain = await warpCore.getDomainByName(config.domainName);
        const userEntity = domain.getEntityByName(ssoUtils.ENTITIES.USER);
        const userDocument = await userEntity.getInstance(persistence, id);

        if (userDocument && userDocument.id) {
            const userResource = await ssoUtils.userResource(req, persistence, userEntity, userDocument);
            resource.embed('items', userResource);
            ssoUtils.sendResource(res, 200, resource);
        } else {
            resource.message = "User not found";
            ssoUtils.sendResource(req, 401, resource);
        }
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
