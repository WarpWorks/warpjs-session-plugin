const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./unauthorized');

const expect = testHelpers.expect;

describe("server/middlewares/unauthorized", () => {
    it("should expose a function with 7 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(7);
    });
});
