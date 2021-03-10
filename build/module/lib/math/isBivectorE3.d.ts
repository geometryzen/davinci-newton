import { BivectorE3 } from './BivectorE3';
/**
 * Determines whether the argument supports the BivectorE3 interface.
 * The argument must be a non-null object and must support the yz, zx, and xy numeric properties.
 */
export default function isBivectorE3(v: any): v is BivectorE3;
