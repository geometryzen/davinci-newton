//
// davinci-newton.d.ts
//
// This file was created manually in order to support the davinci-newton library.
// These declarations are appropriate when using the library through the global
// variable, 'NEWTON'.
//
/**
 * JavaScript Physics Engine library for mathematical physics using Geometric Algebra.
 */
declare module NEWTON {

    /**
     * The QQ class represents a rational number.
     * The QQ implementation is that of an immutable value.
     * The numerator and denominator are reduced to their lowest form.
     * Construct new instances using the static valueOf method.
     */
    class QQ {

        /**
         * The denominator.
         */
        denom: number;

        /**
         * The numerator.
         */
        numer: number;

        /**
         *
         */
        add(rhs: QQ): QQ

        /**
         *
         */
        div(rhs: QQ): QQ

        /**
         *
         */
        equals(other: QQ): boolean

        /**
         * Computes the multiplicative inverse of this rational number.
         */
        inv(): QQ

        /**
         * Determines whether this rational number is the multiplicative identity, <b>1</b>.
         */
        isOne(): boolean

        /**
         * Determines whether this rational number is the additive identity, <b>0</b>.
         */
        isZero(): boolean

        /**
         *
         */
        mul(rhs: QQ): QQ

        /**
         * Computes the additive inverse of this rational number.
         */
        neg(): QQ

        /**
         *
         */
        sub(rhs: QQ): QQ

        /**
         *
         */
        toString(): string

        /**
         *
         */
        static valueOf(numer: number, denom: number): QQ
    }

    /**
     * The dimensions of a physical quantity.
     */
    class Dimensions {
        M: QQ;
        L: QQ;
        T: QQ;
        Q: QQ;
        temperature: QQ;
        amount: QQ;
        intensity: QQ;
        constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity);
        isOne(): boolean;
        isZero(): boolean;
        inv(): Dimensions;
        neg(): Dimensions;

        /**
         *
         */
        static ONE: Dimensions;

        /**
         *
         */
        static MASS: Dimensions;

        /**
         *
         */
        static LENGTH: Dimensions;

        /**
         *
         */
        static TIME: Dimensions;

        /**
         *
         */
        static CHARGE: Dimensions;

        /**
         *
         */
        static CURRENT: Dimensions;

        /**
         *
         */
        static TEMPERATURE: Dimensions;

        /**
         *
         */
        static AMOUNT: Dimensions;

