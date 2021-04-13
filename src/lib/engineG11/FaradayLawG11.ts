import { Charged } from "../core/Charged";
import { FaradayLaw } from "../core/FaradayLaw";
import { Spacetime1 } from "../math/Spacetime1";

export class FaradayLawG11 extends FaradayLaw<Spacetime1> {
    constructor(body: Charged<Spacetime1>, field: (X: Spacetime1) => Spacetime1) {
        super(body, field);
    }
}
