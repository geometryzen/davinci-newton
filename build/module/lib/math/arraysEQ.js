export function arraysEQ2(a, b) {
    for (var i = 0; i < 2; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
export function arraysEQ4(a, b) {
    for (var i = 0; i < 4; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
export function arraysEQ8(a, b) {
    for (var i = 0; i < 8; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
