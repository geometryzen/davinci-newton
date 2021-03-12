import mustSatisfy from '../checks/mustSatisfy';
import isFunction from '../checks/isFunction';

/**
 * @hidden
 */
function beFunction() {
    return "be a function";
}

/**
 * @hidden
 */
export default function mustBeFunction(name: string, value: any, contextBuilder?: () => string): any {
    mustSatisfy(name, isFunction(value), beFunction, contextBuilder);
    return value;
}
