import SimObject from '../core/SimObject';
import toName from '../util/toName';
import validName from '../util/validName';


/**
 * 
 */
export class AbstractSimObject implements SimObject {

    /**
     * 
     */
    private static ID = 1;

    /**
     * 
     */
    private expireTime_ = Number.POSITIVE_INFINITY;

    /**
     * 
     */
    private name_: string;

    /**
     * 
     */
    constructor(name?: string) {
        this.name_ = validName(toName(name || `SIM_OBJ${AbstractSimObject.ID++}`));
    }

    /**
     * 
     */
    getExpireTime(): number {
        return this.expireTime_;
    }
    setExpireTime(expireTime: number): void {
        this.expireTime_ = expireTime;
    }

    /**
     * 
     */
    getName(): string {
        return this.name_;
    }
}

export default AbstractSimObject;
