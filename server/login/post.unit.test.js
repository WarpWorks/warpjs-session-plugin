const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./post');

const expect = testHelpers.expect;

describe("server/login/post", () => {
    let app;

    beforeEach(() => {
        app = {
            get(key) {
                switch (key) {
                    case 'warpjs-core':
                        return {};

                    case 'warpjs-persistence':
                        return {};

                    case 'warpjs-config':
                        return {};

                    default:
                        throw new Error(`Unknown app.get('${key}').`);
                }
            }
        };
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    describe("invalid user", () => {
        it.skip("should 406 for unknown", (done) => {
            const reqOptions = {
                headers: {
                    Accept: 'unknown'
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            req.app = app;
            moduleToTest(req, res);

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
            req.app = app;

            moduleToTest(req, res);

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
            req.app = app;

            moduleToTest(req, res);

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
            req.app = app;

            moduleToTest(req, res);

            setTimeout(() => {
                expect(res._getStatusCode()).to.equal(302);
                expect(res._getRedirectUrl()).to.equal('/session?error=invalid&redirect=https%3A%2F%2Fother.site%2Fsome%2Fpath');
                done();
            }, 1000);
        });
    });
});
