import isNull from '../checks/isNull';
import isNumber from '../checks/isNumber';
import isObject from '../checks/isObject';
/**
 * Determines whether the argument supports the VectorE3 interface.
 * The argument must be a non-null object and must support the x, y, and z numeric properties.
 * @deprecated Do not use this because it could accept types that have scalar and bivector components.
 * @hidden
 */
export function isVectorE2(v) {
    if (isObject(v) && !isNull(v)) {
        return isNumber(v.x) && isNumber(v.y);
    }
    else {
        return false;
    }
}
