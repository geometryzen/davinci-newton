import { GravitationLaw } from "../core/GravitationLaw";
import { Massive } from "../core/Massive";
import { Geometric3 } from "../math/Geometric3";

/**
 * @deprecated Use GravitationLaw.
 * @hidden
 */
export class GravitationForceLaw3 extends GravitationLaw<Geometric3> {
    constructor(body1: Massive<Geometric3>, body2: Massive<Geometric3>) {
        super(body1, body2);
        console.warn("GravitationForceLaw3 is deprecated. Please use GravitationLaw instead.");
    }
}
