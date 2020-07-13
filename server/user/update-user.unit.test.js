const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./update-user');

const expect = testHelpers.expect;

describe('server/user/update-user', () => {
    it('exports a function with 2 params', () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(2);
    });
});
