import mustSatisfy from '../checks/mustSatisfy';
import isGE from '../checks/isGE';
export default function (name, value, limit, contextBuilder) {
    mustSatisfy(name, isGE(value, limit), function () { return "be greater than or equal to " + limit; }, contextBuilder);
    return value;
}
