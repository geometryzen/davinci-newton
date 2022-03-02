import { LinearDamper } from "../core/LinearDamper";
import { RigidBody } from "../core/RigidBody";
import { Geometric3 } from "../math/Geometric3";

/**
 * @deprecated Use LinearDamper.
 * @hidden
 */
export class LinearDamper3 extends LinearDamper<Geometric3> {
    constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>) {
        super(body1, body2);
        console.warn("LinearDamper3 is deprecated. Please use LinearDamper instead.");
    }
}