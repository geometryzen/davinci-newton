import mustBeString from '../checks/mustBeString';
/**
 * @hidden
 * @param name
 * @returns
 */
export default function (name) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "Method `" + name + "` is not supported.";
        }
    };
    return message;
}
