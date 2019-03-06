const debug = require('./debug')('delete');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { id } = req.params;

    const resource = ssoUtils.makeResource(req, {
        description: `Removing company '${id}'`
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const memberEntity = await serverUtils.getMemberEntity(req);
        const memberInstance = await memberEntity.getInstance(persistence, id);

        debug(`memberInstance=`, memberInstance);
        if (memberInstance && memberInstance.id) {
            // TODO: Update parent history
            // const parentMember = await memberEntity.getParentEntity(memberInstance);
            // debug(`parentMember=`, parentMember);

            // const parentInstance = await memberEntity.getParentInstance(persistence, memberInstance);
            // debug(`parentInstance=`, parentInstance);

            await memberEntity.removeDocument(persistence, memberInstance);
            resource.message = "Company removed";
            ssoUtils.sendResource(res, 200, resource);
        } else {
            resource.message = "Company not found";
            ssoUtils.sendResource(res, 404, resource);
        }
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
