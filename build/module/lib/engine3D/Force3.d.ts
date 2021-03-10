import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Geometric3 } from "../math/Geometric3";
/**
 *
 */
export declare class Force3 extends Force<Geometric3> {
    constructor(body: ForceBody<Geometric3>);
}
