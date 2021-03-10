export default function zeroArray(xs) {
    var length = xs.length;
    for (var i = 0; i < length; i++) {
        xs[i] = 0;
    }
}
