const jwt = require('jsonwebtoken');
const testHelpers = require('@quoin/node-test-helpers');

const constants = require('./../constants');
const moduleToTest = require('./warpjs-user');

const expect = testHelpers.expect;

describe("server/middlewares/warpjs-user", () => {
    let config;
    let warpCore;
    let Persistence;

    beforeEach(() => {
        config = {
            jwtCookieName: 'cookie-name',
            jwtSecret: 'jwt-secret'
        };
        warpCore = {};
        Persistence = {};
    });

    it("should expose a function with 6 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(6);
    });

    it("should not add 'warpjsUser' when no signedCookies", () => {
        const reqOptions = {};
        const {req, res} = testHelpers.createMocks(reqOptions);
        const next = testHelpers.stub();

        moduleToTest(config, warpCore, Persistence, req, res, next);

        expect(next).to.have.been.called();
        expect(req.warpjsUser).to.be.undefined();
    });

    it("should not add 'warpjsUser' when no jwt cookie", () => {
        const reqOptions = {
            signedCookies: {
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);
        const next = testHelpers.stub();

        moduleToTest(config, warpCore, Persistence, req, res, next);

        expect(next).to.have.been.called();
        expect(req.warpjsUser).to.be.undefined();
    });

    it("should not add 'warpjsUser' when jwt cookie invalid", () => {
        const reqOptions = {
            signedCookies: {
                [config.jwtCookieName]: 'invalid'
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);
        const next = testHelpers.stub();

        moduleToTest(config, warpCore, Persistence, req, res, next);

        expect(next).to.have.been.called();
        expect(req.warpjsUser).to.be.undefined();
    });

    it("should add 'warpjsUser' when jwt cookie valid", () => {
        const payload = {
            user: {
                username: 'foo',
                something: 'else'
            }
        };
        const token = jwt.sign(payload, config.jwtSecret);

        const reqOptions = {
            signedCookies: {
                [config.jwtCookieName]: token
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);
        const next = testHelpers.stub();

        moduleToTest(config, warpCore, Persistence, req, res, next);

        expect(next).to.have.been.called();
        expect(req[constants.WARPJS_USER_REQ_KEY]).to.deep.equal({
            username: 'foo',
            something: 'else'
        });
    });
});
