import { __extends } from "tslib";
import { Particle } from "../core/Particle";
import { Euclidean3 } from "./Euclidean3";
var Particle3 = /** @class */ (function (_super) {
    __extends(Particle3, _super);
    /**
     * Constructs a particle in 2 Euclidean dimensions.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    function Particle3(M, Q) {
        return _super.call(this, M, Q, new Euclidean3()) || this;
    }
    return Particle3;
}(Particle));
export { Particle3 };
