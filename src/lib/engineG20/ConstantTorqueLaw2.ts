import { ConstantTorqueLaw } from "../core/ConstantTorqueLaw";
import { ForceBody } from "../core/ForceBody";
import { Geometric2 } from "../math/Geometric2";
import { WORLD } from "../model/CoordType";

export class ConstantTorqueLaw2 extends ConstantTorqueLaw<Geometric2> {
    constructor(body: ForceBody<Geometric2>, value: Geometric2) {
        super(body, value, WORLD);
    }
}
