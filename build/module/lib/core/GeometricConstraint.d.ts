import { ForceBody } from "./ForceBody";
export declare class GeometricConstraint<T> {
    private readonly body;
    private readonly normalFn;
    private readonly N;
    constructor(body: ForceBody<T>, normalFn: (x: T, N: T) => void);
    getBody(): ForceBody<T>;
    computeNormal(x: T, N: T): void;
    setForce(N: T): void;
}
