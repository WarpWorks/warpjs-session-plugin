const debug = require('./debug')('patch');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

const STATUS = {
    disabled: 'Draft',
    enabled: 'InheritFromParent'
};

const VALID_STATUS = [
    'disabled',
    'enabled'
];

module.exports = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    debug(`body=`, body);

    const resource = ssoUtils.makeResource(req, {
        description: `Modifying company '${id}'`
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const memberEntity = await serverUtils.getMemberEntity(req);
        const memberInstance = await memberEntity.getInstance(persistence, id);

        debug(`memberInstance=`, memberInstance);

        if (body && body.status) {
            if (VALID_STATUS.indexOf(body.status) !== -1) {
                memberInstance.Status = STATUS[body.status];
                // TODO: Add history
                await memberEntity.updateDocument(persistence, memberInstance);
                const updatedResource = ssoUtils.companyResource(req, memberInstance);
                resource.embed('companies', updatedResource);
                ssoUtils.sendResource(res, 200, resource);
            } else {
                resource.message = `Invalid status='${body.status}'`;
                ssoUtils.sendResource(res, 400, resource);
            }
        } else if (body && body.name) {
        }
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
