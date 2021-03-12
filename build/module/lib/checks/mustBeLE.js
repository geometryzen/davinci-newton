import mustSatisfy from '../checks/mustSatisfy';
import isLE from '../checks/isLE';
/**
 * @hidden
 */
export default function (name, value, limit, contextBuilder) {
    mustSatisfy(name, isLE(value, limit), function () { return "be less than or equal to " + limit; }, contextBuilder);
    return value;
}
