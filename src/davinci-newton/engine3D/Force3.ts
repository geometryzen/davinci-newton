import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Geometric3 } from "../math/Geometric3";

/**
 * @deprecated Force3 is deprecated. Please use Force instead.
 */
export class Force3 extends Force<Geometric3> {
    constructor(body: ForceBody<Geometric3>) {
        super(body, body.metric);
        console.warn("Force3 is deprecated. Please use Force instead.");
    }
}
