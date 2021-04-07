import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";
import { Spacetime2 } from "../math/Spacetime2";

/**
 *
 */
export class TorqueM21 extends Torque<Spacetime2> {
    constructor(body: ForceBody<Spacetime2>) {
        super(body);
    }
}
