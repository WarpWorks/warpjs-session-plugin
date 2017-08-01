const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (config, warpCore, Persistence, subPath, baseUrl) => {
    const routesInfo = new RoutesInfo(subPath, baseUrl);

    routesInfo.route('W2:plugin:session:login', '/{?error,redirect}')
        .get(controllers.loginPage.bind(null, config, warpCore, Persistence))
        .post(controllers.login.bind(null, config, warpCore, Persistence));

    routesInfo.route('W2:plugin:session:logout', '/logout')
        .get(controllers.logout.bind(null, config, warpCore, Persistence));

    return routesInfo;
};
