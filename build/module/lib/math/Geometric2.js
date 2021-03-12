import { notImplemented } from '../i18n/notImplemented';
import { readOnly } from "../i18n/readOnly";
import { approx } from "./approx";
import { arraysEQ } from "./arraysEQ";
import { gauss } from "./gauss";
import { isZeroGeometricE2 as isZeroGeometric } from "./isZeroGeometricE2";
import { isZeroVectorE2 as isZeroVector } from "./isZeroVectorE2";
// import { maskG2 as mask } from './maskG2';
import { QQ } from "./QQ";
import { rotorFromDirectionsE2 as rotorFromDirections } from './rotorFromDirectionsE2';
import { stringFromCoordinates } from "./stringFromCoordinates";
import { Unit } from "./Unit";
// Symbolic constants for the coordinate indices into the data array.
var COORD_A = 0;
var COORD_X = 1;
var COORD_Y = 2;
var COORD_B = 3;
var BASIS_LABELS = ["1", "e1", "e2", "e12"];
BASIS_LABELS[COORD_A] = '1';
BASIS_LABELS[COORD_X] = 'e1';
BASIS_LABELS[COORD_Y] = 'e2';
BASIS_LABELS[COORD_B] = 'e12';
var zero = function zero() {
    return [0, 0, 0, 0];
};
var scalar = function scalar(a) {
    var coords = zero();
    coords[COORD_A] = a;
    return coords;
};
var vector = function vector(x, y) {
    var coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    return coords;
};
var bivector = function bivector(b) {
    var coords = zero();
    coords[COORD_B] = b;
    return coords;
};
var pseudo = function pseudo(b) {
    var coords = zero();
    coords[COORD_B] = b;
    return coords;
};
var spinor = function spinor(a, b) {
    var coords = zero();
    coords[COORD_A] = a;
    coords[COORD_B] = b;
    return coords;
};
/**
 * Coordinates corresponding to basis labels.
 */
var coordinates = function coordinates(m) {
    var coords = zero();
    coords[COORD_A] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_B] = m.b;
    return coords;
};
function isScalar(m) {
    return m.x === 0 && m.y === 0 && m.b === 0;
}
/**
 * Sets the lock on the multivector argument and returns the same argument.
 * This is a convenience function for the dunder (double underscore) methods.
 * All dunder methods should return locked values.
 */
function lock(m) {
    m.lock();
    return m;
}
/**
 * Sentinel value to indicate that the Geometric2 is not locked.
 * UNLOCKED is in the range -1 to 0.
 */
