import { ConstantTorqueLaw } from "../core/ConstantTorqueLaw";
import { ForceBody } from "../core/ForceBody";
import { Geometric3 } from "../math/Geometric3";
import { CoordType } from "../model/CoordType";

export class ConstantTorqueLaw3 extends ConstantTorqueLaw<Geometric3> {
    constructor(body: ForceBody<Geometric3>, value: Geometric3, valueCoordType: CoordType) {
        super(body, value, valueCoordType);
    }
}
