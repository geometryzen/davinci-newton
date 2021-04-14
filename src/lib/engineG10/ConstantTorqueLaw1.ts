import { ConstantTorqueLaw } from "../core/ConstantTorqueLaw";
import { ForceBody } from "../core/ForceBody";
import { Geometric1 } from "../math/Geometric1";
import { WORLD } from "../model/CoordType";

/**
 * @deprecated Use ConstantTorqueLaw.
 * @hidden
 */
export class ConstantTorqueLaw1 extends ConstantTorqueLaw<Geometric1> {
    constructor(body: ForceBody<Geometric1>, value: Geometric1) {
        super(body, value, WORLD);
    }
}
