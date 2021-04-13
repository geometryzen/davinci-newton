import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Spacetime1 } from "../math/Spacetime1";

/**
 *
 */
export class ForceG11 extends Force<Spacetime1> {
    constructor(body: ForceBody<Spacetime1>) {
        super(body);
    }
}
