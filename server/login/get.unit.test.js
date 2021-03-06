const testHelpers = require('@quoin/node-test-helpers');
const RoutesInfoCache = require('@quoin/expressjs-routes-info/lib/cache');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const libConstants = require('./../../lib/constants');
const moduleToTest = require('./get');
const specUtils = require('./../utils.helpers.test');

const expect = testHelpers.expect;

const MOCK_REQ_APP = {
    get: (key) => key
};

describe("server/login/get", () => {
    beforeEach(() => {
        RoutesInfoCache.reset();
        specUtils.initApp();
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should 406 for unknown", () => {
        const reqOptions = {
            headers: {
                Accept: 'unknown'
            },
            app: MOCK_REQ_APP
        };
        const { req, res } = testHelpers.createMocks(reqOptions);
        res.app = {
            get: (key) => key
        };

        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(406);
    });

    it("should render 'index' for HTML", () => {
        const reqOptions = {
            headers: {
                Accept: 'text/html'
            }
        };
        const { req, res } = testHelpers.createMocks(reqOptions);
        const app = {
            get: (key) => key
        };
        req.app = app;
        res.app = app;

        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(200);
        expect(res._getRenderView()).to.equal('portal-index');

        const renderData = res._getRenderData();
        expect(renderData).has.property('baseUrl', 'base-url');
        expect(renderData).has.property('staticUrl', 'static-url');
        expect(renderData).has.property('title', "Login");
        expect(renderData).has.property('copyrightYear', (new Date()).getFullYear());

        expect(renderData).has.property('bundles');
        expect(renderData.bundles).to.deep.equal([
            `base-url/assets/${libConstants.assets.js}`
        ]);

        expect(renderData).has.property('cssFile', `base-url/assets/${libConstants.assets.css}`);

        expect(renderData).has.property('warpjsFeatures');
        expect(renderData.warpjsFeatures).to.be.an('object');

        expect(renderData).has.property('warpjsUser');

        expect(renderData).has.property('_embedded');
        expect(renderData._embedded).has.property('headerItems');

        expect(renderData).has.property('_links');
        expect(renderData._links).has.property('warpjsLogo');
        // expect(renderData._links).has.property('warpjsLogin');
        // expect(renderData._links).has.property('warpjsLogout');
    });

    describe("in HAL", () => {
        it("should send HAL", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                },
                app: MOCK_REQ_APP
            };
            const { req, res } = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(req, res);

            expect(res._getStatusCode()).to.equal(200);
            expect(res._getHeaders()).to.deep.equal({
                'content-type': warpjsUtils.constants.HAL_CONTENT_TYPE
            });

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.hideLoginHeader).to.be.true();
            expect(data.messages).not.to.be.undefined();
            expect(data.messages.error).to.be.undefined();
        });

        it("should add redirect URL if present", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                },
                query: {
                    redirect: '/some/redirect'
                },
                app: MOCK_REQ_APP
            };
            const { req, res } = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(req, res);

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.redirectUrl).to.equal('/some/redirect');
        });

        it("should add failed authentication message if invalid", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                },
                query: {
                    error: 'invalid'
                },
                app: MOCK_REQ_APP
            };
            const { req, res } = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(req, res);

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.messages.error).to.equal("Failed authentication");
        });

        it("should add authorization message if 401", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                },
                query: {
                    error: '401'
                },
                app: MOCK_REQ_APP
            };
            const { req, res } = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(req, res);

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.messages.error).to.equal("You must be logged in to continue");
        });

        it("should add login message if 403", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                },
                query: {
                    error: '403'
                },
                app: MOCK_REQ_APP
            };
            const { req, res } = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(req, res);

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.messages.error).to.equal("You are not authorized. Switch user?");
        });

        it("should add already logged in message if warpjsUser", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                },
                app: MOCK_REQ_APP
            };
            const { req, res } = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };
            req[constants.WARPJS_USER_REQ_KEY] = {
                UserName: 'foobar'
            };

            moduleToTest(req, res);

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.messages).to.have.property('alreadyConnected');
            expect(data.messages.alreadyConnected).to.equal("Already logged in as 'foobar'. Log in below to switch user.");
        });
    });
});
