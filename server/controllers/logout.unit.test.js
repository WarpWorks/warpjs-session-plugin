const testHelpers = require('@quoin/node-test-helpers');
const warpjsUtils = require('@warp-works/warpjs-utils');

const moduleToTest = require('./logout');

const expect = testHelpers.expect;

describe("server/controllers/logout", () => {
    let config;
    let warpCore;
    let Persistence;

    beforeEach(() => {
        config = {};
        warpCore = {};
        Persistence = {};
    });

    it("should expose a function with 5 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(5);
    });

    it("should clearCookie()", () => {
        const {req, res} = testHelpers.createMocks();
        res.app = {
            get: (key) => key
        };

        testHelpers.spy(res, 'clearCookie');

        moduleToTest(config, warpCore, Persistence, req, res);

        expect(res.clearCookie).to.have.been.called();
        expect(res.clearCookie).to.have.been.calledWith(config.jwtCookieName);
    });

    it("should 406 for unknown", () => {
        const reqOptions = {
            headers: {
                Accept: 'unknown'
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);

        moduleToTest(config, warpCore, Persistence, req, res);

        expect(res._getStatusCode()).to.equal(406);
    });

    it("should 204 for HAL", () => {
        const reqOptions = {
            headers: {
                Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);

        moduleToTest(config, warpCore, Persistence, req, res);

        expect(res._getStatusCode()).to.equal(204);
        expect(res._getData()).to.equal('');
        expect(res._getHeaders()).to.deep.equal({
            'Content-Type': warpjsUtils.constants.HAL_CONTENT_TYPE
        });
    });

    it("should redirect for HTML", () => {
        const reqOptions = {};
        const {req, res} = testHelpers.createMocks(reqOptions);

        moduleToTest(config, warpCore, Persistence, req, res);

        expect(res._getStatusCode()).to.equal(302);
        expect(res._getRedirectUrl()).to.equal('/');
    });
});
