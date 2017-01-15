import SimObject from '../core/SimObject';
import Vector from '../math/Vector';

interface Line extends SimObject {
    getEndPoint(): Vector;
    getStartPoint(): Vector;
    getVector(): Vector;
}

export default Line;
