const RoutesInfo = require('@quoin/expressjs-routes-info');

const companies = require('./companies');
const company = require('./company');
// const debug = require('./debug')('sso-routes');
const { routes } = require('./constants');

module.exports = (subPath, baseUrl) => {
    // debug(`sso-routes...`);
    const routesInfo = new RoutesInfo(subPath, baseUrl);

    routesInfo.route(routes.companies, '/company', companies);
    routesInfo.route(routes.company, '/company/{id}', company);

    return routesInfo;
};
