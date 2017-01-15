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
    private localName_: string;

    /**
     * 
     */
    constructor(name?: string, localName?: string) {
        this.name_ = validName(toName(name || `SIM_OBJ${AbstractSimObject.ID++}`));
        this.localName_ = localName || this.name_;
    }

    /**
     * 
     */
    getExpireTime(): number {
        return this.expireTime_;
    }

    /**
     * 
     */
    getName(localized?: boolean): string {
        return localized ? this.localName_ : this.name_;
    }

    /**
     * 
     */
    isMassObject(): boolean {
        return false;
    }

    /**
     * 
     */
    similar(obj: SimObject, tolerance?: number): boolean {
        return obj === this;
    }

}

export default AbstractSimObject;
