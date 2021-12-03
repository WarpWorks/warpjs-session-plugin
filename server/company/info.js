// const debug = require('./debug')('info');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { id } = req.params;

    const resource = ssoUtils.makeResource(req, {
        description: `Info on company '${id}'`
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const memberEntity = await serverUtils.getMemberEntity(req);
        const memberInstance = await memberEntity.getInstance(persistence, id);
        // debug(`memberInstance=`, memberInstance);

        if (memberInstance && memberInstance.id) {
            const memberResource = await ssoUtils.companyResource(req, memberInstance);
            resource.embed('items', memberResource);

            ssoUtils.sendResource(res, 200, resource);
        } else {
            serverUtils.resourceErrorMessage(resource, "Company not found");
            ssoUtils.sendResource(res, 404, resource);
        }
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
