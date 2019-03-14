// const debug = require('./debug')('patch');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

const STATUS = {
    false: 'Draft',
    true: 'InheritFromParent'
};

const VALID_STATUS = [ true, false ];

module.exports = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const resource = ssoUtils.makeResource(req, {
        description: `Modifying company '${id}'`
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const memberEntity = await serverUtils.getMemberEntity(req);
        const memberInstance = await memberEntity.getInstance(persistence, id);

        if (memberInstance && memberInstance.id) {
            if (body && body.enabled !== undefined) {
                if (VALID_STATUS.indexOf(body.enabled) !== -1) {
                    if (memberInstance.Status === STATUS[body.enabled]) {
                        resource.message = `Status unchanged.`;
                    } else {
                        resource.message = `Updated status from '${memberInstance.Status}' to '${STATUS[body.enabled]}'.`;
                        memberInstance.Status = STATUS[body.enabled];
                        // TODO: Add history
                        await memberEntity.updateDocument(persistence, memberInstance);
                    }
                    const updatedResource = ssoUtils.companyResource(req, memberInstance);
                    resource.embed('items', updatedResource);
                    ssoUtils.sendResource(res, 200, resource);
                } else {
                    resource.message = `Invalid enabled='${body.enabled}'`;
                    ssoUtils.sendResource(res, 400, resource);
                }
            } else if (body && body.name) {
                if (memberInstance.Name === body.name) {
                    resource.message = `Name unchanged.`;
                } else {
                    // TODO: Validate the name
                    resource.message = `Updated name from '${memberInstance.Name}' to '${body.name}'.`;
                    memberInstance.Name = body.name; // FIXME: Use BasicProperty
                    memberInstance.CompanyName = body.name; // FIXME: Use BasicProperty
                    // TODO: Add history.
                    await memberEntity.updateDocument(persistence, memberInstance);
                }
                const updatedResource = ssoUtils.companyResource(req, memberInstance);
                resource.embed('items', updatedResource);
                ssoUtils.sendResource(res, 200, resource);
            } else {
                resource.message = `Patch element 'enabled' or 'name' missing.`;
                ssoUtils.sendResource(res, 400, resource);
            }
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
