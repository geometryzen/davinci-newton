import { doesNotSatisfy } from '../checks/mustSatisfy';
/**
 * @hidden
 */
function beAnArray() {
    return "be an array";
}
/**
 * @hidden
 */
export function mustBeArray(name, value, contextBuilder) {
    if (Array.isArray(value)) {
        return value;
    }
    else {
        doesNotSatisfy(name, beAnArray, contextBuilder);
    }
}
