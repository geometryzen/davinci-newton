export default function clone(xs) {
    var length = xs.length;
    var rv = new Array(length);
    for (var i = 0; i < length; i++) {
        rv[i] = xs[i];
    }
    return rv;
}
