export function gcd(a: number, b: number): number {
    let temp: number;

    if (a < 0) {
        a = -a;
    }
    if (b < 0) {
        b = -b;
    }
    if (b > a) {
        temp = a;
        a = b;
        b = temp;
    }
    while (true) {
        a %= b;
        if (a === 0) {
            return b;
        }
        b %= a;
        if (b === 0) {
            return a;
        }
    }
}
