// const debug = require('./debug')('patch');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

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
            let foundAtLeastOneChange = false;
            let modified = false;
            let error = false;

            if (body) {
                if (body.enabled !== undefined) {
                    foundAtLeastOneChange = true;

                    if (ssoUtils.VALID_STATUS.indexOf(body.enabled) !== -1) {
                        if (memberInstance.Status === ssoUtils.STATUS[body.enabled]) { // FIXME: Use Enum
                            serverUtils.resourceMessage(resource, `Status unchanged.`);
                        } else {
                            serverUtils.resourceMessage(resource, `Updated status from '${memberInstance.Status}' to '${ssoUtils.STATUS[body.enabled]}'`);
                            memberInstance.Status = ssoUtils.STATUS[body.enabled];
                            modified = true;
                        }
                    } else {
                        serverUtils.resourceMessage(resource, `Invalid enabled=${body.enabled}`);
                        error = true;
                    }
                }

                if (body.name) {
                    // TODO: Check if name is unique?

                    foundAtLeastOneChange = true;

                    if (memberInstance.Name === body.name) { // FIXME: Use BasicProperty
                        serverUtils.resourceMessage(resource, `Name unchanged`);
                    } else {
                        // TODO: Validate the name
                        serverUtils.resourceMessage(resource, `Updated name from '${memberInstance.Name}' to '${body.name}'`);
                        memberInstance.Name = body.name; // FIXME: Use BasicProperty
                        memberInstance.CompanyName = body.name; // FIXME: Use BasicProperty
                        modified = true;
                    }
                }

                if (body.category) {
                    foundAtLeastOneChange = true;

                    const newCategory = ssoUtils.categories.fromSsoToRh(body.category);
                    if (newCategory === memberInstance.Category) { // FIXME: Use Enum
                        serverUtils.resourceMessage(resource, `Category unchanged`);
                    } else {
                        serverUtils.resourceMessage(resource, `Updated category from '${memberInstance.Category}' to '${newCategory}'`);
                        memberInstance.Category = newCategory;
                        modified = true;
                    }
                }
            }

            if (error) {
                ssoUtils.sendResource(res, 400, resource);
            } else {
                if (foundAtLeastOneChange) {
                    if (modified) {
                        // TODO: Add history
                        await memberEntity.updateDocument(persistence, memberInstance);
                    }

                    const updatedResource = ssoUtils.companyResource(req, memberInstance);
                    resource.embed('items', updatedResource);
                    ssoUtils.sendResource(res, 200, resource);
                } else {
                    serverUtils.resourceMessage(resource, `Did not find anything to change`);
                    ssoUtils.sendResource(res, 400, resource);
                }
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
