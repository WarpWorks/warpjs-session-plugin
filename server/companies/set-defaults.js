const debug = require('./debug')('set-defaults');

module.exports = async (persistence, entity, document) => {
    document.Status = 'Approved'; // FIXME: Use BasicProperty and constant value.
    document.Versionable = false;

    const savedDocument = await entity.createDocument(persistence, document);

    const writeAccessRelationship = entity.getRelationshipByName('WriteAccess'); // FIXME: Use constant.
    debug(`writeAccessRelationship=`, writeAccessRelationship);
    if (writeAccessRelationship) {
        const roleEntity = writeAccessRelationship.getTargetEntity();
        const contentDocuments = await roleEntity.getDocuments(persistence, { Name: 'content' }); // FIXME: Use constant.

        if (contentDocuments.length === 1) {
            const contentDocument = contentDocuments[0];
            const data = {
                id: contentDocument.id,
                type: contentDocument.type,
                typeID: entity.getDomain().getEntityByInstance(contentDocument).id,
                desc: "Created by SSO sync"
            };

            await writeAccessRelationship.addAssociation(savedDocument, data, persistence);
        } else {
            // eslint-disable-next-line no-console
            console.error(`Invalid contentDocuments=`, contentDocuments.map((contentDocument) => contentDocument.Name));
        }
    }

    // TODO: Add history to document.
    // TODO: Add history to parent document.

    await entity.updateDocument(persistence, savedDocument);

    return savedDocument;
};
