import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Geometric1 } from "../math/Geometric1";

/**
 *
 */
export class Force1 extends Force<Geometric1> {
    constructor(body: ForceBody<Geometric1>) {
        super(body);
    }
}
