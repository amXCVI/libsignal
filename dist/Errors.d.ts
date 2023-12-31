import { ProtocolAddress } from './Address';
import * as Native from '../Native';
export declare enum ErrorCode {
    Generic = 0,
    DuplicatedMessage = 1,
    SealedSenderSelfSend = 2,
    UntrustedIdentity = 3,
    InvalidRegistrationId = 4,
    VerificationFailed = 5,
    InvalidSession = 6,
    InvalidSenderKeySession = 7,
    CannotBeEmpty = 8,
    CannotStartWithDigit = 9,
    MissingSeparator = 10,
    BadNicknameCharacter = 11,
    NicknameTooShort = 12,
    NicknameTooLong = 13
}
export declare class LibSignalErrorBase extends Error {
    readonly code: ErrorCode;
    readonly operation: string;
    readonly _addr?: string | Native.ProtocolAddress;
    constructor(message: string, name: keyof typeof ErrorCode | undefined, operation: string, extraProps?: Record<string, unknown>);
    get addr(): ProtocolAddress | string;
}
export type LibSignalErrorCommon = Omit<LibSignalErrorBase, 'addr'>;
export type GenericError = LibSignalErrorCommon & {
    code: ErrorCode.Generic;
};
export type DuplicatedMessageError = LibSignalErrorCommon & {
    code: ErrorCode.DuplicatedMessage;
};
export type SealedSenderSelfSendError = LibSignalErrorCommon & {
    code: ErrorCode.SealedSenderSelfSend;
};
export type UntrustedIdentityError = LibSignalErrorCommon & {
    code: ErrorCode.UntrustedIdentity;
    addr: string;
};
export type InvalidRegistrationIdError = LibSignalErrorCommon & {
    code: ErrorCode.InvalidRegistrationId;
    addr: ProtocolAddress;
};
export type VerificationFailedError = LibSignalErrorCommon & {
    code: ErrorCode.VerificationFailed;
};
export type InvalidSessionError = LibSignalErrorCommon & {
    code: ErrorCode.InvalidSession;
};
export type InvalidSenderKeySessionError = LibSignalErrorCommon & {
    code: ErrorCode.InvalidSenderKeySession;
    distributionId: string;
};
export type CannotBeEmptyError = LibSignalErrorCommon & {
    code: ErrorCode.CannotBeEmpty;
};
export type CannotStartWithDigitError = LibSignalErrorCommon & {
    code: ErrorCode.CannotStartWithDigit;
};
export type MissingSeparatorError = LibSignalErrorCommon & {
    code: ErrorCode.MissingSeparator;
};
export type BadNicknameCharacterError = LibSignalErrorCommon & {
    code: ErrorCode.BadNicknameCharacter;
};
export type NicknameTooShortError = LibSignalErrorCommon & {
    code: ErrorCode.NicknameTooShort;
};
export type NicknameTooLongError = LibSignalErrorCommon & {
    code: ErrorCode.NicknameTooLong;
};
export type LibSignalError = GenericError | DuplicatedMessageError | SealedSenderSelfSendError | UntrustedIdentityError | InvalidRegistrationIdError | VerificationFailedError | InvalidSessionError | InvalidSenderKeySessionError | CannotBeEmptyError | CannotStartWithDigitError | MissingSeparatorError | BadNicknameCharacterError | NicknameTooShortError | NicknameTooLongError;
