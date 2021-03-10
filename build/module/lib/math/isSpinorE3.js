import isNull from '../checks/isNull';
import isNumber from '../checks/isNumber';
import isObject from '../checks/isObject';
/**
 * Determines whether the argument supports the SpinorE3 interface.
 * The argument must be a non-null object and must support the a, xy, yz, and zx numeric properties.
 */
export default function isSpinorE3(v) {
    if (isObject(v) && !isNull(v)) {
        return isNumber(v.a) && isNumber(v.xy) && isNumber(v.yz) && isNumber(v.zx);
    }
    else {
        return false;
    }
}
