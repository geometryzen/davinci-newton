import isDefined from './isDefined';
/**
 * Helper function for validating a named value and providing a default.
 * @hidden
 */
export default function validate(name, value, defaultValue, assertFn) {
    if (isDefined(value)) {
        return assertFn(name, value);
    }
    else {
        return defaultValue;
    }
}
