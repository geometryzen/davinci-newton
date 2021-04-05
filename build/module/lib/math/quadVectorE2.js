import { dotVectorE2 as dot } from './dotVectorE2';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';
/**
 * @hidden
 * @param vector
 * @returns |vector|^2
 */
export function quadVectorE2(vector) {
    if (isDefined(vector)) {
        var x = vector.x;
        var y = vector.y;
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
