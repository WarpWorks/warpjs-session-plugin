const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./login');

const expect = testHelpers.expect;

describe("server/controllers/login", () => {
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

    describe("invalid user", () => {
        it.skip("should 406 for unknown", (done) => {
            const reqOptions = {
                headers: {
                    Accept: 'unknown'
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            moduleToTest(config, warpCore, Persistence, req, res);

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

            moduleToTest(config, warpCore, Persistence, req, res);

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

            moduleToTest(config, warpCore, Persistence, req, res);

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

            moduleToTest(config, warpCore, Persistence, req, res);

            setTimeout(() => {
                expect(res._getStatusCode()).to.equal(302);
                expect(res._getRedirectUrl()).to.equal('/session?error=invalid&redirect=https%3A%2F%2Fother.site%2Fsome%2Fpath');
                done();
            }, 1000);
        });
    });
});
