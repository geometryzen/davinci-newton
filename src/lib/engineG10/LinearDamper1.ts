import { LinearDamper } from "../core/LinearDamper";
import { RigidBody } from "../core/RigidBody";
import { Geometric1 } from "../math/Geometric1";

/**
 * @deprecated Use LinearDamper.
 * @hidden
 */
export class LinearDamper1 extends LinearDamper<Geometric1> {
    constructor(body1: RigidBody<Geometric1>, body2: RigidBody<Geometric1>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("LinearDamper1 is deprecated. Please use LinearDamper instead.");
    }
}
