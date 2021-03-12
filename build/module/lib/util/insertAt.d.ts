/**
 * @hidden
 * Inserts an object at the given index of the array.
 * @param xs The array to modify.
 * @param x The object to insert.
 * @param index The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
export default function insertAt<T>(xs: T[], x: T, index?: number): void;
