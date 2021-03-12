import findIndex from './findIndex';
/**
 * Search an array for the first element that satisfies a given condition and
 * return that element. Returns the first array element that passes the test,
 * or null if no element is found.
 * @hidden
 */
export default function find(xs, test) {
    var i = findIndex(xs, test);
    return i < 0 ? null : xs[i];
}
