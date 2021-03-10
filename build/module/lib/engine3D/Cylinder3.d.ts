import { RigidBody } from '../core/RigidBody';
import { Geometric3 } from '../math/Geometric3';
/**
 * A solid cylinder of uniform density.
 */
export declare class Cylinder3 extends RigidBody<Geometric3> {
    /**
     * The dimension corresponding to the radius.
     */
    private readonly radius_;
    private radiusLock_;
    /**
     * The dimension corresponding to the height.
     */
    private readonly height_;
    private heightLock_;
    /**
     *
     */
    constructor(radius?: Geometric3, height?: Geometric3);
    get radius(): Geometric3;
    set radius(radius: Geometric3);
    get height(): Geometric3;
    set height(height: Geometric3);
    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void;
}
