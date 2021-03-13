import { RigidBody } from "../core/RigidBody";
import { Geometric3 } from "../math/Geometric3";
import { Euclidean3 } from "./Euclidean3";

/**
 *
 */
export class RigidBody3 extends RigidBody<Geometric3> {
    constructor() {
        super(new Euclidean3());
    }
}
