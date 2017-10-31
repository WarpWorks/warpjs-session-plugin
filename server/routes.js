const RoutesInfo = require('@quoin/expressjs-routes-info');

const login = require('./login');
const logout = require('./logout');

module.exports = (subPath, baseUrl) => {
    const routesInfo = new RoutesInfo(subPath, baseUrl);

    routesInfo.route('W2:plugin:session:login', '/{?error,redirect}', login);
    routesInfo.route('W2:plugin:session:logout', '/logout', logout);

    return routesInfo;
};
