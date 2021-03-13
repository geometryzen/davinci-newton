import { Geometric2 } from "../math/Geometric2";
import { RigidBody2 } from "./RigidBody2";
export declare class Rod2 extends RigidBody2 {
    readonly a: Geometric2;
    constructor(a: Geometric2);
    updateInertiaTensor(): void;
}
