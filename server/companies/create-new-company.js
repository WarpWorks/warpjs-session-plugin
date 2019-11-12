// const ChangeLogs = require('@warp-works/warpjs-change-logs');

// const debug = require('./debug')('create-new-company');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { body } = req;

    const resource = ssoUtils.makeResource(req, {
        description: "Create new company"
    });

    const name = body && body.name ? body.name.trim() : null;
    if (!name) {
        serverUtils.resourceErrorMessage(resource, "Missing 'name' in payload.");
        ssoUtils.sendResource(res, 400, resource);
        return;
    }

    const persistence = serverUtils.getPersistence(req);

    try {
        const domain = await serverUtils.getDomain(req);
        const memberEntity = domain.getEntityByName(ssoUtils.ENTITIES.MEMBER);

        const memberInstances = await memberEntity.getDocuments(persistence, {
            Name: new RegExp(`^\\s*${name}\\s*$`, 'i')
        });

        // debug(`memberInstances=`, memberInstances);

        if (memberInstances && memberInstances.length) {
            const memberInstance = memberInstances[0];
            resource.embed('items', ssoUtils.companyResource(req, memberInstance));
            serverUtils.resourceMessage(resource, "Company exists");
            ssoUtils.sendResource(res, 200, resource);
        } else {
            // Note: The company is a child of the (only?) Organization instance.
            const organizationEntity = domain.getEntityByName(ssoUtils.ENTITIES.ORGANIZATION);
            const organizationInstances = await organizationEntity.getDocuments(persistence);

            if (organizationInstances && organizationInstances.length) {
                const organizationInstance = organizationInstances[0];
                const relationship = organizationEntity.getRelationshipByName(ssoUtils.RELATIONSHIPS.MEMBERS);
                const newMember = memberEntity.createContentChildForRelationship(
                    relationship,
                    organizationEntity,
                    organizationInstance
                );
                newMember.Name = name; // FIXME: Use the BasicProperty.
                newMember.CompanyName = name; // FIXME: Use the BasicProperty.
                newMember.Category = ssoUtils.categories.fromSsoToRh(body.category); // FIXME: Use the Enum.
                newMember.Status = 'Approved'; // FIXME: Use BasicProperty and constant.
                newMember.Versionable = false;

                const savedInstance = await memberEntity.createDocument(persistence, newMember);

                const writeAccessRelationship = memberEntity.getRelationshipByName('WriteAccess'); // FIXME: Use constants.
                if (writeAccessRelationship) {
                    const roleEntity = writeAccessRelationship.getTargetEntity();
                    const contentDocuments = await roleEntity.getDocuments(persistence, { Name: 'content' });

                    if (contentDocuments.length === 1) {
                        const contentDocument = contentDocuments[0];
                        const data = {
                            id: contentDocument.id,
                            type: contentDocument.type,
                            typeID: domain.getEntityByInstance(contentDocument).id,
                            desc: "Created by SSO sync"
                        };

                        await writeAccessRelationship.addAssociation(savedInstance, data, persistence);
                        await memberEntity.updateDocument(persistence, savedInstance);
                    } else {
                        // eslint-disable-next-line no-console
                        console.error(`Invalid contentDocuments=`, contentDocuments.map((contentDocument) => contentDocument.Name));
                    }
                }

                // TODO: Add history to savedInstance.
                // TODO: Add history to organization.

                const companyResource = ssoUtils.companyResource(req, savedInstance);
                resource.embed('items', companyResource);
                ssoUtils.sendResource(res, 200, resource);
            } else {
                serverUtils.resourceErrorMessage(resource, "Unable to find top instance.");
                ssoUtils.sendResource(res, 500, resource);
            }
        }
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
