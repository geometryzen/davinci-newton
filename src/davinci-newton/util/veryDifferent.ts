export default function veryDifferent(arg1: number, arg2: number, epsilon = 1E-14, magnitude = 1): boolean {
    if (epsilon <= 0) {
        throw new Error(`epsilon (${epsilon}) must be positive.`);
    }
    if (magnitude <= 0) {
        throw new Error(`magnitude (${magnitude}) must be positive.`);
    }
    const maxArg = Math.max(Math.abs(arg1), Math.abs(arg2));
    const max = maxArg > magnitude ? maxArg : magnitude;
    return Math.abs(arg1 - arg2) > max * epsilon;
}
