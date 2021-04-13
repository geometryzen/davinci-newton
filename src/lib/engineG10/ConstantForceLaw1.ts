import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { ForceBody } from "../core/ForceBody";
import { Geometric1 } from "../math/Geometric1";
import { CoordType, WORLD } from "../model/CoordType";

export class ConstantForceLaw1 extends ConstantForceLaw<Geometric1> {
    constructor(body: ForceBody<Geometric1>, vector: Geometric1, vectorCoordType: CoordType = WORLD) {
        super(body, vector, vectorCoordType);
    }
}
