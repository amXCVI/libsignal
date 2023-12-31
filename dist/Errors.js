"use strict";
//
// Copyright 2021 Signal Messenger, LLC.
// SPDX-License-Identifier: AGPL-3.0-only
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibSignalErrorBase = exports.ErrorCode = void 0;
const Address_1 = require("./Address");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["Generic"] = 0] = "Generic";
    ErrorCode[ErrorCode["DuplicatedMessage"] = 1] = "DuplicatedMessage";
    ErrorCode[ErrorCode["SealedSenderSelfSend"] = 2] = "SealedSenderSelfSend";
    ErrorCode[ErrorCode["UntrustedIdentity"] = 3] = "UntrustedIdentity";
    ErrorCode[ErrorCode["InvalidRegistrationId"] = 4] = "InvalidRegistrationId";
    ErrorCode[ErrorCode["VerificationFailed"] = 5] = "VerificationFailed";
    ErrorCode[ErrorCode["InvalidSession"] = 6] = "InvalidSession";
    ErrorCode[ErrorCode["InvalidSenderKeySession"] = 7] = "InvalidSenderKeySession";
    ErrorCode[ErrorCode["CannotBeEmpty"] = 8] = "CannotBeEmpty";
    ErrorCode[ErrorCode["CannotStartWithDigit"] = 9] = "CannotStartWithDigit";
    ErrorCode[ErrorCode["MissingSeparator"] = 10] = "MissingSeparator";
    ErrorCode[ErrorCode["BadNicknameCharacter"] = 11] = "BadNicknameCharacter";
    ErrorCode[ErrorCode["NicknameTooShort"] = 12] = "NicknameTooShort";
    ErrorCode[ErrorCode["NicknameTooLong"] = 13] = "NicknameTooLong";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class LibSignalErrorBase extends Error {
    constructor(message, name, operation, extraProps) {
        super(message);
        // Include the dynamic check for `name in ErrorCode` in case there's a bug in the Rust code.
        if (name !== undefined && name in ErrorCode) {
            this.name = name;
            this.code = ErrorCode[name];
        }
        else {
            this.name = 'LibSignalError';
            this.code = ErrorCode.Generic;
        }
        this.operation = operation;
        if (extraProps !== undefined) {
            Object.assign(this, extraProps);
        }
        // Maintains proper stack trace, where our error was thrown (only available on V8)
        //   via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this);
        }
    }
    get addr() {
        switch (this.code) {
            case ErrorCode.UntrustedIdentity:
                return this._addr;
            case ErrorCode.InvalidRegistrationId:
                return Address_1.ProtocolAddress._fromNativeHandle(this._addr);
            default:
                throw new TypeError(`cannot get address from this error (${this})`);
        }
    }
}
exports.LibSignalErrorBase = LibSignalErrorBase;
//# sourceMappingURL=Errors.js.map