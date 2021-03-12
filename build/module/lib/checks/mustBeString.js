import mustSatisfy from '../checks/mustSatisfy';
import isString from '../checks/isString';
/**
 * @hidden
 */
function beAString() {
    return "be a string";
}
/**
 * @hidden
 */
export default function (name, value, contextBuilder) {
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}
