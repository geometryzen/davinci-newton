import { Geometric3 } from '../math/Geometric3';
import { RigidBody } from '../core/RigidBody';
/**
 * A rectangular block of constant density.
 */
export declare class Block3 extends RigidBody<Geometric3> {
    /**
     * The dimension corresponding to the width.
     */
    private readonly width_;
    private widthLock_;
    /**
     * The dimension corresponding to the height.
     */
    private readonly height_;
    private heightLock_;
    /**
     * The dimension corresponding to the depth.
     */
    private readonly depth_;
    private depthLock_;
    /**
     *
     */
    constructor(width?: Geometric3, height?: Geometric3, depth?: Geometric3);
    get width(): Geometric3;
    set width(width: Geometric3);
    get height(): Geometric3;
    set height(height: Geometric3);
    get depth(): Geometric3;
    set depth(depth: Geometric3);
    /**
     * The angular velocity is updated from the angular momentum.
     */
    updateAngularVelocity(): void;
    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void;
}
