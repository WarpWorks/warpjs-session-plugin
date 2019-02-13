const warpjsUtils = require('@warp-works/warpjs-utils');

const casSSO = require('./../middlewares/cas-sso');
// const debug = require('./debug')('info');
const fullUrl = require('./../../lib/full-url');
const instanceResource = require('./../company/resource');

module.exports = async (req, res) => {
    const config = req.app.get('warpjs-config');

    const selfUrl = fullUrl.fromReq(req);
    const resource = warpjsUtils.createResource(selfUrl.toString(), {
        timestamp: Date.now()
    });

    if (casSSO.isValidKey(config, req)) {
        const warpCore = req.app.get('warpjs-core');
        const Persistence = req.app.get('warpjs-persistence');

        const persistence = new Persistence(config.persistence.host, config.persistence.name);

        try {
            const domain = await warpCore.getDomainByName(config.domainName);
            const memberEntity = domain.getEntityByName('Member');
            const { id } = req.params;

            const memberInstance = await memberEntity.getInstance(persistence, id);

            const memberResource = instanceResource(req, memberInstance);
            memberResource.timestamp = resource.timestamp;

            res.status(200)
                .header('Content-Type', warpjsUtils.constants.HAL_CONTENT_TYPE)
                .send(memberResource.toJSON());
        } catch (err) {
            resource.message = err.message;
            res.status(500)
                .header('Content-Type', warpjsUtils.constants.HAL_CONTENT_TYPE)
                .send(resource.toJSON());
        } finally {
            persistence.close();
        }
    } else {
        resource.message = "Invalid credentials";
        res.status(403)
            .header('Content-Type', warpjsUtils.constants.HAL_CONTENT_TYPE)
            .send(resource.toJSON());
    }
};
