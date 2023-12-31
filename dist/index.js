"use strict";
//
// Copyright 2020-2022 Signal Messenger, LLC.
// SPDX-License-Identifier: AGPL-3.0-only
//
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = exports.HsmEnclaveClient = exports.Cds2Client = exports.sealedSenderDecryptToUsmc = exports.sealedSenderDecryptMessage = exports.sealedSenderMultiRecipientMessageForSingleRecipient = exports.sealedSenderMultiRecipientEncrypt = exports.sealedSenderEncrypt = exports.sealedSenderEncryptMessage = exports.signalDecryptPreKey = exports.signalDecrypt = exports.signalEncrypt = exports.processPreKeyBundle = exports.DecryptionErrorMessage = exports.PlaintextContent = exports.CiphertextMessage = exports.SealedSenderDecryptionResult = exports.groupDecrypt = exports.groupEncrypt = exports.SenderKeyStore = exports.SignedPreKeyStore = exports.PreKeyStore = exports.IdentityKeyStore = exports.SessionStore = exports.UnidentifiedSenderMessageContent = exports.SenderKeyMessage = exports.processSenderKeyDistributionMessage = exports.SenderKeyDistributionMessage = exports.SenderCertificate = exports.SenderKeyRecord = exports.ServerCertificate = exports.SessionRecord = exports.PreKeySignalMessage = exports.SignalMessage = exports.SignedPreKeyRecord = exports.PreKeyRecord = exports.PreKeyBundle = exports.IdentityKeyPair = exports.PrivateKey = exports.PublicKey = exports.Aes256GcmSiv = exports.Fingerprint = exports.DisplayableFingerprint = exports.ScannableFingerprint = exports.hkdf = exports.HKDF = exports.ContentHint = exports.Direction = exports.CiphertextMessageType = exports.usernames = void 0;
exports.initLogger = void 0;
const uuid = require("uuid");
const Errors = require("./Errors");
__exportStar(require("./Errors"), exports);
const Address_1 = require("./Address");
__exportStar(require("./Address"), exports);
exports.usernames = require("./usernames");
const Native = require("../Native");
Native.registerErrors(Errors);
// These enums must be kept in sync with their Rust counterparts.
var CiphertextMessageType;
(function (CiphertextMessageType) {
    CiphertextMessageType[CiphertextMessageType["Whisper"] = 2] = "Whisper";
    CiphertextMessageType[CiphertextMessageType["PreKey"] = 3] = "PreKey";
    CiphertextMessageType[CiphertextMessageType["SenderKey"] = 7] = "SenderKey";
    CiphertextMessageType[CiphertextMessageType["Plaintext"] = 8] = "Plaintext";
})(CiphertextMessageType = exports.CiphertextMessageType || (exports.CiphertextMessageType = {}));
var Direction;
(function (Direction) {
    Direction[Direction["Sending"] = 0] = "Sending";
    Direction[Direction["Receiving"] = 1] = "Receiving";
})(Direction = exports.Direction || (exports.Direction = {}));
// This enum must be kept in sync with sealed_sender.proto.
var ContentHint;
(function (ContentHint) {
    ContentHint[ContentHint["Default"] = 0] = "Default";
    ContentHint[ContentHint["Resendable"] = 1] = "Resendable";
    ContentHint[ContentHint["Implicit"] = 2] = "Implicit";
})(ContentHint = exports.ContentHint || (exports.ContentHint = {}));
class HKDF {
    /**
     * @deprecated Use the top-level 'hkdf' function for standard HKDF behavior
     */
    static new(version) {
        if (version != 3) {
            throw new Error('HKDF versions other than 3 are no longer supported');
        }
        return new HKDF();
    }
    deriveSecrets(outputLength, keyMaterial, label, salt) {
        return hkdf(outputLength, keyMaterial, label, salt);
    }
}
exports.HKDF = HKDF;
function hkdf(outputLength, keyMaterial, label, salt) {
    return Native.HKDF_DeriveSecrets(outputLength, keyMaterial, label, salt);
}
exports.hkdf = hkdf;
class ScannableFingerprint {
    constructor(scannable) {
        this.scannable = scannable;
    }
    static _fromBuffer(scannable) {
        return new ScannableFingerprint(scannable);
    }
    compare(other) {
        return Native.ScannableFingerprint_Compare(this.scannable, other.scannable);
    }
    toBuffer() {
        return this.scannable;
    }
}
exports.ScannableFingerprint = ScannableFingerprint;
class DisplayableFingerprint {
    constructor(display) {
        this.display = display;
    }
    static _fromString(display) {
        return new DisplayableFingerprint(display);
    }
    toString() {
        return this.display;
    }
}
exports.DisplayableFingerprint = DisplayableFingerprint;
class Fingerprint {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static new(iterations, version, localIdentifier, localKey, remoteIdentifier, remoteKey) {
        return new Fingerprint(Native.Fingerprint_New(iterations, version, localIdentifier, localKey, remoteIdentifier, remoteKey));
    }
    displayableFingerprint() {
        return DisplayableFingerprint._fromString(Native.Fingerprint_DisplayString(this));
    }
    scannableFingerprint() {
        return ScannableFingerprint._fromBuffer(Native.Fingerprint_ScannableEncoding(this));
    }
}
exports.Fingerprint = Fingerprint;
class Aes256GcmSiv {
    constructor(key) {
        this._nativeHandle = Native.Aes256GcmSiv_New(key);
    }
    static new(key) {
        return new Aes256GcmSiv(key);
    }
    encrypt(message, nonce, associated_data) {
        return Native.Aes256GcmSiv_Encrypt(this, message, nonce, associated_data);
    }
    decrypt(message, nonce, associated_data) {
        return Native.Aes256GcmSiv_Decrypt(this, message, nonce, associated_data);
    }
}
exports.Aes256GcmSiv = Aes256GcmSiv;
class PublicKey {
    constructor(handle) {
        this._nativeHandle = handle;
    }
    static _fromNativeHandle(handle) {
        return new PublicKey(handle);
    }
    static deserialize(buf) {
        return new PublicKey(Native.PublicKey_Deserialize(buf));
    }
    /// Returns -1, 0, or 1
    compare(other) {
        return Native.PublicKey_Compare(this, other);
    }
    serialize() {
        return Native.PublicKey_Serialize(this);
    }
    getPublicKeyBytes() {
        return Native.PublicKey_GetPublicKeyBytes(this);
    }
    verify(msg, sig) {
        return Native.PublicKey_Verify(this, msg, sig);
    }
    verifyAlternateIdentity(other, signature) {
        return Native.IdentityKey_VerifyAlternateIdentity(this, other, signature);
    }
}
exports.PublicKey = PublicKey;
class PrivateKey {
    constructor(handle) {
        this._nativeHandle = handle;
    }
    static _fromNativeHandle(handle) {
        return new PrivateKey(handle);
    }
    static generate() {
        return new PrivateKey(Native.PrivateKey_Generate());
    }
    static deserialize(buf) {
        return new PrivateKey(Native.PrivateKey_Deserialize(buf));
    }
    serialize() {
        return Native.PrivateKey_Serialize(this);
    }
    sign(msg) {
        return Native.PrivateKey_Sign(this, msg);
    }
    agree(other_key) {
        return Native.PrivateKey_Agree(this, other_key);
    }
    getPublicKey() {
        return PublicKey._fromNativeHandle(Native.PrivateKey_GetPublicKey(this));
    }
}
exports.PrivateKey = PrivateKey;
class IdentityKeyPair {
    constructor(publicKey, privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    static generate() {
        const privateKey = PrivateKey.generate();
        return new IdentityKeyPair(privateKey.getPublicKey(), privateKey);
    }
    static deserialize(buffer) {
        const { privateKey, publicKey } = Native.IdentityKeyPair_Deserialize(buffer);
        return new IdentityKeyPair(PublicKey._fromNativeHandle(publicKey), PrivateKey._fromNativeHandle(privateKey));
    }
    serialize() {
        return Native.IdentityKeyPair_Serialize(this.publicKey, this.privateKey);
    }
    signAlternateIdentity(other) {
        return Native.IdentityKeyPair_SignAlternateIdentity(this.publicKey, this.privateKey, other);
    }
}
exports.IdentityKeyPair = IdentityKeyPair;
class PreKeyBundle {
    constructor(handle) {
        this._nativeHandle = handle;
    }
    static new(registration_id, device_id, prekey_id, prekey, signed_prekey_id, signed_prekey, signed_prekey_signature, identity_key) {
        return new PreKeyBundle(Native.PreKeyBundle_New(registration_id, device_id, prekey_id, prekey != null ? prekey : null, 
        //prekey?,
        signed_prekey_id, signed_prekey, signed_prekey_signature, identity_key));
    }
    deviceId() {
        return Native.PreKeyBundle_GetDeviceId(this);
    }
    identityKey() {
        return PublicKey._fromNativeHandle(Native.PreKeyBundle_GetIdentityKey(this));
    }
    preKeyId() {
        return Native.PreKeyBundle_GetPreKeyId(this);
    }
    preKeyPublic() {
        const handle = Native.PreKeyBundle_GetPreKeyPublic(this);
        if (handle == null) {
            return null;
        }
        else {
            return PublicKey._fromNativeHandle(handle);
        }
    }
    registrationId() {
        return Native.PreKeyBundle_GetRegistrationId(this);
    }
    signedPreKeyId() {
        return Native.PreKeyBundle_GetSignedPreKeyId(this);
    }
    signedPreKeyPublic() {
        return PublicKey._fromNativeHandle(Native.PreKeyBundle_GetSignedPreKeyPublic(this));
    }
    signedPreKeySignature() {
        return Native.PreKeyBundle_GetSignedPreKeySignature(this);
    }
}
exports.PreKeyBundle = PreKeyBundle;
class PreKeyRecord {
    constructor(handle) {
        this._nativeHandle = handle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new PreKeyRecord(nativeHandle);
    }
    static new(id, pubKey, privKey) {
        return new PreKeyRecord(Native.PreKeyRecord_New(id, pubKey, privKey));
    }
    static deserialize(buffer) {
        return new PreKeyRecord(Native.PreKeyRecord_Deserialize(buffer));
    }
    id() {
        return Native.PreKeyRecord_GetId(this);
    }
    privateKey() {
        return PrivateKey._fromNativeHandle(Native.PreKeyRecord_GetPrivateKey(this));
    }
    publicKey() {
        return PublicKey._fromNativeHandle(Native.PreKeyRecord_GetPublicKey(this));
    }
    serialize() {
        return Native.PreKeyRecord_Serialize(this);
    }
}
exports.PreKeyRecord = PreKeyRecord;
class SignedPreKeyRecord {
    constructor(handle) {
        this._nativeHandle = handle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new SignedPreKeyRecord(nativeHandle);
    }
    static new(id, timestamp, pubKey, privKey, signature) {
        return new SignedPreKeyRecord(Native.SignedPreKeyRecord_New(id, timestamp, pubKey, privKey, signature));
    }
    static deserialize(buffer) {
        return new SignedPreKeyRecord(Native.SignedPreKeyRecord_Deserialize(buffer));
    }
    id() {
        return Native.SignedPreKeyRecord_GetId(this);
    }
    privateKey() {
        return PrivateKey._fromNativeHandle(Native.SignedPreKeyRecord_GetPrivateKey(this));
    }
    publicKey() {
        return PublicKey._fromNativeHandle(Native.SignedPreKeyRecord_GetPublicKey(this));
    }
    serialize() {
        return Native.SignedPreKeyRecord_Serialize(this);
    }
    signature() {
        return Native.SignedPreKeyRecord_GetSignature(this);
    }
    timestamp() {
        return Native.SignedPreKeyRecord_GetTimestamp(this);
    }
}
exports.SignedPreKeyRecord = SignedPreKeyRecord;
class SignalMessage {
    constructor(handle) {
        this._nativeHandle = handle;
    }
    static _new(messageVersion, macKey, senderRatchetKey, counter, previousCounter, ciphertext, senderIdentityKey, receiverIdentityKey) {
        return new SignalMessage(Native.SignalMessage_New(messageVersion, macKey, senderRatchetKey, counter, previousCounter, ciphertext, senderIdentityKey, receiverIdentityKey));
    }
    static deserialize(buffer) {
        return new SignalMessage(Native.SignalMessage_Deserialize(buffer));
    }
    body() {
        return Native.SignalMessage_GetBody(this);
    }
    counter() {
        return Native.SignalMessage_GetCounter(this);
    }
    messageVersion() {
        return Native.SignalMessage_GetMessageVersion(this);
    }
    serialize() {
        return Native.SignalMessage_GetSerialized(this);
    }
    verifyMac(senderIdentityKey, recevierIdentityKey, macKey) {
        return Native.SignalMessage_VerifyMac(this, senderIdentityKey, recevierIdentityKey, macKey);
    }
}
exports.SignalMessage = SignalMessage;
class PreKeySignalMessage {
    constructor(handle) {
        this._nativeHandle = handle;
    }
    static _new(messageVersion, registrationId, preKeyId, signedPreKeyId, baseKey, identityKey, signalMessage) {
        return new PreKeySignalMessage(Native.PreKeySignalMessage_New(messageVersion, registrationId, preKeyId, signedPreKeyId, baseKey, identityKey, signalMessage));
    }
    static deserialize(buffer) {
        return new PreKeySignalMessage(Native.PreKeySignalMessage_Deserialize(buffer));
    }
    preKeyId() {
        return Native.PreKeySignalMessage_GetPreKeyId(this);
    }
    registrationId() {
        return Native.PreKeySignalMessage_GetRegistrationId(this);
    }
    signedPreKeyId() {
        return Native.PreKeySignalMessage_GetSignedPreKeyId(this);
    }
    version() {
        return Native.PreKeySignalMessage_GetVersion(this);
    }
    serialize() {
        return Native.PreKeySignalMessage_Serialize(this);
    }
}
exports.PreKeySignalMessage = PreKeySignalMessage;
class SessionRecord {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new SessionRecord(nativeHandle);
    }
    static deserialize(buffer) {
        return new SessionRecord(Native.SessionRecord_Deserialize(buffer));
    }
    serialize() {
        return Native.SessionRecord_Serialize(this);
    }
    archiveCurrentState() {
        Native.SessionRecord_ArchiveCurrentState(this);
    }
    localRegistrationId() {
        return Native.SessionRecord_GetLocalRegistrationId(this);
    }
    remoteRegistrationId() {
        return Native.SessionRecord_GetRemoteRegistrationId(this);
    }
    hasCurrentState() {
        return Native.SessionRecord_HasCurrentState(this);
    }
    currentRatchetKeyMatches(key) {
        return Native.SessionRecord_CurrentRatchetKeyMatches(this, key);
    }
}
exports.SessionRecord = SessionRecord;
class ServerCertificate {
    static _fromNativeHandle(nativeHandle) {
        return new ServerCertificate(nativeHandle);
    }
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static new(keyId, serverKey, trustRoot) {
        return new ServerCertificate(Native.ServerCertificate_New(keyId, serverKey, trustRoot));
    }
    static deserialize(buffer) {
        return new ServerCertificate(Native.ServerCertificate_Deserialize(buffer));
    }
    certificateData() {
        return Native.ServerCertificate_GetCertificate(this);
    }
    key() {
        return PublicKey._fromNativeHandle(Native.ServerCertificate_GetKey(this));
    }
    keyId() {
        return Native.ServerCertificate_GetKeyId(this);
    }
    serialize() {
        return Native.ServerCertificate_GetSerialized(this);
    }
    signature() {
        return Native.ServerCertificate_GetSignature(this);
    }
}
exports.ServerCertificate = ServerCertificate;
class SenderKeyRecord {
    static _fromNativeHandle(nativeHandle) {
        return new SenderKeyRecord(nativeHandle);
    }
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static deserialize(buffer) {
        return new SenderKeyRecord(Native.SenderKeyRecord_Deserialize(buffer));
    }
    serialize() {
        return Native.SenderKeyRecord_Serialize(this);
    }
}
exports.SenderKeyRecord = SenderKeyRecord;
class SenderCertificate {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new SenderCertificate(nativeHandle);
    }
    static new(senderUuid, senderE164, senderDeviceId, senderKey, expiration, signerCert, signerKey) {
        return new SenderCertificate(Native.SenderCertificate_New(senderUuid, senderE164, senderDeviceId, senderKey, expiration, signerCert, signerKey));
    }
    static deserialize(buffer) {
        return new SenderCertificate(Native.SenderCertificate_Deserialize(buffer));
    }
    serialize() {
        return Native.SenderCertificate_GetSerialized(this);
    }
    certificate() {
        return Native.SenderCertificate_GetCertificate(this);
    }
    expiration() {
        return Native.SenderCertificate_GetExpiration(this);
    }
    key() {
        return PublicKey._fromNativeHandle(Native.SenderCertificate_GetKey(this));
    }
    senderE164() {
        return Native.SenderCertificate_GetSenderE164(this);
    }
    senderUuid() {
        return Native.SenderCertificate_GetSenderUuid(this);
    }
    senderDeviceId() {
        return Native.SenderCertificate_GetDeviceId(this);
    }
    serverCertificate() {
        return ServerCertificate._fromNativeHandle(Native.SenderCertificate_GetServerCertificate(this));
    }
    signature() {
        return Native.SenderCertificate_GetSignature(this);
    }
    validate(trustRoot, time) {
        return Native.SenderCertificate_Validate(this, trustRoot, time);
    }
}
exports.SenderCertificate = SenderCertificate;
class SenderKeyDistributionMessage {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static create(sender, distributionId, store) {
        return __awaiter(this, void 0, void 0, function* () {
            const handle = yield Native.SenderKeyDistributionMessage_Create(sender, Buffer.from(uuid.parse(distributionId)), store, null);
            return new SenderKeyDistributionMessage(handle);
        });
    }
    static _new(messageVersion, distributionId, chainId, iteration, chainKey, pk) {
        return new SenderKeyDistributionMessage(Native.SenderKeyDistributionMessage_New(messageVersion, Buffer.from(uuid.parse(distributionId)), chainId, iteration, chainKey, pk));
    }
    static deserialize(buffer) {
        return new SenderKeyDistributionMessage(Native.SenderKeyDistributionMessage_Deserialize(buffer));
    }
    serialize() {
        return Native.SenderKeyDistributionMessage_Serialize(this);
    }
    chainKey() {
        return Native.SenderKeyDistributionMessage_GetChainKey(this);
    }
    iteration() {
        return Native.SenderKeyDistributionMessage_GetIteration(this);
    }
    chainId() {
        return Native.SenderKeyDistributionMessage_GetChainId(this);
    }
    distributionId() {
        return uuid.stringify(Native.SenderKeyDistributionMessage_GetDistributionId(this));
    }
}
exports.SenderKeyDistributionMessage = SenderKeyDistributionMessage;
function processSenderKeyDistributionMessage(sender, message, store) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Native.SenderKeyDistributionMessage_Process(sender, message, store, null);
    });
}
exports.processSenderKeyDistributionMessage = processSenderKeyDistributionMessage;
class SenderKeyMessage {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static _new(messageVersion, distributionId, chainId, iteration, ciphertext, pk) {
        return new SenderKeyMessage(Native.SenderKeyMessage_New(messageVersion, Buffer.from(uuid.parse(distributionId)), chainId, iteration, ciphertext, pk));
    }
    static deserialize(buffer) {
        return new SenderKeyMessage(Native.SenderKeyMessage_Deserialize(buffer));
    }
    serialize() {
        return Native.SenderKeyMessage_Serialize(this);
    }
    ciphertext() {
        return Native.SenderKeyMessage_GetCipherText(this);
    }
    iteration() {
        return Native.SenderKeyMessage_GetIteration(this);
    }
    chainId() {
        return Native.SenderKeyMessage_GetChainId(this);
    }
    distributionId() {
        return uuid.stringify(Native.SenderKeyMessage_GetDistributionId(this));
    }
    verifySignature(key) {
        return Native.SenderKeyMessage_VerifySignature(this, key);
    }
}
exports.SenderKeyMessage = SenderKeyMessage;
class UnidentifiedSenderMessageContent {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new UnidentifiedSenderMessageContent(nativeHandle);
    }
    static new(message, sender, contentHint, groupId) {
        return new UnidentifiedSenderMessageContent(Native.UnidentifiedSenderMessageContent_New(message, sender, contentHint, groupId));
    }
    static deserialize(buffer) {
        return new UnidentifiedSenderMessageContent(Native.UnidentifiedSenderMessageContent_Deserialize(buffer));
    }
    serialize() {
        return Native.UnidentifiedSenderMessageContent_Serialize(this);
    }
    contents() {
        return Native.UnidentifiedSenderMessageContent_GetContents(this);
    }
    msgType() {
        return Native.UnidentifiedSenderMessageContent_GetMsgType(this);
    }
    senderCertificate() {
        return SenderCertificate._fromNativeHandle(Native.UnidentifiedSenderMessageContent_GetSenderCert(this));
    }
    contentHint() {
        return Native.UnidentifiedSenderMessageContent_GetContentHint(this);
    }
    groupId() {
        return Native.UnidentifiedSenderMessageContent_GetGroupId(this);
    }
}
exports.UnidentifiedSenderMessageContent = UnidentifiedSenderMessageContent;
class SessionStore {
    _saveSession(name, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.saveSession(Address_1.ProtocolAddress._fromNativeHandle(name), SessionRecord._fromNativeHandle(record));
        });
    }
    _getSession(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const sess = yield this.getSession(Address_1.ProtocolAddress._fromNativeHandle(name));
            if (sess == null) {
                return null;
            }
            else {
                return sess._nativeHandle;
            }
        });
    }
}
exports.SessionStore = SessionStore;
class IdentityKeyStore {
    _getIdentityKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getIdentityKey();
            return key._nativeHandle;
        });
    }
    _getLocalRegistrationId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getLocalRegistrationId();
        });
    }
    _saveIdentity(name, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.saveIdentity(Address_1.ProtocolAddress._fromNativeHandle(name), PublicKey._fromNativeHandle(key));
        });
    }
    _isTrustedIdentity(name, key, sending) {
        return __awaiter(this, void 0, void 0, function* () {
            const direction = sending ? Direction.Sending : Direction.Receiving;
            return this.isTrustedIdentity(Address_1.ProtocolAddress._fromNativeHandle(name), PublicKey._fromNativeHandle(key), direction);
        });
    }
    _getIdentity(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getIdentity(Address_1.ProtocolAddress._fromNativeHandle(name));
            if (key == null) {
                return Promise.resolve(null);
            }
            else {
                return key._nativeHandle;
            }
        });
    }
}
exports.IdentityKeyStore = IdentityKeyStore;
class PreKeyStore {
    _savePreKey(id, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.savePreKey(id, PreKeyRecord._fromNativeHandle(record));
        });
    }
    _getPreKey(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pk = yield this.getPreKey(id);
            return pk._nativeHandle;
        });
    }
    _removePreKey(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.removePreKey(id);
        });
    }
}
exports.PreKeyStore = PreKeyStore;
class SignedPreKeyStore {
    _saveSignedPreKey(id, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.saveSignedPreKey(id, SignedPreKeyRecord._fromNativeHandle(record));
        });
    }
    _getSignedPreKey(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pk = yield this.getSignedPreKey(id);
            return pk._nativeHandle;
        });
    }
}
exports.SignedPreKeyStore = SignedPreKeyStore;
class SenderKeyStore {
    _saveSenderKey(sender, distributionId, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.saveSenderKey(Address_1.ProtocolAddress._fromNativeHandle(sender), uuid.stringify(distributionId), SenderKeyRecord._fromNativeHandle(record));
        });
    }
    _getSenderKey(sender, distributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skr = yield this.getSenderKey(Address_1.ProtocolAddress._fromNativeHandle(sender), uuid.stringify(distributionId));
            if (skr == null) {
                return null;
            }
            else {
                return skr._nativeHandle;
            }
        });
    }
}
exports.SenderKeyStore = SenderKeyStore;
function groupEncrypt(sender, distributionId, store, message) {
    return __awaiter(this, void 0, void 0, function* () {
        return CiphertextMessage._fromNativeHandle(yield Native.GroupCipher_EncryptMessage(sender, Buffer.from(uuid.parse(distributionId)), message, store, null));
    });
}
exports.groupEncrypt = groupEncrypt;
function groupDecrypt(sender, store, message) {
    return __awaiter(this, void 0, void 0, function* () {
        return Native.GroupCipher_DecryptMessage(sender, message, store, null);
    });
}
exports.groupDecrypt = groupDecrypt;
class SealedSenderDecryptionResult {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new SealedSenderDecryptionResult(nativeHandle);
    }
    message() {
        return Native.SealedSenderDecryptionResult_Message(this);
    }
    senderE164() {
        return Native.SealedSenderDecryptionResult_GetSenderE164(this);
    }
    senderUuid() {
        return Native.SealedSenderDecryptionResult_GetSenderUuid(this);
    }
    deviceId() {
        return Native.SealedSenderDecryptionResult_GetDeviceId(this);
    }
}
exports.SealedSenderDecryptionResult = SealedSenderDecryptionResult;
class CiphertextMessage {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new CiphertextMessage(nativeHandle);
    }
    static from(message) {
        return message.asCiphertextMessage();
    }
    serialize() {
        return Native.CiphertextMessage_Serialize(this);
    }
    type() {
        return Native.CiphertextMessage_Type(this);
    }
}
exports.CiphertextMessage = CiphertextMessage;
class PlaintextContent {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static deserialize(buffer) {
        return new PlaintextContent(Native.PlaintextContent_Deserialize(buffer));
    }
    static from(message) {
        return new PlaintextContent(Native.PlaintextContent_FromDecryptionErrorMessage(message));
    }
    serialize() {
        return Native.PlaintextContent_Serialize(this);
    }
    body() {
        return Native.PlaintextContent_GetBody(this);
    }
    asCiphertextMessage() {
        return CiphertextMessage._fromNativeHandle(Native.CiphertextMessage_FromPlaintextContent(this));
    }
}
exports.PlaintextContent = PlaintextContent;
class DecryptionErrorMessage {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static _fromNativeHandle(nativeHandle) {
        return new DecryptionErrorMessage(nativeHandle);
    }
    static forOriginal(bytes, type, timestamp, originalSenderDeviceId) {
        return new DecryptionErrorMessage(Native.DecryptionErrorMessage_ForOriginalMessage(bytes, type, timestamp, originalSenderDeviceId));
    }
    static deserialize(buffer) {
        return new DecryptionErrorMessage(Native.DecryptionErrorMessage_Deserialize(buffer));
    }
    static extractFromSerializedBody(buffer) {
        return new DecryptionErrorMessage(Native.DecryptionErrorMessage_ExtractFromSerializedContent(buffer));
    }
    serialize() {
        return Native.DecryptionErrorMessage_Serialize(this);
    }
    timestamp() {
        return Native.DecryptionErrorMessage_GetTimestamp(this);
    }
    deviceId() {
        return Native.DecryptionErrorMessage_GetDeviceId(this);
    }
    ratchetKey() {
        const keyHandle = Native.DecryptionErrorMessage_GetRatchetKey(this);
        if (keyHandle) {
            return PublicKey._fromNativeHandle(keyHandle);
        }
        else {
            return undefined;
        }
    }
}
exports.DecryptionErrorMessage = DecryptionErrorMessage;
function processPreKeyBundle(bundle, address, sessionStore, identityStore) {
    return Native.SessionBuilder_ProcessPreKeyBundle(bundle, address, sessionStore, identityStore, null);
}
exports.processPreKeyBundle = processPreKeyBundle;
function signalEncrypt(message, address, sessionStore, identityStore) {
    return __awaiter(this, void 0, void 0, function* () {
        return CiphertextMessage._fromNativeHandle(yield Native.SessionCipher_EncryptMessage(message, address, sessionStore, identityStore, null));
    });
}
exports.signalEncrypt = signalEncrypt;
function signalDecrypt(message, address, sessionStore, identityStore) {
    return Native.SessionCipher_DecryptSignalMessage(message, address, sessionStore, identityStore, null);
}
exports.signalDecrypt = signalDecrypt;
function signalDecryptPreKey(message, address, sessionStore, identityStore, prekeyStore, signedPrekeyStore) {
    return Native.SessionCipher_DecryptPreKeySignalMessage(message, address, sessionStore, identityStore, prekeyStore, signedPrekeyStore, null);
}
exports.signalDecryptPreKey = signalDecryptPreKey;
function sealedSenderEncryptMessage(message, address, senderCert, sessionStore, identityStore) {
    return __awaiter(this, void 0, void 0, function* () {
        const ciphertext = yield signalEncrypt(message, address, sessionStore, identityStore);
        const usmc = UnidentifiedSenderMessageContent.new(ciphertext, senderCert, ContentHint.Default, null);
        return yield sealedSenderEncrypt(usmc, address, identityStore);
    });
}
exports.sealedSenderEncryptMessage = sealedSenderEncryptMessage;
function sealedSenderEncrypt(content, address, identityStore) {
    return Native.SealedSender_Encrypt(address, content, identityStore, null);
}
exports.sealedSenderEncrypt = sealedSenderEncrypt;
function sealedSenderMultiRecipientEncrypt(content, recipients, identityStore, sessionStore) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipientSessions = yield sessionStore.getExistingSessions(recipients);
        return yield Native.SealedSender_MultiRecipientEncrypt(recipients, recipientSessions, content, identityStore, null);
    });
}
exports.sealedSenderMultiRecipientEncrypt = sealedSenderMultiRecipientEncrypt;
// For testing only
function sealedSenderMultiRecipientMessageForSingleRecipient(message) {
    return Native.SealedSender_MultiRecipientMessageForSingleRecipient(message);
}
exports.sealedSenderMultiRecipientMessageForSingleRecipient = sealedSenderMultiRecipientMessageForSingleRecipient;
function sealedSenderDecryptMessage(message, trustRoot, timestamp, localE164, localUuid, localDeviceId, sessionStore, identityStore, prekeyStore, signedPrekeyStore) {
    return __awaiter(this, void 0, void 0, function* () {
        const ssdr = yield Native.SealedSender_DecryptMessage(message, trustRoot, timestamp, localE164, localUuid, localDeviceId, sessionStore, identityStore, prekeyStore, signedPrekeyStore);
        return SealedSenderDecryptionResult._fromNativeHandle(ssdr);
    });
}
exports.sealedSenderDecryptMessage = sealedSenderDecryptMessage;
function sealedSenderDecryptToUsmc(message, identityStore) {
    return __awaiter(this, void 0, void 0, function* () {
        const usmc = yield Native.SealedSender_DecryptToUsmc(message, identityStore, null);
        return UnidentifiedSenderMessageContent._fromNativeHandle(usmc);
    });
}
exports.sealedSenderDecryptToUsmc = sealedSenderDecryptToUsmc;
class Cds2Client {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static new(mrenclave, attestationMsg, currentTimestamp) {
        return new Cds2Client(Native.Cds2ClientState_New(mrenclave, attestationMsg, currentTimestamp.getTime()));
    }
    initialRequest() {
        return Native.Cds2ClientState_InitialRequest(this);
    }
    completeHandshake(buffer) {
        return Native.Cds2ClientState_CompleteHandshake(this, buffer);
    }
    establishedSend(buffer) {
        return Native.Cds2ClientState_EstablishedSend(this, buffer);
    }
    establishedRecv(buffer) {
        return Native.Cds2ClientState_EstablishedRecv(this, buffer);
    }
}
exports.Cds2Client = Cds2Client;
class HsmEnclaveClient {
    constructor(nativeHandle) {
        this._nativeHandle = nativeHandle;
    }
    static new(public_key, code_hashes) {
        code_hashes.forEach((hash) => {
            if (hash.length != 32) {
                throw new Error('code hash length must be 32');
            }
        });
        const concat_hashes = Buffer.concat(code_hashes);
        return new HsmEnclaveClient(Native.HsmEnclaveClient_New(public_key, concat_hashes));
    }
    initialRequest() {
        return Native.HsmEnclaveClient_InitialRequest(this);
    }
    completeHandshake(buffer) {
        return Native.HsmEnclaveClient_CompleteHandshake(this, buffer);
    }
    establishedSend(buffer) {
        return Native.HsmEnclaveClient_EstablishedSend(this, buffer);
    }
    establishedRecv(buffer) {
        return Native.HsmEnclaveClient_EstablishedRecv(this, buffer);
    }
}
exports.HsmEnclaveClient = HsmEnclaveClient;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Debug"] = 4] = "Debug";
    LogLevel[LogLevel["Trace"] = 5] = "Trace";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
