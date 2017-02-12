import approx from './approx';
import BivectorE3 from './BivectorE3';
import CartesianG3 from './CartesianG3';
import arraysEQ from './arraysEQ';
import dotVector from './dotVectorE3';
import extG3 from './extG3';
import gauss from './gauss';
import GeometricE3 from './GeometricE3';
import isDefined from '../checks/isDefined';
import isScalarG3 from './isScalarG3';
import isVectorE3 from './isVectorE3';
import isVectorG3 from './isVectorG3';
import isZeroGeometricE3 from './isZeroGeometricE3';
import isZeroVectorE3 from './isZeroVectorE3';
import lcoG3 from './lcoG3';
import maskG3 from './maskG3';
import mulE3 from './mulE3';
import QQ from './QQ';
import randomRange from './randomRange';
import readOnly from '../i18n/readOnly';
import rcoG3 from './rcoG3';
import rotorFromDirections from './rotorFromDirectionsE3';
import scpG3 from './scpG3';
import Scalar from './Scalar';
import SpinorE3 from './SpinorE3';
import squaredNormG3 from './squaredNormG3';
import stringFromCoordinates from './stringFromCoordinates';
import Unit from './Unit';
import VectorE3 from './VectorE3';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

// Symbolic constants for the coordinate indices into the data array.
const COORD_SCALAR = 0;
const COORD_X = 1;
const COORD_Y = 2;
const COORD_Z = 3;
const COORD_XY = 4;
const COORD_YZ = 5;
const COORD_ZX = 6;
const COORD_PSEUDO = 7;

// FIXME: Change to Canonical ordering.
const BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
BASIS_LABELS[COORD_SCALAR] = '1';
BASIS_LABELS[COORD_X] = 'e1';
BASIS_LABELS[COORD_Y] = 'e2';
BASIS_LABELS[COORD_Z] = 'e3';

const zero = function zero(): number[] {
    return [0, 0, 0, 0, 0, 0, 0, 0];
};

const scalar = function scalar(a: number): number[] {
    const coords = zero();
    coords[COORD_SCALAR] = a;
    return coords;
};

const vector = function vector(x: number, y: number, z: number): number[] {
    const coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    return coords;
};

const bivector = function bivector(yz: number, zx: number, xy: number): number[] {
    const coords = zero();
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};

const spinor = function spinor(a: number, yz: number, zx: number, xy: number): number[] {
    const coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};

