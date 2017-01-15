import Subject from './Subject';
import toName from '../util/toName';
import validName from '../util/validName';

/**
 * 
 */
export class AbstractSubject implements Subject {
    /**
     * 
     */
    private name_: string;
    /**
     * 
     */
    constructor(name: string) {
        if (!name) {
            throw new Error('no name');
        }
        this.name_ = validName(toName(name));
    }
    /**
     * 
     */
    getName(): string {
        return this.name_;
    }
}

export default AbstractSubject;
