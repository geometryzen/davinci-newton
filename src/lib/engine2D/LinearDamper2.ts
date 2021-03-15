import { LinearDamper } from "../core/LinearDamper";
import { RigidBody } from "../core/RigidBody";
import { Geometric2 } from "../math/Geometric2";

/**
 *
 */
export class LinearDamper2 extends LinearDamper<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>) {
        super(body1, body2);
    }
}
