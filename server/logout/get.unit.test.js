const testHelpers = require('@quoin/node-test-helpers');
const warpjsUtils = require('@warp-works/warpjs-utils');

const moduleToTest = require('./get');

const expect = testHelpers.expect;

describe("server/logout/get", () => {
    let app;

    beforeEach(() => {
        app = {
            get: (key) => {
                switch (key) {
                    case 'warpjs-core':
                        return {};

                    case 'warpjs-config':
                        return {};

                    case 'warpjs-persistence':
                        return {};

                    default:
                        return key;
                }
            }
        };
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should clearCookie()", () => {
        const {req, res} = testHelpers.createMocks();
        req.app = app;

        testHelpers.spy(res, 'clearCookie');

        moduleToTest(req, res);

        expect(res.clearCookie).to.have.been.called();
        // expect(res.clearCookie).to.have.been.calledWith(config.jwtCookieName);
    });

    it("should 406 for unknown", () => {
        const reqOptions = {
            headers: {
                Accept: 'unknown'
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);
        req.app = app;

        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(406);
    });

    it("should 204 for HAL", () => {
        const reqOptions = {
            headers: {
                Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);
        req.app = app;

        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(204);
        expect(res._getData()).to.equal('');
        expect(res._getHeaders()).to.deep.equal({
            'Content-Type': warpjsUtils.constants.HAL_CONTENT_TYPE
        });
    });

    it("should redirect for HTML", () => {
        const reqOptions = {};
        const {req, res} = testHelpers.createMocks(reqOptions);
        req.app = app;

        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(302);
        expect(res._getRedirectUrl()).to.equal('/');
    });
});
