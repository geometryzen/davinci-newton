import isNull from '../checks/isNull';
import isNumber from '../checks/isNumber';
import isObject from '../checks/isObject';
/**
 * Determines whether the argument supports the SpinorE2 interface.
 * The argument must be a non-null object and must support the a, and xy numeric properties.
 * @hidden
 */
export function isSpinorE2(v) {
    if (isObject(v) && !isNull(v)) {
        return isNumber(v.a) && isNumber(v.xy);
    }
    else {
        return false;
    }
}
