import isUndefined from '../checks/isUndefined';
import mustSatisfy from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beUndefined() {
    return "be 'undefined'";
}

/**
 * @hidden
 */
export default function (name: string, value: unknown, contextBuilder?: () => string): unknown {
    mustSatisfy(name, isUndefined(value), beUndefined, contextBuilder);
    return value;
}
