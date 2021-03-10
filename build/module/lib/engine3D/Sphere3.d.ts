import { RigidBody } from '../core/RigidBody';
import { Geometric3 } from '../math/Geometric3';
/**
 * A solid sphere of constant density.
 */
export declare class Sphere3 extends RigidBody<Geometric3> {
    /**
     * The dimension corresponding to the width.
     */
    private readonly radius_;
    private radiusLock_;
    /**
     *
     */
    constructor(radius?: Geometric3);
    get radius(): Geometric3;
    set radius(radius: Geometric3);
    /**
     * L(Ω) = (2 M r r / 5) Ω => Ω = (5 / 2 M r r) L(Ω)
     */
    updateAngularVelocity(): void;
    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void;
}
