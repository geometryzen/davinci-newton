export default function contains<T>(xs: T[], x: T): boolean {
    const length = xs.length;
    for (let i = 0; i < length; i++) {
        if (xs[i] === x) {
            return true;
        }
    }
    return false;
}
