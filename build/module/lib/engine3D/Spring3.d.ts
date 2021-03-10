import { RigidBody } from "../core/RigidBody";
import { Spring } from "../core/Spring";
import { Geometric3 } from "../math/Geometric3";
/**
 *
 */
export declare class Spring3 extends Spring<Geometric3> {
    constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>);
}
