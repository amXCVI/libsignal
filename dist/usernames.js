"use strict";
//
// Copyright 2023 Signal Messenger, LLC.
// SPDX-License-Identifier: AGPL-3.0-only
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyProof = exports.generateProofWithRandom = exports.generateProof = exports.hash = exports.generateCandidates = void 0;
const crypto_1 = require("crypto");
const Constants_1 = require("./zkgroup/internal/Constants");
const Native = require("../Native");
function generateCandidates(nickname, minNicknameLength, maxNicknameLength) {
    return Native.Username_CandidatesFrom(nickname, minNicknameLength, maxNicknameLength).split(',');
}
exports.generateCandidates = generateCandidates;
function hash(username) {
    return Native.Username_Hash(username);
}
exports.hash = hash;
function generateProof(username) {
    const random = (0, crypto_1.randomBytes)(Constants_1.RANDOM_LENGTH);
    return generateProofWithRandom(username, random);
}
exports.generateProof = generateProof;
function generateProofWithRandom(username, random) {
    return Native.Username_Proof(username, random);
}
exports.generateProofWithRandom = generateProofWithRandom;
// Only for testing. Will throw on failure.
function verifyProof(proof, hash) {
    Native.Username_Verify(proof, hash);
}
exports.verifyProof = verifyProof;
//# sourceMappingURL=usernames.js.map