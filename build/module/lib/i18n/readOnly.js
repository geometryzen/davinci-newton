import mustBeString from '../checks/mustBeString';
/**
 * @hidden
 * @param name
 * @returns
 */
export function readOnly(name) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}
