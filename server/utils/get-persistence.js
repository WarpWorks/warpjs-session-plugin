module.exports = (req) => {
    const config = req.app.get('warpjs-config');
    const Persistence = req.app.get('warpjs-persistence');

    return new Persistence(config.persistence.host, config.persistence.name);
};
