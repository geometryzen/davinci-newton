export default function contains<T>(xs: T[], x: T): boolean {
    const N = xs.length;
    for (let i = 0; i < N; i++) {
        if (xs[i] === x) {
            return true;
        }
    }
    return false;
}
