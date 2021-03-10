import { SimObject } from '../core/SimObject';
/**
 *
 */
export declare class AbstractSimObject implements SimObject {
    /**
     *
     */
    private expireTime_;
    /**
     *
     */
    constructor();
    /**
     *
     */
    get expireTime(): number;
    set expireTime(expireTime: number);
}
