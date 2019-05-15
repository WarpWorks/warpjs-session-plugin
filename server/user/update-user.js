const isUndefined = require('lodash/isUndefined');

// const debug = require('./debug')('update-user');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const resource = ssoUtils.makeResource(req, {
        description: `Modifying user '${id}'.`
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const userEntity = await serverUtils.getUserEntity(req);
        const userDocument = await userEntity.getInstance(persistence, id);

        if (!userDocument || !userDocument.id) {
            resource.message = `User id='${id}' not found.`;
            ssoUtils.sendResource(res, 404, resource);
            return;
        }

        let foundAtLeastOneChange = false;

        if (body) {
            if (!isUndefined(body.fullname)) {
                if (userDocument.Name === body.fullname) {
                    serverUtils.resourceMessage(resource, `Unmodified 'fullname'`);
                } else {
                    serverUtils.resourceMessage(resource, `Updated name from '${userDocument.Name}' to '${body.fullname}'`);
                    userDocument.Name = body.fullname;
                    foundAtLeastOneChange = true;
                }
            }

            if (!isUndefined(body.email)) {
                if (userDocument.Email === body.email) {
                    serverUtils.resourceMessage(resource, `Unmodified 'email'`);
                } else {
                    serverUtils.resourceMessage(resource, `Updated email from '${userDocument.Email}' to '${body.email}'`);
                    userDocument.Email = body.email;
                    foundAtLeastOneChange = true;
                }
            }

            if (!isUndefined(body.enabled)) {
                if (ssoUtils.VALID_STATUS.indexOf(body.enabled) !== -1) {
                    if (userDocument.Status === ssoUtils.STATUS[body.enabled]) {
                        serverUtils.resourceMessage(resource, `Status unchanged`);
                    } else {
                        serverUtils.resourceMessage(resource, `Updated status from '${userDocument.Status}' to '${ssoUtils.STATUS[body.enabled]}'`);
                        userDocument.Status = ssoUtils.STATUS[body.enabled];
                        foundAtLeastOneChange = true;
                    }
                } else {
                    serverUtils.resourceMessage(resource, `Invalid enabled=${body.enabled}`);
                }
            }

            // if (!isUndefined(body.contactId)) {
            //     const userAccountRelationship = userEntity.getRelationshipByName(ssoUtils.RELATIONSHIPS.ACCOUNTS);
            //     const accountDocuments = await userAccountRelationship.getDocuments(persistence, userDocument);
            //     debug(`accountDocuments=`, accountDocuments);
            // }
        }

        if (foundAtLeastOneChange) {
            // TODO: Add history.
            await userEntity.updateDocument(persistence, userDocument);
        } else {
            serverUtils.resourceMessage(resource, `Did not find anything to change`);
        }
        const userResource = await ssoUtils.userResource(req, persistence, userEntity, userDocument);
        resource.embed('items', userResource);
        ssoUtils.sendResource(res, 200, resource);
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
