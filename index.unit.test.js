const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./index');

const expect = testHelpers.expect;

describe("index", () => {
    const clone = _.clone(moduleToTest);

    it("should export a function", () => {
        expect(moduleToTest).to.be.a('function');
    });

    context("function", () => {
        it("should take 3 params", () => {
            expect(moduleToTest).to.have.lengthOf(3);
        });
    });

    context(".middlewares()", () => {
        it("should expose .middlewares", () => {
            expect(moduleToTest).to.have.property('middlewares');
        });

        it("should be a function with 3 params", () => {
            expect(moduleToTest.middlewares).to.be.a('function').and.to.have.lengthOf(3);
        });

        after(() => {
            delete clone.middlewares;
        });
    });

    context(".canEdit()", () => {
        it("should expose .canEdit", () => {
            expect(moduleToTest).to.have.property('canEdit');
        });

        it("should be a function with 5 params", () => {
            expect(moduleToTest.canEdit).to.be.a('function').and.to.have.lengthOf(5);
        });

        after(() => {
            delete clone.canEdit;
        });
    });

    describe("after all properties", () => {
        it("should be all tested", () => {
            expect(clone).to.be.empty();
        });
    });
});
