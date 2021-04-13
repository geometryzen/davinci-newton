import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Geometric2 } from "../math/Geometric2";

/**
 *
 */
export class Force2 extends Force<Geometric2> {
    constructor(body: ForceBody<Geometric2>) {
        super(body);
    }
}
