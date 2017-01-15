/**
 * Ensures the given text consists of only uppercase letters, numbers and underscore
 * and first character is a letter or underscore.
 */
export default function validName(text: string): string {
    if (!text.match(/^[A-Z_][A-Z_0-9]*$/)) {
        throw new Error('not a valid name: ' + text);
    }
    return text;
}
