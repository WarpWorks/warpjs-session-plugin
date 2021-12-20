const getEnumerationInstance = async (req) => {
    const warpCore = req.app.get('warpjs-core');
    const persistenceWarpJS = warpCore.getPersistence();
    let enumerationInstance = null;

    try {
        const domainModel = await warpCore.getCoreDomain();
        const enumerationEntity = await domainModel.getEntityByName('Enumeration');
        const enumerationDocuments = await enumerationEntity.getDocuments(persistenceWarpJS, { _id: '5af1ed38baab0a0030ddcde1' }, true);

        enumerationInstance = enumerationDocuments.pop();
    } finally {
        persistenceWarpJS.close();
    }

    return enumerationInstance;
};

const fromRhToSsoEnum = async (req, category) => {
    const enumerationInstance = await getEnumerationInstance(req);

    const categories = Object.freeze(enumerationInstance.embedded[0].entities.reduce((acc, category) => {
        acc[category.name] = category.label;

        return acc;
    }, {}));

    return categories[category] || null;
};

const fromSsoToRhEnum = async (req, category) => {
    const enumerationInstance = await getEnumerationInstance(req);

    const categories = Object.freeze(enumerationInstance.embedded[0].entities.reduce((acc, category) => {
        acc[category.label] = category.name;

        return acc;
    }, {}));

    return categories[category] || null;
};

module.exports = Object.freeze({
    fromRhToSso: (req, category) => fromRhToSsoEnum(req, category),
    fromSsoToRh: (req, category) => fromSsoToRhEnum(req, category)
});
