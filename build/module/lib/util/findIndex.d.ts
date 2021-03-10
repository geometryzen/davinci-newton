/**
 * Search an array for the first element that satisfies a given condition and
 * return its index. Returns the index of the first array element that passes the test,
 * or -1 if no element is found.
 */
export default function findIndex<T>(xs: T[], test: (x: T, index: number) => boolean): number;
