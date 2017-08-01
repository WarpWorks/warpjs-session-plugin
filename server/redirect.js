const RoutesInfo = require('@quoin/expressjs-routes-info');

module.exports = (res, error, redirect) => {
    const redirectUrl = RoutesInfo.expand('W2:plugin:session:login', {
        error,
        redirect
    });
    res.redirect(redirectUrl);
};
