const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (subPath, prefix) => {
    const routesInfo = new RoutesInfo(subPath, prefix);

    routesInfo.route('login', '/')
        .get(controllers.loginPage)
        .post(controllers.login);

    routesInfo.route('logout', '/logout')
        .get(controllers.logout);

    return routesInfo;
};
