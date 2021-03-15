import { ForceBody } from "../core/ForceBody";
import { SurfaceConstraint } from "../core/SurfaceConstraint";
import { Geometric3 } from "../math/Geometric3";

export class SurfaceConstraint3 extends SurfaceConstraint<Geometric3> {
    constructor(body: ForceBody<Geometric3>, normalFn: (x: Geometric3, N: Geometric3) => void) {
        super(body, normalFn);
    }
}
