import { GravitationLaw } from "../core/GravitationLaw";
import { Massive } from "../core/Massive";
import { Geometric1 } from "../math/Geometric1";

export class GravitationForceLaw1 extends GravitationLaw<Geometric1> {
    constructor(body1: Massive<Geometric1>, body2: Massive<Geometric1>, G: Geometric1) {
        super(body1, body2, G);
    }
}
