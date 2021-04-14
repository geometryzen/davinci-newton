import { RigidBody } from "../core/RigidBody";
import { Spring } from "../core/Spring";
import { Geometric1 } from "../math/Geometric1";

/**
 * @deprecated Use Spring.
 * @hidden
 */
export class Spring1 extends Spring<Geometric1> {
    constructor(body1: RigidBody<Geometric1>, body2: RigidBody<Geometric1>) {
        super(body1, body2);
        console.warn("Spring1 is deprecated. Please use Spring instead.");
    }
}
