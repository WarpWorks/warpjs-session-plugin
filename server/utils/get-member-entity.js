const getDomain = require('./get-domain');
const ssoUtils = require('./../../lib/sso-utils');

module.exports = async (req) => {
    const domain = await getDomain(req);
    return domain.getEntityByName(ssoUtils.ENTITIES.MEMBER);
};
