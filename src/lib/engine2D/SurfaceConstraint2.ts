import { ForceBody } from "../core/ForceBody";
import { SurfaceConstraint } from "../core/SurfaceConstraint";
import { Geometric2 } from "../math/Geometric2";

export class SurfaceConstraint2 extends SurfaceConstraint<Geometric2> {
    constructor(body: ForceBody<Geometric2>, normalFn: (x: Geometric2, N: Geometric2) => void) {
        super(body, normalFn);
    }
}
