import { BivectorE2 } from './BivectorE2';

/**
 * Returns true if all coordinates of the bivector are exactly zero.
 */
export function isZeroBivectorE2(m: BivectorE2): boolean {
    return m.xy === 0;
}
