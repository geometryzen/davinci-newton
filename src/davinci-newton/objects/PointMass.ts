import AbstractMassObject from './AbstractMassObject';

export class PointMass extends AbstractMassObject {
    constructor(name: string, localName: string) {
        super(name, localName);
    }
}

export default PointMass;