function initLogger(maxLevel, callback) {
    let nativeMaxLevel;
    switch (maxLevel) {
        case LogLevel.Error:
            nativeMaxLevel = 1 /* Native.LogLevel.Error */;
            break;
        case LogLevel.Warn:
            nativeMaxLevel = 2 /* Native.LogLevel.Warn */;
            break;
        case LogLevel.Info:
            nativeMaxLevel = 3 /* Native.LogLevel.Info */;
            break;
        case LogLevel.Debug:
            nativeMaxLevel = 4 /* Native.LogLevel.Debug */;
            break;
        case LogLevel.Trace:
            nativeMaxLevel = 5 /* Native.LogLevel.Trace */;
            break;
    }
    Native.initLogger(nativeMaxLevel, (nativeLevel, target, file, line, message) => {
        let level;
        switch (nativeLevel) {
            case 1 /* Native.LogLevel.Error */:
                level = LogLevel.Error;
                break;
            case 2 /* Native.LogLevel.Warn */:
                level = LogLevel.Warn;
                break;
            case 3 /* Native.LogLevel.Info */:
                level = LogLevel.Info;
                break;
            case 4 /* Native.LogLevel.Debug */:
                level = LogLevel.Debug;
                break;
            case 5 /* Native.LogLevel.Trace */:
                level = LogLevel.Trace;
                break;
            default:
                callback(LogLevel.Warn, 'signal-client', 'index.ts', 0, 'unknown log level ' + nativeLevel + '; treating as error');
                level = LogLevel.Error;
                break;
        }
        callback(level, target, file, line, message);
    });
}
exports.initLogger = initLogger;
//# sourceMappingURL=index.js.map