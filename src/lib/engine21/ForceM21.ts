import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Spacetime2 } from "../math/Spacetime2";

/**
 *
 */
export class ForceM21 extends Force<Spacetime2> {
    constructor(body: ForceBody<Spacetime2>) {
        super(body);
    }
}
