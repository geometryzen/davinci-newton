import find from './find';
import Observer from './Observer';
import Parameter from './Parameter';
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
    private paramList_: Parameter[] = [];

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
     * Returns the Parameter with the given name, or null if not found
     * @param name name of parameter to search for
     * @return the Parameter with the given name, or null if not found
     */
    private getParam(name: string): Parameter {
        name = toName(name);
        return find(this.paramList_, function (p) {
            return p.getName() === name;
        });
    }

    getParameter(name: string): Parameter {
        var p = this.getParam(name);
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
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

    broadcastParameter(name: string): void {
        const p = this.getParam(name);
        if (p === null) {
            throw new Error('unknown Parameter ' + name);
        }
        this.broadcast(p);
    }

}

export default AbstractSubject;
