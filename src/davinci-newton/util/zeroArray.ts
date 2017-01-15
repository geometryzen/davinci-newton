export default function zeroArray(xs: number[]): void {
    const n = xs.length;
    for (let i = 0; i < n; i++) {
        xs[i] = 0;
    }
}
