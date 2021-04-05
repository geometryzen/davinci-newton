import mustSatisfy from '../checks/mustSatisfy';
import isDefined from '../checks/isDefined';

/**
 * @hidden
 */
function beDefined() {
    return "not be 'undefined'";
}

/**
 * @hidden
 */
export function mustBeDefined(name: string, value: any, contextBuilder?: () => string): any {
    mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
    return value;
}
