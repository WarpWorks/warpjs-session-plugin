const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('user-resource');
const fullUrl = require('./../../lib/full-url');
const { routes } = require('./../../server/constants');

const UNKNOWN = null;
const DISABLED_STATUS = [ 'Draft', 'Retired', 'Declined' ];

const convertStatus = (status) => (DISABLED_STATUS.indexOf(status) === -1);

module.exports = async (req, persistence, userEntity, userDocument) => {
    const href = fullUrl.fromBase(RoutesInfo.expand(routes.user, { id: userDocument.id }), fullUrl.fromReq(req)).toString();
    const resource = warpjsUtils.createResource(href, {
        email: userDocument.Email || UNKNOWN,
        fullname: userDocument.Name,
        status: convertStatus(userDocument.Status)
    });

    const accountRelationship = userEntity.getRelationshipByName('Accounts');
    const accountDocuments = await accountRelationship.getDocuments(persistence, userDocument);
    const accountDocument = accountDocuments.length ? accountDocuments[0] : {};
    resource.contactId = accountDocument.ssoID || UNKNOWN;
    resource.username = accountDocument.UserName || UNKNOWN;

    const companyRelationship = userEntity.getRelationshipByName('WorkingFor');
    const companyDocuments = await companyRelationship.getDocuments(persistence, userDocument);
    const companyDocument = companyDocuments.length ? companyDocuments[0] : {};
    resource.organization = companyDocument.Name || UNKNOWN;
    resource.title = companyDocument.relnDesc || UNKNOWN;

    return resource;
};
