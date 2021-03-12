import mustSatisfy from '../checks/mustSatisfy';
import isObject from '../checks/isObject';

/**
 * @hidden 
 */
function beObject() {
    return "be an `object`";
}

/**
 * @hidden
 */
export default function mustBeObject<T>(name: string, value: T, contextBuilder?: () => string): T {
    mustSatisfy(name, isObject(value), beObject, contextBuilder);
    return value;
}