        /**
         *
         */
        static INTENSITY: Dimensions;
    }

    /**
     * The unit of measure for a physical quantity.
     */
    class Unit {
        dimensions: Dimensions;

        /**
         * The label strings to use for each dimension.
         */
        labels: string[];
        multiplier: number;

        /**
         * The ampere.
         */
        static AMPERE: Unit;

        /**
         * The candela.
         */
        static CANDELA: Unit;

        /**
         * The coulomb.
         */
        static COULOMB: Unit;

        /**
         * The kelvin.
         */
        static KELVIN: Unit;

        /**
         * The kilogram.
         */
        static KILOGRAM: Unit;

        /**
         * The meter.
         */
        static METER: Unit;

        /**
         * The mole.
         */
        static MOLE: Unit;

        /**
         * The second.
         */
        static SECOND: Unit;

        /**
         * 
         */
        constructor(multiplier: number, dimensions: Dimensions, labels: string[]);

        /**
         * Computes the unit equal to `this / rhs`.
         */
        div(rhs: Unit): Unit;

        /**
         * Computes the unit equal to `this * rhs`.
         */
        mul(rhs: Unit): Unit;

        /**
         * 
         */
        toExponential(fractionDigits?: number, compact?: boolean): string;

        /**
         * 
         */
        toFixed(fractionDigits?: number, compact?: boolean): string;

        /**
         * 
         */
        toPrecision(precision?: number, compact?: boolean): string;

        /**
         * 
         */
        toString(radix?: number, compact?: boolean): string;

        /**
         * 
         */
        static assertDimensionless(uom: Unit): void;

        /**
         * Returns the compatible unit of measure or throws an error if the units are not compatible.
         * If either argument is undefined or null it is considered to be equal to unity.
         * This function should be used when adding or subtracting measures.
         */
        static compatible(lhs: Unit, rhs: Unit): Unit;

        /**
         * Returns the quotient of the two units of measure.
         * If either argument is undefined or null it is considered to be equal to unity.
         * This function should be used when dividing measures.
         */
        static div(lhs: Unit, rhs: Unit): Unit;

        /**
         * Computes the multiplicative inverse of the specified unit of measure.
         */
        static inv(uom: Unit): Unit;

        static isOne(uom: Unit): boolean;

        /**
         * Returns the product of the two units of measure.
         * If either argument is undefined or null it is considered to be equal to unity.
         * This function should be used when multiplying measures.
         */
        static mul(lhs: Unit, rhs: Unit): Unit;

        static mustBeUnit(name: string, uom: Unit): Unit;

        /**
         * Computes the value of the unit of measure raised to the specified power.
         */
        static pow(uom: Unit, exponent: QQ): Unit;

        static sqrt(uom: Unit): Unit;
    }

    interface SimObject {
        /**
         * 
         */
        expireTime: number;
    }

    class SimList {
        constructor();
        add(simObject: SimObject): void;
        forEach(callBack: (simObject: SimObject, index: number) => any): void;
        remove(simObject: SimObject): void;
        removeTemporary(time: number): void;
    }

    interface Simulation {
        /**
         * 
         */
        time: number;
        /**
         * Handler for actions to be performed before getState and the evaluate calls.
         */
        prolog(): void;
        /**
         * 
         */
        getState(): number[];
        /**
         * 
         */
        evaluate(state: number[], change: number[], stepSize: number, uomStep: Unit): void;
        /**
         * 
         */
        setState(vars: number[]): void;
        /**
         * Handler for actions to be performed after the evaluate calls and setState.
         */
        epilog(): void;
    }

    class VarsList {
        constructor(varNames: string[]);
        addVariables(names: string[]): number;
        deleteVariables(index: number, howMany: number): void;
        incrSequence(...indexes: number[]);
        getValues(): number[];
        setValues(values: number[], continuous?: boolean): void;
        setValue(index: number, value: number, continuous?: boolean): void;
        getTime(): number;
        timeIndex(): number;
    }
    interface Scalar {
        a: number;
        uom: Unit;
    }

    interface Pseudo {
        b: number;
        uom: Unit;
    }

    interface VectorE3 {
        x: number;
        y: number;
        z: number;
        uom: Unit;
    }

    interface BivectorE3 {
        yz: number;
        zx: number;
        xy: number;
        uom: Unit;
    }

    interface SpinorE3 extends Scalar, BivectorE3 {
    }
    /**
     * The coordinates for a multivector in 3D in geometric Cartesian basis.
     */
    interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {

    }

    class VectorN<T> {
        coords: T[];
        modified: boolean;
        constructor(coords: T[], modified?: boolean, size?: number);
        clone(): VectorN<T>;
        getComponent(index: number): T;
        pop(): T;
        push(value: T): number;
        setComponent(index: number, value: T): void;
        toArray(array?: T[], offset?: number): T[];
        toLocaleString(): string;
        toString(): string;
    }

    /**
     * A mutable multivector in 3D with a Euclidean metric and optional unit of measure.
     */
    class Geometric3 extends VectorN<number> implements GeometricE3 {
        /**
         * The coordinate corresponding to the unit standard basis scalar.
         */
        a: number;

        /**
         * The coordinate corresponding to the e1 standard basis vector.
         */
        x: number;

        /**
         * The coordinate corresponding to the e2 standard basis vector.
         */
        y: number;

        /**
         * The coordinate corresponding to the e3 standard basis vector.
         */
        z: number;

        /**
         * The bivector component in the e2e3 plane.
         */
        yz: number;

        /**
         * The bivector component in the e3e1 plane.
         */
        zx: number;

        /**
         * The coordinate corresponding to the e1e2 standard basis bivector.
         */
        xy: number;

        /**
         * The pseudoscalar coordinate of the multivector.
         */
        b: number;

        /**
         * The optional unit of measure.
         */
        uom: Unit;

        /**
         * Constructs a Geometric3.
         * The multivector is initialized to zero.
         */
        constructor();

        /**
         * Adds M * α to this multivector.
         *
         * this ⟼ this + M * α
         */
        add(M: GeometricE3, α?: number): Geometric3;

        /**
         * Sets this multivector to the sum of a and b.
         *
         * this ⟼ a + b
         */
        add2(a: GeometricE3, b: GeometricE3): Geometric3;

        /**
         * Adds the pseudoscalar coordinate to this multivector.
         */
        addPseudo(β: number, uom?: Unit): Geometric3;

        /**
         * Adds the scalar coordinate to this multivector.
         */
        addScalar(α: number, uom?: Unit): Geometric3;

        /**
         * Adds v * α to this multivector where v is a vector and α is an optional scalar.
         *
         * this ⟼ this + v * α
         */
        addVector(v: VectorE3, α?: number): Geometric3;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): Geometric3;

        /**
         * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
         */
        approx(n: number): Geometric3;

        /**
         *Returns a clone of this multivector.
         */
        clone(): Geometric3;

        /**
         * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
         * 
         * this ⟼ conj(this)
         */
        conj(): Geometric3;

        /**
         * Copies the multivector M into this multivector.
         *
         * this ⟼ copy(M)
         */
        copy(M: GeometricE3): Geometric3;

        /**
         * 
         */
        copyBivector(B: BivectorE3): Geometric3;

        /**
         * Copies the scalar α into this multivector.
         *
         * this ⟼ copy(α, uom)
         */
        copyScalar(α: number, uom?: Unit): Geometric3;

        /**
         * Copies the spinor into this multivector.
         *
         * this ⟼ copy(spinor)
         */
        copySpinor(spinor: SpinorE3): Geometric3;

        /**
         * Copies the vector into this multivector.
         *
         * this ⟼ copyVector(vector)
         */
        copyVector(vector: VectorE3): Geometric3;

        /**
         * Sets this multivector to the vector cross product of this with m.
         * this ⟼ this x m
         */
        cross(m: GeometricE3): Geometric3;

        /**
         * Normalizes this multivector by dividing it by its magnitude.
         */
        direction(): Geometric3;

        /**
         * Sets this multivector to the result of division by another multivector.
         * 
         * this ⟼ this / m
         * 
         */
        div(m: GeometricE3): Geometric3;

        /**
         * 
         * this ⟼ a / b
         * 
         * a
         * b
         */
        div2(a: SpinorE3, b: SpinorE3): Geometric3;

        /**
         * 
         * this ⟼ this / α
         * 
         */
        divByNumber(α: number): Geometric3;

        /**
         * 
         * this ⟼ this / (α * uom)
         * 
         */
        divByScalar(α: number, uom: Unit): Geometric3;

        /**
         * 
         */
        divByVector(vector: VectorE3): Geometric3;

        /**
         * 
         * this ⟼ dual(m) = I * m
         * 
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * m The vector whose dual will be used to set this spinor.
         */
        dual(m: VectorE3): Geometric3;

        /**
         * 
         */
        equals(other: any): boolean;

        /**
         * 
         * this ⟼ e<sup>this</sup>
         * 
         */
        exp(): Geometric3;

        /**
         * 
         * this ⟼ this ^ m
         * 
         * m
         */
        ext(m: GeometricE3): Geometric3;

        /**
         * 
         * this ⟼ a ^ b
         * 
         * a
         * b
         */
        ext2(a: GeometricE3, b: GeometricE3): Geometric3;

        /**
         * Constructs the standard basis unit vector corresponding to the x coordinate.
         */
        e1(): Geometric3;

        /**
         * Constructs the standard basis unit vector corresponding to the y coordinate.
         */
        e2(): Geometric3;

        /**
         * Constructs the standard basis unit vector corresponding to the z coordinate.
         */
        e3(): Geometric3;

        /**
         * Sets this multivector to the result of keeping only the specified grade.
         * This is the grade extraction operation.
         */
        grade(grade: number): Geometric3;

        /**
         * Sets this multivector to its inverse.
         * this ⟼ conj(this) / quad(this)
         */
        inv(): Geometric3;

        /**
         * 
         */
        isLocked(): boolean;

        isOne(): boolean;

        isZero(): boolean;

        /**
         * Sets this multivector to the unit pseudoscalar.
         */
        I(): Geometric3;

        /**
         * Sets this multivector to the left contraction with another multivector.
         * 
         * this ⟼ this << m
         * 
         * m
         */
        lco(m: GeometricE3): Geometric3;

        /**
         * Sets this multivector to the left contraction of two multivectors. 
         * 
         * this ⟼ a << b
         * 
         * a
         * b
         */
        lco2(a: GeometricE3, b: GeometricE3): Geometric3;

        /**
         * 
         * this ⟼ this + α * (target - this)
         * 
         * target
         * α
         */
        lerp(target: GeometricE3, α: number): Geometric3;

        /**
         * 
         * this ⟼ a + α * (b - a)
         * 
         * a {GeometricE3}
         * b {GeometricE3}
         * α {number}
         */
        lerp2(a: GeometricE3, b: GeometricE3, α: number): Geometric3;

        /**
         * 
         */
        lock(): number;

        /**
         * 
         * this ⟼ log(this)
         * 
         */
        log(): Geometric3;

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): Geometric3;

        /**
         * 
         * this ⟼ this * s
         * 
         * m {GeometricE3}
         */
        mul(m: GeometricE3): Geometric3;

        /**
         * 
         * this ⟼ a * b
         * 
         * a
         * b
         */
        mul2(a: GeometricE3, b: GeometricE3): Geometric3;

        /**
         * this ⟼ this * α
         */
        mulByNumber(α: number): Geometric3;

        /**
         * this ⟼ this * (α * uom)
         */
        mulByScalar(α: number, uom: Unit): Geometric3;

        /**
         * 
         * this ⟼ -1 * this
         * 
         */
        neg(): Geometric3;

        /**
         * 
         * this ⟼ sqrt(this * conj(this))
         * 
         */
        norm(): Geometric3;

        /**
         * Sets this multivector to the identity element for multiplication, 1.
         */
        one(): Geometric3;

        /**
         * 
         * this ⟼ this | ~this = scp(this, rev(this))
         * 
         */
        quaditude(): Geometric3;

        /**
         * Sets this multivector to the right contraction with another multivector.
         * 
         * this ⟼ this >> m
         * 
         * m
         */
        rco(m: GeometricE3): Geometric3;

        /**
         * Sets this multivector to the right contraction of two multivectors.
         * 
         * this ⟼ a >> b
         * 
         * a
         * b
         */
        rco2(a: GeometricE3, b: GeometricE3): Geometric3;

        /**
         * 
         * this ⟼ - n * this * n
         * 
         * n
         */
        reflect(n: VectorE3): Geometric3;

        /**
         * 
         * this ⟼ rev(this)
         * 
         */
        rev(): Geometric3;

        /**
         * 
         * this ⟼ R * this * rev(R)
         * 
         * R
         */
        rotate(R: SpinorE3): Geometric3;

        /**
         * Sets this multivector to a rotor that rotates through angle θ around the specified direction.
         *
         * n: The (unit) vector defining the rotation direction.
         * θ: The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
         */
        rotorFromAxisAngle(n: VectorE3, θ: number): Geometric3;

        /**
         * Sets this multivector to a rotor representing a rotation from a to b.
         * this = ⟼ R, where
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         *
         * a The <em>from</em> vector.
         * b The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;

        /**
         * 
         */
        rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): Geometric3;

        /**
         * Sets this multivector to a rotor represented by the plane B and angle θ.
         * this = ⟼ R = exp(- B * θ / 2)
         *
         * B is the (unit) bivector generating the rotation, B * B = -1.
         * θ The rotation angle in radians.
         */
        rotorFromGeneratorAngle(B: BivectorE3, θ: number): Geometric3;

        /**
         * R = (|b||a| + b a) / sqrt(2 |b||a|(|b||a| + b << a))
         * 
         * The result is independent of the magnitudes of a and b.
         */
        rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3;

        /**
         * 
         * this ⟼ scp(this, m)
         * 
         * m
         */
        scp(m: GeometricE3): Geometric3;

        /**
         * 
         * this ⟼ scp(a, b)
         * 
         * a
         * b
         */
        scp2(a: GeometricE3, b: GeometricE3): Geometric3;

        /**
         * Computes the <em>squared norm</em> of this multivector.
         */
        squaredNorm(): Geometric3;

        /**
         * 
         * this ⟼ this - M * α
         * 
         * M
         * α
         */
        sub(M: GeometricE3, α?: number): Geometric3;

        /**
         * 
         * this ⟼ a - b
         * 
         * a
         * b
         */
        sub2(a: GeometricE3, b: GeometricE3): Geometric3;

        /**
         * Subtracts v * α from this multivector where v is a vector and α is an optional scalar.
         *
         * this ⟼ this - v * α
         */
        subVector(v: VectorE3, α?: number): Geometric3;

        /**
         * Returns a string representing the number in exponential notation.
         */
        toExponential(fractionDigits?: number): string;

        /**
         * Returns a string representing the number in fixed-point notation.
         * fractionDigits
         */
        toFixed(fractionDigits?: number): string;

        /**
         *
         */
        toPrecision(precision?: number): string;

        /**
         * Returns a string representation of the number.
         */
        toString(radix?: number): string;

        /**
         * 
         */
        unlock(token: number): boolean;

        /**
         * 
         * this ⟼ a * b
         * 
         * Sets this Geometric3 to the geometric product a * b of the vector arguments.
         * a
         * b
         */
        versor(a: VectorE3, b: VectorE3): Geometric3;

        /**
         * 
         */
        writeVector(vector: VectorE3): void;

        /**
         * Sets this multivector to the identity element for addition, 0.
         */
        zero(): Geometric3;

        /**
         * Basis vector corresponding to the β coordinate.
         */
        static I(): Geometric3;

        /**
         * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
         */
        static bivector(yz: number, zx: number, xy: number, uom?: Unit): Geometric3;

        static copy(m: GeometricE3): Geometric3;

        static dual(m: GeometricE3): Geometric3;

        static dualOfBivector(B: BivectorE3): Geometric3;

        static dualOfVector(v: VectorE3): Geometric3;

        /**
         * Standard Basis vector corresponding to the x coordinate.
         */
        static e1(): Geometric3;

        /**
         * Basis vector corresponding to the y coordinate.
         */
        static e2(): Geometric3;

        /**
         * Basis vector corresponding to the z coordinate.
         */
        static e3(): Geometric3;

        /**
         * Creates a copy of a bivector.
         */
        static fromBivector(B: BivectorE3): Geometric3;

        /**
         * Creates a copy of a scalar.
         */
        static fromScalar(scalar: Scalar): Geometric3;

        /**
         * Creates a copy of a spinor.
         */
        static fromSpinor(spinor: SpinorE3): Geometric3;

        /**
         * Creates a copy of a vector.
         */
        static fromVector(vector: VectorE3): Geometric3;

        /**
         * The identity element for multiplication, 1 (scalar).
         * e.g.
         * const one = EIGHT.Geometric3.one();
         */
        static one(): Geometric3;

        /**
         * Computes a random multivector.
         */
        static random(): Geometric3;

        /**
         * Computes the rotor that rotates vector a to vector b.
         * a The <em>from</em> vector.
         * b The <em>to</em> vector.
         */
        static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;

        /**
         * 
         */
        static rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3;

        /**
         * Constructs a new scalar from a number and a unit of measure.
         */
        static scalar(α: number, uom?: Unit): Geometric3;

        static spinor(a: number, yz: number, zx: number, xy: number, uom?: Unit): Geometric3;

        /**
         * Constructs a new vector from Cartesian coordinates and a unit of measure.
         */
        static vector(x: number, y: number, z: number, uom?: Unit): Geometric3;

        static wedge(a: Geometric3, b: Geometric3): Geometric3;

        /**
         * The identity element for addition, 0.
         * e.g.
         * const origin = EIGHT.Geometric3.zero();
         */
        static zero(): Geometric3;
    }

    interface MatrixLike {
        dimensions: number;
        uom: Unit;
        getElement(row: number, column: number): number;
    }

    /**
     * A mutable 3x3 matrix.
     */
    class Matrix3 implements MatrixLike {
        dimensions: number;
        uom: Unit;
        elements: Float32Array;
        modified: boolean;
        /**
         * Constructs a mutable 3x3 identity matrix.
         */
        constructor(elements: Float32Array, uom: Unit);
        copy(source: MatrixLike): this;
        getElement(row: number, column: number): number;
        inv(): this;
        isOne(): boolean;
        mul(rhs: Matrix3): this;
        mul2(a: Matrix3, b: Matrix3): this;
        rmul(lhs: Matrix3): this;
        rotation(spinor: SpinorE3): this;
        row(i: number): number[];
        setElement(row: number, column: number, value: number): void;
        toString(radix?: number): string;
        transpose(): this;
        static one(): Matrix3;
        static zero(): Matrix3;
    }

    /**
     * 
     */
    class RigidBody3 implements SimObject {
        /**
         * The center of mass position vector in local coordinates.
         */
        centerOfMassLocal: VectorE3;
        /**
         * Mass (scalar).
         */
        M: Geometric3;
        /**
         * Inertia Tensor (in body coordinates) (3x3 matrix).
         */
        I: MatrixLike;
        /**
         * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
         */
        Iinv: MatrixLike;
        /**
         * Position (vector).
         */
        X: Geometric3;
        /**
         * Attitude (spinor)
         */
        R: Geometric3;
        /**
         * Linear momentum (vector).
         */
        P: Geometric3;
        /**
         * Angular momentum (bivector).
         */
        L: Geometric3;
        /**
         * Angular velocity (bivector).
         */
        Ω: Geometric3;
        /**
         * 
         */
        expireTime: number;
        /**
         * The starting index of this rigid body in the state variables.
         */
        varsIndex: number;
        /**
         * 
         */
        constructor();
        /**
         * Converts a point in local coordinates to the same point in world coordinates.
         * x = R (localPoint - centerOfMassLocal) * ~R + X
         */
        localPointToWorldPoint(localPoint: VectorE3, worldPoint: VectorE3): void;
        /**
         * Updates the angular velocity, Ω, bivector based upon the angular momentum.
         * Derived classes may override to provide more efficient implementations based upon symmetry.
         */
        public updateAngularVelocity(): void;
        /**
         * 
         */
        protected updateInertiaTensor(): void;
        /**
         * 
         */
        rotationalEnergy(): Geometric3;
        /**
         * 
         */
        translationalEnergy(): Geometric3;
    }

    /**
     * A rectangular block of uniform density.
     */
    class Block3 extends RigidBody3 {
        width: Geometric3;
        height: Geometric3;
        depth: Geometric3;
        constructor(width?: GeometricE3, height?: GeometricE3, depth?: GeometricE3);
    }

    /**
     * A solid cylinder of uniform density.
     */
    class Cylinder3 extends RigidBody3 {
        /**
         * 
         */
        radius: Geometric3;
        /**
         * 
         */
        height: Geometric3;
        /**
         * 
         */
        constructor(radius?: GeometricE3, height?: GeometricE3);
    }

    /**
     * A solid sphere of uniform density.
     */
    class Sphere3 extends RigidBody3 {
        /**
         * 
         */
        radius: Geometric3;
        /**
         * 
         */
        constructor(radius?: GeometricE3);
    }

    enum CoordType {
        BODY = 0,
        WORLD = 1
    }

    /**
     * The application of a force to a particle in a rigid body.
     */
    class Force3 implements SimObject {
        /**
         * 
         */
        F: Geometric3;
        /**
         * 
         */
        x: Geometric3;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body: RigidBody3);
        getBody(): RigidBody3;
    }

    interface ForceLaw3 extends SimObject {
        updateForces(): Force3[];
        disconnect(): void;
        potentialEnergy(): Geometric3;
    }

    /**
     * 
     */
    class Physics3 implements Simulation, EnergySystem {
        static INDEX_TIME: number;
        static INDEX_TRANSLATIONAL_KINETIC_ENERGY: number;
        static INDEX_ROTATIONAL_KINETIC_ENERGY: number;
        static INDEX_POTENTIAL_ENERGY: number;
        static INDEX_TOTAL_ENERGY: number;
        static INDEX_TOTAL_LINEAR_MOMENTUM_X: number;
        static INDEX_TOTAL_LINEAR_MOMENTUM_Y: number;
        static INDEX_TOTAL_LINEAR_MOMENTUM_Z: number;
        static INDEX_TOTAL_ANGULAR_MOMENTUM_YZ: number;
        static INDEX_TOTAL_ANGULAR_MOMENTUM_ZX: number;
        static INDEX_TOTAL_ANGULAR_MOMENTUM_XY: number;
        static OFFSET_POSITION_X: number;
        static OFFSET_POSITION_Y: number;
        static OFFSET_POSITION_Z: number;
        static OFFSET_ATTITUDE_A: number;
        static OFFSET_ATTITUDE_YZ: number;
        static OFFSET_ATTITUDE_ZX: number;
        static OFFSET_ATTITUDE_XY: number;
        static OFFSET_LINEAR_MOMENTUM_X: number;
        static OFFSET_LINEAR_MOMENTUM_Y: number;
        static OFFSET_LINEAR_MOMENTUM_Z: number;
        static OFFSET_ANGULAR_MOMENTUM_YZ: number;
        static OFFSET_ANGULAR_MOMENTUM_ZX: number;
        static OFFSET_ANGULAR_MOMENTUM_XY: number;
        /**
         * 
         */
        simList: SimList;
        /**
         * 
         */
        varsList: VarsList;
        /**
         * Determines whether calculated forces will be added to the simulation list.
         */
        showForces: boolean;
        /**
         * 
         */
        time: number;
        /**
         *
         */
        constructor();
        addBody(body: RigidBody3): void;
        addForceLaw(forceLaw: ForceLaw3): void;
        epilog(): void;
        evaluate(state: number[], change: number[], stepSize: number, uomStep: Unit): void;
        getState(): number[];
        prolog(): void;
        removeBody(body: RigidBody3): void;
        removeForceLaw(forceLaw: ForceLaw3): void;
        setState(state: number[]): void;
        totalEnergy(): Geometric3;
        /**
         * Update the state variables following a change to the simulation bodies.
         */
        updateFromBodies(): void;
    }

    interface DiffEqSolver {
        step(stepSize: number, uomStep: Unit): void;
    }

    /**
     * 
     */
    class EulerMethod implements DiffEqSolver {
        constructor(simulation: Simulation);
        step(stepSize: number, uomStep: Unit): void;
    }

    /**
     * 
     */
    class ModifiedEuler implements DiffEqSolver {
        constructor(simulation: Simulation);
        step(stepSize: number, uomStep: Unit): void;
    }

    /**
     * 
     */
    class RungeKutta implements DiffEqSolver {
        constructor(simulation: Simulation);
        step(stepSize: number, uomStep: Unit): void;
    }

    interface EnergySystem {
        /**
         * 
         */
        totalEnergy(): Geometric3;
    }

    class AdaptiveStepSolver implements DiffEqSolver {
        /**
         * Whether to use second order differences for deciding when to reduce the step size.
         * The first difference is the change in energy of the system over a time step.
         * We can only use first differences when the energy of the system is constant.
         * If the energy of the system changes over time, then we need to reduce the step size
         * until the change of energy over the step stabilizes.  Put another way:  we reduce
         * the step size until the change in the change in energy becomes small.
         * true means use *change in change in energy* (second derivative)
         * as the criteria for accuracy
         */
        secondDiff: boolean;
        /**
         * The smallest time step that will executed.
         * Setting a reasonable lower bound prevents the solver from taking too long to give up.
         * This value may be reduced incrementally to improve the accuracy.
         * Default is 1E-5;
         */
        stepLBound: number;
        /**
         * Returns the tolerance used to decide if sufficient accuracy has been achieved.
         * Default is 1E-6.
         */
        tolerance: number;
        /**
         * 
         */
        constructor(diffEq: Simulation, energySystem: EnergySystem, diffEqSolver: DiffEqSolver);
        /**
         * 
         */
        step(stepSize: number, uomStep: Unit): void;
    }

    /**
     * An adaptive step solver that adjusts the step size in order to
     * ensure that the energy change be less than a tolerance amount.
     */
    class ConstantEnergySolver implements DiffEqSolver {
        /**
         * The smallest time step that will executed.
         * Setting a reasonable lower bound prevents the solver from taking too long to give up.
         * This value may be reduced incrementally to improve the accuracy.
         * Default is 1E-5;
         */
        stepLowerBound: number;
        /**
         * Returns the tolerance used to decide if sufficient accuracy has been achieved.
         * Default is 1E-6.
         */
        tolerance: number;
        /**
         * 
         */
        constructor(simulation: Simulation, energySystem: EnergySystem, solverMethod: DiffEqSolver);
        /**
         * 
         */
        step(stepSize: number, uomStep: Unit): void;
    }

    interface AdvanceStrategy {
        /**
         * 
         */
        advance(stepSize: number, uomStep: Unit): void;
    }

    class DefaultAdvanceStrategy implements AdvanceStrategy {
        /**
         * 
         */
        constructor(simulation: Simulation, solver: DiffEqSolver);
        advance(stepSize: number, uomStep: Unit): void;
    }

    /**
     * 
     */
    interface ForceBody3 {
        M: GeometricE3;
        X: VectorE3;
        R: SpinorE3;
        P: VectorE3;
        L: BivectorE3;
        Ω: BivectorE3;
        varsIndex: number;
        rotationalEnergy(): Geometric3;
        translationalEnergy(): Geometric3;
        updateAngularVelocity(): void;
    }

    /**
     * 
     */
    class ConstantForceLaw3 implements ForceLaw3 {
        /**
         * 
         */
        expireTime: number;
        /**
         * The attachment point to the body in body coordinates.
         */
        location: VectorE3;
        /**
         * 
         */
        constructor(body: RigidBody3, vector: VectorE3, vectorCoordType?: CoordType);
        /**
         * 
         */
        updateForces(): Force3[];
        /**
         * 
         */
        disconnect(): void;
        /**
         * 
         */
        potentialEnergy(): Geometric3;
    }

    /**
     * 
     */
    class GravitationLaw3 implements ForceLaw3 {
        /**
         * 
         */
        G: Geometric3;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body1: RigidBody3, body2: RigidBody3, G?: Geometric3);
        updateForces(): Force3[];
        disconnect(): void;
        potentialEnergy(): Geometric3;
    }

    /**
     * 
     */
    class Spring3 implements ForceLaw3 {
        /**
         * 
         */
        restLength: Geometric3;
        /**
         * 
         */
        stiffness: Geometric3;
        /**
         * 
         */
        attach1: VectorE3;
        /**
         * 
         */
        attach2: VectorE3;
        /**
         * 
         */
        end1: Geometric3;
        /**
         * 
         */
        end2: Geometric3;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body1: RigidBody3, body2: RigidBody3);
        updateForces(): Force3[];
        disconnect(): void;
        potentialEnergy(): Geometric3;
    }

    class DoubleRect {

    }

    class SimView {

    }

    /**
     * 
     */
    enum AxisChoice {
        HORIZONTAL = 1,
        VERTICAL = 2,
        BOTH = 3
    }

    /**
     * 
     */
    class AutoScale {
        /**
         * 
         */
        active: boolean;
        /**
         * 
         */
        axisChoice: AxisChoice;
        /**
         * 
         */
        enabled: boolean;
        /**
         * 
         */
        timeWindow: number;
        /**
         * 
         */
        constructor(view: SimView);
        /**
         * 
         */
        addGraphLine(graphLine: GraphLine): void;
        /**
         * 
         */
        clearRange(): void;
        /**
         * 
         */
        getRangeRect(): DoubleRect;
        /**
         * 
         */
        memorize(): void;
        // observe(event: SubjectEvent): void;
        /**
         * 
         */
        removeGraphLine(graphLine: GraphLine): void;
        /**
         * 
         */
        reset(): void;
    }

    enum AlignH {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2,
        FULL = 3
    }


    enum AlignV {
        TOP = 0,
        MIDDLE = 1,
        BOTTOM = 2,
        FULL = 3
    }

    /**
     * 
     */
    class DisplayAxes {

        /**
         * 
         */
        color: string;

        /**
         * The alignment for the horizontal axis.
         */
        hAxisAlign: AlignV;

        /**
         * The label for the horizontal axis.
         */
        hAxisLabel: string;

        /**
         * The scale for the horizontal axis (scalar).
         */
        hAxisScale: Unit;

        /**
         * The alignment for the vertical axis.
         */
        vAxisAlign: AlignH;

        /**
         * The label for the vertical axis.
         */
        vAxisLabel: string;

        /**
         * The scale for the vertical axis (scalar).
         */
        vAxisScale: Unit;
    }

    /**
     * 
     */
    enum DrawingMode {
        DOTS = 0,
        LINES = 1
    }

    /**
     * 
     */
    interface GraphLine {
        /**
         * 
         */
        color: string;
        /**
         * 
         */
        drawingMode: DrawingMode;
        /**
         * The variable index used for the horizontal coordinate.
         */
        hCoordIndex: number;
        /**
         * 
         */
        hotspotColor: string;
        /**
         * 
         */
        lineWidth: number;
        /**
         * 
         */
        varsList: VarsList;
        /**
         * The variable index used for the vertical coordinate.
         */
        vCoordIndex: number;
        /**
         * 
         */
        // getGraphPoints(): CircularList<GraphPoint>;
        // getGraphStyle(index: number): GraphStyle;
        /**
         * 
         */
        getXVarName(): string;
        /**
         * 
         */
        getYVarName(): string;
        reset(): void;
        resetStyle(): void;
    }

    /**
     * 
     */
    class Graph {
        /**
         * 
         */
        autoScale: AutoScale;
        /**
         * 
         */
        axes: DisplayAxes;
        /**
         * 
         */
        constructor(canvasId: string, varsList: VarsList);
        /**
         * 
         */
        addGraphLine(hCoordIndex: number, vCoordIndex: number, color?: string): GraphLine;
        /**
         * 
         */
        memorize(): void;
        /**
         * 
         */
        removeGraphLine(graphLine: GraphLine): void;
        /**
         * 
         */
        render(): void;
        /**
         * 
         */
        reset(): void;
    }
}

declare module 'newton' {
    export = NEWTON;
}
