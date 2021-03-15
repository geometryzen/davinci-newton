import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";
import { Geometric2 } from "../math/Geometric2";

/**
 *
 */
export class Torque2 extends Torque<Geometric2> {
    constructor(body: ForceBody<Geometric2>) {
        super(body);
    }
}
