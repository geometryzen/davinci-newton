import { GravitationLaw } from "../core/GravitationLaw";
import { Massive } from "../core/Massive";
import { Geometric2 } from "../math/Geometric2";

export class GravitationForceLaw2 extends GravitationLaw<Geometric2> {
    constructor(body1: Massive<Geometric2>, body2: Massive<Geometric2>) {
        super(body1, body2, Geometric2.one);
    }
}
