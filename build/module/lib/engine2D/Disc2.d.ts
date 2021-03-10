import { RigidBody } from '../core/RigidBody';
import { Geometric2 } from '../math/Geometric2';
/**
 * A solid disk of uniform surface density.
 */
export declare class Disc2 extends RigidBody<Geometric2> {
    /**
     * The dimension corresponding to the width.
     */
    private readonly radius_;
    private radiusLock_;
    /**
     *
     */
    constructor(radius?: Geometric2);
    get radius(): Geometric2;
    set radius(radius: Geometric2);
    /**
     * L = J(Ω) = (1/2) M R^2 Ω => Ω = 2 * L * (1/M) * (1/R)^2
     */
    updateAngularVelocity(): void;
    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     * I = (1/2) M * R^2
     */
    protected updateInertiaTensor(): void;
}
