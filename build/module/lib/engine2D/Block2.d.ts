import { Geometric2 } from '../math/Geometric2';
import { RigidBody2 } from './RigidBody2';
/**
 * A rectangular block of constant surface density.
 */
export declare class Block2 extends RigidBody2 {
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
     *
     */
    constructor(width?: Geometric2, height?: Geometric2);
    get width(): Geometric2;
    set width(width: Geometric2);
    get height(): Geometric2;
    set height(height: Geometric2);
    /**
     * The angular velocity is updated from the angular momentum.
     * Ω = 12 * L * (1/M) * 1 / (h^2+w^2)
     */
    updateAngularVelocity(): void;
    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     * L = J(Ω) = (1/12) * M * (h^2 + w^2) * Ω
     */
    protected updateInertiaTensor(): void;
}
