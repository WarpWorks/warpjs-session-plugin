const { expect } = require('@quoin/node-test-helpers');

const moduleToTest = require('./compare-password');

const filespace = require('./_.test');

describe(filespace(__filename), () => {
    const CLEARTEXT = 'foobar';
    const BCRYPTED = '$2a$10$NIik9eMIsllNBgVlRbiFJ.2N.1tMCMNaXZEHwQsBoDuEGWfICHlzG';

    it('exports a function with 2 params', () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(2);
    });

    describe('()', () => {
        it('throws when called without params', async () => {
            try {
                await moduleToTest();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equals('Invalid password');
            }
        });

        it('throws when only 1 param', async () => {
            try {
                await moduleToTest('foo');
                expect.fail();
            } catch (err) {
                expect(err.message).to.equals('Invalid password');
            }
        });

        it('throws when wrong password', async () => {
            try {
                await moduleToTest(`WRONG-${CLEARTEXT}`, BCRYPTED);
            } catch (err) {
                expect(err.message).to.equals('Invalid password');
            }
        });

        it('finds the correct answer', async () => {
            try {
                await moduleToTest(CLEARTEXT, BCRYPTED);
            } catch (err) {
                expect.fail();
            }
        });
    });
});
