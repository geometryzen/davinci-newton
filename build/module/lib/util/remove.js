import removeAt from './removeAt';
/**
 * @hidden
 * Removes the first occurrence of a particular value from an array.
 * @param xs Array from which to remove value.
 * @param x Object to remove.
 * @return True if an element was removed.
 */
export function remove(xs, x) {
    var i = xs.indexOf(x);
    var rv;
    if ((rv = i >= 0)) {
        removeAt(xs, i);
    }
    return rv;
}
