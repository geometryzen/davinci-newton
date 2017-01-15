import Observer from './Observer';
import Subject from './Subject';
import SubjectEvent from './SubjectEvent';
import toName from '../util/toName';
import validName from '../util/validName';

/**
 * 
 */
export class AbstractSubject implements Subject {

    /**
     * 
     */
    private doBroadcast_ = true;

    /**
     * 
     */
    private name_: string;

    /**
     * 
     */
    private observers_: Observer[] = [];

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

    /**
     * 
     */
    broadcast(event: SubjectEvent): void {
        if (this.doBroadcast_) {
            const len = this.observers_.length;
            for (let i = 0; i < len; i++) {
                this.observers_[i].observe(event);
            }
        }
    }
}

export default AbstractSubject;
