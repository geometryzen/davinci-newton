import { doesNotSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beFunction() {
    return "be a function";
}

/**
 * @hidden
 */
export function mustBeFunction(name: string, value: unknown, contextBuilder?: () => string): Function {
    if (typeof value === 'function') {
        return value;
    } else {
        doesNotSatisfy(name, beFunction, contextBuilder);
    }
}
