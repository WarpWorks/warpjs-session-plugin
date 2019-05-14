const RoutesInfo = require('@quoin/expressjs-routes-info');

const companies = require('./companies');
const company = require('./company');
// const debug = require('./debug')('sso-routes');
const { routes } = require('./constants');
const user = require('./user');
const users = require('./users');
const wrapControllers = require('./../lib/sso-utils/wrap-controllers');

module.exports = (subPath, baseUrl) => {
    // debug(`sso-routes...`);
    const routesInfo = new RoutesInfo(subPath, baseUrl);

    routesInfo.route(routes.companies, '/company', wrapControllers(companies));
    routesInfo.route(routes.company, '/company/{id}', wrapControllers(company));
    routesInfo.route(routes.users, '/user', wrapControllers(users));
    routesInfo.route(routes.user, '/user/{id}', wrapControllers(user));

    return routesInfo;
};
