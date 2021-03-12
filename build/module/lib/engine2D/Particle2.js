import { __extends } from "tslib";
import { Particle } from "../core/Particle";
import { Euclidean2 } from "./Euclidean2";
var Particle2 = /** @class */ (function (_super) {
    __extends(Particle2, _super);
    function Particle2(mass, charge) {
        return _super.call(this, mass, charge, new Euclidean2()) || this;
    }
    return Particle2;
}(Particle));
export { Particle2 };
