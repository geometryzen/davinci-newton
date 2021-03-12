import { RigidBody } from "../core/RigidBody";
import { Geometric2 } from "../math/Geometric2";
export declare class PolygonRigidBody2 extends RigidBody<Geometric2> {
    /**
     * The position of the polygon point relative to the center of mass.
     *
     * r = x - X, where x is the world position, X is the center of mass.
     */
    readonly rs: Geometric2[];
    constructor(points: Geometric2[]);
    /**
     * The inertia tensor matrix must be updated any time the geometry changes.
     * The geometry is defined by the total mass, M, and the positions of the vertices.
     */
    updateInertiaTensor(): void;
}
