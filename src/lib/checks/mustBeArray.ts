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
export default function <T>(name: string, value: T[], contextBuilder?: () => string): T[] {
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}
