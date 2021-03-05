import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { ForceBody } from "../core/ForceBody";
import { Geometric2 } from "../math/Geometric2";
import { CoordType, WORLD } from "../model/CoordType";

export class ConstantForceLaw2 extends ConstantForceLaw<Geometric2> {
    constructor(body: ForceBody<Geometric2>, vector: Geometric2, vectorCoordType: CoordType = WORLD) {
        super(body, vector, vectorCoordType);
    }
}
