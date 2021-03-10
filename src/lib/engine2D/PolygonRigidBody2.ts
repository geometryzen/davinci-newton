import { RigidBody } from "../core/RigidBody";
import { Geometric2 } from "../math/Geometric2";
import { Matrix1 } from "../math/Matrix1";
import { Euclidean2 } from "./Euclidean2";

export class PolygonRigidBody2 extends RigidBody<Geometric2> {
    constructor(public readonly points: Geometric2[]) {
        super(new Euclidean2());
    }
    updateInertiaTensor(): void {
        const r = Geometric2.scalar(1);
        const s = 0.5 * this.M.a * r.a * r.a;
        const I = Matrix1.zero();
        I.setElement(0, 0, s);
        // TODO: Units
        this.I = I;
    }
}
