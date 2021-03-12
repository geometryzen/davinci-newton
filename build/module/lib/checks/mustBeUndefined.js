import mustSatisfy from '../checks/mustSatisfy';
import isUndefined from '../checks/isUndefined';
/**
 * @hidden
 */
function beUndefined() {
    return "be 'undefined'";
}
/**
 * @hidden
 */
export default function (name, value, contextBuilder) {
    mustSatisfy(name, isUndefined(value), beUndefined, contextBuilder);
    return value;
}
