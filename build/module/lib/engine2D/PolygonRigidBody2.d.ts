import { RigidBody } from "../core/RigidBody";
import { Geometric2 } from "../math/Geometric2";
export declare class PolygonRigidBody2 extends RigidBody<Geometric2> {
    readonly points: Geometric2[];
    constructor(points: Geometric2[]);
    updateInertiaTensor(): void;
}
