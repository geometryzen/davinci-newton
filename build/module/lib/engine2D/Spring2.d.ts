import { RigidBody } from "../core/RigidBody";
import { Spring } from "../core/Spring";
import { Geometric2 } from "../math/Geometric2";
/**
 *
 */
export declare class Spring2 extends Spring<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>);
}
