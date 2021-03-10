import mustSatisfy from '../checks/mustSatisfy';
import isLT from '../checks/isLT';
export default function (name, value, limit, contextBuilder) {
    mustSatisfy(name, isLT(value, limit), function () { return "be less than " + limit; }, contextBuilder);
    return value;
}
