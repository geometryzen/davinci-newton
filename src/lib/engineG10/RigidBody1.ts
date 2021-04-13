import { RigidBody } from "../core/RigidBody";
import { Geometric1 } from "../math/Geometric1";
import { Euclidean1 } from "./Euclidean1";

export class RigidBody1 extends RigidBody<Geometric1> {
    constructor() {
        super(new Euclidean1());
    }
}