const multivector = function multivector(a: number, x: number, y: number, z: number, yz: number, zx: number, xy: number, b: number): number[] {
    const coords = zero();
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

const pseudo = function pseudo(b: number): number[] {
    const coords = zero();
    coords[COORD_PSEUDO] = b;
    return coords;
};

/**
 * Coordinates corresponding to basis labels.
 */
const coordinates = function coordinates(m: GeometricE3): number[] {
    const coords = zero();
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
 */
function cosVectorVector(a: VectorE3, b: VectorE3): number {
    function scp(a: VectorE3, b: VectorE3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    function norm(v: VectorE3): number {
        return Math.sqrt(scp(v, v));
    }
    return scp(a, b) / (norm(a) * norm(b));
}

/**
 * Sets the lock on the multivector argument and returns the same argument.
 * This is a convenience function for the dunder (double underscore) methods.
 * All dunder methods should return locked values.
 */
function lock(m: Geometric3): Geometric3 {
    m.lock();
    return m;
}

/**
 * 
 */
function compatibleUnit(this: void, a: GeometricE3, b: GeometricE3): Unit {
    if (Unit.isCompatible(a.uom, b.uom)) {
        return Unit.compatible(a.uom, b.uom);
    }
    else {
        try {
            return Unit.compatible(a.uom, b.uom);
        }
        catch (e) {
            throw new Error(`${Geometric3.copy(a)} and ${Geometric3.copy(b)} must have compatible units of measure. Cause: ${e}`);
        }
    }
}

/**
 * Scratch variable for holding cosines.
 */
const cosines: number[] = [];

const magicCode = Math.random();

/**
 * Sentinel value to indicate that the Geometric3 is not locked.
 * UNLOCKED is in the range -1 to 0.
 */
const UNLOCKED = -1 * Math.random();

/**
 * A multivector with a Euclidean metric and Cartesian coordinates.
 */
export class Geometric3 implements CartesianG3, GeometricE3 {

    /**
     * 
     */
    private readonly coords_: number[];

    /**
     * 
     */
    private modified_: boolean;

    /**
     * The unit of measure.
     * This property should only be changed through the accessors.
     */
    private uom_: Unit;

    /**
     * 
     */
    private lock_ = UNLOCKED;

    /**
     * Do not call this constructor. Use the static construction methods instead.
     */
    constructor(coords: number[] = zero(), uom?: Unit, code?: number) {
        if (coords.length !== 8) {
            throw new Error("coords.length must be 8");
        }
        if (isDefined(code) && code !== magicCode) {
            throw new Error("Use the static creation methods instead of the constructor");
        }
        this.coords_ = coords;
        this.uom_ = uom;
        this.modified_ = false;
    }

    /**
     * Determines whether this multivector is locked.
     * If the multivector is in the unlocked state then it is mutable.
     * If the multivector is in the locked state then it is immutable.
     */
    public isLocked(): boolean {
        return this.lock_ !== UNLOCKED;
    }

    /**
     * Locks this multivector (preventing any further mutation),
     * and returns a token that may be used to unlock it.
     */
    public lock(): number {
        if (this.lock_ !== UNLOCKED) {
            throw new Error("already locked");
        }
        else {
            this.lock_ = Math.random();
            return this.lock_;
        }
    }

    /**
     * Unlocks this multivector (allowing mutation),
     * using a token that was obtained from a preceding lock method call.
     */
    public unlock(token: number): void {
        if (this.lock_ === UNLOCKED) {
            throw new Error("not locked");
        }
        else if (this.lock_ === token) {
            this.lock_ = UNLOCKED;
        }
        else {
            throw new Error("unlock denied");
        }
    }

    /**
     * Consistently set a coordinate value in the most optimized way.
     * Permits mutation only when the lock status is UNLOCKED.
     * It is safe to use this as an alternative to the named property accessors.
     */
    private setCoordinate(index: number, newValue: number, name: string) {
        if (this.lock_ === UNLOCKED) {
            const coords = this.coords_;
            const previous = coords[index];
            if (newValue !== previous) {
                coords[index] = newValue;
                this.modified_ = true;
            }
        }
        else {
            throw new Error(readOnly(name).message);
        }
    }

    /**
     * The scalar part of this multivector.
     */
    get a(): number {
        return this.coords_[COORD_SCALAR];
    }
    set a(a: number) {
        this.setCoordinate(COORD_SCALAR, a, 'a');
    }

    /**
     * The pseudoscalar part of this multivector.
     */
    get b(): number {
        return this.coords_[COORD_PSEUDO];
    }
    set b(b: number) {
        this.setCoordinate(COORD_PSEUDO, b, 'b');
    }

    /**
     * A bitmask describing the grades.
     *
     * 0x0 = zero
     * 0x1 = scalar
     * 0x2 = vector
     * 0x4 = bivector
     * 0x8 = pseudoscalar
     */
    get maskG3(): number {
        const coords = this.coords_;
        const α = coords[COORD_SCALAR];
        const x = coords[COORD_X];
        const y = coords[COORD_Y];
        const z = coords[COORD_Z];
        const yz = coords[COORD_YZ];
        const zx = coords[COORD_ZX];
        const xy = coords[COORD_XY];
        const β = coords[COORD_PSEUDO];
        let mask = 0x0;
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
    }

    /**
     * The optional unit of measure.
     */
    get uom(): Unit {
        return this.uom_;
    }
    set uom(uom: Unit) {
        if (this.lock_ === UNLOCKED) {
            // This is the only place where we should check the unit of measure.
            // It also should be the only place where we access the private member.
            this.uom_ = Unit.mustBeUnit('uom', uom);
        }
        else {
            throw new Error(readOnly('uom').message);
        }
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     */
    get x(): number {
        return this.coords_[COORD_X];
    }
    set x(x: number) {
        this.setCoordinate(COORD_X, x, 'x');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     */
    get y(): number {
        return this.coords_[COORD_Y];
    }
    set y(y: number) {
        this.setCoordinate(COORD_Y, y, 'y');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     */
    get z(): number {
        return this.coords_[COORD_Z];
    }
    set z(z: number) {
        this.setCoordinate(COORD_Z, z, 'z');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
     */
    get yz(): number {
        return this.coords_[COORD_YZ];
    }
    set yz(yz: number) {
        this.setCoordinate(COORD_YZ, yz, 'yz');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
     */
    get zx(): number {
        return this.coords_[COORD_ZX];
    }
    set zx(zx: number) {
        this.setCoordinate(COORD_ZX, zx, 'zx');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     */
    get xy(): number {
        return this.coords_[COORD_XY];
    }
    set xy(xy: number) {
        this.setCoordinate(COORD_XY, xy, 'xy');
    }

    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * @param M The multivector to be added to this multivector.
     * @param α An optional scale factor that multiplies the multivector argument.
     * @returns this + M * α
     */
    add(M: GeometricE3, α = 1): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
                this.uom = compatibleUnit(this, M);
                return this;
            }
        }
    }

    /**
     * this ⟼ a + b
     *
     * @param a
     * @param b
     * @returns this multivector
     */
    add2(a: GeometricE3, b: GeometricE3): this {
        if (isZeroGeometricE3(a)) {
            this.uom = b.uom;
        }
        else if (isZeroGeometricE3(b)) {
            this.uom = a.uom;
        }
        else {
            this.uom = compatibleUnit(a, b);
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
    }

    /**
     * Adds a pseudoscalar value to this multivector.
     *
     * @param β The pseudoscalar value to be added to this multivector.
     * @param uom The optional unit of measure.
     * @returns this + (Iβ * uom)
     */
    addPseudo(β: number, uom?: Unit): Geometric3 {
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
    }

    /**
     * Adds a scalar value to this multivector.
     *
     * @param α The scalar value to be added to this multivector.
     * @param uom The optional unit of measure.
     * @returns this + (α * uom)
     */
    addScalar(α: number, uom?: Unit): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addScalar(α, uom));
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
            this.a += α;
            return this;
        }
    }

    /**
     * @param v The vector to be added to this multivector.
     * @param α An optional scale factor that multiplies the vector argument.
     * @returns this + v * α
     */
    addVector(v: VectorE3, α = 1): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * Sets this multivector to the angle, defined as the bivector part of the logarithm.
     * @returns grade(log(this), 2)
     */
    angle(): Geometric3 {
        return this.log().grade(2);
    }

    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
     * @param n
     * @returns approx(this, n)
     */
    approx(n: number): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().approx(n));
        }
        else {
            approx(this.coords_, n);
            return this;
        }
    }

    /**
     * @returns copy(this)
     */
    clone(): Geometric3 {
        return Geometric3.copy(this);
    }

    /**
     * Clifford conjugation
     */
    conj(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * Copies the coordinate values into this <code>Geometric3</code>.
     *
     * @param coordinates The coordinates in order a, x, y, z, yz, zx, xy, b.
     */
    copyCoordinates(coordinates: number[]): this {
        // Copy using the setters so that the modified flag is updated.
        this.a = coordinates[COORD_SCALAR];
        this.x = coordinates[COORD_X];
        this.y = coordinates[COORD_Y];
        this.z = coordinates[COORD_Z];
        this.yz = coordinates[COORD_YZ];
        this.zx = coordinates[COORD_ZX];
        this.xy = coordinates[COORD_XY];
        this.b = coordinates[COORD_PSEUDO];
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     *
     * @param M The multivector to be copied.
     */
    copy(M: GeometricE3): this {
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
    }

    /**
     * <p>
     * <code>this ⟼ copy(B)</code>
     * </p>
     *
     * @param B The bivector to be copied.
     */
    copyBivector(B: BivectorE3): this {
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
    }

    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     * @param uom The unit of measure.
     */
    copyScalar(α: number, uom: Unit): this {
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
    }

    /**
     * Copies the spinor argument value into this multivector.
     * The non-spinor components are set to zero.
     *
     * @param spinor The spinor to be copied.
     */
    copySpinor(spinor: SpinorE3): this {
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
    }

    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    copyVector(vector: VectorE3): this {
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
    }

    /**
     * Sets this multivector to the generalized vector cross product with another multivector.
     *
     * @returns -I * (this ^ m)
     */
    cross(m: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().cross(m));
        }
        else {
            this.ext(m);
            this.dual(this).neg();
            return this;
        }
    }

    /**
     * @returns this / magnitude(this)
     */
    direction(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().direction());
        }
        else {
            const norm: number = this.magnitudeSansUnits();
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
    }

    /**
     * @param m The multivector dividend.
     * @returns this / m;
     */
    div(m: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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

                const α = m.a;
                const x = m.x;
                const y = m.y;
                const z = m.z;
                const xy = m.xy;
                const yz = m.yz;
                const zx = m.zx;
                const β = m.b;

                const A = [
                    [α, x, y, z, -xy, -yz, -zx, -β],
                    [x, α, xy, -zx, -y, -β, z, -yz],
                    [y, -xy, α, yz, x, -z, -β, -zx],
                    [z, zx, -yz, α, -β, y, -x, -xy],
                    [xy, -y, x, β, α, zx, -yz, z],
                    [yz, β, -z, y, -zx, α, xy, x],
                    [zx, z, β, -x, yz, -xy, α, y],
                    [β, yz, zx, xy, z, x, y, α]
                ];

                const b = [1, 0, 0, 0, 0, 0, 0, 0];

                const X = gauss(A, b);

                const a0 = this.a;
                const a1 = this.x;
                const a2 = this.y;
                const a3 = this.z;
                const a4 = this.xy;
                const a5 = this.yz;
                const a6 = this.zx;
                const a7 = this.b;

                const b0 = X[0];
                const b1 = X[1];
                const b2 = X[2];
                const b3 = X[3];
                const b4 = X[4];
                const b5 = X[5];
                const b6 = X[6];
                const b7 = X[7];

                const c0 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                const c1 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                const c2 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                const c3 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                const c4 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                const c5 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                const c6 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                const c7 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);

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
    }

    divByNumber(α: number): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * <p>
     * <code>this ⟼ this / (α * uom)</code>
     * </p>
     *
     * @param α The scalar dividend.
     * @param uom The unit of measure.
     */
    divByScalar(α: number, uom: Unit): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByScalar(α, uom));
        }
        else {
            this.uom = Unit.div(this.uom, uom);
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
    }

    divByVector(v: VectorE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByVector(v));
        }
        else {
            const x = v.x;
            const y = v.y;
            const z = v.z;
            const uom2 = Unit.pow(v.uom, QQ.valueOf(2, 1));
            const squaredNorm = x * x + y * y + z * z;
            return this.mulByVector(v).divByScalar(squaredNorm, uom2);
        }
    }

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @param a The numerator.
     * @param b The denominator.
     */
    div2(a: SpinorE3, b: SpinorE3): this {
        this.uom = Unit.div(a.uom, b.uom);
        // FIXME: Generalize
        const a0 = a.a;
        const a1 = a.yz;
        const a2 = a.zx;
        const a3 = a.xy;
        const b0 = b.a;
        const b1 = b.yz;
        const b2 = b.zx;
        const b3 = b.xy;
        // Compare this to the product for Quaternions
        // It would be interesting to DRY this out.
        this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        // this.a = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    }

    /**
     * dual(m) = I<sub>n</sub> * m = m / I<sub>n</sub>
     *
     * @returns dual(m) or dual(this) if m is undefined.
     */
    dual(m?: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().dual(m));
        }
        else {
            if (isDefined(m)) {
                const w = -m.b;
                const x = -m.yz;
                const y = -m.zx;
                const z = -m.xy;
                const yz = m.x;
                const zx = m.y;
                const xy = m.z;
                const β = m.a;

                this.a = w;
                this.x = x;
                this.y = y;
                this.z = z;
                this.yz = yz;
                this.zx = zx;
                this.xy = xy;
                this.b = β;
                this.uom = m.uom;
                return this;
            }
            else {
                return this.dual(this);
            }
        }
    }

    /**
     * @param other
     * @returns
     */
    equals(other: any): boolean {
        if (other instanceof Geometric3) {
            // TODO: Check units of measure.
            return arraysEQ(this.coords_, other.coords_);
        }
        else {
            return false;
        }
    }

    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     */
    exp(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().exp());
        }
        else {
            Unit.assertDimensionless(this.uom);
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            const expW = Math.exp(this.a);

            // In Geometric3 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            // let cosβ = cos(this.b)
            // let sinβ = sin(this.b)

            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            const yz = this.yz;
            const zx = this.zx;
            const xy = this.xy;
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            const φ = Math.sqrt(yz * yz + zx * zx + xy * xy);
            const s = φ !== 0 ? Math.sin(φ) / φ : 1;
            const cosφ = Math.cos(φ);

            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.a = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.mulByNumber(expW);
        }
    }

    /**
     * Computes the inverse of this multivector. 
     * @returns inverse(this)
     */
    inv(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().inv());
        }
        else {
            const α = this.a;
            const x = this.x;
            const y = this.y;
            const z = this.z;
            const xy = this.xy;
            const yz = this.yz;
            const zx = this.zx;
            const β = this.b;

            const A = [
                [α, x, y, z, -xy, -yz, -zx, -β],
                [x, α, xy, -zx, -y, -β, z, -yz],
                [y, -xy, α, yz, x, -z, -β, -zx],
                [z, zx, -yz, α, -β, y, -x, -xy],
                [xy, -y, x, β, α, zx, -yz, z],
                [yz, β, -z, y, -zx, α, xy, x],
                [zx, z, β, -x, yz, -xy, α, y],
                [β, yz, zx, xy, z, x, y, α]
            ];

            const b = [1, 0, 0, 0, 0, 0, 0, 0];

            const X = gauss(A, b);

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
    }

    /**
     * Determines whether this multivector is exactly 1 (one).
     */
    isOne(): boolean {
        if (Unit.isOne(this.uom)) {
            return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
        }
        else {
            return false;
        }
    }

    /**
     * Determines whether this multivector is exactly 0 (zero).
     */
    isZero(): boolean {
        // It does not matter what the unit of measure is if all the coordinates are zero.
        return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    }

    /**
     * @param m
     * @returns this << m
     */
    lco(m: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lco(m));
        }
        else {
            return this.lco2(this, m);
        }
    }

    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    lco2(a: GeometricE3, b: GeometricE3): this {
        return lcoG3(a, b, this);
    }

    /**
     * @param target
     * @param α
     * @returns this + α * (target - this)
     */
    lerp(target: GeometricE3, α: number): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lerp(target, α));
        }
        else {
            if (this.isZero()) {
                this.uom = target.uom;
            }
            else if (isZeroGeometricE3(target)) {
                // Fall through.
            }
            else {
                this.uom = compatibleUnit(this, target);
            }
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    }

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     *
     * @param a
     * @param b
     * @param α
     */
    lerp2(a: GeometricE3, b: GeometricE3, α: number): this {
        this.copy(a).lerp(b, α);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     */
    log(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().log());
        }
        else {
            Unit.assertDimensionless(this.uom);
            const α = this.a;
            const x = this.yz;
            const y = this.zx;
            const z = this.xy;
            const BB = x * x + y * y + z * z;
            const B = Math.sqrt(BB);
            const f = Math.atan2(B, α) / B;
            this.a = Math.log(Math.sqrt(α * α + BB));
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        }
    }

    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     */
    magnitude(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().magnitude());
        }
        else {
            this.a = Math.sqrt(this.squaredNormSansUnits());
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
    }

    /**
     * Intentionally undocumented.
     */
    private magnitudeSansUnits(): number {
        return Math.sqrt(this.squaredNormSansUnits());
    }

    /**
     * Returns the geometric product of this multivector with the rhs multivector.
     * @param rhs The operand on the right hand side of the * operator.
     * @return this * rhs
     */
    mul(rhs: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mul(rhs));
        }
        else {
            return this.mul2(this, rhs);
        }
    }

    private mulByVector(v: VectorE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByVector(v));
        }
        else {
            this.uom = Unit.mul(this.uom, v.uom);

            const a0 = this.a;
            const a1 = this.x;
            const a2 = this.y;
            const a3 = this.z;
            const a4 = this.xy;
            const a5 = this.yz;
            const a6 = this.zx;
            const a7 = this.b;

            const b0 = 0;
            const b1 = v.x;
            const b2 = v.y;
            const b3 = v.z;
            const b4 = 0;
            const b5 = 0;
            const b6 = 0;
            const b7 = 0;

            // TODO: substitute a cheaper multiplication function.
            this.a = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
            this.x = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
            this.y = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
            this.z = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
            this.xy = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
            this.yz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
            this.zx = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
            this.b = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);

            return this;
        }
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    mul2(a: GeometricE3, b: GeometricE3): this {
        if (this.lock_ !== UNLOCKED) {
            throw new Error("TODO");
        }
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.z;
        const a4 = a.xy;
        const a5 = a.yz;
        const a6 = a.zx;
        const a7 = a.b;

        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.z;
        const b4 = b.xy;
        const b5 = b.yz;
        const b6 = b.zx;
        const b7 = b.b;

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
    }

    /**
     * @returns this * -1
     */
    neg(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * An alias for the `magnitude` method.
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     */
    norm(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().norm());
        }
        else {
            this.a = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            // There is no change to the unit of measure.
            return this;
        }
    }

    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     */
    one(): this {
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
    }

    /**
     * The quaditude of a multivector is defined in terms of the scalar products
     * of its blades.
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    quaditude(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().quaditude());
        }
        else {
            this.a = this.squaredNormSansUnits();
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
    }

    /**
     * @param m
     * @returns this >> m
     */
    rco(m: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rco(m));
        }
        else {
            return this.rco2(this, m);
        }
    }

    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    rco2(a: GeometricE3, b: GeometricE3): this {
        return rcoG3(a, b, this);
    }

    /**
     * Computes the <em>squared norm</em> of this multivector.
     *
     * This is an alias for the `quaditude` method.
     */
    squaredNorm(): Geometric3 {
        return this.quaditude();
    }

    /**
     * Intentionally undocumented
     */
    private squaredNormSansUnits(): number {
        return squaredNormG3(this);
    }

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
    reflect(n: VectorE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().reflect(n));
        }
        else {
            // We are assuming that n is dimensionless, so that our unit of measure does not change.
            Unit.assertDimensionless(n.uom);
            const n1 = n.x;
            const n2 = n.y;
            const n3 = n.z;
            const n11 = n1 * n1;
            const n22 = n2 * n2;
            const n33 = n3 * n3;
            const nn = n11 + n22 + n33;
            const f1 = 2 * n2 * n3;
            const f2 = 2 * n3 * n1;
            const f3 = 2 * n1 * n2;
            const t1 = n22 + n33 - n11;
            const t2 = n33 + n11 - n22;
            const t3 = n11 + n22 - n33;
            const cs = this.coords_;
            const a = cs[COORD_SCALAR];
            const x1 = cs[COORD_X];
            const x2 = cs[COORD_Y];
            const x3 = cs[COORD_Z];
            const B3 = cs[COORD_XY];
            const B1 = cs[COORD_YZ];
            const B2 = cs[COORD_ZX];
            const b = cs[COORD_PSEUDO];
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
    }

    /**
     * @returns reverse(this)
     */
    rev(): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * @param R the spinor that rotates this multivector.
     * @returns R * this * reverse(R)
     */
    rotate(R: SpinorE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rotate(R));
        }
        else {
            // We are assuming that R is dimensionless.
            Unit.assertDimensionless(R.uom);
            // FIXME: This only rotates the vector components.
            const x = this.x;
            const y = this.y;
            const z = this.z;

            const a = R.xy;
            const b = R.yz;
            const c = R.zx;
            const α = R.a;

            const ix = α * x - c * z + a * y;
            const iy = α * y - a * x + b * z;
            const iz = α * z - b * y + c * x;
            const iα = b * x + c * y + a * z;

            this.x = ix * α + iα * b + iy * a - iz * c;
            this.y = iy * α + iα * c + iz * b - ix * a;
            this.z = iz * α + iα * a + ix * c - iy * b;

            return this;
        }
    }

    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
     *
     * @param axis The (unit) vector defining the rotation aspect and orientation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): this {
        Unit.assertDimensionless(axis.uom);
        // Compute the dual of the axis to obtain the corresponding bivector.
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const squaredNorm = x * x + y * y + z * z;
        if (squaredNorm === 1) {
            return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z, uom: void 0 }, θ);
        }
        else {
            const norm = Math.sqrt(squaredNorm);
            const yz = x / norm;
            const zx = y / norm;
            const xy = z / norm;
            return this.rotorFromGeneratorAngle({ yz, zx, xy, uom: void 0 }, θ);
        }
    }

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
    rotorFromDirections(a: VectorE3, b: VectorE3): this {
        const B: BivectorE3 = void 0;
        return this.rotorFromVectorToVector(a, b, B);
    }

    /**
     * Helper function for rotorFromFrameToFrame.
     */
    private rotorFromTwoVectors(e1: VectorE3, f1: VectorE3, e2: VectorE3, f2: VectorE3): this {
        // FIXME: This creates a lot of temporary objects.
        // Compute the rotor that takes e1 to f1.
        // There is no concern that the two vectors are anti-parallel.
        const R1 = Geometric3.rotorFromDirections(e1, f1);
        // Compute the image of e2 under the first rotation in order to calculate R2.
        const f = Geometric3.fromVector(e2).rotate(R1);
        // In case of rotation for antipodal vectors, define the fallback rotation bivector.
        const B = Geometric3.dualOfVector(f1);
        // Compute R2
        const R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
        // The total rotor, R, is the composition of R1 followed by R2.
        return this.mul2(R2, R1);
    }

    /**
     * 
     */
    rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): this {
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
        let biggestValue = -1;
        let firstVector: number;
        for (let i = 0; i < 3; i++) {
            cosines[i] = cosVectorVector(es[i], fs[i]);
            if (cosines[i] > biggestValue) {
                firstVector = i;
                biggestValue = cosines[i];
            }
        }
        const secondVector = (firstVector + 1) % 3;
        return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
    }

    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromGeneratorAngle(B: BivectorE3, θ: number): this {
        Unit.assertDimensionless(B.uom);
        const φ = θ / 2;
        const yz = B.yz;
        const zx = B.zx;
        const xy = B.xy;
        const absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
        const mφ = absB * φ;
        const sinDivAbsB = Math.sin(mφ) / absB;

        this.a = Math.cos(mφ);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = -yz * sinDivAbsB;
        this.zx = -zx * sinDivAbsB;
        this.xy = -xy * sinDivAbsB;
        this.b = 0;
        return this;
    }

    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b. 
     */
    rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): this {
        rotorFromDirections(a, b, B, this);
        return this;
    }

    /**
     * @param m
     * @returns this | m
     */
    scp(m: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().scp(m));
        }
        else {
            return this.scp2(this, m);
        }
    }

    /**
     * <p>
     * <code>this ⟼ scp(a, b) = a | b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    scp2(a: GeometricE3, b: GeometricE3): this {
        return scpG3(a, b, this);
    }

    /**
     * @param α
     * @returns this * α
     */
    mulByNumber(α: number): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * @param α
     * @param uom
     * @returns this * (α * uom)
     */
    mulByScalar(α: number, uom: Unit): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * Applies the diagonal elements of a scaling matrix to this multivector.
     *
     * @param σ
     */
    stress(σ: VectorE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().stress(σ));
        }
        else {
            this.x *= σ.x;
            this.y *= σ.y;
            this.z *= σ.z;
            this.uom = Unit.mul(σ.uom, this.uom);
            // TODO: Action on other components TBD.
            return this;
        }
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     *
     * @param a
     * @param b
     */
    versor(a: VectorE3, b: VectorE3): this {
        this.uom = Unit.mul(a.uom, b.uom);

        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const bx = b.x;
        const by = b.y;
        const bz = b.z;

        this.zero();
        this.a = dotVector(a, b);
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);

        return this;
    }

    writeVector(vector: VectorE3): void {
        vector.x = this.x;
        vector.y = this.y;
        vector.z = this.z;
        vector.uom = this.uom;
    }

    /**
     * @param M
     * @param α
     * @returns this - M * α
     */
    sub(M: GeometricE3, α = 1): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
                this.uom = compatibleUnit(this, M);
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
    }

    /**
     * @param v The vector to subtract from this multivector.
     * @param α The multiplier for the amount of the vector to subtract.
     * @returns this - v * α
     */
    subVector(v: VectorE3, α = 1): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    sub2(a: GeometricE3, b: GeometricE3): this {
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
            this.uom = compatibleUnit(a, b);
        }
        return this;
    }

    /**
     * Returns a string representing the number in exponential notation.
     *
     * @param fractionDigits
     * @returns
     */
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    /**
     * Returns a string representing the number in fixed-point notation.
     *
     * @param fractionDigits
     * @returns
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    /**
     * @param precision
     * @returns
     */
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    /**
     * Returns a string representation of the number.
     *
     * @param radix
     * @returns
     */
    toString(radix?: number): string {
        const coordToString = function (coord: number): string { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    /**
     * Sets this multivector to the result of keeping only the specified grade.
     * This is the grade extraction operation.
     * 
     * @param n the grade to be retained.
     * @returns grade(this, n)
     */
    grade(n: number): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
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
    }

    /**
     * @param m
     * @return this ^ m
     */
    ext(m: GeometricE3): Geometric3 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().ext(m));
        }
        else {
            return this.ext2(this, m);
        }
    }

    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    ext2(a: GeometricE3, b: GeometricE3): this {
        return extG3(a, b, this);
    }

    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): this {
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
    }

    /**
     * Implements `this + rhs`.
     */
    __add__(rhs: number | CartesianG3): Geometric3 {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().add(duckR));
        }
        else if (isVectorE3(rhs)) {
            return lock(this.clone().addVector(rhs));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `this / rhs`.
     */
    __div__(rhs: number | CartesianG3) {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().div(duckR));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `lhs / this`.
     */
    __rdiv__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs, void 0).div(this));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `this * rhs`.
     */
    __mul__(rhs: number | CartesianG3) {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().mul(duckR));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `lhs * this`.
     */
    __rmul__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `lhs + this`.
     */
    __radd__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).add(this));
        }
        else if (isVectorE3(lhs)) {
            return lock(Geometric3.fromVector(lhs).add(this));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `this - rhs`.
     */
    __sub__(rhs: number | CartesianG3) {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().sub(duckR));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `lhs - rhs`.
     */
    __rsub__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `~this`.
     */
    __tilde__(): Geometric3 {
        return lock(Geometric3.copy(this).rev());
    }

    /**
     * Implements `this ^ rhs`.
     */
    __wedge__(rhs: number | Geometric3) {
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
    }

    /**
     * Implements `lhs ^ this`.
     */
    __rwedge__(lhs: number | Geometric3) {
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
    }

    /**
     * Implements `this << rhs`.
     */
    __lshift__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `lhs << this`.
     */
    __rlshift__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `this >> rhs`.
     */
    __rshift__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `lhs >> rhs`.
     */
    __rrshift__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `this | rhs`.
     */
    __vbar__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `lhs | this`.
     */
    __rvbar__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    }

    /**
     * Implements `!this`.
     */
    __bang__(): Geometric3 {
        return lock(Geometric3.copy(this).inv());
    }

    /**
     * Implements `+this`.
     */
    __pos__(): Geometric3 {
        return lock(Geometric3.copy(this));
    }

    /**
     * Implements `-this`.
     */
    __neg__(): Geometric3 {
        return lock(Geometric3.copy(this).neg());
    }

    /**
     * Constructs a Geometric3 representing the number zero.
     * The identity element for addition, <b>0</b>.
     * The returned multivector is locked.
     */
    public static readonly zero = lock(new Geometric3(zero(), void 0, magicCode));

    /**
     * Constructs a Geometric3 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     * The returned multivector is locked.
     */
    public static readonly one = lock(new Geometric3(scalar(1), void 0, magicCode));

    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     * The returned multivector is locked.
     */
    public static readonly e1 = lock(new Geometric3(vector(1, 0, 0), void 0, magicCode));

    /**
     * Constructs a basis vector corresponding to the <code>y</code> coordinate.
     * The returned multivector is locked.
     */
    public static readonly e2 = lock(new Geometric3(vector(0, 1, 0), void 0, magicCode));

    /**
     * Constructs a basis vector corresponding to the <code>z</code> coordinate.
     * The returned multivector is locked.
     */
    public static readonly e3 = lock(new Geometric3(vector(0, 0, 1), void 0, magicCode));

    /**
     * Constructs a basis vector corresponding to the <code>β</code> coordinate.
     * The returned multivector is locked.
     */
    public static readonly I = lock(new Geometric3(pseudo(1), void 0, magicCode));

    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
     */
    public static readonly meter = lock(new Geometric3(scalar(1), Unit.METER, magicCode));

    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    public static readonly kilogram = lock(new Geometric3(scalar(1), Unit.KILOGRAM, magicCode));

    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    public static readonly second = lock(new Geometric3(scalar(1), Unit.SECOND, magicCode));

    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    public static readonly ampere = lock(new Geometric3(scalar(1), Unit.AMPERE, magicCode));

    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
     */
    public static readonly kelvin = lock(new Geometric3(scalar(1), Unit.KELVIN, magicCode));

    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    public static readonly mole = lock(new Geometric3(scalar(1), Unit.MOLE, magicCode));

    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     */
    public static readonly candela = lock(new Geometric3(scalar(1), Unit.CANDELA, magicCode));

    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static bivector(yz: number, zx: number, xy: number, uom?: Unit): Geometric3 {
        return Geometric3.spinor(0, yz, zx, xy, uom);
    }

    /**
     * @param mv The multivector to be copied.
     */
    static copy(mv: GeometricE3): Geometric3 {
        return new Geometric3(coordinates(mv), mv.uom, magicCode);
    }

    static dual(m: Geometric3): Geometric3 {
        return new Geometric3(zero(), m.uom, magicCode).dual(m);
    }

    static dualOfBivector(B: BivectorE3): Geometric3 {
        return new Geometric3(vector(-B.yz, -B.zx, -B.xy), B.uom, magicCode);
    }

    static dualOfVector(v: VectorE3): Geometric3 {
        return new Geometric3(bivector(v.x, v.y, v.z), v.uom, magicCode);
    }

    static fromBivector(B: BivectorE3): Geometric3 {
        return new Geometric3(bivector(B.yz, B.zx, B.xy), B.uom, magicCode);
    }

    /**
     * @param alpha
     */
    static fromScalar(alpha: Scalar): Geometric3 {
        return new Geometric3(scalar(alpha.a), alpha.uom, magicCode);
    }

    /**
     * @param s
     */
    static fromSpinor(R: SpinorE3): Geometric3 {
        return new Geometric3(spinor(R.a, R.yz, R.zx, R.xy), R.uom, magicCode);
    }

    /**
     * @param v
     * @returns
     */
    static fromVector(v: VectorE3): Geometric3 {
        return new Geometric3(vector(v.x, v.y, v.z), v.uom, magicCode);
    }

    /**
     * @param A
     * @param B
     * @param α
     * @returns <code>A + α * (B - A)</code>
     */
    static lerp(A: GeometricE3, B: GeometricE3, α: number): Geometric3 {
        return Geometric3.copy(A).lerp(B, α);
    }

    /**
     * <p>
     * Computes a multivector with random components.
     * </p>
     */
    static random() {
        const lowerBound = -1;
        const upperBound = +1;
        const a = randomRange(lowerBound, upperBound);
        const x = randomRange(lowerBound, upperBound);
        const y = randomRange(lowerBound, upperBound);
        const z = randomRange(lowerBound, upperBound);
        const yz = randomRange(lowerBound, upperBound);
        const zx = randomRange(lowerBound, upperBound);
        const xy = randomRange(lowerBound, upperBound);
        const b = randomRange(lowerBound, upperBound);
        return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b), void 0, magicCode);
    }

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     *
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3 {
        return new Geometric3(zero(), void 0, magicCode).rotorFromDirections(a, b);
    }

    static rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): Geometric3 {
        return new Geometric3(zero(), void 0, magicCode).rotorFromFrameToFrame(es, fs);
    }

    static rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3 {
        return new Geometric3(zero(), void 0, magicCode).rotorFromVectorToVector(a, b, B);
    }

    /**
     * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static scalar(a: number, uom?: Unit): Geometric3 {
        return new Geometric3(scalar(a), uom, magicCode);
    }

    /**
     * Creates a spinor valued multivector from the specified cartesian coordinates.
     * @param a The scalar coordinate.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static spinor(a: number, yz: number, zx: number, xy: number, uom?: Unit): Geometric3 {
        return new Geometric3(spinor(a, yz, zx, xy), uom, magicCode);
    }

    /**
     * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
     * @param x The coordinate corresponding to the e1 basis vector.
     * @param y The coordinate corresponding to the e2 basis vector.
     * @param z The coordinate corresponding to the e3 basis vector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static vector(x: number, y: number, z: number, uom?: Unit): Geometric3 {
        return new Geometric3(vector(x, y, z), uom, magicCode);
    }

    /**
     * @param a
     * @param b
     */
    static wedge(a: Geometric3, b: Geometric3): Geometric3 {

        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const bx = b.x;
        const by = b.y;
        const bz = b.z;

        const yz = wedgeYZ(ax, ay, az, bx, by, bz);
        const zx = wedgeZX(ax, ay, az, bx, by, bz);
        const xy = wedgeXY(ax, ay, az, bx, by, bz);

        return Geometric3.spinor(0, yz, zx, xy, Unit.mul(a.uom, b.uom));
    }
}

export default Geometric3;
