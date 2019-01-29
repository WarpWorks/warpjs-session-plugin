const fetch = require('node-fetch');
const Promise = require('bluebird');
const xmlParser = require('fast-xml-parser');

const cookies = require('./../../lib/cookies');
const debug = require('./debug.js')('cas-sso');
const findProperRedirectPage = require('./../../lib/find-proper-redirect-page');
const fullUrl = require('./../../lib/full-url');
const userInfo = require('./../auth/user-info');

fetch.Promise = Promise;

const PARAMS = Object.freeze({
    GATEWAY: 'gateway',
    RETURN_SSO: 'returnSSO',
    SERVICE: 'service',
    TICKET: 'ticket'
});

const SSO_PATHS = Object.freeze({
    LOGIN: 'login',
    LOGOUT: 'logout',
    // VALIDATE: 'validate'
    VALIDATE: 'p3/serviceValidate'
});

class CasSsoError extends Error {
    constructor(message) {
        super(message);
        this.name = `WarpWorks.${this.constructor.name}`;
    }
}

class CasSsoUser {
    constructor(json) {
        this.id = json['cas:user'].toString();

        const attributes = json['cas:attributes'];

        this.lastName = attributes['cas:lastName'];
        this.firstName = attributes['cas:firstName'];
        this.displayName = attributes['cas:displayName'];
        this.title = attributes['cas:title'];
        this.organization = attributes['cas:organization'];
        this.email = attributes['cas:email'];

        this.username = attributes['cas:username'].toString();
    }
}

const checkSSO = (config, req, res) => {
    const serviceUrl = fullUrl.fromReq(req);
    serviceUrl.searchParams.set(PARAMS.RETURN_SSO, true);

    const ssoLoginUrl = fullUrl.fromBase(SSO_PATHS.LOGIN, config.casSSO.urlPrefix);
    ssoLoginUrl.searchParams.set(PARAMS.SERVICE, serviceUrl.toString());
    ssoLoginUrl.searchParams.set(PARAMS.GATEWAY, true);
    // debug(`checkSSO(): Redirecting to ${ssoLoginUrl.toString()}`);
    res.redirect(ssoLoginUrl.toString());
};

const getLoginUrl = (config, req, returnUrl) => {
    const serviceUrl = returnUrl || fullUrl.fromReq(req);
    serviceUrl.searchParams.set(PARAMS.RETURN_SSO, true);

    const loginUrl = fullUrl.fromBase(SSO_PATHS.LOGIN, config.casSSO.urlPrefix);
    loginUrl.searchParams.set(PARAMS.SERVICE, serviceUrl.toString());
    return loginUrl.toString();
};

const getLogoutUrl = (config, req) => {
    const serviceUrl = findProperRedirectPage(req);

    const logoutUrl = fullUrl.fromBase(SSO_PATHS.LOGOUT, config.casSSO.urlPrefix);
    logoutUrl.searchParams.set(PARAMS.SERVICE, serviceUrl.toString());
    return logoutUrl.toString();
};

const login = (config, req, res, returnUrl) => {
    res.redirect(getLoginUrl(config, req, returnUrl));
};

const logout = (config, req, res) => {
    res.redirect(getLogoutUrl(config, req));
};

const validate = async (config, req, res, serviceUrl, ticket) => {
    const url = fullUrl.fromBase(SSO_PATHS.VALIDATE, config.casSSO.urlPrefix);
    url.searchParams.set(PARAMS.SERVICE, serviceUrl.toString());
    url.searchParams.set(PARAMS.TICKET, ticket);

    const xml = await fetch(url.toString()).then(response => response.text());
    const jsonObj = xmlParser.parse(xml);

    try {
        const casServiceResponse = jsonObj['cas:serviceResponse'];
        if (!casServiceResponse) {
            throw new CasSsoError(`Invalid response.`);
        }

        const casAuthenticationSuccess = casServiceResponse['cas:authenticationSuccess'];
        if (!casAuthenticationSuccess) {
            throw new CasSsoError(`Unable to validate.`);
        }

        return new CasSsoUser(casAuthenticationSuccess);
    } catch (e) {
        // TODO: Log this?
        // eslint-disable-next-line no-console
        console.error("...error validating cas sso ticket:", e.message);
        return null;
    }
};

const returnSSO = async (config, warpCore, Persistence, req, res) => {
    const returnUrl = fullUrl.fromReq(req);

    const ticket = returnUrl.searchParams.get(PARAMS.TICKET);
    returnUrl.searchParams.delete('ticket');

    if (ticket) {
        const casSsoUser = await validate(config, req, res, returnUrl, ticket);
        const domain = await warpCore.getDomainByName(config.domainName);
        const accountEntity = domain.getEntityByName(config.users.entity);
        const persistence = new Persistence(config.persistence.host, config.persistence.name);
        try {
            const accounts = await accountEntity.getDocuments(persistence, { [config.casSSO.userAttribute]: casSsoUser.id });
            if (accounts && accounts.length) {
                if (accounts.length !== 1) {
                    throw new CasSsoError(`${accounts.length} accounts found for ${casSsoUser.id}.`);
                } else {
                    const accountInstance = accounts[0];
                    const user = await userInfo(persistence, accountEntity, accountInstance);
                    cookies.send(config, req, res, { casSSO: true, user });
                }
            } else {
                // TODO: Create the account.
                debug(`Account not found, need to create it.`);
            }
            returnUrl.searchParams.delete(PARAMS.RETURN_SSO);
            res.redirect(returnUrl.toString());
        } finally {
            persistence.close();
        }
    } else {
        // There is no ticket, just send user to page without returnSSO param.
        returnUrl.searchParams.delete(PARAMS.RETURN_SSO);

        cookies.send(config, req, res, { casSSO: true });

        res.redirect(returnUrl.toString());
    }
};

module.exports = Object.freeze({
    checkSSO: (config, req, res) => checkSSO(config, req, res),
    getLoginUrl: (config, req, returnUrl) => getLoginUrl(config, req, returnUrl),
    getLogoutUrl: (config, req) => getLogoutUrl(config, req),
    isCasSSO: (config) => Boolean(config && config.casSSO && config.casSSO.enabled),
    login: (config, req, res, returnUrl) => login(config, req, res, returnUrl),
    logout: (config, req, res) => logout(config, req, res),
    returnSSO: (config, warpCore, Persistence, req, res) => returnSSO(config, warpCore, Persistence, req, res)
});
