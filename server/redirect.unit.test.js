const RoutesInfoCache = require('@quoin/expressjs-routes-info/lib/cache');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./redirect');
const specHelpers = require('./utils.helpers.test');

const expect = testHelpers.expect;

describe("server/redirect", () => {
    it("should expose a function with 3 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(3);
    });

    describe("()", () => {
        let res;

        beforeEach(() => {
            RoutesInfoCache.reset();
            specHelpers.initApp();
            res = {
                redirect: testHelpers.stub()
            };
        });

        it("should redirect to '/test/' without params", () => {
            moduleToTest(res);
            expect(res.redirect).to.have.been.calledOnce();
            expect(res.redirect).to.have.been.calledWith('/test/');
        });

        it("should redirect to '/test/?error=foo' when only error defined", () => {
            moduleToTest(res, 'foo');
            expect(res.redirect).to.have.been.calledOnce();
            expect(res.redirect).to.have.been.calledWith('/test/?error=foo');
        });

        it("should redirect to '/test/?redirect=bar' when only redirect defined", () => {
            moduleToTest(res, undefined, 'bar');
            expect(res.redirect).to.have.been.calledOnce();
            expect(res.redirect).to.have.been.calledWith('/test/?redirect=bar');
        });

        it("should redirect to '/test/?error=foo&redirect=bar' when both defined", () => {
            moduleToTest(res, 'foo', 'bar');
            expect(res.redirect).to.have.been.calledOnce();
            expect(res.redirect).to.have.been.calledWith('/test/?error=foo&redirect=bar');
        });
    });
});
