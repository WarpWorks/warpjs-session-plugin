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

        const memberResource = ssoUtils.companyResource(req, memberInstance);
        memberResource.timestamp = resource.timestamp;

        ssoUtils.sendResource(res, 200, memberResource);
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
