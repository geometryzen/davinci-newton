/**
 * 
 */
interface SimObject {
    /**
     * 
     */
    getExpireTime(): number;
    /**
     * 
     */
    getName(localized?: boolean): string;
    /**
     * 
     */
    isMassObject(): boolean;
    /**
     * Returns true if the given SimObject is similar to this SimObject for display purposes.
     * SimObjects are similar when they are the same type and nearly the same size and location.
     * Mainly used when showing forces - to avoid adding too many objects to the display.
     */
    similar(obj: SimObject, tolerance?: number): boolean;
}

export default SimObject;
