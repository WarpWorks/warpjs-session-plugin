const isUndefined = require('lodash/isUndefined');

// const debug = require('./debug')('update-user');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { id } = req.params;
    const body = req.body || {};

    const resource = ssoUtils.makeResource(req, {
        description: `Modifying user '${id}'.`
    });

    const persistence = serverUtils.getPersistence(req);

    try {
        const userEntity = await serverUtils.getUserEntity(req);
        const userDocument = await userEntity.getInstance(persistence, id);

        if (!userDocument || !userDocument.id) {
            serverUtils.resourceErrorMessage(resource, `User id='${id}' not found.`);
            ssoUtils.sendResource(res, 404, resource);
            return;
        }

        let foundAtLeastOneChange = false;

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
                serverUtils.resourceErrorMessage(resource, `Invalid enabled=${body.enabled}`);
            }
        }

        // When a username is changed, we need to determine if the new username
        // is belonging to the current user. If not, we need to make sure it's
        // unique.
        if (!isUndefined(body.username)) {
            const userAccountRelationship = userEntity.getRelationshipByName(ssoUtils.RELATIONSHIPS.ACCOUNTS);
            const accountDocuments = await userAccountRelationship.getDocuments(persistence, userDocument);
            const accountDocument = accountDocuments.length ? accountDocuments[0] : null;

            if (accountDocument) {
                if (accountDocument.UserName === body.username) {
                    serverUtils.resourceMessage(resource, `Unmodified 'username'`);
                } else {
                    const accountEntity = userEntity.getDomain().getEntityByName(ssoUtils.ENTITIES.ACCOUNT);
                    const newUsernameDocuments = await accountEntity.getDocuments(persistence, {
                        UserName: body.username
                    });
                    if (newUsernameDocuments.length) {
                        serverUtils.resourceErrorMessage(resource, `Username '${body.username}' is used by another account`);
                    } else {
                        serverUtils.resourceMessage(resource, `Username changed from '${accountDocument.UserName}' to '${body.username}'`);
                        accountDocument.UserName = body.username;
                        foundAtLeastOneChange = true;
                        await accountEntity.updateDocument(persistence, accountDocument);
                    }
                }
            } else {
                serverUtils.resourceErrorMessage(resource, `User doesn't have an account`);
            }
        }

        // When changing the organization, we need to put that as the first
        // organization of the user. So if the first one is not the new
        // organization, we need to remove that first element.
        if (!isUndefined(body.organization)) {
            const memberEntity = userEntity.getDomain().getEntityByName(ssoUtils.ENTITIES.MEMBER);
            const memberDocuments = await memberEntity.getDocuments(persistence, {
                Name: body.organization
            });
            const memberDocument = memberDocuments.length ? memberDocuments[0] : null;
            if (memberDocument) {
                const userMemberRelationship = userEntity.getRelationshipByName(ssoUtils.RELATIONSHIPS.WORKING_FOR);
                const data = {
                    id: memberDocument.id,
                    type: memberDocument.type,
                    typeID: memberDocument.typeID,
                    desc: body.title ? body.title.trim() : undefined,
                    position: 1
                };
                await userMemberRelationship.addAssociation(userDocument, data, persistence);

                // Now, just make sure we reorder the associations.
                const targetReferences = userMemberRelationship.getTargetReferences(userDocument);
                targetReferences.filter((ref) => ref._id === data.id && ref.type === data.type)
                    .concat(targetReferences.filter((ref) => ref._id !== data.id || ref.type !== data.type))
                    .forEach((ref, index) => {
                        ref.position = index + 1;
                    })
                ;
                serverUtils.resourceMessage(resource, `Organization/title maybe updated`);
                foundAtLeastOneChange = true;
            } else {
                serverUtils.resourceErrorMessage(resource, `Organization '${body.organization}' doesn't exist`);
            }
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
