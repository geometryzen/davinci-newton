import { __extends } from "tslib";
import { readOnly } from '../i18n/readOnly';
import { AbstractMeasure } from './AbstractMeasure';
import { approx } from './approx';
import { arraysEQ8 } from './arraysEQ';
import { dotVectorE3 as dotVector } from './dotVectorE3';
import extG3 from './extG3';
import { gauss } from './gauss';
import isScalarG3 from './isScalarG3';
import isVectorG3 from './isVectorG3';
import { isZeroGeometricE3 } from './isZeroGeometricE3';
import isZeroVectorE3 from './isZeroVectorE3';
import { lcoG3 } from './lcoG3';
import { maskG3 } from './maskG3';
import { mulE3 } from './mulE3';
import { QQ } from './QQ';
import randomRange from './randomRange';
import rcoG3 from './rcoG3';
import rotorFromDirections from './rotorFromDirectionsE3';
import scpG3 from './scpG3';
import { squaredNormG3 } from './squaredNormG3';
import { stringFromCoordinates } from './stringFromCoordinates';
import { Unit } from './Unit';
import { wedgeXY } from './wedgeXY';
import { wedgeYZ } from './wedgeYZ';
import { wedgeZX } from './wedgeZX';
// Symbolic constants for the coordinate indices into the data array.
/**
 * @hidden
 */
var COORD_SCALAR = 0;
/**
 * @hidden
 */
var COORD_X = 1;
/**
 * @hidden
 */
var COORD_Y = 2;
/**
 * @hidden
 */
var COORD_Z = 3;
/**
 * @hidden
 */
var COORD_XY = 4;
/**
 * @hidden
 */
var COORD_YZ = 5;
/**
 * @hidden
 */
var COORD_ZX = 6;
/**
 * @hidden
 */
var COORD_PSEUDO = 7;
/**
 * @hidden
 */
var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
BASIS_LABELS[COORD_SCALAR] = '1';
BASIS_LABELS[COORD_X] = 'e1';
BASIS_LABELS[COORD_Y] = 'e2';
BASIS_LABELS[COORD_Z] = 'e3';
/**
 * @hidden
 */
var BASIS_LABELS_LaTeX = ["1", "e_{1}", "e_{2}", "e_{3}", "e_{12}", "e_{23}", "e_{31}", "e_{123}"];
BASIS_LABELS_LaTeX[COORD_SCALAR] = '1';
BASIS_LABELS_LaTeX[COORD_X] = 'e_{1}';
BASIS_LABELS_LaTeX[COORD_Y] = 'e_{2}';
BASIS_LABELS_LaTeX[COORD_Z] = 'e_{3}';
/**
 * @hidden
 */
var zero = function zero() {
    return [0, 0, 0, 0, 0, 0, 0, 0];
};
/**
 * @hidden
 */
var scalar = function scalar(a) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    return coords;
};
/**
 * @hidden
 */
var vector = function vector(x, y, z) {
    var coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    return coords;
};
/**
 * @hidden
 */
var bivector = function bivector(yz, zx, xy) {
    var coords = zero();
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};
/**
 * @hidden
 */
var spinor = function spinor(a, yz, zx, xy) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};
/**
 * @hidden
 */
var multivector = function multivector(a, x, y, z, yz, zx, xy, b) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    coords[COORD_PSEUDO] = b;
    return coords;
};
/**
 * @hidden
 */
var pseudo = function pseudo(b) {
    var coords = zero();
    coords[COORD_PSEUDO] = b;
    return coords;
};
/**
 * Coordinates corresponding to basis labels.
 * @hidden
 */
var coordinates = function coordinates(m) {
    var coords = zero();
    coords[COORD_SCALAR] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_Z] = m.z;
    coords[COORD_YZ] = m.yz;
    coords[COORD_ZX] = m.zx;
    coords[COORD_XY] = m.xy;
    coords[COORD_PSEUDO] = m.b;
    return coords;
};
/**
 * Computes the cosine of the angle between two vectors.
 * cos(a, b) = (a | b) / |a||b|
 * This is dimensionless, so we are justified in simply returning a number.
 * @hidden
 */
