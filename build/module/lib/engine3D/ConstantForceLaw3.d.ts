import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { ForceBody } from "../core/ForceBody";
import { Geometric3 } from "../math/Geometric3";
import { CoordType } from "../model/CoordType";
export declare class ConstantForceLaw3 extends ConstantForceLaw<Geometric3> {
    constructor(body: ForceBody<Geometric3>, vector: Geometric3, vectorCoordType?: CoordType);
}
