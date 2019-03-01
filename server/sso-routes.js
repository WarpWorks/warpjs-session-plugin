const RoutesInfo = require('@quoin/expressjs-routes-info');

const companies = require('./companies');
const company = require('./company');
// const debug = require('./debug')('sso-routes');
const { routes } = require('./constants');
const wrapControllers = require('./../lib/sso-utils/wrap-controllers');

module.exports = (subPath, baseUrl) => {
    // debug(`sso-routes...`);
    const routesInfo = new RoutesInfo(subPath, baseUrl);

    routesInfo.route(routes.companies, '/company', wrapControllers(companies));
    routesInfo.route(routes.company, '/company/{id}', wrapControllers(company));

    return routesInfo;
};
