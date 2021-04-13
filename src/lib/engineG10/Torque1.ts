import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";
import { Geometric1 } from "../math/Geometric1";

/**
 *
 */
export class Torque1 extends Torque<Geometric1> {
    constructor(body: ForceBody<Geometric1>) {
        super(body);
    }
}
