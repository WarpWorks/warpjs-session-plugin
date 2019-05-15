module.exports = async (persistence, domain) => {
    const organizationEntity = domain.getEntityByName('Organization'); // FIXME: hard-coded.
    const organizationDocuments = await organizationEntity.getDocuments(persistence);
    if (organizationDocuments && organizationDocuments.length) {
        return Object.freeze({
            model: organizationEntity,
            instance: organizationDocuments[0]
        });
    } else {
        throw new Error(`Cannot find 'Organization' document.`);
    }
};
