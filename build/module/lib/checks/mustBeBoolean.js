import mustSatisfy from '../checks/mustSatisfy';
import isBoolean from '../checks/isBoolean';
/**
 * @hidden
 */
function beBoolean() {
    return "be `boolean`";
}
/**
 * @hidden
 */
export function mustBeBoolean(name, value, contextBuilder) {
    mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
    return value;
}
