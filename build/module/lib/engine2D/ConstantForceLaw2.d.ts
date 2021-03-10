import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { ForceBody } from "../core/ForceBody";
import { Geometric2 } from "../math/Geometric2";
import { CoordType } from "../model/CoordType";
export declare class ConstantForceLaw2 extends ConstantForceLaw<Geometric2> {
    constructor(body: ForceBody<Geometric2>, vector: Geometric2, vectorCoordType?: CoordType);
}
