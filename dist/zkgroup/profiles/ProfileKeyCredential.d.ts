/// <reference types="node" />
import ByteArray from '../internal/ByteArray';
export default class ProfileKeyCredential extends ByteArray {
    private readonly __type?;
    constructor(contents: Buffer);
}