var UNLOCKED = -1 * Math.random();
var Geometric2 = /** @class */ (function () {
    /**
     * Do not call this constructor. Use the static construction methods instead.
     * The multivector is constructed in the unlocked (mutable) state.
     */
    function Geometric2(coords, uom) {
        if (coords === void 0) { coords = zero(); }
        /**
         *
         */
        this.lock_ = UNLOCKED;
        if (coords.length !== 4) {
            throw new Error("coords.length must be 4");
        }
        this.coords_ = coords;
        this.uom_ = uom;
    }
    /**
     * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric2.scalar = function (a, uom) {
        return new Geometric2(scalar(a), uom);
    };
    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     * The bivector returned is in the unlocked (mutable) state.
     * @param b The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric2.bivector = function (b, uom) {
        return Geometric2.spinor(0, b, uom);
    };
    /**
     * Creates a spinor valued multivector from the specified cartesian coordinates.
     * The spinor returned is in the unlocked (mutable) state.
     * @param a The scalar coordinate.
     * @param b The pseudoscalar coordinate.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric2.spinor = function (a, b, uom) {
        return new Geometric2(spinor(a, b), uom);
    };
    /**
     * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
     * @param x The coordinate corresponding to the e1 basis vector.
     * @param y The coordinate corresponding to the e2 basis vector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric2.vector = function (x, y, uom) {
        return new Geometric2(vector(x, y), uom);
    };
    Geometric2.copy = function (mv) {
        return new Geometric2(coordinates(mv), mv.uom);
    };
    Geometric2.fromBivector = function (B) {
        return new Geometric2(bivector(B.xy), B.uom);
    };
    Geometric2.fromScalar = function (alpha) {
        return new Geometric2(scalar(alpha.a), alpha.uom);
    };
    Geometric2.fromSpinor = function (R) {
        return new Geometric2(spinor(R.a, R.xy), R.uom);
    };
    Geometric2.fromVector = function (v) {
        return new Geometric2(vector(v.x, v.y), v.uom);
    };
    Geometric2.rotorFromDirections = function (a, b) {
        return new Geometric2([0, 0, 0, 0]).rotorFromDirections(a, b);
    };
    Geometric2.rotorFromVectorToVector = function (a, b) {
        return new Geometric2([0, 0, 0, 0]).rotorFromVectorToVector(a, b);
    };
    Geometric2.prototype.adj = function () {
        throw new Error(notImplemented('adj').message);
    };
    Geometric2.prototype.isScalar = function () {
        return isScalar(this);
    };
    Geometric2.prototype.quad = function () {
        return new Geometric2([this.squaredNormSansUnits(), 0, 0, 0], Unit.mul(this.uom, this.uom));
    };
    Geometric2.prototype.scale = function (α) {
        return new Geometric2([this.a * α, this.x * α, this.y * α, this.b * α], this.uom);
    };
    Geometric2.prototype.slerp = function (target, α) {
        throw new Error(notImplemented('slerp').message);
    };
    Geometric2.prototype.stress = function (σ) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().stress(σ));
        }
        else {
            this.x *= σ.x;
            this.y *= σ.y;
            this.uom = Unit.mul(σ.uom, this.uom);
            // TODO: Action on other components TBD.
            return this;
        }
    };
    Geometric2.prototype.__div__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(this.clone().div(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().divByNumber(rhs));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().divByScalar(1, rhs));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs, void 0).div(this));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__vbar__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).scp(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rvbar__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__wedge__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return lock(Geometric2.copy(this).mulByNumber(rhs));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rwedge__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return lock(Geometric2.copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__lshift__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).lco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rlshift__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rshift__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).rco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rrshift__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__bang__ = function () {
        return lock(Geometric2.copy(this).inv());
    };
    Geometric2.prototype.__eq__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            var a0 = this.a;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.b;
            var b0 = rhs.a;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.b;
            // TODO: Should be equals on Unit, but this is close.
            return a0 === b0 && a1 === b1 && a2 === b2 && a3 === b3 && Unit.isCompatible(this.uom, rhs.uom);
        }
        else if (typeof rhs === 'number') {
            return false;
        }
        else {
            return false;
        }
    };
    Geometric2.prototype.__ne__ = function (rhs) {
        throw new Error(notImplemented('__ne_').message);
    };
    Geometric2.prototype.__ge__ = function (rhs) {
        throw new Error(notImplemented('__ge_').message);
    };
    Geometric2.prototype.__gt__ = function (rhs) {
        throw new Error(notImplemented('__gt_').message);
    };
    Geometric2.prototype.__le__ = function (rhs) {
        throw new Error(notImplemented('__le_').message);
    };
    Geometric2.prototype.__lt__ = function (rhs) {
        throw new Error(notImplemented('__lt_').message);
    };
    Geometric2.prototype.__tilde__ = function () {
        return lock(Geometric2.copy(this).rev());
    };
    Geometric2.prototype.__add__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(this.clone().add(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().addScalar(rhs, void 0, 1));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().addScalar(1, rhs, 1));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).add(this));
        }
        else if (lhs instanceof Unit) {
            return lock(Geometric2.scalar(1, lhs).add(this));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(this.clone().sub(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().subScalar(rhs, void 0, 1));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().subScalar(1, rhs, 1));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__pos__ = function () {
        return lock(Geometric2.copy(this));
    };
    Geometric2.prototype.__neg__ = function () {
        return lock(Geometric2.copy(this).neg());
    };
    Geometric2.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(this.clone().mul(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().mulByNumber(rhs));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().mulByScalar(1, rhs));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            // The ordering of operands is not important for scalar multiplication.
            return lock(Geometric2.copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    };
    Geometric2.prototype.add2 = function (a, b) {
        if (isZeroGeometric(a)) {
            this.uom = b.uom;
        }
        else if (isZeroGeometric(b)) {
            this.uom = a.uom;
        }
        else {
            this.uom = Unit.compatible(a.uom, b.uom);
        }
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.b = a.b + b.b;
        return this;
    };
    Geometric2.prototype.addPseudo = function (β, uom) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addPseudo(β, uom));
        }
        else {
            if (this.isZero()) {
                this.uom = uom;
            }
            else if (β === 0) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, uom);
            }
            this.b += β;
            return this;
        }
    };
    Geometric2.prototype.addScalar = function (a, uom, α) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addScalar(a, uom, α));
        }
        else {
            if (this.isZero()) {
                this.uom = uom;
            }
            else if (α === 0) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, uom);
            }
            this.a += a * α;
            return this;
        }
    };
    Geometric2.prototype.angle = function () {
        return this.log().grade(2);
    };
    Geometric2.prototype.approx = function (n) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().approx(n));
        }
        else {
            approx(this.coords_, n);
            return this;
        }
    };
    Geometric2.prototype.conj = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().conj());
        }
        else {
            this.x = -this.x;
            this.y = -this.y;
            this.b = -this.b;
            return this;
        }
    };
    Geometric2.prototype.copySpinor = function (spinor) {
        var a = spinor.a;
        var b = spinor.xy;
        this.setCoordinate(COORD_A, a, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_B, b, 'b');
        this.uom = spinor.uom;
        return this;
    };
    /**
     * @param m The multivector dividend.
     * @returns this / m;
     */
    Geometric2.prototype.div = function (rhs) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().div(rhs));
        }
        else {
            if (isScalar(rhs)) {
                return this.divByScalar(rhs.a, rhs.uom);
            }
            else {
                return this.mul(Geometric2.copy(rhs).inv());
            }
        }
    };
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @param a The numerator.
     * @param b The denominator.
     */
    Geometric2.prototype.div2 = function (a, b) {
        throw new Error(notImplemented('div2').message);
    };
    Geometric2.prototype.divByNumber = function (α) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByNumber(α));
        }
        else {
            this.a /= α;
            this.x /= α;
            this.y /= α;
            this.b /= α;
            return this;
        }
    };
    Geometric2.prototype.divByVector = function (v) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByVector(v));
        }
        else {
            var x = v.x;
            var y = v.y;
            var uom2 = Unit.pow(v.uom, QQ.valueOf(2, 1));
            var squaredNorm = x * x + y * y;
            return this.mulByVector(v).divByScalar(squaredNorm, uom2);
        }
    };
    /**
     * dual(m) = I<sub>n</sub> * m = m / I<sub>n</sub>
     *
     * @returns dual(m) or dual(this) if m is undefined.
     */
    Geometric2.prototype.dual = function (m) {
        throw new Error(notImplemented('dual').message);
    };
    Geometric2.prototype.equals = function (other) {
        if (other instanceof Geometric2) {
            // TODO: Check units of measure.
            return arraysEQ(this.coords_, other.coords_);
        }
        else {
            return false;
        }
    };
    Geometric2.prototype.exp = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().exp());
        }
        else {
            Unit.assertDimensionless(this.uom);
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            var expW = Math.exp(this.a);
            // In Geometric3 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            // let cosβ = cos(this.b)
            // let sinβ = sin(this.b)
            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            var xy = this.xy;
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = Math.sqrt(xy * xy);
            var s = φ !== 0 ? Math.sin(φ) / φ : 1;
            var cosφ = Math.cos(φ);
            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.a = cosφ;
            this.xy = xy * s;
            return this.mulByNumber(expW);
        }
    };
    /**
     * <p>
     * <code>this ⟼ lhs ^ rhs</code>
     * </p>
     */
    Geometric2.prototype.ext2 = function (lhs, rhs) {
        var a0 = lhs.a;
        var a1 = lhs.x;
        var a2 = lhs.y;
        var a3 = lhs.b;
        var b0 = rhs.a;
        var b1 = rhs.x;
        var b2 = rhs.y;
        var b3 = rhs.b;
        this.a = a0 * b0;
        this.x = a0 * b1 + a1 * b0;
        this.y = a0 * b2 + a2 * b0;
        this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    };
    Geometric2.prototype.grade = function (n) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().grade(n));
        }
        else {
            // There is no change to the unit of measure.
            switch (n) {
                case 0: {
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                    break;
                }
                case 1: {
                    this.a = 0;
                    this.b = 0;
                    break;
                }
                case 2: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    break;
                }
                default: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                }
            }
            return this;
        }
    };
    Geometric2.prototype.isOne = function () {
        if (Unit.isOne(this.uom)) {
            return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
        }
        else {
            return false;
        }
    };
    Geometric2.prototype.isSpinor = function () {
        return this.x === 0 && this.y === 0;
    };
    Geometric2.prototype.I = function () {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.b = 1;
        this.uom = void 0;
        return this;
    };
    Geometric2.prototype.lco = function (rhs) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lco(rhs));
        }
        else {
            return this.lco2(this, rhs);
        }
    };
    /**
     * <p>
     * <code>this ⟼ lhs << rhs</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric2.prototype.lco2 = function (lhs, rhs) {
        var a0 = lhs.a;
        var a1 = lhs.x;
        var a2 = lhs.y;
        var a3 = lhs.b;
        var b0 = rhs.a;
        var b1 = rhs.x;
        var b2 = rhs.y;
        var b3 = rhs.b;
        this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        this.x = a0 * b1 - a2 * b3;
        this.y = a0 * b2 + a1 * b3;
        this.b = a0 * b3;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    };
    Geometric2.prototype.lerp = function (target, α) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lerp(target, α));
        }
        else {
            if (this.isZero()) {
                this.uom = target.uom;
            }
            else if (isZeroGeometric(target)) {
                // Fall through.
            }
            else {
                this.uom = Unit.compatible(this.uom, target.uom);
            }
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    };
    Geometric2.prototype.lerp2 = function (a, b, α) {
        this.copy(a).lerp(b, α);
        return this;
    };
    Geometric2.prototype.log = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().log());
        }
        else {
            Unit.assertDimensionless(this.uom);
            if (this.isSpinor()) {
                var α = this.a;
                var β = this.b;
                this.a = Math.log(Math.sqrt(α * α + β * β));
                this.b = Math.atan2(β, α);
                return this;
            }
            else {
                throw new Error(notImplemented("log(" + this.toString() + ")").message);
            }
        }
    };
    Geometric2.prototype.norm = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().norm());
        }
        else {
            this.a = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.b = 0;
            // There is no change to the unit of measure.
            return this;
        }
    };
    Geometric2.prototype.one = function () {
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        this.uom = void 0;
        return this;
    };
    Geometric2.prototype.rco = function (m) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rco(m));
        }
        else {
            return this.rco2(this, m);
        }
    };
    /**
     * <p>
     * <code>this ⟼ lhs >> rhs</code>
     * </p>
     */
    Geometric2.prototype.rco2 = function (lhs, rhs) {
        var a0 = lhs.a;
        var a1 = lhs.x;
        var a2 = lhs.y;
        var a3 = lhs.b;
        var b0 = rhs.a;
        var b1 = rhs.x;
        var b2 = rhs.y;
        var b3 = rhs.b;
        this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        this.x = -a1 * b0 - a3 * b2;
        this.y = -a2 * b0 + a3 * b1;
        this.b = a3 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    };
    /**
     * If `this` is mutable, then sets `this` multivector to its reflection in the plane orthogonal to vector n. The result is mutable.
     * If `this` is immutable (locked), a copy of `this` is made, which is then reflected. The result is immutable (locked).
     *
     * i.e. The result is mutable (unlocked) iff `this` is mutable (unlocked).
     *
     * Mathematically,
     *
     * this ⟼ - n * this * n
     *
     * Geometrically,
     *
     * Reflects this multivector in the plane orthogonal to the unit vector, n.
     * This implementation does assume that n is a vector, but does not assume that it is normalized to unity.
     *
     * If n is not a unit vector then the result is scaled by n squared.
     * The scalar component gets an extra minus sign. The pseudoscalar component does not change sign.
     * The units of measure are carried through but in most cases n SHOULD be dimensionless.
     *
     * @param n The unit vector that defines the reflection plane.
     */
    Geometric2.prototype.reflect = function (n) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().reflect(n));
        }
        else {
            var nx = n.x;
            var ny = n.y;
            var nu = n.uom;
            var a = this.a;
            var x = this.x;
            var y = this.y;
            var b = this.b;
            var u = this.uom;
            var nx2 = nx * nx;
            var ny2 = ny * ny;
            var μ = nx2 - ny2;
            var λ = -2 * nx * ny;
            var β = nx2 + ny2;
            // The scalar component picks up a minus sign and the factor |n||n|.
            this.a = -β * a;
            this.x = λ * y - μ * x;
            this.y = λ * x + μ * y;
            // The pseudoscalar component does not change sign but still picks up the |n||n| factor.
            this.b = β * b;
            // In most cases, n SHOULD be dimensionless.
            this.uom = Unit.mul(nu, Unit.mul(u, nu));
            return this;
        }
    };
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * </p>
     *
     * The result is independent of the magnitudes of a and b.
     *
     * @param a The starting vector
     * @param b The ending vector
     * @returns The rotor representing a rotation from a to b.
     */
    Geometric2.prototype.rotorFromDirections = function (a, b) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rotorFromDirections(a, b));
        }
        else {
            rotorFromDirections(a, b, this);
            return this;
        }
    };
    Geometric2.prototype.rotorFromFrameToFrame = function (es, fs) {
        throw new Error(notImplemented('rotorFromFrameToFrame').message);
    };
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    Geometric2.prototype.rotorFromGeneratorAngle = function (B, θ) {
        throw new Error(notImplemented('rotorFromGeneratorAngle').message);
    };
    /**
     * R = sqrt(|b|/|a|) * (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is depends  on the magnitudes of a and b.
     */
    Geometric2.prototype.rotorFromVectorToVector = function (a, b) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rotorFromVectorToVector(a, b));
        }
        else {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            var mb = Math.sqrt(bx * bx + by * by);
            var ma = Math.sqrt(ax * ax + ay * ay);
            /**
             * s = |b||a|
             */
            var s = mb * ma;
            /**
             * p = b.a or b << a
             */
            var p = bx * ax + by * ay;
            /**
             * q = b ^ a
             */
            var q = bx * ay - by * ax;
            var d = Math.sqrt(2 * s * (s + p));
            var f = Math.sqrt(mb) / (Math.sqrt(ma) * d);
            this.a = f * (s + p);
            this.x = 0;
            this.y = 0;
            this.b = f * q;
            this.uom = Unit.sqrt(Unit.div(b.uom, a.uom));
            return this;
        }
    };
    Geometric2.prototype.sqrt = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().sqrt());
        }
        else {
            this.a = Math.sqrt(this.a);
            this.x = 0;
            this.y = 0;
            this.b = 0;
            this.uom = Unit.sqrt(this.uom);
            return this;
        }
    };
    Geometric2.prototype.squaredNorm = function (mutate) {
        return this.quaditude(mutate);
    };
    Geometric2.prototype.sub2 = function (a, b) {
        if (isZeroGeometric(a)) {
            this.a = -b.a;
            this.x = -b.x;
            this.y = -b.y;
            this.b = -b.b;
            this.uom = b.uom;
        }
        else if (isZeroGeometric(b)) {
            this.a = a.a;
            this.x = a.x;
            this.y = a.y;
            this.b = a.b;
            this.uom = a.uom;
        }
        else {
            this.a = a.a - b.a;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.b = a.b - b.b;
            this.uom = Unit.compatible(a.uom, b.uom);
        }
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     */
    Geometric2.prototype.versor = function (a, b) {
        this.a = a.x * b.x + a.y * b.y;
        this.x = 0;
        this.y = 0;
        this.b = a.x * b.y - a.y * b.x;
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
    };
    /**
     * Determines whether this multivector is locked.
     * If the multivector is in the unlocked state then it is mutable.
     * If the multivector is in the locked state then it is immutable.
     */
    Geometric2.prototype.isLocked = function () {
        return this.lock_ !== UNLOCKED;
    };
    Geometric2.prototype.isMutable = function () {
        return this.lock_ === UNLOCKED;
    };
    /**
     * Locks this multivector (preventing any further mutation),
     * and returns a token that may be used to unlock it.
     */
    Geometric2.prototype.lock = function () {
        if (this.lock_ !== UNLOCKED) {
            throw new Error("already locked");
        }
        else {
            this.lock_ = Math.random();
            return this.lock_;
        }
    };
    /**
     * Unlocks this multivector (allowing mutation),
     * using a token that was obtained from a preceding lock method call.
     */
    Geometric2.prototype.unlock = function (token) {
        if (this.lock_ === UNLOCKED) {
            throw new Error("not locked");
        }
        else if (this.lock_ === token) {
            this.lock_ = UNLOCKED;
        }
        else {
            throw new Error("unlock denied");
        }
    };
    /**
     * Consistently set a coordinate value in the most optimized way.
     * Permits mutation only when the lock status is UNLOCKED.
     * It is safe to use this as an alternative to the named property accessors.
     */
    Geometric2.prototype.setCoordinate = function (index, newValue, name) {
        if (this.lock_ === UNLOCKED) {
            var coords = this.coords_;
            var previous = coords[index];
            if (newValue !== previous) {
                coords[index] = newValue;
            }
        }
        else {
            throw new Error(readOnly(name).message);
        }
    };
    Object.defineProperty(Geometric2.prototype, "a", {
        /**
         * The scalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_A];
        },
        set: function (a) {
            this.setCoordinate(COORD_A, a, 'a');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "b", {
        /**
         * The pseudoscalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_B];
        },
        set: function (b) {
            this.setCoordinate(COORD_B, b, 'b');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "xy", {
        get: function () {
            return this.coords_[COORD_B];
        },
        set: function (xy) {
            this.setCoordinate(COORD_B, xy, 'xy');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "grades", {
        /**
         * A bitmask describing the grades.
         *
         * 0x0 = zero
         * 0x1 = scalar
         * 0x2 = vector
         * 0x4 = bivector
         * 0x8 = pseudoscalar
         */
        get: function () {
            var coords = this.coords_;
            var α = coords[COORD_A];
            var x = coords[COORD_X];
            var y = coords[COORD_Y];
            var β = coords[COORD_B];
            var mask = 0x0;
            if (α !== 0) {
                mask += 0x1;
            }
            if (x !== 0 || y !== 0) {
                mask += 0x2;
            }
            if (β !== 0) {
                mask += 0x4;
            }
            return mask;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "uom", {
        /**
         * The optional unit of measure.
         */
        get: function () {
            return this.uom_;
        },
        set: function (uom) {
            if (this.lock_ === UNLOCKED) {
                // This is the only place where we should check the unit of measure.
                // It also should be the only place where we access the private member.
                this.uom_ = Unit.mustBeUnit('uom', uom);
            }
            else {
                throw new Error(readOnly('uom').message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "x", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_X];
        },
        set: function (x) {
            this.setCoordinate(COORD_X, x, 'x');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "y", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_Y];
        },
        set: function (y) {
            this.setCoordinate(COORD_Y, y, 'y');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * @param M The multivector to be added to this multivector.
     * @param α An optional scale factor that multiplies the multivector argument.
     * @returns this + M * α
     */
    Geometric2.prototype.add = function (M, α) {
        if (α === void 0) { α = 1; }
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().add(M, α));
        }
        else {
            if (this.isZero()) {
                this.a = M.a * α;
                this.x = M.x * α;
                this.y = M.y * α;
                this.b = M.b * α;
                this.uom = M.uom;
                return this;
            }
            else if (isZeroGeometric(M)) {
                // α has no effect because M is zero.
                return this;
            }
            else {
                this.a += M.a * α;
                this.x += M.x * α;
                this.y += M.y * α;
                this.b += M.b * α;
                this.uom = Unit.compatible(this.uom, M.uom);
                return this;
            }
        }
    };
    /**
     * @param v The vector to be added to this multivector.
     * @param α An optional scale factor that multiplies the vector argument.
     * @returns this + v * α
     */
    Geometric2.prototype.addVector = function (v, α) {
        if (α === void 0) { α = 1; }
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVector(v)) {
                // α has no effect because v is zero.
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x += v.x * α;
            this.y += v.y * α;
            return this;
        }
    };
    /**
     * @returns copy(this)
     */
    Geometric2.prototype.clone = function () {
        return Geometric2.copy(this);
    };
    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     *
     * @param M The multivector to be copied.
     */
    Geometric2.prototype.copy = function (M) {
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.b = M.b;
        this.uom = M.uom;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ copy(B)</code>
     * </p>
     *
     * @param B The bivector to be copied.
     */
    Geometric2.prototype.copyBivector = function (B) {
        var b = B.xy;
        this.setCoordinate(COORD_A, 0, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_B, b, 'b');
        this.uom = B.uom;
        return this;
    };
    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     * @param uom The unit of measure.
     */
    Geometric2.prototype.copyScalar = function (α, uom) {
        this.setCoordinate(COORD_A, α, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_B, 0, 'b');
        this.uom = uom;
        return this;
    };
    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    Geometric2.prototype.copyVector = function (vector) {
        var x = vector.x;
        var y = vector.y;
        this.setCoordinate(COORD_A, 0, 'a');
        this.setCoordinate(COORD_X, x, 'x');
        this.setCoordinate(COORD_Y, y, 'y');
        this.setCoordinate(COORD_B, 0, 'b');
        this.uom = vector.uom;
        return this;
    };
    /**
     * @param mutate Must be `true` when calling the `direction` method on an unlocked Geometric3.
     * @returns this / magnitude(this)
     */
    Geometric2.prototype.direction = function (mutate) {
        if (this.lock_ !== UNLOCKED) {
            if (!mutate) {
                return lock(this.clone().direction(true));
            }
            else {
                throw new Error("Unable to mutate this locked Geometric2.");
            }
        }
        else {
            if (mutate) {
                var norm = this.magnitudeSansUnits();
                if (norm !== 0) {
                    this.a = this.a / norm;
                    this.x = this.x / norm;
                    this.y = this.y / norm;
                    this.b = this.b / norm;
                }
                this.uom = void 0;
                return this;
            }
            else {
                return lock(this.clone().direction(true));
            }
        }
    };
    Geometric2.prototype.divByPseudo = function (β, uom) {
        if (this.isMutable()) {
            var a = this.a;
            var x = this.x;
            var y = this.y;
            var b = this.b;
            this.a = b / β;
            this.x = y / β;
            this.y = -x / β;
            this.b = -a / β;
            this.uom = Unit.div(this.uom, uom);
            return this;
        }
        else {
            return lock(this.clone().divByPseudo(β, uom));
        }
    };
    /**
     * <p>
     * <code>this ⟼ this / (α * uom)</code>
     * </p>
     *
     * @param α The scalar dividend.
     * @param uom The unit of measure.
     */
    Geometric2.prototype.divByScalar = function (α, uom) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByScalar(α, uom));
        }
        else {
            this.uom = Unit.div(this.uom, uom);
            this.a /= α;
            this.x /= α;
            this.y /= α;
            this.b /= α;
            return this;
        }
    };
    /**
     * @param m
     * @returns this ^ m
     */
    Geometric2.prototype.ext = function (m) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().ext(m));
        }
        else {
            var a0 = this.a;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.b;
            var b0 = m.a;
            var b1 = m.x;
            var b2 = m.y;
            var b3 = m.b;
            this.a = a0 * b0;
            this.x = a0 * b1 + a1 * b0;
            this.y = a0 * b2 + a2 * b0;
            this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
            this.uom = Unit.mul(this.uom, m.uom);
            return this;
        }
    };
    /**
     * Computes the inverse of this multivector.
     * TODO: Define what inverse means.
     * @returns inverse(this)
     */
    Geometric2.prototype.inv = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().inv());
        }
        else {
            var α = this.a;
            var x = this.x;
            var y = this.y;
            var β = this.b;
            var A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];
            var b = [1, 0, 0, 0];
            var X = gauss(A, b);
            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.b = X[3];
            this.uom = Unit.inv(this.uom);
            return this;
        }
    };
    /**
     * Determines whether this multivector is exactly 0 (zero).
     */
    Geometric2.prototype.isZero = function () {
        // It does not matter what the unit of measure is if all the coordinates are zero.
        return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
    };
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     */
    Geometric2.prototype.magnitude = function (mutate) {
        if (typeof mutate === 'boolean') {
            if (this.isLocked()) {
                if (!mutate) {
                    return lock(this.clone().magnitude(true));
                }
                else {
                    throw new Error("mutate is " + mutate + ", but isMutable() is " + this.isMutable() + ".");
                }
            }
            else {
                if (mutate) {
                    this.a = Math.sqrt(this.squaredNormSansUnits());
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                    // The unit of measure is unchanged.
                    return this;
                }
                else {
                    return lock(this.clone().magnitude(true));
                }
            }
        }
        else {
            return this.magnitude(this.isMutable());
        }
    };
    /**
     * Intentionally undocumented.
     */
    Geometric2.prototype.magnitudeSansUnits = function () {
        return Math.sqrt(this.squaredNormSansUnits());
    };
    /**
     * @param rhs
     * @returns this * m
     */
    Geometric2.prototype.mul = function (rhs) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mul(rhs));
        }
        else {
            return this.mul2(this, rhs);
        }
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric2.prototype.mul2 = function (lhs, rhs) {
        var a0 = lhs.a;
        var a1 = lhs.x;
        var a2 = lhs.y;
        var a3 = lhs.b;
        var b0 = rhs.a;
        var b1 = rhs.x;
        var b2 = rhs.y;
        var b3 = rhs.b;
        this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        this.x = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.y = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    };
    Geometric2.prototype.mulByBivector = function (B) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByBivector(B));
        }
        else {
            this.uom = Unit.mul(this.uom, B.uom);
            var a = this.a;
            var x = this.x;
            var y = this.y;
            var b = this.b;
            var β = B.xy;
            this.a = -b * β;
            this.x = -y * β;
            this.y = +x * β;
            this.b = a * β;
            return this;
        }
    };
    /**
     * @param α
     * @returns this * α
     */
    Geometric2.prototype.mulByNumber = function (α) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByNumber(α));
        }
        else {
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.b *= α;
            // There is no change in the unit of measure.
            return this;
        }
    };
    /**
     * @param α
     * @param uom
     * @returns this * (α * uom)
     */
    Geometric2.prototype.mulByScalar = function (α, uom) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByScalar(α, uom));
        }
        else {
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.b *= α;
            this.uom = Unit.mul(this.uom, uom);
            return this;
        }
    };
    Geometric2.prototype.mulByVector = function (v) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByVector(v));
        }
        else {
            this.uom = Unit.mul(this.uom, v.uom);
            var a0 = this.a;
            var a1 = this.x;
            var a2 = this.y;
            var a4 = this.xy;
            var b1 = v.x;
            var b2 = v.y;
            this.a = a1 * b1 + a2 * b2;
            this.x = a0 * b1 + a4 * b2;
            this.y = a0 * b2 - a4 * b1;
            this.b = a1 * b2 - a2 * b1;
            return this;
        }
    };
    /**
     * @returns this * -1
     */
    Geometric2.prototype.neg = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().neg());
        }
        else {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.b = -this.b;
            // There is no change in the unit of measure.
            return this;
        }
    };
    /**
     * The quaditude of a multivector is defined in terms of the scalar products
     * of its blades.
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    Geometric2.prototype.quaditude = function (mutate) {
        if (this.lock_ !== UNLOCKED) {
            if (!mutate) {
                return lock(this.clone().quaditude(true));
            }
            else {
                throw new Error("Unable to mutate this locked Geometric3.");
            }
        }
        else {
            if (mutate) {
                this.a = this.squaredNormSansUnits();
                this.x = 0;
                this.y = 0;
                this.b = 0;
                this.uom = Unit.mul(this.uom, this.uom);
                return this;
            }
            else {
                return lock(this.clone().quaditude(true));
            }
        }
    };
    /**
     * @returns reverse(this)
     */
    Geometric2.prototype.rev = function () {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rev());
        }
        else {
            // reverse has a ++-- structure on the grades.
            this.a = +this.a;
            this.x = +this.x;
            this.y = +this.y;
            this.b = -this.b;
            // The unit of measure is unchanged.
            return this;
        }
    };
    /**
     * (α + βI)(a + x.e1 + y.e2 + b.I)(α - β.I)
     *
     * @param spinor the spinor that rotates this multivector.
     * @returns R * this * reverse(R)
     */
    Geometric2.prototype.rotate = function (spinor) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rotate(spinor));
        }
        else {
            // We are assuming that R is dimensionless.
            Unit.assertDimensionless(spinor.uom);
            var a = this.a;
            var x = this.x;
            var y = this.y;
            var b = this.b;
            var α = spinor.a;
            var β = spinor.xy;
            var α2 = α * α;
            var β2 = β * β;
            var p = α2 - β2;
            var q = 2 * α * β;
            var s = α2 + β2;
            this.a = s * a;
            this.x = p * x + q * y;
            this.y = p * y - q * x;
            this.b = s * b;
            return this;
        }
    };
    /**
     * @param m
     * @returns this | m
     */
    Geometric2.prototype.scp = function (m) {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().scp(m));
        }
        else {
            return this.scp2(this, m);
        }
    };
    /**
     * <p>
     * <code>this ⟼ scp(a, b) = a | b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric2.prototype.scp2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2 = b.y;
        var b3 = b.b;
        var s = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
        this.a = s;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
    };
    /**
     * Intentionally undocumented
     */
    Geometric2.prototype.squaredNormSansUnits = function () {
        return this.a * this.a + this.x * this.x + this.y * this.y + this.b * this.b;
    };
    /**
     * @param M
     * @param α
     * @returns this - M * α
     */
    Geometric2.prototype.sub = function (M, α) {
        if (α === void 0) { α = 1; }
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().sub(M, α));
        }
        else {
            if (this.isZero()) {
                this.uom = M.uom;
            }
            else if (isZeroGeometric(M)) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, M.uom);
            }
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.b -= M.b * α;
            return this;
        }
    };
    Geometric2.prototype.subScalar = function (a, uom, α) {
        if (α === void 0) { α = 1; }
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().subScalar(a, uom, α));
        }
        else {
            if (this.isZero()) {
                this.uom = uom;
            }
            else {
                this.uom = Unit.compatible(this.uom, uom);
            }
            this.a -= a * α;
            return this;
        }
    };
    /**
     * @param v The vector to subtract from this multivector.
     * @param α The multiplier for the amount of the vector to subtract.
     * @returns this - v * α
     */
    Geometric2.prototype.subVector = function (v, α) {
        if (α === void 0) { α = 1; }
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().subVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVector(v)) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x -= v.x * α;
            this.y -= v.y * α;
            return this;
        }
    };
    /**
     * Returns a string representing the number in exponential notation.
     *
     * @param fractionDigits
     * @returns
     */
    Geometric2.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    /**
     * Returns a string representing the number in fixed-point notation.
     *
     * @param fractionDigits
     * @returns
     */
    Geometric2.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    /**
     * @param precision
     * @returns
     */
    Geometric2.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    /**
     * Returns a string representation of the number.
     *
     * @param radix
     * @returns
     */
    Geometric2.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    Geometric2.prototype.write = function (mv) {
        mv.a = this.a;
        mv.x = this.x;
        mv.y = this.y;
        mv.b = this.b;
        mv.uom = this.uom;
    };
    Geometric2.prototype.writeVector = function (vector) {
        vector.x = this.x;
        vector.y = this.y;
        vector.uom = this.uom;
    };
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    Geometric2.prototype.zero = function () {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        this.uom = void 0;
        return this;
    };
    /**
     * Constructs a Geometric2 representing the number zero.
     * The identity element for addition, <b>0</b>.
     * The returned multivector is locked.
     */
    Geometric2.zero = lock(new Geometric2(zero(), void 0));
    /**
     * Constructs a Geometric2 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     * The returned multivector is locked.
     */
    Geometric2.one = lock(new Geometric2(scalar(1), void 0));
    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     * The returned multivector is locked.
     */
    Geometric2.e1 = lock(new Geometric2(vector(1, 0), void 0));
    /**
     * Constructs a basis vector corresponding to the <code>y</code> coordinate.
     * The returned multivector is locked.
     */
    Geometric2.e2 = lock(new Geometric2(vector(0, 1), void 0));
    /**
     * Constructs a basis vector corresponding to the <code>β</code> coordinate.
     * The returned multivector is locked.
     */
    Geometric2.I = lock(new Geometric2(pseudo(1), void 0));
    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
     */
    Geometric2.meter = lock(new Geometric2(scalar(1), Unit.METER));
    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    Geometric2.kilogram = lock(new Geometric2(scalar(1), Unit.KILOGRAM));
    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    Geometric2.second = lock(new Geometric2(scalar(1), Unit.SECOND));
    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    Geometric2.ampere = lock(new Geometric2(scalar(1), Unit.AMPERE));
    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
     */
    Geometric2.kelvin = lock(new Geometric2(scalar(1), Unit.KELVIN));
    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     *
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    Geometric2.mole = lock(new Geometric2(scalar(1), Unit.MOLE));
    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     */
    Geometric2.candela = lock(new Geometric2(scalar(1), Unit.CANDELA));
    /**
     * SI derived unit of electric charge, quantity of electricity.
     */
    Geometric2.coulomb = lock(new Geometric2(scalar(1), Unit.COULOMB));
    /**
     * SI derived unit of force.
     */
    Geometric2.newton = lock(new Geometric2(scalar(1), Unit.NEWTON));
    /**
     * SI derived unit of energy, work, quantity of heat.
     */
    Geometric2.joule = lock(new Geometric2(scalar(1), Unit.JOULE));
    return Geometric2;
}());
export { Geometric2 };
