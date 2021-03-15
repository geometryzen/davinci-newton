import { LinearDamper } from "../core/LinearDamper";
import { RigidBody } from "../core/RigidBody";
import { Geometric3 } from "../math/Geometric3";
/**
 *
 */
export declare class LinearDamper3 extends LinearDamper<Geometric3> {
    constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>);
}
