import { ForceBody } from "./ForceBody";
/**
 * @hidden
 */
export interface GeometricConstraint<T> {
    getBody(): ForceBody<T>;
    computeNormal(x: T, N: T): void;
    setForce(N: T): void;
}
