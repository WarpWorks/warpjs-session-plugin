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

    context(".isCasSSO()", () => {
        after(() => {
            delete clone.isCasSSO;
        });

        it("should be a function with 1 param", () => {
            expect(clone).to.have.property('isCasSSO');
            expect(clone.isCasSSO).to.be.a('function').and.to.have.lengthOf(1);
        });
    });

    context(".getLoginUrl()", () => {
        after(() => {
            delete clone.getLoginUrl;
        });

        it("should be a function with 1 param", () => {
            expect(clone).to.have.property('getLoginUrl');
            expect(clone.getLoginUrl).to.be.a('function').and.to.have.lengthOf(2);
        });
    });

    context(".getLogoutUrl()", () => {
        after(() => {
            delete clone.getLogoutUrl;
        });

        it("should be a function with 1 param", () => {
            expect(clone).to.have.property('getLogoutUrl');
            expect(clone.getLogoutUrl).to.be.a('function').and.to.have.lengthOf(2);
        });
    });

    describe("after all properties", () => {
        it("should be all tested", () => {
            expect(clone).to.be.empty();
        });
    });
});
