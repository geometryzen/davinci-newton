/**
 * Search an array for the first element that satisfies a given condition and
 * return its index. Returns the index of the first array element that passes the test,
 * or -1 if no element is found.
 */
export default function findIndex(xs, test) {
    var N = xs.length;
    for (var i = 0; i < N; i++) {
        var x = xs[i];
        if (test(x, i)) {
            return i;
        }
    }
    return -1;
}
