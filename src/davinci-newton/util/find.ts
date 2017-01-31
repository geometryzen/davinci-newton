import findIndex from './findIndex';

/**
 * Search an array for the first element that satisfies a given condition and
 * return that element. Returns the first array element that passes the test,
 * or null if no element is found.
 */
export default function find<T>(xs: T[], test: (x: T, index: number) => boolean): T {
    const i = findIndex(xs, test);
    return i < 0 ? null : xs[i];
}