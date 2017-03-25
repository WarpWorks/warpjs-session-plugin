const _ = require('lodash');
const jwt = require('jsonwebtoken');
const testHelpers = require('@quoin/node-test-helpers');

const config = require('./../config');
const middlewares = require('./middlewares');
const utils = require('./../utils');

const expect = testHelpers.expect;

describe("server/session/middlewares", () => {
    it("should export an object", () => {
        expect(middlewares).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(middlewares);

        expect(clone).to.have.property('i3cUser');
        delete clone.i3cUser;

        expect(clone).to.have.property('requiresI3cUser');
        delete clone.requiresI3cUser;

        expect(clone).to.deep.equal({});
    });

    describe("i3cUser()", () => {
        it("should not add 'i3cUser' when no signedCookies", () => {
            const reqOptions = {};
            const {req, res} = testHelpers.createMocks(reqOptions);
            const next = testHelpers.stub();

            middlewares.i3cUser(req, res, next);

            expect(next).to.have.been.called();
            expect(req.i3cUser).to.be.undefined();
        });

        it("should not add 'i3cUser' when no jwt cookie", () => {
            const reqOptions = {
                signedCookies: {
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            const next = testHelpers.stub();

            middlewares.i3cUser(req, res, next);

            expect(next).to.have.been.called();
            expect(req.i3cUser).to.be.undefined();
        });

        it("should not add 'i3cUser' when jwt cookie invalid", () => {
            const reqOptions = {
                signedCookies: {
                    [config.jwtCookieName]: 'invalid'
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            const next = testHelpers.stub();

            middlewares.i3cUser(req, res, next);

            expect(next).to.have.been.called();
            expect(req.i3cUser).to.be.undefined();
        });

        it("should add 'i3cUser' when jwt cookie valid", () => {
            const payload = {
                user: {
                    username: 'foo',
                    something: 'else'
                }
            };
            const token = jwt.sign(payload, config.jwtSecret);

            const reqOptions = {
                signedCookies: {
                    [config.jwtCookieName]: token
                }
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            const next = testHelpers.stub();

            middlewares.i3cUser(req, res, next);

            expect(next).to.have.been.called();
            expect(req.i3cUser).to.deep.equal({
                username: 'foo',
                something: 'else'
            });
        });
    });

    describe("requiresI3cUser()", () => {
        it("should be a function with 4 params", () => {
            expect(middlewares.requiresI3cUser).to.be.a('function').to.have.lengthOf(4);
        });

        it("should redirect if not logged in", () => {
            const reqOptions = {
                url: '/some/original/url'
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            const next = testHelpers.stub();
            const expectedRedirect = utils.urlFormat('/session', {
                error: '403',
                redirect: '/some/original/url'
            });

            middlewares.requiresI3cUser(undefined, req, res, next);

            expect(next).not.to.have.been.called();
            expect(res._getStatusCode()).to.equal(302);
            expect(res._getRedirectUrl()).to.equal(expectedRedirect);
        });

        it("should check permissions with user", () => {
            const reqOptions = {
                url: '/some/original/url'
            };
            const {req, res} = testHelpers.createMocks(reqOptions);
            const next = testHelpers.stub();

            req.i3cUser = {};

            middlewares.requiresI3cUser(undefined, req, res, next);

            expect(next).to.have.been.called();
        });
    });
});
