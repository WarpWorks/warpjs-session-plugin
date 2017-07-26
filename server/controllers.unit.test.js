const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../config');
const controllers = require('./controllers');
const specUtils = require('./../utils.helpers.test');

const expect = testHelpers.expect;

describe("server/session/controllers", () => {
    it("should export an object", () => {
        expect(controllers).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(controllers);

        expect(clone).to.have.property('loginPage');
        delete clone.loginPage;

        expect(clone).to.have.property('login');
        delete clone.login;

        expect(clone).to.have.property('logout');
        delete clone.logout;

        expect(clone).to.deep.equal({});
    });

    describe("loginPage()", () => {
        it("should be a function with 2 params", () => {
            expect(controllers.loginPage).to.be.a('function').to.have.lengthOf(2);
        });

        it("should 406 for unknown", () => {
            const reqOptions = {
                headers: {
                    Accept: 'unknown'
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);

            controllers.loginPage(req, res);

            expect(res._getStatusCode()).to.equal(406);
        });

        it("should render 'index' for HTML", () => {
            const reqOptions = {
                headers: {
                    Accept: 'text/html'
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);

            controllers.loginPage(req, res);

            expect(res._getStatusCode()).to.equal(200);
            expect(res._getRenderView()).to.equal('index');
            expect(res._getRenderData()).to.deep.equal({
                title: "Login",
                bundle: 'session'
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

                controllers.loginPage(req, res);

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

                controllers.loginPage(req, res);

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

                controllers.loginPage(req, res);

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

                controllers.loginPage(req, res);

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

                controllers.loginPage(req, res);

                const data = res._getData();

                specUtils.verifyHal(expect, data);
                expect(data.messages.error).to.equal("You are not authorized. Switch user?");
            });

            it("should add already logged in message if i3cUser", () => {
                const reqOptions = {
                    url: '/some/original/url',
                    headers: {
                        Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                    }
                };
                const {req, res} = testHelpers.createMocks(reqOptions);
                req.i3cUser = {
                    UserName: 'foobar'
                };

                controllers.loginPage(req, res);

                const data = res._getData();

                specUtils.verifyHal(expect, data);
                expect(data.messages).to.have.property('alreadyConnected')
                    .to.equal("Already logged in as 'foobar'. Log in below to switch user.");
            });
        });
    });

    describe("login()", () => {
        it("should be a function with 2 params", () => {
            expect(controllers.login).to.be.a('function').to.have.lengthOf(2);
        });

        describe("invalid user", () => {
            it.skip("should 406 for unknown", (done) => {
                const reqOptions = {
                    headers: {
                        Accept: 'unknown'
                    }
                };
                const {req, res} = testHelpers.createMocks(reqOptions);
                controllers.login(req, res);

                setTimeout(() => {
                    expect(res._getStatusCode()).to.equal(406);
                    done();
                }, 1000);
            });

            it.skip("should redirect to login for HTML", (done) => {
                const reqOptions = {
                    headers: {
                        Accept: 'text/html'
                    }
                };
                const {req, res} = testHelpers.createMocks(reqOptions);

                controllers.login(req, res);

                setTimeout(() => {
                    expect(res._getStatusCode()).to.equal(302);
                    expect(res._getRedirectUrl()).to.equal('/session?error=invalid&redirect=');
                    done();
                }, 1000);
            });

            it.skip("should redirect (with body.redirect) to login for HTML", (done) => {
                const reqOptions = {
                    headers: {
                        Accept: 'text/html'
                    },
                    body: {
                        redirect: '/something'
                    }
                };
                const {req, res} = testHelpers.createMocks(reqOptions);

                controllers.login(req, res);

                setTimeout(() => {
                    expect(res._getStatusCode()).to.equal(302);
                    expect(res._getRedirectUrl()).to.equal('/session?error=invalid&redirect=%2Fsomething');
                    done();
                }, 1000);
            });

            it.skip("should redirect (with referer) to login for HTML", (done) => {
                const reqOptions = {
                    headers: {
                        Accept: 'text/html',
                        Referer: 'https://other.site/some/path'
                    }
                };
                const {req, res} = testHelpers.createMocks(reqOptions);

                controllers.login(req, res);

                setTimeout(() => {
                    expect(res._getStatusCode()).to.equal(302);
                    expect(res._getRedirectUrl()).to.equal('/session?error=invalid&redirect=https%3A%2F%2Fother.site%2Fsome%2Fpath');
                    done();
                }, 1000);
            });
        });
    });

    describe("logout()", () => {
        it("should be a function with 2 params", () => {
            expect(controllers.logout).to.be.a('function').to.have.lengthOf(2);
        });

        it("should clearCookie()", () => {
            const {req, res} = testHelpers.createMocks();

            testHelpers.spy(res, 'clearCookie');

            controllers.logout(req, res);

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

            controllers.logout(req, res);

            expect(res._getStatusCode()).to.equal(406);
        });

        it("should 204 for HAL", () => {
            const reqOptions = {
                headers: {
                    Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);

            controllers.logout(req, res);

            expect(res._getStatusCode()).to.equal(204);
            expect(res._getData()).to.equal('');
            expect(res._getHeaders()).to.deep.equal({
                'Content-Type': warpjsUtils.constants.HAL_CONTENT_TYPE
            });
        });

        it("should redirect for HTML", () => {
            const reqOptions = {};
            const {req, res} = testHelpers.createMocks(reqOptions);

            controllers.logout(req, res);

            expect(res._getStatusCode()).to.equal(302);
            expect(res._getRedirectUrl()).to.equal('/');
        });
    });
});
