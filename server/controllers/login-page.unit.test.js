const testHelpers = require('@quoin/node-test-helpers');
const RoutesInfoCache = require('@quoin/expressjs-routes-info/lib/cache');
const warpjsUtils = require('@warp-works/warpjs-utils');

const app = require('./../app');
const constants = require('./../constants');
const moduleToTest = require('./login-page');
const specUtils = require('./../utils.helpers.test');

const expect = testHelpers.expect;

describe("server/controllers/login-page", () => {
    const config = {};
    const warpCore = {};
    const Persistence = {};
    const baseUrl = '/test';
    const staticUrl = '/test-static';

    beforeEach(() => {
        RoutesInfoCache.reset();
        app(config, warpCore, Persistence, baseUrl, staticUrl);
    });

    it("should expose a function with 5 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(5);
    });

    it("should 406 for unknown", () => {
        const reqOptions = {
            headers: {
                Accept: 'unknown'
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);
        res.app = {
            get: (key) => key
        };

        moduleToTest(config, warpCore, Persistence, req, res);

        expect(res._getStatusCode()).to.equal(406);
    });

    it("should render 'index' for HTML", () => {
        const reqOptions = {
            headers: {
                Accept: 'text/html'
            }
        };
        const {req, res} = testHelpers.createMocks(reqOptions);
        res.app = {
            get: (key) => key
        };

        moduleToTest(config, warpCore, Persistence, req, res);

        expect(res._getStatusCode()).to.equal(200);
        expect(res._getRenderView()).to.equal('index');
        expect(res._getRenderData()).to.deep.equal({
            title: "Login",
            baseUrl: 'base-url',
            staticUrl: 'static-url',
            bundles: [
                'static-url/app/vendor.js',
                'static-url/app/session.js'
            ],
            cssFile: undefined
        });
    });

    describe("in HAL", () => {
        it("should send HAL", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(config, warpCore, Persistence, req, res);

            expect(res._getStatusCode()).to.equal(200);
            expect(res._getHeaders()).to.deep.equal({
                'Content-Type': warpjsUtils.constants.HAL_CONTENT_TYPE
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
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(config, warpCore, Persistence, req, res);

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
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(config, warpCore, Persistence, req, res);

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
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(config, warpCore, Persistence, req, res);

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
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };

            moduleToTest(config, warpCore, Persistence, req, res);

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.messages.error).to.equal("You are not authorized. Switch user?");
        });

        it("should add already logged in message if warpjsUser", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            res.app = {
                get: (key) => key
            };
            req[constants.WARPJS_USER_REQ_KEY] = {
                UserName: 'foobar'
            };

            moduleToTest(config, warpCore, Persistence, req, res);

            const data = res._getData();

            specUtils.verifyHal(expect, data);
            expect(data.messages).to.have.property('alreadyConnected')
                .to.equal("Already logged in as 'foobar'. Log in below to switch user.");
        });
    });
});
