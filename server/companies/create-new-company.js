// const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('create-new-company');
const instanceResource = require('./../company/resource');
const { ENTITIES, makeResource, sendResource } = require('./../../lib/sso-utils');

module.exports = async (req, res) => {
    const { body } = req;

    const resource = makeResource(req, {
        description: "Create new company"
    });

    const name = body && body.name ? body.name.trim() : null;

    if (name) {
        const config = req.app.get('warpjs-config');
        const warpCore = req.app.get('warpjs-core');
        const Persistence = req.app.get('warpjs-persistence');

        const persistence = new Persistence(config.persistence.host, config.persistence.name);
        try {
            const domain = await warpCore.getDomainByName(config.domainName);
            const memberEntity = domain.getEntityByName(ENTITIES.MEMBER);

            const memberInstances = await memberEntity.getDocuments(persistence, {
                Name: new RegExp(`^\\s*${name}\\s*$`, 'i')
            });

            // debug(`memberInstances=`, memberInstances);

            if (memberInstances && memberInstances.length) {
                const memberInstance = memberInstances[0];
                resource.embed('companies', instanceResource(req, memberInstance));
                resource.message = "Company exists";
            } else {
                // TODO: Create the new company. Make sure to assign to the
                // parent.
            }

            sendResource(res, 200, resource);
        } catch (err) {
            resource.message = err.message;
            sendResource(res, 500, resource);
        } finally {
            persistence.close();
        }
    } else {
        resource.message = "Missing 'name' in payload.";
        sendResource(res, 400, resource);
    }
};
