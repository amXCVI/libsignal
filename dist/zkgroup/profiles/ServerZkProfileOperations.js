"use strict";
//
// Copyright 2020-2022 Signal Messenger, LLC.
// SPDX-License-Identifier: AGPL-3.0-only
//
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const Native = require("../../../Native");
const Constants_1 = require("../internal/Constants");
const ExpiringProfileKeyCredentialResponse_1 = require("./ExpiringProfileKeyCredentialResponse");
const PniCredentialResponse_1 = require("./PniCredentialResponse");
const ProfileKeyCredentialResponse_1 = require("./ProfileKeyCredentialResponse");
const UUIDUtil_1 = require("../internal/UUIDUtil");
class ServerZkProfileOperations {
    constructor(serverSecretParams) {
        this.serverSecretParams = serverSecretParams;
    }
    issueProfileKeyCredential(profileKeyCredentialRequest, uuid, profileKeyCommitment) {
        const random = (0, crypto_1.randomBytes)(Constants_1.RANDOM_LENGTH);
        return this.issueProfileKeyCredentialWithRandom(random, profileKeyCredentialRequest, uuid, profileKeyCommitment);
    }
    issueProfileKeyCredentialWithRandom(random, profileKeyCredentialRequest, uuid, profileKeyCommitment) {
        return new ProfileKeyCredentialResponse_1.default(Native.ServerSecretParams_IssueProfileKeyCredentialDeterministic(this.serverSecretParams.getContents(), random, profileKeyCredentialRequest.getContents(), (0, UUIDUtil_1.fromUUID)(uuid), profileKeyCommitment.getContents()));
    }
    issueExpiringProfileKeyCredential(profileKeyCredentialRequest, uuid, profileKeyCommitment, expirationInSeconds) {
        const random = (0, crypto_1.randomBytes)(Constants_1.RANDOM_LENGTH);
        return this.issueExpiringProfileKeyCredentialWithRandom(random, profileKeyCredentialRequest, uuid, profileKeyCommitment, expirationInSeconds);
    }
    issueExpiringProfileKeyCredentialWithRandom(random, profileKeyCredentialRequest, uuid, profileKeyCommitment, expirationInSeconds) {
        return new ExpiringProfileKeyCredentialResponse_1.default(Native.ServerSecretParams_IssueExpiringProfileKeyCredentialDeterministic(this.serverSecretParams.getContents(), random, profileKeyCredentialRequest.getContents(), (0, UUIDUtil_1.fromUUID)(uuid), profileKeyCommitment.getContents(), expirationInSeconds));
    }
    /**
     * @deprecated Superseded by AuthCredentialWithPni + ProfileKeyCredential
     */
    issuePniCredential(profileKeyCredentialRequest, aci, pni, profileKeyCommitment) {
        const random = (0, crypto_1.randomBytes)(Constants_1.RANDOM_LENGTH);
        return this.issuePniCredentialWithRandom(random, profileKeyCredentialRequest, aci, pni, profileKeyCommitment);
    }
    /**
     * @deprecated Superseded by AuthCredentialWithPni + ProfileKeyCredential
     */
    issuePniCredentialWithRandom(random, profileKeyCredentialRequest, aci, pni, profileKeyCommitment) {
        return new PniCredentialResponse_1.default(Native.ServerSecretParams_IssuePniCredentialDeterministic(this.serverSecretParams.getContents(), random, profileKeyCredentialRequest.getContents(), (0, UUIDUtil_1.fromUUID)(aci), (0, UUIDUtil_1.fromUUID)(pni), profileKeyCommitment.getContents()));
    }
    verifyProfileKeyCredentialPresentation(groupPublicParams, profileKeyCredentialPresentation, now = new Date()) {
        Native.ServerSecretParams_VerifyProfileKeyCredentialPresentation(this.serverSecretParams.getContents(), groupPublicParams.getContents(), profileKeyCredentialPresentation.getContents(), Math.floor(now.getTime() / 1000));
    }
    /**
     * @deprecated Superseded by AuthCredentialWithPni + ProfileKeyCredential
     */
    verifyPniCredentialPresentation(groupPublicParams, presentation) {
        Native.ServerSecretParams_VerifyPniCredentialPresentation(this.serverSecretParams.getContents(), groupPublicParams.getContents(), presentation.getContents());
    }
}
exports.default = ServerZkProfileOperations;
//# sourceMappingURL=ServerZkProfileOperations.js.map