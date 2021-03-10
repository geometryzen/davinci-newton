import mustSatisfy from '../checks/mustSatisfy';
import isNumber from '../checks/isNumber';
function beANumber() {
    return "be a `number`";
}
export default function (name, value, contextBuilder) {
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}
