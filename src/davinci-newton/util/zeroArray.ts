export default function zeroArray(xs: number[]): void {
    const length = xs.length;
    for (let i = 0; i < length; i++) {
        xs[i] = 0;
    }
}
