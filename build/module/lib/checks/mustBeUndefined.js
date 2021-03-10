import mustSatisfy from '../checks/mustSatisfy';
import isUndefined from '../checks/isUndefined';
function beUndefined() {
    return "be 'undefined'";
}
export default function (name, value, contextBuilder) {
    mustSatisfy(name, isUndefined(value), beUndefined, contextBuilder);
    return value;
}
