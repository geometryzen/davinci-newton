import mustSatisfy from '../checks/mustSatisfy';
import isEQ from '../checks/isEQ';
/**
 * @hidden
 */
export default function mustBeEQ(name, value, limit, contextBuilder) {
    mustSatisfy(name, isEQ(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
    return value;
}
