const RoutesInfo = require('@quoin/expressjs-routes-info');
const RoutesInfoCache = require('@quoin/expressjs-routes-info/lib/cache');
const testHelpers = require('@quoin/node-test-helpers');

const constants = require('./../constants');
const moduleToTest = require('./requires-warpjs-user');
const specHelpers = require('./../utils.helpers.test');

const expect = testHelpers.expect;

describe("server/middlewares/requires-warpjs-user", () => {
    const config = {};
    const warpCore = {};
    const Persistence = {};

    beforeEach(() => {
        RoutesInfoCache.reset();
        specHelpers.initApp();
    });

    it("should expose a function with 6 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(6);
    });

    it("should redirect if not logged in", () => {
        const reqOptions = {
            url: '/some/original/url'
        };
        const { req, res } = testHelpers.createMocks(reqOptions);
        const next = testHelpers.stub();
        const expectedRedirect = RoutesInfo.expand('W2:plugin:session:login', {
            error: '401',
            redirect: '/some/original/url'
        });

        moduleToTest(config, warpCore, Persistence, req, res, next);

        expect(next).not.to.have.been.called();
        expect(res._getStatusCode()).to.equal(302);
        expect(res._getRedirectUrl()).to.equal(expectedRedirect);
    });

    it("should check permissions with user", () => {
        const reqOptions = {
            url: '/some/original/url'
        };
        const { req, res } = testHelpers.createMocks(reqOptions);
        const next = testHelpers.stub();

        req[constants.WARPJS_USER_REQ_KEY] = {};

        moduleToTest(config, warpCore, Persistence, req, res, next);

        expect(next).to.have.been.called();
    });
});
