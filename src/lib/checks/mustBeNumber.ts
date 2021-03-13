import mustSatisfy from '../checks/mustSatisfy';
import isNumber from '../checks/isNumber';

/**
 * @hidden
 */
function beANumber() {
    return "be a `number`";
}

/**
 * @hidden
 * @param name 
 * @param value 
 * @param contextBuilder 
 * @returns 
 */
export function mustBeNumber(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}
