"use strict";
//
// Copyright 2023 Signal Messenger, LLC.
// SPDX-License-Identifier: AGPL-3.0-only
//
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Errors_1 = require("../Errors");
const usernames = require("../usernames");
const util = require("./util");
util.initLogger();
describe('usernames', () => {
    describe('hash', () => {
        it('can hash valid usernames', () => {
            chai_1.assert.isNotEmpty(usernames.hash('He110.01'));
            chai_1.assert.isNotEmpty(usernames.hash('usr.999999999'));
            chai_1.assert.isNotEmpty(usernames.hash('_identifier.42'));
        });
        it('throws on invalid usernames', () => {
            chai_1.assert.throws(() => usernames.hash('0zerostart.42'));
            chai_1.assert.throws(() => usernames.hash('no_discriminator'));
            chai_1.assert.throws(() => usernames.hash('🦀.42'));
            chai_1.assert.throws(() => usernames.hash('s p a c e s.01'));
            chai_1.assert.throws(() => usernames.hash('zero.00'));
            chai_1.assert.throws(() => usernames.hash('zeropad.001'));
            chai_1.assert.throws(() => usernames.hash('short.1'));
            chai_1.assert.throws(() => usernames.hash('short_zero.0'));
        });
    });
    describe('proof verification', () => {
        it('works', () => {
            const nickname = 'He110.101';
            const hash = usernames.hash(nickname);
            const proof = usernames.generateProof(nickname);
            usernames.verifyProof(proof, hash);
        });
        it('does not allow interchanging proofs', () => {
            const hash = usernames.hash('He110.101');
            const proof = usernames.generateProof('sneaky.99');
            chai_1.assert.throws(() => usernames.verifyProof(proof, hash));
        });
        it('throws for an invalid hash', () => {
            const nickname = 'He110.101';
            const hash = usernames.hash(nickname);
            const badHash = hash.slice(1);
            const proof = usernames.generateProof(nickname);
            chai_1.assert.throws(() => usernames.verifyProof(proof, badHash));
        });
    });
    describe('generateCandidates', () => {
        it('can generate valid usernames', () => {
            const nickname = '_SiGNA1';
            const candidates = usernames.generateCandidates(nickname, 3, 32);
            chai_1.assert.isNotEmpty(candidates);
            for (const candidate of candidates) {
                (0, chai_1.assert)(candidate.startsWith(nickname), `${candidate} didn't start with ${nickname}`);
                const hash = usernames.hash(candidate);
                chai_1.assert.isNotEmpty(hash);
                const proof = usernames.generateProof(candidate);
                chai_1.assert.isNotEmpty(proof);
                usernames.verifyProof(proof, hash);
            }
        });
        it('will error on invalid nicknames', () => {
            (0, chai_1.expect)(() => usernames.generateCandidates('ab', 3, 32))
                .throws(Errors_1.LibSignalErrorBase)
                .with.property('code', Errors_1.ErrorCode.NicknameTooShort);
            (0, chai_1.expect)(() => usernames.generateCandidates('ab', 1, 32)).does.not.throw();
            (0, chai_1.expect)(() => usernames.generateCandidates('abc', 1, 2))
                .throws(Errors_1.LibSignalErrorBase)
                .with.property('code', Errors_1.ErrorCode.NicknameTooLong);
            (0, chai_1.expect)(() => usernames.generateCandidates('Ke$ha', 3, 32))
                .throws(Errors_1.LibSignalErrorBase)
                .with.property('code', Errors_1.ErrorCode.BadNicknameCharacter);
        });
    });
});
//# sourceMappingURL=UsernamesTest.js.map