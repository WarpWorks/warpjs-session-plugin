const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./can-access');

const expect = testHelpers.expect;

describe("server/middlewares/can-access", () => {
    it("should expose a function with 7 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(7);
    });
});
