import { ForceBody } from "../core/ForceBody";
import { SurfaceConstraint } from "../core/SurfaceConstraint";
import { Geometric1 } from "../math/Geometric1";

export class SurfaceConstraint1 extends SurfaceConstraint<Geometric1> {
    constructor(body: ForceBody<Geometric1>, radiusFn: (x: Geometric1, radius: Geometric1) => void, rotationFn: (x: Geometric1, plane: Geometric1) => void, tangentFn: (x: Geometric1, tangent: Geometric1) => void) {
        super(body, radiusFn, rotationFn, tangentFn);
    }
}
