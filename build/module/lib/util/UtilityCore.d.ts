/**
 * @hidden
 */
export declare class UtilityCore {
    /**
     * Maximum representable integer.
     * Need to avoid having an index ever reach this value because we can then
     * no longer increment by 1.
     * That is:  2^53 + 1 == 2^53 because of how floating point works.
     */
    static MAX_INTEGER: number;
}
