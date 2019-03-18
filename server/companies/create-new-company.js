// const debug = require('./debug')('create-new-company');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { body } = req;

    const resource = ssoUtils.makeResource(req, {
        description: "Create new company"
    });

    const name = body && body.name ? body.name.trim() : null;

    if (name) {
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
                resource.message = "Company exists";
                ssoUtils.sendResource(res, 200, resource);
            } else {
                // Note: The company is a child of the (only?) Organization instance.
                const organizationEntity = domain.getEntityByName(ssoUtils.ENTITIES.ORGANIZATION);
                const organizationInstances = await organizationEntity.getDocuments(persistence);
                if (organizationInstances && organizationInstances.length) {
                    const organizationInstance = organizationInstances[0];
                    const relationship = organizationEntity.getRelationshipByName(ssoUtils.RELATIONSHIPS.MEMBERS);
                    const newMember = organizationEntity.createContentChildForRelationship(
                        relationship,
                        organizationEntity,
                        organizationInstance
                    );
                    newMember.Name = name; // FIXME: Use the BasicProperty.
                    newMember.CompanyName = name; // FIXME: Use the BasicProperty.
                    newMember.Category = ssoUtils.categories.fromSsoToRh(body.category); // FIXME: Use the Enum.

                    const savedInstance = await memberEntity.createDocument(persistence, newMember);

                    // TODO: Add history to savedInstance.
                    // TODO: Add history to organization.

                    const companyResource = ssoUtils.companyResource(req, savedInstance);
                    resource.embed('items', companyResource);
                    ssoUtils.sendResource(res, 200, resource);
                } else {
                    resource.message = "Unable to find top instance.";
                    ssoUtils.sendResource(res, 500, resource);
                }
            }
        } catch (err) {
            ssoUtils.sendErrorResource(res, err, resource);
        } finally {
            persistence.close();
        }
    } else {
        resource.message = "Missing 'name' in payload.";
        ssoUtils.sendResource(res, 400, resource);
    }
};
