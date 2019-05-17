const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (persistence, domain) => {
    const organizationEntity = domain.getEntityByName(ssoUtils.ENTITIES.ORGANIZATION);
    const organizationDocuments = await organizationEntity.getDocuments(persistence);
    if (organizationDocuments && organizationDocuments.length) {
        return Object.freeze({
            model: organizationEntity,
            instance: organizationDocuments[0]
        });
    } else {
        throw new Error(`Cannot find '${ssoUtils.ENTITIES.ORGANIZATION}' document.`);
    }
};
