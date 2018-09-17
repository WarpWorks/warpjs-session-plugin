const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./can-access');

const expect = testHelpers.expect;

describe("server/middlewares/can-access", () => {
    const config = {};
    const warpCore = {};
    const Persistence = {};

    it("should expose a function with 7 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(7);
    });

    it("should call next() with error when no user", () => {
        function impl() {}

        const reqOptions = {
            headers: {
                Accept: 'unknown'
            }
        };
        const { req, res } = testHelpers.createMocks(reqOptions);
        const next = testHelpers.stub();

        moduleToTest(impl, config, warpCore, Persistence, req, res, next);

        expect(next).to.have.been.calledOnce();
    });
});
