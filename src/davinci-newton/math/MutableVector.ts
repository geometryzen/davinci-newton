import VectorE3 from './VectorE3';

/**
 * 
 */
export class MutableVector implements VectorE3 {

    /**
     * 
     */
    constructor(public x = 0, public y = 0, public z = 0) {

    }

    /**
     * 
     */
    copy(v: VectorE3): this {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
}

export default MutableVector;
