/**
 * Helper function for validating a named value and providing a default.
 */
export default function validate<T>(name: string, value: T, defaultValue: T, assertFn: (name: string, value: T) => T): T;
