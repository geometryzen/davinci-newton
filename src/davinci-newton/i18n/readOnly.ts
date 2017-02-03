import LocalizableMessage from '../i18n/LocalizableMessage';
import mustBeString from '../checks/mustBeString';

export default function readOnly(name: string): LocalizableMessage {
    mustBeString('name', name);
    const message: LocalizableMessage = {
        get message(): string {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}
