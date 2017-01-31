import SpinorE2 from './SpinorE2';

export function rotateX(x: number, y: number, spinor: SpinorE2): number {
    const a = spinor.xy;
    const w = spinor.a;

    const ix = w * x + a * y;
    const iy = w * y - a * x;

    return ix * w + iy * a;
}

export function rotateY(x: number, y: number, spinor: SpinorE2): number {
    const a = spinor.xy;
    const w = spinor.a;

    const ix = w * x + a * y;
    const iy = w * y - a * x;

    return iy * w - ix * a;
}
