import VectorE3 from './VectorE3';

export default function mustBeVectorE3(name: string, v: VectorE3): VectorE3 {
    if (isNaN(v.x) || isNaN(v.y) || isNaN(v.z)) {
        throw new Error(`${name}, (${v.x}, ${v.y}, ${v.z}), must be a VectorE3.`);
    }
    return v;
}
