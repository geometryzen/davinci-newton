import mustSatisfy from '../checks/mustSatisfy';
import isInteger from '../checks/isInteger';
/**
 * @hidden
 */
function beAnInteger() {
    return "be an integer";
}
/**
 * @hidden
 */
export default function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}
