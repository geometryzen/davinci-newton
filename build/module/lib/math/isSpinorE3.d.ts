import { SpinorE3 } from './SpinorE3';
/**
 * Determines whether the argument supports the SpinorE3 interface.
 * The argument must be a non-null object and must support the a, xy, yz, and zx numeric properties.
 */
export default function isSpinorE3(v: any): v is SpinorE3;
