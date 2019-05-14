const routeName = require('./route-name');

const ERROR_MESSAGES = {
    invalid: "Failed authentication",
    401: "You must be logged in to continue",
    403: "You are not authorized. Switch user?"
};

module.exports = Object.freeze({
    ERROR_MESSAGES,
    WARPJS_USER_INVALID_REQ_KEY: 'warpjsUserInvalid',
    WARPJS_USER_REQ_KEY: 'warpjsUser',
    WARPJS_CAS_SSO_REQ_KEY: 'warpjsCasSSO',
    routes: Object.freeze({
        companies: routeName('companies'),
        company: routeName('company'),
        users: routeName('users'),
        user: routeName('user')
        // TODO: Get the routes for login and logout.
    })
});
