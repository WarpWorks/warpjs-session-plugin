module.exports = async (req) => {
    const config = req.app.get('warpjs-config');
    const warpCore = req.app.get('warpjs-core');

    return warpCore.getDomainByName(config.domainName);
};
