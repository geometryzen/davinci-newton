import SimObject from '../core/SimObject';

export class AbstractSimObject implements SimObject {
    constructor(name?: string, localName?: string) {
        // Do nothing yet.
    }
    isMassObject(): boolean {
        return false;
    }
}

export default AbstractSimObject;
