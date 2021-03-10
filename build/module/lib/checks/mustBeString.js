import mustSatisfy from '../checks/mustSatisfy';
import isString from '../checks/isString';
function beAString() {
    return "be a string";
}
export default function (name, value, contextBuilder) {
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}
