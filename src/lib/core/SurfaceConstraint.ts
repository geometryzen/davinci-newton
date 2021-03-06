import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { ForceBody } from "./ForceBody";
import { GeometricConstraint } from "./GeometricConstraint";

/**
 * @hidden
 */
export class SurfaceConstraint<T> implements GeometricConstraint<T> {
    public readonly N: T;
    constructor(private readonly body: ForceBody<T>, private readonly normalFn: (x: T, N: T) => void) {
        mustBeNonNullObject('body', body);
        const metric = body.metric;
        this.N = metric.zero();
    }
    getBody(): ForceBody<T> {
        return this.body;
    }
    computeNormal(x: T, N: T): void {
        this.normalFn(x, N);
    }
    setForce(N: T): void {
        const metric = this.body.metric;
        metric.copyVector(N, this.N);
    }
}
