import { dotVectorE2 as dot } from './dotVectorE2';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';
import { VectorE2 } from '../math/VectorE2';

export function quadVectorE2(vector: VectorE2): number {
    if (isDefined(vector)) {
        const x = vector.x;
        const y = vector.y;
        if (isNumber(x) && isNumber(y)) {
            return dot(vector, vector);
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