function cosVectorVector(a, b) {
    function scp(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    function norm(v) {
        return Math.sqrt(scp(v, v));
    }
    return scp(a, b) / (norm(a) * norm(b));
}
/**
 * Sets the lock on the multivector argument and returns the same argument.
 * This is a convenience function for the dunder (double underscore) methods.
 * All dunder methods should return locked values.
 * @hidden
 */
function lock(m) {
    m.lock();
    return m;
}
/**
 * Scratch variable for holding cosines.
 * @hidden
 */
var cosines = [];
/**
 * A mutable and lockable multivector in 3D with a Euclidean metric and optional unit of measure.
 */
var Geometric3 = /** @class */ (function (_super) {
    __extends(Geometric3, _super);
    /**
     * Constructs a mutable instance of Geometric3 from coordinates and an optional unit of measure.
     * @param coords The 8 coordinates are in the order [a, x, y, z, xy, yz, zx, b].
     * @param uom The optional unit of measure.
     */
    function Geometric3(coords, uom) {
        if (coords === void 0) { coords = zero(); }
        var _this = _super.call(this, uom) || this;
        if (coords.length !== 8) {
            throw new Error("coords.length must be 8");
        }
        _this.coords_ = coords;
        return _this;
    }
    /**
     * @hidden
     */
    Geometric3.prototype.__eq__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return this.equals(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.equals(Geometric3.scalar(rhs));
        }
        else if (rhs instanceof Unit) {
            return this.equals(Geometric3.scalar(1, rhs));
        }
        else {
            return false;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__ne__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return !this.equals(rhs);
        }
        else if (typeof rhs === 'number') {
            return !this.equals(Geometric3.scalar(rhs));
        }
        else if (rhs instanceof Unit) {
            return !this.equals(Geometric3.scalar(1, rhs));
        }
        else {
            return true;
        }
    };
    Geometric3.prototype.scale = function (α) {
        return this.mulByNumber(α);
    };
    /**
     * Consistently set a coordinate value in the most optimized way.
     * Permits mutation only when the lock status is UNLOCKED.
     * It is safe to use this as an alternative to the named property accessors.
     */
    Geometric3.prototype.setCoordinate = function (index, newValue, name) {
        if (this.isMutable()) {
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
    Object.defineProperty(Geometric3.prototype, "a", {
        /**
         * The scalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_SCALAR];
        },
        set: function (a) {
            this.setCoordinate(COORD_SCALAR, a, 'a');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "b", {
        /**
         * The pseudoscalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_PSEUDO];
        },
        set: function (b) {
            this.setCoordinate(COORD_PSEUDO, b, 'b');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "grades", {
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
            var α = coords[COORD_SCALAR];
            var x = coords[COORD_X];
            var y = coords[COORD_Y];
            var z = coords[COORD_Z];
            var yz = coords[COORD_YZ];
            var zx = coords[COORD_ZX];
            var xy = coords[COORD_XY];
            var β = coords[COORD_PSEUDO];
            var mask = 0x0;
            if (α !== 0) {
                mask += 0x1;
            }
            if (x !== 0 || y !== 0 || z !== 0) {
                mask += 0x2;
            }
            if (yz !== 0 || zx !== 0 || xy !== 0) {
                mask += 0x4;
            }
            if (β !== 0) {
                mask += 0x8;
            }
            return mask;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "x", {
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
    Object.defineProperty(Geometric3.prototype, "y", {
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
    Object.defineProperty(Geometric3.prototype, "z", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_Z];
        },
        set: function (z) {
            this.setCoordinate(COORD_Z, z, 'z');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "yz", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_YZ];
        },
        set: function (yz) {
            this.setCoordinate(COORD_YZ, yz, 'yz');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "zx", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_ZX];
        },
        set: function (zx) {
            this.setCoordinate(COORD_ZX, zx, 'zx');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "xy", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_XY];
        },
        set: function (xy) {
            this.setCoordinate(COORD_XY, xy, 'xy');
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
    Geometric3.prototype.add = function (M, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().add(M, α));
        }
        else {
            if (this.isZero()) {
                this.a = M.a * α;
                this.x = M.x * α;
                this.y = M.y * α;
                this.z = M.z * α;
                this.yz = M.yz * α;
                this.zx = M.zx * α;
                this.xy = M.xy * α;
                this.b = M.b * α;
                this.uom = M.uom;
                return this;
            }
            else if (isZeroGeometricE3(M)) {
                return this;
            }
            else {
                this.a += M.a * α;
                this.x += M.x * α;
                this.y += M.y * α;
                this.z += M.z * α;
                this.yz += M.yz * α;
                this.zx += M.zx * α;
                this.xy += M.xy * α;
                this.b += M.b * α;
                this.uom = Unit.compatible(this.uom, M.uom);
                return this;
            }
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.add2 = function (a, b) {
        if (isZeroGeometricE3(a)) {
            this.uom = b.uom;
        }
        else if (isZeroGeometricE3(b)) {
            this.uom = a.uom;
        }
        else {
            this.uom = Unit.compatible(a.uom, b.uom);
        }
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.yz = a.yz + b.yz;
        this.zx = a.zx + b.zx;
        this.xy = a.xy + b.xy;
        this.b = a.b + b.b;
        return this;
    };
    /**
     * Adds a pseudoscalar value to this multivector.
     *
     * @param β The pseudoscalar value to be added to this multivector.
     * @param uom The optional unit of measure.
     * @returns this + (Iβ * uom)
     */
    Geometric3.prototype.addPseudo = function (β, uom) {
        if (this.isLocked()) {
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
    /**
     * Adds a scalar value to this multivector.
     *
     * @param α The scalar value to be added to this multivector.
     * @param uom The optional unit of measure.
     * @returns this + (α * uom)
     */
    Geometric3.prototype.addScalar = function (a, uom, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().addScalar(a, uom, α));
        }
        else {
            if (this.isZero()) {
                this.a = a * α;
                this.uom = uom;
                return this;
            }
            else if (a === 0 || α === 0) {
                return this;
            }
            else {
                this.a += a * α;
                this.uom = Unit.compatible(this.uom, uom);
                return this;
            }
        }
    };
    /**
     * @hidden
     * @param v The vector to be added to this multivector.
     * @param α An optional scale factor that multiplies the vector argument.
     * @returns this + v * α
     */
    Geometric3.prototype.addVector = function (v, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().addVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVectorE3(v)) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x += v.x * α;
            this.y += v.y * α;
            this.z += v.z * α;
            return this;
        }
    };
    /**
     * @hidden
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this column vector.
     */
    Geometric3.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var yz = this.yz;
        var zx = this.zx;
        var xy = this.xy;
        var n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1), n13 = σ.getElement(0, 2);
        var n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1), n23 = σ.getElement(1, 2);
        var n31 = σ.getElement(2, 0), n32 = σ.getElement(2, 1), n33 = σ.getElement(2, 2);
        this.x = n11 * x + n12 * y + n13 * z;
        this.y = n21 * x + n22 * y + n23 * z;
        this.z = n31 * x + n32 * y + n33 * z;
        this.yz = n11 * yz + n12 * zx + n13 * xy;
        this.zx = n21 * yz + n22 * zx + n23 * xy;
        this.xy = n31 * yz + n32 * zx + n33 * xy;
        this.uom = Unit.mul(this.uom, σ.uom);
        return this;
    };
    /**
     * @hidden
     */
    Geometric3.prototype.approx = function (n) {
        if (this.isLocked()) {
            return lock(this.clone().approx(n));
        }
        else {
            approx(this.coords_, n);
            return this;
        }
    };
    /**
     * @returns copy(this)
     */
    Geometric3.prototype.clone = function () {
        return Geometric3.copy(this);
    };
    /**
     * Clifford conjugation
     */
    Geometric3.prototype.conj = function () {
        if (this.isLocked()) {
            return lock(this.clone().conj());
        }
        else {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     *
     * @param M The multivector to be copied.
     */
    Geometric3.prototype.copy = function (M) {
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.z = M.z;
        this.yz = M.yz;
        this.zx = M.zx;
        this.xy = M.xy;
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
    Geometric3.prototype.copyBivector = function (B) {
        this.setCoordinate(COORD_SCALAR, 0, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_Z, 0, 'z');
        this.setCoordinate(COORD_YZ, B.yz, 'yz');
        this.setCoordinate(COORD_ZX, B.zx, 'zx');
        this.setCoordinate(COORD_XY, B.xy, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
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
    Geometric3.prototype.copyScalar = function (α, uom) {
        this.setCoordinate(COORD_SCALAR, α, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_Z, 0, 'z');
        this.setCoordinate(COORD_YZ, 0, 'yz');
        this.setCoordinate(COORD_ZX, 0, 'zx');
        this.setCoordinate(COORD_XY, 0, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        this.uom = uom;
        return this;
    };
    /**
     * Copies the spinor argument value into this multivector.
     * The non-spinor components are set to zero.
     *
     * @param spinor The spinor to be copied.
     */
    Geometric3.prototype.copySpinor = function (spinor) {
        this.setCoordinate(COORD_SCALAR, spinor.a, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_Z, 0, 'z');
        this.setCoordinate(COORD_YZ, spinor.yz, 'yz');
        this.setCoordinate(COORD_ZX, spinor.zx, 'zx');
        this.setCoordinate(COORD_XY, spinor.xy, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        this.uom = spinor.uom;
        return this;
    };
    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    Geometric3.prototype.copyVector = function (vector) {
        this.setCoordinate(COORD_SCALAR, 0, 'a');
        this.setCoordinate(COORD_X, vector.x, 'x');
        this.setCoordinate(COORD_Y, vector.y, 'y');
        this.setCoordinate(COORD_Z, vector.z, 'z');
        this.setCoordinate(COORD_YZ, 0, 'yz');
        this.setCoordinate(COORD_ZX, 0, 'zx');
        this.setCoordinate(COORD_XY, 0, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        this.uom = vector.uom;
        return this;
    };
    /**
     * Sets this multivector to the generalized vector cross product with another multivector.
     *
     * @returns -I * (this ^ m)
     */
    Geometric3.prototype.cross = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().cross(m));
        }
        else {
            return this.ext(m).dual();
        }
    };
    /**
     * @returns this / magnitude(this)
     */
    Geometric3.prototype.direction = function () {
        if (this.isMutable()) {
            var norm = this.magnitudeNoUnits();
            if (norm !== 0) {
                this.a = this.a / norm;
                this.x = this.x / norm;
                this.y = this.y / norm;
                this.z = this.z / norm;
                this.yz = this.yz / norm;
                this.zx = this.zx / norm;
                this.xy = this.xy / norm;
                this.b = this.b / norm;
            }
            this.uom = void 0;
            return this;
        }
        else {
            return lock(this.clone().direction());
        }
    };
    /**
     * @param m The multivector dividend.
     * @returns this / m;
     */
    Geometric3.prototype.div = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().div(m));
        }
        else {
            if (isScalarG3(m)) {
                this.divByScalar(m.a, m.uom);
                return this;
            }
            else if (isVectorG3(m)) {
                return this.divByVector(m);
            }
            else {
                this.uom = Unit.div(this.uom, m.uom);
                var α = m.a;
                var x = m.x;
                var y = m.y;
                var z = m.z;
                var xy = m.xy;
                var yz = m.yz;
                var zx = m.zx;
                var β = m.b;
                var A = [
                    [α, x, y, z, -xy, -yz, -zx, -β],
                    [x, α, xy, -zx, -y, -β, z, -yz],
                    [y, -xy, α, yz, x, -z, -β, -zx],
                    [z, zx, -yz, α, -β, y, -x, -xy],
                    [xy, -y, x, β, α, zx, -yz, z],
                    [yz, β, -z, y, -zx, α, xy, x],
                    [zx, z, β, -x, yz, -xy, α, y],
                    [β, yz, zx, xy, z, x, y, α]
                ];
                var b = [1, 0, 0, 0, 0, 0, 0, 0];
                var X = gauss(A, b);
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.b;
                var b0 = X[0];
                var b1 = X[1];
                var b2 = X[2];
                var b3 = X[3];
                var b4 = X[4];
                var b5 = X[5];
                var b6 = X[6];
                var b7 = X[7];
                var c0 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                var c1 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                var c2 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                var c3 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                var c4 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                var c5 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                var c6 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                var c7 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
                this.a = c0;
                this.x = c1;
                this.y = c2;
                this.z = c3;
                this.xy = c4;
                this.yz = c5;
                this.zx = c6;
                this.b = c7;
            }
            return this;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.divByNumber = function (α) {
        if (this.isLocked()) {
            return lock(this.clone().divByNumber(α));
        }
        else {
            this.a /= α;
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.b /= α;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ this / (a * uom)</code>
     * </p>
     *
     * @param a The scalar dividend.
     * @param uom The unit of measure.
     */
    Geometric3.prototype.divByScalar = function (a, uom) {
        if (this.isLocked()) {
            return lock(this.clone().divByScalar(a, uom));
        }
        else {
            this.uom = Unit.div(this.uom, uom);
            this.a /= a;
            this.x /= a;
            this.y /= a;
            this.z /= a;
            this.yz /= a;
            this.zx /= a;
            this.xy /= a;
            this.b /= a;
            return this;
        }
    };
    Geometric3.prototype.divByVector = function (v) {
        if (this.isLocked()) {
            return lock(this.clone().divByVector(v));
        }
        else {
            var x = v.x;
            var y = v.y;
            var z = v.z;
            return this.mulByVector(v).divByScalar(x * x + y * y + z * z, Unit.pow(v.uom, QQ.valueOf(2, 1)));
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.div2 = function (a, b) {
        this.uom = Unit.div(a.uom, b.uom);
        // FIXME: Generalize
        var a0 = a.a;
        var a1 = a.yz;
        var a2 = a.zx;
        var a3 = a.xy;
        var b0 = b.a;
        var b1 = b.yz;
        var b2 = b.zx;
        var b3 = b.xy;
        // Compare this to the product for Quaternions
        // It would be interesting to DRY this out.
        this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        // this.a = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    };
    /**
     * dualization: dual(Ak) = Ak << inv(I)
     *
     * In an n-dimensional Euclidean space, the inverse is the reverse.
     */
    Geometric3.prototype.dual = function () {
        if (this.isLocked()) {
            return this.clone().dual().permlock();
        }
        else {
            var a = this.b;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var yz = -this.x;
            var zx = -this.y;
            var xy = -this.z;
            var b = -this.a;
            this.a = a;
            this.x = x;
            this.y = y;
            this.z = z;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            this.b = b;
            return this;
        }
    };
    /**
     * @param other
     * @returns
     */
    Geometric3.prototype.equals = function (other) {
        if (other === this) {
            return true;
        }
        else if (other instanceof Geometric3) {
            return arraysEQ8(this.coords_, other.coords_) && Unit.isCompatible(this.uom, other.uom);
        }
        else {
            return false;
        }
    };
    /**
     * Computes the inverse of this multivector.
     * @returns inverse(this)
     */
    Geometric3.prototype.inv = function () {
        if (this.isLocked()) {
            return lock(this.clone().inv());
        }
        else {
            var x0 = this.a;
            var x1 = this.x;
            var x2 = this.y;
            var x3 = this.z;
            var x4 = this.xy;
            var x5 = this.yz;
            var x6 = this.zx;
            var x7 = this.b;
            var A = [
                [+x0, +x1, +x2, +x3, -x4, -x5, -x6, -x7],
                [+x1, +x0, -x4, +x6, +x2, -x7, -x3, -x5],
                [+x2, +x4, +x0, -x5, -x1, +x3, -x7, -x6],
                [+x3, -x6, +x5, +x0, -x7, -x2, +x1, -x4],
                [+x4, +x2, -x1, +x7, +x0, -x6, +x5, +x3],
                [+x5, +x7, +x3, -x2, +x6, +x0, -x4, +x1],
                [+x6, -x3, +x7, +x1, -x5, +x4, +x0, +x2],
                [+x7, +x5, +x6, +x4, +x3, +x1, +x2, +x0]
            ];
            var b = [1, 0, 0, 0, 0, 0, 0, 0];
            var X = gauss(A, b);
            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.z = X[3];
            this.xy = X[4];
            this.yz = X[5];
            this.zx = X[6];
            this.b = X[7];
            this.uom = Unit.inv(this.uom);
            return this;
        }
    };
    Geometric3.prototype.isBivector = function () {
        return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.b === 0;
    };
    /**
     * Determines whether this multivector is exactly 1 (one).
     */
    Geometric3.prototype.isOne = function () {
        if (Unit.isOne(this.uom)) {
            return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
        }
        else {
            return false;
        }
    };
    Geometric3.prototype.isScalar = function () {
        return this.x === 0 && this.y === 0 && this.z === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0 && this.b === 0;
    };
    Geometric3.prototype.isSpinor = function () {
        if (Unit.isOne(this.uom)) {
            return this.x === 0 && this.y === 0 && this.z === 0 && this.b === 0;
        }
        else {
            return false;
        }
    };
    Geometric3.prototype.isVector = function () {
        return this.a === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0 && this.b === 0;
    };
    /**
     * Determines whether this multivector is exactly 0 (zero).
     */
    Geometric3.prototype.isZero = function () {
        // It does not matter what the unit of measure is if all the coordinates are zero.
        return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    };
    /**
     * @param m
     * @returns this << m
     */
    Geometric3.prototype.lco = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().lco(m));
        }
        else {
            return this.lco2(this, m);
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.lco2 = function (a, b) {
        return lcoG3(a, b, this);
    };
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     */
    Geometric3.prototype.magnitude = function () {
        if (this.isMutable()) {
            this.a = Math.sqrt(this.quaditudeNoUnits());
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.xy = 0;
            this.yz = 0;
            this.zx = 0;
            this.b = 0;
            // The unit of measure is unchanged.
            return this;
        }
        else {
            return lock(this.clone().magnitude());
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.magnitudeNoUnits = function () {
        return Math.sqrt(this.quaditudeNoUnits());
    };
    /**
     * Returns the geometric product of this multivector with the rhs multivector.
     * @param rhs The operand on the right hand side of the * operator.
     * @return this * rhs
     */
    Geometric3.prototype.mul = function (rhs) {
        if (this.isLocked()) {
            return lock(this.clone().mul(rhs));
        }
        else {
            return this.mul2(this, rhs);
        }
    };
    Geometric3.prototype.mulByBivector = function (B) {
        if (this.isLocked()) {
            return lock(this.clone().mulByBivector(B));
        }
        else {
            this.uom = Unit.mul(this.uom, B.uom);
            var a0 = this.a;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.z;
            var a4 = this.xy;
            var a5 = this.yz;
            var a6 = this.zx;
            var a7 = this.b;
            var b4 = B.xy;
            var b5 = B.yz;
            var b6 = B.zx;
            this.a = -a4 * b4 - a5 * b5 - a6 * b6;
            this.x = -a2 * b4 + a3 * b6 - a7 * b5;
            this.y = +a1 * b4 - a3 * b5 - a7 * b6;
            this.z = -a1 * b6 + a2 * b5 - a7 * b4;
            this.xy = a0 * b4 - a5 * b6 + a6 * b5;
            this.yz = a0 * b5 + a4 * b6 - a6 * b4;
            this.zx = a0 * b6 - a4 * b5 + a5 * b4;
            this.b = +a1 * b5 + a2 * b6 + a3 * b4;
            return this;
        }
    };
    Geometric3.prototype.mulByVector = function (v) {
        if (this.isLocked()) {
            return lock(this.clone().mulByVector(v));
        }
        else {
            this.uom = Unit.mul(this.uom, v.uom);
            var a0 = this.a;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.z;
            var a4 = this.xy;
            var a5 = this.yz;
            var a6 = this.zx;
            var a7 = this.b;
            var b1 = v.x;
            var b2 = v.y;
            var b3 = v.z;
            this.a = a1 * b1 + a2 * b2 + a3 * b3;
            this.x = a0 * b1 + a4 * b2 - a6 * b3;
            this.y = a0 * b2 - a4 * b1 + a5 * b3;
            this.z = a0 * b3 - a5 * b2 + a6 * b1;
            this.xy = a1 * b2 - a2 * b1 + a7 * b3;
            this.yz = a2 * b3 - a3 * b2 + a7 * b1;
            this.zx = -a1 * b3 + a3 * b1 + a7 * b2;
            this.b = a4 * b3 + a5 * b1 + a6 * b2;
            return this;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.mul2 = function (a, b) {
        if (this.isLocked()) {
            throw new Error("TODO");
        }
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.z;
        var a4 = a.xy;
        var a5 = a.yz;
        var a6 = a.zx;
        var a7 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2 = b.y;
        var b3 = b.z;
        var b4 = b.xy;
        var b5 = b.yz;
        var b6 = b.zx;
        var b7 = b.b;
        this.a = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        this.x = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        this.y = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        this.z = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        this.xy = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        this.yz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        this.zx = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        this.b = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
    };
    /**
     * @returns this * -1
     */
    Geometric3.prototype.neg = function () {
        if (this.isLocked()) {
            return lock(this.clone().neg());
        }
        else {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            // There is no change in the unit of measure.
            return this;
        }
    };
    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     */
    Geometric3.prototype.one = function () {
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        this.b = 0;
        this.uom = void 0;
        return this;
    };
    /**
     * @hidden
     * The quaditude of a multivector is defined in terms of the scalar products
     * of its blades.
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    Geometric3.prototype.quaditude = function () {
        if (this.isMutable()) {
            this.a = this.quaditudeNoUnits();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            this.uom = Unit.mul(this.uom, this.uom);
            return this;
        }
        else {
            return lock(this.clone().quaditude());
        }
    };
    /**
     * @param m
     * @returns this >> m
     */
    Geometric3.prototype.rco = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().rco(m));
        }
        else {
            return this.rco2(this, m);
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.rco2 = function (a, b) {
        return rcoG3(a, b, this);
    };
    /**
     * Computes the <em>squared norm</em> of this multivector.
     *
     * This is an alias for the `quaditude` method.
     */
    Geometric3.prototype.squaredNorm = function () {
        return this.quaditude();
    };
    /**
     * @hidden
     */
    Geometric3.prototype.quaditudeNoUnits = function () {
        return squaredNormG3(this);
    };
    /**
     * Sets this multivector to its reflection in the plane orthogonal to vector n.
     *
     * Mathematically,
     *
     * this ⟼ - n * this * n
     *
     * Geometrically,
     *
     * Reflects this multivector in the plane orthogonal to the unit vector, n.
     *
     * If n is not a unit vector then the result is scaled by n squared.
     *
     * @param n The unit vector that defines the reflection plane.
     */
    Geometric3.prototype.reflect = function (n) {
        if (this.isLocked()) {
            return lock(this.clone().reflect(n));
        }
        else {
            // We are assuming that n is dimensionless, so that our unit of measure does not change.
            Unit.assertDimensionless(n.uom);
            var n1 = n.x;
            var n2 = n.y;
            var n3 = n.z;
            var n11 = n1 * n1;
            var n22 = n2 * n2;
            var n33 = n3 * n3;
            var nn = n11 + n22 + n33;
            var f1 = 2 * n2 * n3;
            var f2 = 2 * n3 * n1;
            var f3 = 2 * n1 * n2;
            var t1 = n22 + n33 - n11;
            var t2 = n33 + n11 - n22;
            var t3 = n11 + n22 - n33;
            var cs = this.coords_;
            var a = cs[COORD_SCALAR];
            var x1 = cs[COORD_X];
            var x2 = cs[COORD_Y];
            var x3 = cs[COORD_Z];
            var B3 = cs[COORD_XY];
            var B1 = cs[COORD_YZ];
            var B2 = cs[COORD_ZX];
            var b = cs[COORD_PSEUDO];
            this.setCoordinate(COORD_SCALAR, -nn * a, 'a');
            this.setCoordinate(COORD_X, x1 * t1 - x2 * f3 - x3 * f2, 'x');
            this.setCoordinate(COORD_Y, x2 * t2 - x3 * f1 - x1 * f3, 'y');
            this.setCoordinate(COORD_Z, x3 * t3 - x1 * f2 - x2 * f1, 'z');
            this.setCoordinate(COORD_XY, B3 * t3 - B1 * f2 - B2 * f1, 'xy');
            this.setCoordinate(COORD_YZ, B1 * t1 - B2 * f3 - B3 * f2, 'yz');
            this.setCoordinate(COORD_ZX, B2 * t2 - B3 * f1 - B1 * f3, 'zx');
            this.setCoordinate(COORD_PSEUDO, -nn * b, 'b');
            return this;
        }
    };
    /**
     * @returns reverse(this)
     */
    Geometric3.prototype.rev = function () {
        if (this.isLocked()) {
            return lock(this.clone().rev());
        }
        else {
            // reverse has a ++-- structure on the grades.
            this.a = +this.a;
            this.x = +this.x;
            this.y = +this.y;
            this.z = +this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            // The unit of measure is unchanged.
            return this;
        }
    };
    /**
     * @param R the spinor that rotates this multivector.
     * @returns R * this * reverse(R)
     */
    Geometric3.prototype.rotate = function (R) {
        if (this.isLocked()) {
            return lock(this.clone().rotate(R));
        }
        else {
            // We are assuming that R is dimensionless.
            Unit.assertDimensionless(R.uom);
            // FIXME: This only rotates the vector components.
            if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
                return this;
            }
            else {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var yz = this.yz;
                var zx = this.zx;
                var xy = this.xy;
                var Rxy = R.xy;
                var Ryz = R.yz;
                var Rzx = R.zx;
                var Ra = R.a;
                var ix = Ra * x - Rzx * z + Rxy * y;
                var iy = Ra * y - Rxy * x + Ryz * z;
                var iz = Ra * z - Ryz * y + Rzx * x;
                var iα = Ryz * x + Rzx * y + Rxy * z;
                var Syz = Ra * yz - Rzx * xy + Rxy * zx;
                var Szx = Ra * zx - Rxy * yz + Ryz * xy;
                var Sxy = Ra * xy - Ryz * zx + Rzx * yz;
                var Sa = Ryz * yz + Rzx * zx + Rxy * xy;
                this.x = ix * Ra + iα * Ryz + iy * Rxy - iz * Rzx;
                this.y = iy * Ra + iα * Rzx + iz * Ryz - ix * Rxy;
                this.z = iz * Ra + iα * Rxy + ix * Rzx - iy * Ryz;
                this.yz = Syz * Ra + Sa * Ryz + Szx * Rxy - Sxy * Rzx;
                this.zx = Szx * Ra + Sa * Rzx + Sxy * Ryz - Syz * Rxy;
                this.xy = Sxy * Ra + Sa * Rxy + Syz * Rzx - Szx * Ryz;
                return this;
            }
        }
    };
    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
     *
     * @param axis The (unit) vector defining the rotation aspect and orientation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    Geometric3.prototype.rotorFromAxisAngle = function (axis, θ) {
        Unit.assertDimensionless(axis.uom);
        // Compute the dual of the axis to obtain the corresponding bivector.
        var x = axis.x;
        var y = axis.y;
        var z = axis.z;
        var squaredNorm = x * x + y * y + z * z;
        if (squaredNorm === 1) {
            return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z, uom: void 0 }, θ);
        }
        else {
            var norm = Math.sqrt(squaredNorm);
            var yz = x / norm;
            var zx = y / norm;
            var xy = z / norm;
            return this.rotorFromGeneratorAngle({ yz: yz, zx: zx, xy: xy, uom: void 0 }, θ);
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
    Geometric3.prototype.rotorFromDirections = function (a, b) {
        var B = void 0;
        return this.rotorFromVectorToVector(a, b, B);
    };
    /**
     * Helper function for rotorFromFrameToFrame.
     */
    Geometric3.prototype.rotorFromTwoVectors = function (e1, f1, e2, f2) {
        // FIXME: This creates a lot of temporary objects.
        // Compute the rotor that takes e1 to f1.
        // There is no concern that the two vectors are anti-parallel.
        var R1 = Geometric3.rotorFromDirections(e1, f1);
        // Compute the image of e2 under the first rotation in order to calculate R2.
        var f = Geometric3.fromVector(e2).rotate(R1);
        // In case of rotation for antipodal vectors, define the fallback rotation bivector.
        var B = Geometric3.dualOfVector(f1);
        // Compute R2
        var R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
        // The total rotor, R, is the composition of R1 followed by R2.
        return this.mul2(R2, R1);
    };
    /**
     *
     */
    Geometric3.prototype.rotorFromFrameToFrame = function (es, fs) {
        // There is instability when the rotation angle is near 180 degrees.
        // So we don't use the lovely formula based upon reciprocal frames.
        // Our algorithm is to first pick the vector that stays most aligned with itself.
        // This allows for the possibility that the other two vectors may become anti-aligned.
        // Observe that all three vectors can't be anti-aligned because that would be a reflection!
        // We then compute the rotor R1 that maps this first vector to its image.
        // Allowing then for the possibility that the remaining vectors may have ambiguous rotors,
        // we compute the dual of this image vector as the default rotation plane for one of the
        // other vectors. We only need to calculate the rotor R2 for one more vector because our
        // frames are orthogonal and so R1 and R2 determine R.
        //
        var biggestValue = -1;
        var firstVector;
        for (var i = 0; i < 3; i++) {
            cosines[i] = cosVectorVector(es[i], fs[i]);
            if (cosines[i] > biggestValue) {
                firstVector = i;
                biggestValue = cosines[i];
            }
        }
        var secondVector = (firstVector + 1) % 3;
        return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
    };
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
        Unit.assertDimensionless(B.uom);
        var φ = θ / 2;
        var yz = B.yz;
        var zx = B.zx;
        var xy = B.xy;
        var absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
        var mφ = absB * φ;
        var sinDivAbsB = Math.sin(mφ) / absB;
        this.a = Math.cos(mφ);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = -yz * sinDivAbsB;
        this.zx = -zx * sinDivAbsB;
        this.xy = -xy * sinDivAbsB;
        this.b = 0;
        return this;
    };
    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     */
    Geometric3.prototype.rotorFromVectorToVector = function (a, b, B) {
        rotorFromDirections(a, b, B, this);
        return this;
    };
    /**
     * @param m
     * @returns this | m
     */
    Geometric3.prototype.scp = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().scp(m));
        }
        else {
            return this.scp2(this, m);
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.scp2 = function (a, b) {
        return scpG3(a, b, this);
    };
    /**
     * Currently limited to taking the square root of a positive scalar quantity.
     */
    Geometric3.prototype.sqrt = function () {
        if (this.isLocked()) {
            return lock(this.clone().sqrt());
        }
        else {
            this.a = Math.sqrt(this.a);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            this.uom = Unit.sqrt(this.uom);
            return this;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.mulByNumber = function (α) {
        if (this.isLocked()) {
            return lock(this.clone().mulByNumber(α));
        }
        else {
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
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
    Geometric3.prototype.mulByScalar = function (α, uom) {
        if (this.isLocked()) {
            return lock(this.clone().mulByScalar(α, uom));
        }
        else {
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.b *= α;
            this.uom = Unit.mul(this.uom, uom);
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     *
     * @param a
     * @param b
     */
    Geometric3.prototype.versor = function (a, b) {
        this.uom = Unit.mul(a.uom, b.uom);
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        this.zero();
        this.a = dotVector(a, b);
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    Geometric3.prototype.write = function (mv) {
        mv.a = this.a;
        mv.x = this.x;
        mv.y = this.y;
        mv.z = this.z;
        mv.xy = this.xy;
        mv.yz = this.yz;
        mv.zx = this.zx;
        mv.b = this.b;
        mv.uom = this.uom;
    };
    Geometric3.prototype.writeVector = function (v) {
        v.x = this.x;
        v.y = this.y;
        v.z = this.z;
        v.uom = this.uom;
    };
    Geometric3.prototype.writeBivector = function (B) {
        B.xy = this.xy;
        B.yz = this.yz;
        B.zx = this.zx;
        B.uom = this.uom;
    };
    /**
     * @param M
     * @param α
     * @returns this - M * α
     */
    Geometric3.prototype.sub = function (M, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().sub(M, α));
        }
        else {
            if (this.isZero()) {
                this.uom = M.uom;
            }
            else if (isZeroGeometricE3(M)) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, M.uom);
            }
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.b -= M.b * α;
            return this;
        }
    };
    /**
     * Subtracts a multiple of a scalar from this multivector.
     * @param a The scalar value to be subtracted from this multivector.
     * @param uom The optional unit of measure.
     * @param α The fraction of (a * uom) to be subtracted. Default is 1.
     * @returns this - (a * uom) * α
     */
    Geometric3.prototype.subScalar = function (a, uom, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().subScalar(a, uom, α));
        }
        else {
            if (this.isZero()) {
                this.a = -a * α;
                this.uom = uom;
                return this;
            }
            else if (a === 0 || α === 0) {
                return this;
            }
            else {
                this.a -= a * α;
                this.uom = Unit.compatible(this.uom, uom);
                return this;
            }
        }
    };
    /**
     * @hidden
     * @param v The vector to subtract from this multivector.
     * @param α The multiplier for the amount of the vector to subtract.
     * @returns this - v * α
     */
    Geometric3.prototype.subVector = function (v, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().subVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVectorE3(v)) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.sub2 = function (a, b) {
        if (isZeroGeometricE3(a)) {
            this.a = -b.a;
            this.x = -b.x;
            this.y = -b.y;
            this.z = -b.z;
            this.yz = -b.yz;
            this.zx = -b.zx;
            this.xy = -b.xy;
            this.b = -b.b;
            this.uom = b.uom;
        }
        else if (isZeroGeometricE3(b)) {
            this.a = a.a;
            this.x = a.x;
            this.y = a.y;
            this.z = a.z;
            this.yz = a.yz;
            this.zx = a.zx;
            this.xy = a.xy;
            this.b = a.b;
            this.uom = a.uom;
        }
        else {
            this.a = a.a - b.a;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.b = a.b - b.b;
            this.uom = Unit.compatible(a.uom, b.uom);
        }
        return this;
    };
    /**
     * Returns a string representing the number in exponential notation.
     *
     * @param fractionDigits
     * @returns
     */
    Geometric3.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    /**
     * Returns a string representing the number in fixed-point notation.
     *
     * @param fractionDigits
     * @returns
     */
    Geometric3.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    Geometric3.prototype.toLaTeX = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS_LaTeX, this.uom);
    };
    /**
     * @param precision
     * @returns
     */
    Geometric3.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    /**
     * Returns a string representation of the number.
     *
     * @param radix
     * @returns
     */
    Geometric3.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    };
    /**
     * Sets this multivector to the result of keeping only the specified grade.
     * This is the grade extraction operation.
     *
     * @param n the grade to be retained.
     * @returns grade(this, n)
     */
    Geometric3.prototype.grade = function (n) {
        if (this.isLocked()) {
            return lock(this.clone().grade(n));
        }
        else {
            // There is no change to the unit of measure.
            switch (n) {
                case 0: {
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
                    break;
                }
                case 1: {
                    this.a = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
                    break;
                }
                case 2: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.b = 0;
                    break;
                }
                case 3: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    break;
                }
                default: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
                }
            }
            return this;
        }
    };
    /**
     * @param m
     * @return this ^ m
     */
    Geometric3.prototype.ext = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().ext(m));
        }
        else {
            return this.ext2(this, m);
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.ext2 = function (a, b) {
        return extG3(a, b, this);
    };
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    Geometric3.prototype.zero = function () {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        this.b = 0;
        // The unit of measure does not matter if all the coordinates are zero.
        return this;
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__add__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(this.clone().add(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().addScalar(rhs));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().addScalar(1, rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__div__ = function (rhs) {
        var duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().div(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs, void 0).div(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__mul__ = function (rhs) {
        var duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().mul(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).add(this));
        }
        else if (lhs instanceof Unit) {
            return Geometric3.scalar(1, lhs).add(this).permlock();
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__sub__ = function (rhs) {
        var duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().sub(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__tilde__ = function () {
        return lock(Geometric3.copy(this).rev());
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__wedge__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return lock(Geometric3.copy(this).mulByNumber(rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rwedge__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return lock(Geometric3.copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__lshift__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rlshift__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rshift__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rrshift__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__vbar__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__rvbar__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__bang__ = function () {
        return lock(Geometric3.copy(this).inv());
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__pos__ = function () {
        return lock(Geometric3.copy(this));
    };
    /**
     * @hidden
     */
    Geometric3.prototype.__neg__ = function () {
        return lock(Geometric3.copy(this).neg());
    };
    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     * The bivector returned is in the unlocked (mutable) state.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric3.bivector = function (yz, zx, xy, uom) {
        return Geometric3.spinor(0, yz, zx, xy, uom);
    };
    /**
     * @param mv The multivector to be copied.
     */
    Geometric3.copy = function (mv) {
        return new Geometric3(coordinates(mv), mv.uom);
    };
    Geometric3.dual = function (m) {
        return Geometric3.copy(m).dual();
    };
    Geometric3.dualOfBivector = function (B) {
        return new Geometric3(vector(-B.yz, -B.zx, -B.xy), B.uom);
    };
    Geometric3.dualOfVector = function (v) {
        return new Geometric3(bivector(v.x, v.y, v.z), v.uom);
    };
    Geometric3.fromBivector = function (B) {
        return new Geometric3(bivector(B.yz, B.zx, B.xy), B.uom);
    };
    /**
     * @param alpha
     */
    Geometric3.fromScalar = function (alpha) {
        return new Geometric3(scalar(alpha.a), alpha.uom);
    };
    /**
     * @param s
     */
    Geometric3.fromSpinor = function (R) {
        return new Geometric3(spinor(R.a, R.yz, R.zx, R.xy), R.uom);
    };
    /**
     * @param v
     * @returns
     */
    Geometric3.fromVector = function (v) {
        return new Geometric3(vector(v.x, v.y, v.z), v.uom);
    };
    Geometric3.pseudo = function (b, uom) {
        return new Geometric3(pseudo(b), uom);
    };
    /**
     * <p>
     * Computes a multivector with random components.
     * </p>
     */
    Geometric3.random = function () {
        var lowerBound = -1;
        var upperBound = +1;
        var a = randomRange(lowerBound, upperBound);
        var x = randomRange(lowerBound, upperBound);
        var y = randomRange(lowerBound, upperBound);
        var z = randomRange(lowerBound, upperBound);
        var yz = randomRange(lowerBound, upperBound);
        var zx = randomRange(lowerBound, upperBound);
        var xy = randomRange(lowerBound, upperBound);
        var b = randomRange(lowerBound, upperBound);
        return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b), void 0);
    };
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     *
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    Geometric3.rotorFromDirections = function (a, b) {
        return new Geometric3(zero(), void 0).rotorFromDirections(a, b);
    };
    Geometric3.rotorFromFrameToFrame = function (es, fs) {
        return new Geometric3(zero(), void 0).rotorFromFrameToFrame(es, fs);
    };
    Geometric3.rotorFromVectorToVector = function (a, b, B) {
        return new Geometric3(zero(), void 0).rotorFromVectorToVector(a, b, B);
    };
    /**
     * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric3.scalar = function (a, uom) {
        return new Geometric3(scalar(a), uom);
    };
    /**
     * Creates a spinor valued multivector from the specified cartesian coordinates.
     * The spinor returned is in the unlocked (mutable) state.
     * @param a The scalar coordinate.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric3.spinor = function (a, yz, zx, xy, uom) {
        return new Geometric3(spinor(a, yz, zx, xy), uom);
    };
    /**
     * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
     * @param x The coordinate corresponding to the e1 basis vector.
     * @param y The coordinate corresponding to the e2 basis vector.
     * @param z The coordinate corresponding to the e3 basis vector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    Geometric3.vector = function (x, y, z, uom) {
        return new Geometric3(vector(x, y, z), uom);
    };
    /**
     * @param a
     * @param b
     */
    Geometric3.wedge = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var yz = wedgeYZ(ax, ay, az, bx, by, bz);
        var zx = wedgeZX(ax, ay, az, bx, by, bz);
        var xy = wedgeXY(ax, ay, az, bx, by, bz);
        return Geometric3.spinor(0, yz, zx, xy, Unit.mul(a.uom, b.uom));
    };
    /**
     * Constructs a Geometric3 representing the number zero.
     * The identity element for addition, <b>0</b>.
     * The returned multivector is locked.
     */
    Geometric3.zero = lock(new Geometric3(zero(), void 0));
    /**
     * Constructs a Geometric3 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     * The returned multivector is locked.
     */
    Geometric3.one = lock(new Geometric3(scalar(1), void 0));
    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     * The returned multivector is locked.
     */
    Geometric3.e1 = lock(new Geometric3(vector(1, 0, 0), void 0));
    /**
     * Constructs a basis vector corresponding to the <code>y</code> coordinate.
     * The returned multivector is locked.
     */
    Geometric3.e2 = lock(new Geometric3(vector(0, 1, 0), void 0));
    /**
     * Constructs a basis vector corresponding to the <code>z</code> coordinate.
     * The returned multivector is locked.
     */
    Geometric3.e3 = lock(new Geometric3(vector(0, 0, 1), void 0));
    /**
     * Constructs a basis vector corresponding to the <code>β</code> coordinate.
     * The returned multivector is locked.
     */
    Geometric3.I = lock(new Geometric3(pseudo(1), void 0));
    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
     */
    Geometric3.meter = lock(new Geometric3(scalar(1), Unit.METER));
    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    Geometric3.kilogram = lock(new Geometric3(scalar(1), Unit.KILOGRAM));
    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    Geometric3.second = lock(new Geometric3(scalar(1), Unit.SECOND));
    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    Geometric3.ampere = lock(new Geometric3(scalar(1), Unit.AMPERE));
    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
     */
    Geometric3.kelvin = lock(new Geometric3(scalar(1), Unit.KELVIN));
    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     *
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    Geometric3.mole = lock(new Geometric3(scalar(1), Unit.MOLE));
    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     */
    Geometric3.candela = lock(new Geometric3(scalar(1), Unit.CANDELA));
    /**
     * SI derived unit of electric charge, quantity of electricity.
     */
    Geometric3.coulomb = lock(new Geometric3(scalar(1), Unit.COULOMB));
    /**
     * SI derived unit of force.
     */
    Geometric3.newton = lock(new Geometric3(scalar(1), Unit.NEWTON));
    /**
     * SI derived unit of energy, work, quantity of heat.
     */
    Geometric3.joule = lock(new Geometric3(scalar(1), Unit.JOULE));
    return Geometric3;
}(AbstractMeasure));
export { Geometric3 };
