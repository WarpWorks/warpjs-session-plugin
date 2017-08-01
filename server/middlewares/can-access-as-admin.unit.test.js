const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./can-access-as-admin');

const expect = testHelpers.expect;

describe("server/middlewares/can-access-as-admin", () => {
    it("should expose a function with 6 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(6);
    });
});
