const cloneDeep = require('lodash/cloneDeep');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./index');

const expect = testHelpers.expect;

describe("server/middlewares/index", () => {
    const config = {};
    const warpCore = {};
    const Persistence = {};

    let index;

    beforeEach(() => {
        index = moduleToTest(config, warpCore, Persistence);
    });

    it("should export a function with 3 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(3);
    });

    it("should expose known properties", () => {
        const clone = cloneDeep(index);

        testHelpers.verifyProperties(clone, 'function', [
            'canAccessAsAdmin',
            'canAccessAsContentManager',
            'warpjsUser',
            'requiresWarpjsUser',
            'unauthorized'
        ]);

        expect(clone).to.be.empty();
    });
});
