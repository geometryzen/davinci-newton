import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";
import { Geometric3 } from "../math/Geometric3";

/**
 *
 */
export class Torque3 extends Torque<Geometric3> {
    constructor(body: ForceBody<Geometric3>) {
        super(body);
    }
}
