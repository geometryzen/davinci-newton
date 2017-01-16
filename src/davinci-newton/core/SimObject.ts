/**
 * 
 */
export interface SimObject {
    /**
     * 
     */
    getExpireTime(): number;
    /**
     * 
     */
    getName(localized?: boolean): string;
}

export default SimObject;
