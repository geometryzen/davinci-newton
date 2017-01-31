import VectorE2 from './VectorE2';

export function wedgeXY(a: VectorE2, b: VectorE2): number {
    return a.x * b.y - a.y * b.x;
}
