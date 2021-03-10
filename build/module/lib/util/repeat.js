/**
 * Returns an array consisting of the given `value` repeated `N` times.
 */
export default function repeat(value, N) {
    var xs = [];
    for (var i = 0; i < N; i++) {
        xs[i] = value;
    }
    return xs;
}
