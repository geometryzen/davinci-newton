import { __extends } from "tslib";
import { Particle } from "../core/Particle";
import { Euclidean3 } from "./Euclidean3";
var Particle3 = /** @class */ (function (_super) {
    __extends(Particle3, _super);
    function Particle3(mass, charge) {
        return _super.call(this, mass, charge, new Euclidean3()) || this;
    }
    return Particle3;
}(Particle));
export { Particle3 };
