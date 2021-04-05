import { __extends } from "tslib";
import { Particle } from "../core/Particle";
import { Euclidean2 } from "./Euclidean2";
var Particle2 = /** @class */ (function (_super) {
    __extends(Particle2, _super);
    /**
     * Constructs a particle in 2 Euclidean dimensions.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    function Particle2(M, Q) {
        return _super.call(this, M, Q, new Euclidean2()) || this;
    }
    return Particle2;
}(Particle));
export { Particle2 };
