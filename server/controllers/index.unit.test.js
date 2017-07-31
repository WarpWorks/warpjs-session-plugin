const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const controllers = require('./index');

const expect = testHelpers.expect;

describe("server/controllers/index", () => {
    it("should export an object", () => {
        expect(controllers).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(controllers);

        expect(clone).to.have.property('loginPage');
        delete clone.loginPage;

        expect(clone).to.have.property('login');
        delete clone.login;

        expect(clone).to.have.property('logout');
        delete clone.logout;

        expect(clone).to.deep.equal({});
    });
});
