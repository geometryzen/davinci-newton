import mustSatisfy from '../checks/mustSatisfy';
import isArray from '../checks/isArray';
/**
 * @hidden
 */
function beAnArray() {
    return "be an array";
}
/**
 * @hidden
 */
export default function (name, value, contextBuilder) {
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}
