import { LinearDamper } from "../core/LinearDamper";
import { RigidBody } from "../core/RigidBody";
import { Geometric1 } from "../math/Geometric1";

/**
 *
 */
export class LinearDamper1 extends LinearDamper<Geometric1> {
    constructor(body1: RigidBody<Geometric1>, body2: RigidBody<Geometric1>) {
        super(body1, body2);
    }
}
