// Type definitions for davinci-newton 1.0.12
// Project: https://github.com/geometryzen/davinci-newton
// Definitions by: David Geo Holmes david.geo.holmes@gmail.com https://www.stemcstudio.com
//
// This file was created manually in order to support the davinci-newton library.
// These declarations are appropriate when using the library through the global
// variable, 'NEWTON'.
//

export = NEWTON;
export as namespace NEWTON;

/**
 * JavaScript Physics Engine library for mathematical physics using Geometric Algebra.
 */
declare namespace NEWTON {

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
        readonly denom: number;

        /**
         * The numerator.
         */
        readonly numer: number;

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
         * Determines whether this rational number is the multiplicative identity, 1.
         */
        isOne(): boolean

        /**
         * Determines whether this rational number is the additive identity, 0.
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
        readonly M: QQ;
        readonly L: QQ;
        readonly T: QQ;
        readonly Q: QQ;
        readonly temperature: QQ;
        readonly amount: QQ;
        readonly intensity: QQ;
        constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity: QQ);
        isOne(): boolean;
        isZero(): boolean;
        inv(): Dimensions;
        neg(): Dimensions;

        /**
         *
         */
        static readonly ONE: Dimensions;

        /**
         *
         */
        static readonly MASS: Dimensions;

        /**
         *
         */
        static readonly LENGTH: Dimensions;

        /**
         *
         */
        static readonly TIME: Dimensions;

        /**
         *
         */
        static readonly ELECTRIC_CHARGE: Dimensions;

        /**
         *
         */
        static readonly ELECTRIC_CURRENT: Dimensions;

        /**
         *
         */
        static readonly THERMODYNAMIC_TEMPERATURE: Dimensions;

        /**
         *
         */
        static readonly AMOUNT_OF_SUBSTANCE: Dimensions;

        /**
         *
         */
        static readonly LUMINOUS_INTENSITY: Dimensions;
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
        public static valueOf(multiplier: number, dimensions: Dimensions, labels: string[]): Unit;

        /**
         * 
         */
        private constructor(multiplier: number, dimensions: Dimensions, labels: string[]);

        /**
         * Computes the unit equal to `this / rhs`.
         */
        div(rhs: Unit): Unit;

        /**
         * 
         */
        isOne(): boolean;

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

    /**
     * 
     */
    interface Simulation {
        /**
         * 
         */
        readonly time: number;

        /**
         * Handler for actions to be performed before getState and the evaluate calls.
         */
        prolog(): void;

        /**
         * Gets the state vector, Y(t).
         */
        getState(): number[];

        /**
         * Computes the derivatives of the state variables based upon the specified state.
         */
        evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void;

        /**
         * Sets the state vector, Y(t).
         */
        setState(state: number[]): void;

        /**
         * Handler for actions to be performed after the evaluate calls and setState.
         * Computes the system energy, linear momentum and angular momentum.
         */
        epilog(): void;
    }

    class VarsList {
        constructor(varNames: string[]);
        addVariables(names: string[]): number;
        deleteVariables(index: number, howMany: number): void;
        incrSequence(...indexes: number[]): void;
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

    interface VectorE2 {
        x: number;
        y: number;
        uom: Unit;
    }

    interface VectorE3 {
        x: number;
        y: number;
        z: number;
        uom: Unit;
    }

    interface BivectorE2 {
        xy: number;
        uom: Unit;
    }

    interface BivectorE3 {
        yz: number;
        zx: number;
        xy: number;
        uom: Unit;
    }

    interface SpinorE2 extends Scalar, BivectorE2 {
    }

    interface SpinorE3 extends Scalar, BivectorE3 {
    }

    /**
     * The coordinates for a multivector in 2D in geometric Cartesian basis.
     */
    interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {

    }

    /**
     * The coordinates for a multivector in 3D in geometric Cartesian basis.
     */
    interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {

    }

    /**
     * A mutable multivector in 3D with a Euclidean metric and optional unit of measure.
     */
    class Geometric2 implements GeometricE2 {
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
         * Do not call this constructor. Use the static construction methods instead.
         */
        constructor(coords?: number[], uom?: Unit, code?: number);

        /**
         * Adds M * α to this multivector.
         *
         * this ⟼ this + M * α
         */
        add(M: GeometricE2, α?: number): Geometric2;

        /**
         * Sets this multivector to the sum of a and b.
         *
         * this ⟼ a + b
         */
        add2(a: GeometricE2, b: GeometricE2): Geometric2;

        /**
         * Adds the pseudoscalar coordinate to this multivector.
         */
        addPseudo(β: number, uom?: Unit): Geometric2;

        /**
         * Adds the scalar coordinate to this multivector.
         */
        addScalar(α: number, uom?: Unit): Geometric2;

        /**
         * Adds v * α to this multivector where v is a vector and α is an optional scalar.
         *
         * this ⟼ this + v * α
         */
        addVector(v: VectorE2, α?: number): Geometric2;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): Geometric2;

        /**
         * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
         */
        approx(n: number): Geometric2;

        /**
         * Returns a clone of this multivector.
         */
        clone(): Geometric2;

        /**
         * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
         * 
         * this ⟼ conj(this)
         */
        conj(): Geometric2;

        /**
         * Copies the multivector M into this multivector.
         *
         * this ⟼ copy(M)
         */
        copy(M: GeometricE2): Geometric2;

        /**
         * 
         */
        copyBivector(B: BivectorE2): Geometric2;

        /**
         * Copies the scalar α into this multivector.
         *
         * this ⟼ copy(α, uom)
         */
        copyScalar(α: number, uom?: Unit): Geometric2;

        /**
         * Copies the spinor into this multivector.
         *
         * this ⟼ copy(spinor)
         */
        copySpinor(spinor: SpinorE2): Geometric2;

        /**
         * Copies the vector into this multivector.
         *
         * this ⟼ copyVector(vector)
         */
        copyVector(vector: VectorE2): Geometric2;

        /**
         * Normalizes this multivector by dividing it by its magnitude.
         */
        direction(mutate?: boolean): Geometric2;

        /**
         * Sets this multivector to the result of division by another multivector.
         * 
         * this ⟼ this / m
         * 
         */
        div(m: GeometricE2): Geometric2;

        /**
         * 
         * this ⟼ a / b
         * 
         * a
         * b
         */
        div2(a: SpinorE2, b: SpinorE2): Geometric2;

        /**
         * 
         * this ⟼ this / α
         * 
         */
        divByNumber(α: number): Geometric2;

        /**
         * 
         * this ⟼ this / (α * uom)
         * 
         */
        divByScalar(α: number, uom: Unit): Geometric2;

        /**
         * 
         */
        divByVector(vector: VectorE2): Geometric2;

        /**
         * 
         */
        dual(m?: GeometricE2): Geometric2;

        /**
         * 
         */
        equals(other: any): boolean;

        /**
         * 
         * this ⟼ e<sup>this</sup>
         * 
         */
        exp(): Geometric2;

        /**
         * 
         * this ⟼ this ^ m
         * 
         * m
         */
        ext(m: GeometricE2): Geometric2;

        /**
         * 
         * this ⟼ a ^ b
         * 
         * a
         * b
         */
        ext2(a: GeometricE2, b: GeometricE2): Geometric2;

        /**
         * Sets this multivector to the result of keeping only the specified grade.
         * This is the grade extraction operation.
         */
        grade(grade: number): Geometric2;

        /**
         * Sets this multivector to its inverse.
         * this ⟼ conj(this) / quad(this)
         */
        inv(): Geometric2;

        /**
         * 
         */
        isLocked(): boolean;

        isOne(): boolean;

        isZero(): boolean;

        /**
         * Sets this multivector to the unit pseudoscalar.
         */
        I(): Geometric2;

        /**
         * Sets this multivector to the left contraction with another multivector.
         * 
         * this ⟼ this << m
         * 
         * m
         */
        lco(m: GeometricE2): Geometric2;

        /**
         * Sets this multivector to the left contraction of two multivectors. 
         * 
         * this ⟼ a << b
         * 
         * a
         * b
         */
        lco2(a: GeometricE2, b: GeometricE2): Geometric2;

        /**
         * 
         * this ⟼ this + α * (target - this)
         * 
         * target
         * α
         */
        lerp(target: GeometricE2, α: number): Geometric2;

        /**
         * 
         * this ⟼ a + α * (b - a)
         * 
         * a {GeometricE3}
         * b {GeometricE3}
         * α {number}
         */
        lerp2(a: GeometricE2, b: GeometricE2, α: number): Geometric2;

        /**
         * 
         */
        lock(): number;

        /**
         * 
         * this ⟼ log(this)
         * 
         */
        log(): Geometric2;

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(mutate?: boolean): Geometric2;

        /**
         * 
         * this ⟼ this * s
         * 
         * m {GeometricE3}
         */
        mul(m: GeometricE2): Geometric2;

        /**
         * 
         * this ⟼ a * b
         * 
         * a
         * b
         */
        mul2(a: GeometricE2, b: GeometricE2): Geometric2;

        /**
         * this ⟼ this * α
         */
        mulByNumber(α: number): Geometric2;

        /**
         * this ⟼ this * (α * uom)
         */
        mulByScalar(α: number, uom: Unit): Geometric2;

        /**
         * 
         * this ⟼ -1 * this
         * 
         */
        neg(): Geometric2;

        /**
         * 
         * this ⟼ sqrt(this * conj(this))
         * 
         */
        norm(): Geometric2;

        /**
         * Sets this multivector to the identity element for multiplication, 1.
         */
        one(): Geometric2;

        /**
         * 
         * this ⟼ this | ~this = scp(this, rev(this))
         * 
         */
        quaditude(mutate?: boolean): Geometric2;

        /**
         * Sets this multivector to the right contraction with another multivector.
         * 
         * this ⟼ this >> m
         * 
         * m
         */
        rco(m: GeometricE2): Geometric2;

        /**
         * Sets this multivector to the right contraction of two multivectors.
         * 
         * this ⟼ a >> b
         * 
         * a
         * b
         */
        rco2(a: GeometricE2, b: GeometricE2): Geometric2;

        /**
         * 
         * this ⟼ - n * this * n
         * 
         * n
         */
        reflect(n: VectorE2): Geometric2;

        /**
         * 
         * this ⟼ rev(this)
         * 
         */
        rev(): Geometric2;

        /**
         * 
         * this ⟼ R * this * rev(R)
         * 
         * R
         */
        rotate(R: SpinorE2): Geometric2;

        /**
         * Sets this multivector to a rotor representing a rotation from a to b.
         * this = ⟼ R, where
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         *
         * a The <em>from</em> vector.
         * b The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2;

        /**
         * 
         */
        rotorFromFrameToFrame(es: VectorE2[], fs: VectorE2[]): Geometric2;

        /**
         * Sets this multivector to a rotor represented by the plane B and angle θ.
         * this = ⟼ R = exp(- B * θ / 2)
         *
         * B is the (unit) bivector generating the rotation, B * B = -1.
         * θ The rotation angle in radians.
         */
        rotorFromGeneratorAngle(B: BivectorE2, θ: number): Geometric2;

        /**
         * R = (|b||a| + b a) / sqrt(2 |b||a|(|b||a| + b << a))
         * 
         * The result is independent of the magnitudes of a and b.
         */
        rotorFromVectorToVector(a: VectorE2, b: VectorE2, B: BivectorE2): Geometric2;

        /**
         * 
         * this ⟼ scp(this, m)
         * 
         * m
         */
        scp(m: GeometricE2): Geometric2;

        /**
         * 
         * this ⟼ scp(a, b)
         * 
         * a
         * b
         */
        scp2(a: GeometricE2, b: GeometricE2): Geometric2;

        /**
         * Currently limited to taking the square root of a positive scalar quantity.
         */
        sqrt(): Geometric2;

        /**
         * Computes the <em>squared norm</em> of this multivector.
         */
        squaredNorm(mutate?: boolean): Geometric2;

        /**
         * 
         * this ⟼ this - M * α
         * 
         * M
         * α
         */
        sub(M: GeometricE2, α?: number): Geometric2;

        /**
         * 
         * this ⟼ a - b
         * 
         * a
         * b
         */
        sub2(a: GeometricE2, b: GeometricE2): Geometric2;

        /**
         * Subtracts v * α from this multivector where v is a vector and α is an optional scalar.
         *
         * this ⟼ this - v * α
         */
        subVector(v: VectorE2, α?: number): Geometric2;

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
        unlock(token: number): void;

        /**
         * 
         * this ⟼ a * b
         * 
         * Sets this Geometric2 to the geometric product a * b of the vector arguments.
         * a
         * b
         */
        versor(a: VectorE2, b: VectorE2): Geometric2;

        /**
         * 
         */
        writeVector(vector: VectorE2): void;

        /**
         * Sets this multivector to the identity element for addition, 0.
         */
        zero(): Geometric2;

        /**
         * Standard Basis vector corresponding to the x coordinate.
         * The e1 multivector (vector) is immutable (locked).
         */
        static readonly e1: Geometric2;

        /**
         * Basis vector corresponding to the y coordinate.
         * The e2 multivector (vector) is immutable (locked).
         */
        static readonly e2: Geometric2;

        /**
         * Basis vector corresponding to the pseudoscalar coordinate.
         * The I multivector (pseudoscalar) is immutable (locked).
         */
        static readonly I: Geometric2;

        /**
         * The identity element for multiplication, 1 (scalar).
         * The one multivector (scalar) is immutable (locked).
         */
        static readonly one: Geometric2;

        /**
         * The identity element for addition, 0.
         * The zero multivector is immutable (locked).
         */
        static readonly zero: Geometric2;

        /**
         * SI base unit of length.
         * The meter is the length of the path travelled by light in vacuum
         * during a time interval of 1 / 299 792 458 of a second.
         * The meter multivector (scalar) is immutable (locked).
         */
        static readonly meter: Geometric2;

        /**
         * SI base unit of mass.
         * The kilogram is the unit of mass; it is equal to the mass of the
         * international prototype of the kilogram.
         * The kilogram multivector (scalar) is immutable (locked).
         */
        static readonly kilogram: Geometric2;

        /**
         * SI base unit of time.
         * The second is the duration of 9 192 631 770 periods of the radiation
         * corresponding to the transition between
         * the two hyperfine levels of the ground state of the cesium 133 atom.
         * The second multivector (scalar) is immutable (locked).
         */
        static readonly second: Geometric2;

        /**
         * SI base unit of electric current.
         * The ampere is that constant current which, if maintained in two straight parallel
         * conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum,
         * would produce between these conductors a force equal to 2E-7 newton per meter of length.
         * The ampere multivector (scalar) is immutable (locked).
         */
        static readonly ampere: Geometric2;

        /**
         * SI base unit of thermodynamic temperature.
         * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature
         * of the triple point of water.
         * The kelvin multivector (scalar) is immutable (locked).
         */
        static readonly kelvin: Geometric2;

        /**
         * SI base unit of amount of substance.
         * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are
         * atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
         * 
         * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions,
         * electrons, other particles, or specified groups of such particles.
         * The mole multivector (scalar) is immutable (locked).
         */
        static readonly mole: Geometric2;

        /**
         * SI base unit of luminous intensity.
         * The candela is the luminous intensity, in a given direction,
         * of a source that emits monochromatic radiation of frequency 540 x 10E12
         * hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
         * The candela multivector (scalar) is immutable (locked).
         */
        static readonly candela: Geometric2;

        /**
         * SI derived unit of electric charge, quantity of electricity.
         * The coulomb multivector (scalar) is immutable (locked).
         */
        static readonly coulomb: Geometric2;

        /**
         * SI derived unit of force.
         * The newton multivector (scalar) is immutable (locked).
         */
        static readonly newton: Geometric2;

        /**
         * SI derived unit of energy, work, quantity of heat.
         * The joule multivector (scalar) is immutable (locked).
         */
        static readonly joule: Geometric2;

        /**
         * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
         */
        static bivector(xy: number, uom?: Unit): Geometric2;

        static copy(m: GeometricE2): Geometric2;

        static dual(m: GeometricE2): Geometric2;

        static dualOfBivector(B: BivectorE2): Geometric2;

        static dualOfVector(v: VectorE2): Geometric2;

        /**
         * Creates a copy of a bivector.
         */
        static fromBivector(B: BivectorE3): Geometric3;

        /**
         * Creates a copy of a scalar.
         */
        static fromScalar(scalar: Scalar): Geometric2;

        /**
         * Creates a copy of a spinor.
         */
        static fromSpinor(spinor: SpinorE2): Geometric2;

        /**
         * Creates a copy of a vector.
         */
        static fromVector(vector: VectorE2): Geometric2;

        /**
         * Computes a random multivector.
         */
        static random(): Geometric2;

        /**
         * Computes the rotor that rotates vector a to vector b.
         * a The from vector.
         * b The to vector.
         */
        static rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2;

        /**
         * Computes the rotor that rotates vector a to vector b.
         * a The from vector.
         * b The to vector.
         * B The plane of rotation when the rotation plane is ambiguous.
         */
        static rotorFromVectorToVector(a: VectorE2, b: VectorE2, B: BivectorE2): Geometric2;

        /**
         * Constructs a new scalar from a number and a unit of measure.
         * The multivector (scalar) is mutable (unlocked).
         */
        static scalar(α: number, uom?: Unit): Geometric2;

        static spinor(a: number, xy: number, uom?: Unit): Geometric2;

        /**
         * Constructs a new vector from Cartesian coordinates and a unit of measure.
         * The multivector (vector) is mutable (unlocked).
         */
        static vector(x: number, y: number, uom?: Unit): Geometric2;

        static wedge(a: Geometric2, b: Geometric2): Geometric2;
    }

    /**
     * A mutable multivector in 3D with a Euclidean metric and optional unit of measure.
     */
    class Geometric3 implements GeometricE3 {
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
         * Do not call this constructor. Use the static construction methods instead.
         */
        constructor(coords?: number[], uom?: Unit, code?: number);

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
         * Returns a clone of this multivector.
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
        direction(mutate?: boolean): Geometric3;

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
         */
        dual(m?: GeometricE3): Geometric3;

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
        magnitude(mutate?: boolean): Geometric3;

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
        quaditude(mutate?: boolean): Geometric3;

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
         * Currently limited to taking the square root of a positive scalar quantity.
         */
        sqrt(): Geometric3;

        /**
         * Computes the <em>squared norm</em> of this multivector.
         */
        squaredNorm(mutate?: boolean): Geometric3;

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
         * Standard Basis vector corresponding to the x coordinate.
         * The e1 multivector (vector) is immutable (locked).
         */
        static readonly e1: Geometric3;

        /**
         * Basis vector corresponding to the y coordinate.
         * The e2 multivector (vector) is immutable (locked).
         */
        static readonly e2: Geometric3;

        /**
         * Basis vector corresponding to the z coordinate.
         * The e3 multivector (vector) is immutable (locked).
         */
        static readonly e3: Geometric3;

        /**
         * Basis vector corresponding to the pseudoscalar coordinate.
         * The I multivector (pseudoscalar) is immutable (locked).
         */
        static readonly I: Geometric3;

        /**
         * The identity element for multiplication, 1 (scalar).
         * The one multivector (scalar) is immutable (locked).
         */
        static readonly one: Geometric3;

        /**
         * The identity element for addition, 0.
         * The zero multivector is immutable (locked).
         */
        static readonly zero: Geometric3;

        /**
         * SI base unit of length.
         * The meter is the length of the path travelled by light in vacuum
         * during a time interval of 1 / 299 792 458 of a second.
         * The meter multivector (scalar) is immutable (locked).
         */
        static readonly meter: Geometric3;

        /**
         * SI base unit of mass.
         * The kilogram is the unit of mass; it is equal to the mass of the
         * international prototype of the kilogram.
         * The kilogram multivector (scalar) is immutable (locked).
         */
        static readonly kilogram: Geometric3;

        /**
         * SI base unit of time.
         * The second is the duration of 9 192 631 770 periods of the radiation
         * corresponding to the transition between
         * the two hyperfine levels of the ground state of the cesium 133 atom.
         * The second multivector (scalar) is immutable (locked).
         */
        static readonly second: Geometric3;

        /**
         * SI base unit of electric current.
         * The ampere is that constant current which, if maintained in two straight parallel
         * conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum,
         * would produce between these conductors a force equal to 2E-7 newton per meter of length.
         * The ampere multivector (scalar) is immutable (locked).
         */
        static readonly ampere: Geometric3;

        /**
         * SI base unit of thermodynamic temperature.
         * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature
         * of the triple point of water.
         * The kelvin multivector (scalar) is immutable (locked).
         */
        static readonly kelvin: Geometric3;

        /**
         * SI base unit of amount of substance.
         * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are
         * atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
         * 
         * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions,
         * electrons, other particles, or specified groups of such particles.
         * The mole multivector (scalar) is immutable (locked).
         */
        static readonly mole: Geometric3;

        /**
         * SI base unit of luminous intensity.
         * The candela is the luminous intensity, in a given direction,
         * of a source that emits monochromatic radiation of frequency 540 x 10E12
         * hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
         * The candela multivector (scalar) is immutable (locked).
         */
        static readonly candela: Geometric3;

        /**
         * SI derived unit of electric charge, quantity of electricity.
         * The coulomb multivector (scalar) is immutable (locked).
         */
        static readonly coulomb: Geometric3;

        /**
         * SI derived unit of force.
         * The newton multivector (scalar) is immutable (locked).
         */
        static readonly newton: Geometric3;

        /**
         * SI derived unit of energy, work, quantity of heat.
         * The joule multivector (scalar) is immutable (locked).
         */
        static readonly joule: Geometric3;

        /**
         * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
         */
        static bivector(yz: number, zx: number, xy: number, uom?: Unit): Geometric3;

        static copy(m: GeometricE3): Geometric3;

        static dual(m: GeometricE3): Geometric3;

        static dualOfBivector(B: BivectorE3): Geometric3;

        static dualOfVector(v: VectorE3): Geometric3;

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
         * Computes a random multivector.
         */
        static random(): Geometric3;

        /**
         * Computes the rotor that rotates vector a to vector b.
         * a The from vector.
         * b The to vector.
         */
        static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;

        /**
         * Computes the rotor that rotates vector a to vector b.
         * a The from vector.
         * b The to vector.
         * B The plane of rotation when the rotation plane is ambiguous.
         */
        static rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3;

        /**
         * Constructs a new scalar from a number and a unit of measure.
         * The multivector (scalar) is mutable (unlocked).
         */
        static scalar(α: number, uom?: Unit): Geometric3;

        static spinor(a: number, yz: number, zx: number, xy: number, uom?: Unit): Geometric3;

        /**
         * Constructs a new vector from Cartesian coordinates and a unit of measure.
         * The multivector (vector) is mutable (unlocked).
         */
        static vector(x: number, y: number, z: number, uom?: Unit): Geometric3;

        static wedge(a: Geometric3, b: Geometric3): Geometric3;
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

    export interface Metric<T> {
        a(mv: T): number;

        add(lhs: T, rhs: T): T;

        addVector(lhs: T, rhs: T): T;

        applyMatrix(mv: T, matrix: MatrixLike): T;

        copy(source: T, target: T): T;

        copyBivector(source: T, target: T): T;

        copyScalar(a: number, uom: Unit, target: T): T;

        copyVector(source: T, target: T): T;

        direction(mv: T, mutate: boolean): T;

        divByScalar(lhs: T, a: number, uom: Unit): T;

        ext(lhs: T, rhs: T): T;

        isZero(mv: T): boolean;

        lock(mv: T): number;

        magnitude(mv: T, mutate: boolean): T;

        mulByNumber(lhs: T, alpha: number): T;

        mulByScalar(lhs: T, a: number, uom: Unit): T;

        mulByVector(lhs: T, rhs: T): T;

        neg(mv: T): T;

        quaditude(mv: T, mutate: boolean): T;

        rev(mv: T): T;

        rotate(mv: T, spinor: T): T;

        /**
         * Creates a grade 0 (scalar) multivector with value `a * uom`.
         * The scalar returned is in the unlocked (mutable) state.
         * @param a The scaling factor for the unit of measure.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        scalar(a: number, uom?: Unit): T;

        scp(lhs: T, rhs: T): T;

        setUom(mv: T, uom: Unit): void;

        sub(lhs: T, rhs: T): T;

        subScalar(lhs: T, rhs: T): T;

        subVector(lhs: T, rhs: T): T;

        unlock(mv: T, token: number): void;

        uom(mv: T): Unit;

        write(source: T, target: T): void;

        writeVector(source: T, target: T): void;

        zero(): T;
    }

    class Euclidean2 implements Metric<Geometric2> {
        a(mv: Geometric2): number;
        add(lhs: Geometric2, rhs: Geometric2): Geometric2;
        addVector(lhs: Geometric2, rhs: Geometric2): Geometric2;
        applyMatrix(mv: Geometric2, matrix: MatrixLike): Geometric2;
        copy(source: Geometric2, target: Geometric2): Geometric2;
        copyBivector(source: Geometric2, target: Geometric2): Geometric2;
        copyScalar(a: number, uom: Unit, target: Geometric2): Geometric2;
        copyVector(source: Geometric2, target: Geometric2): Geometric2;
        direction(mv: Geometric2, mutate: boolean): Geometric2;
        divByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2;
        ext(lhs: Geometric2, rhs: Geometric2): Geometric2;
        isZero(mv: Geometric2): boolean;
        lock(mv: Geometric2): number;
        magnitude(mv: Geometric2, mutate: boolean): Geometric2;
        mulByNumber(lhs: Geometric2, alpha: number): Geometric2;
        mulByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2;
        mulByVector(lhs: Geometric2, rhs: Geometric2): Geometric2;
        neg(mv: Geometric2): Geometric2;
        quaditude(mv: Geometric2, mutate: boolean): Geometric2;
        rev(mv: Geometric2): Geometric2;
        rotate(mv: Geometric2, spinor: Geometric2): Geometric2;
        scalar(a: number, uom?: Unit): Geometric2;
        scp(lhs: Geometric2, rhs: Geometric2): Geometric2;
        setUom(mv: Geometric2, uom: Unit): void;
        sub(lhs: Geometric2, rhs: Geometric2): Geometric2;
        subScalar(lhs: Geometric2, rhs: Geometric2): Geometric2;
        subVector(lhs: Geometric2, rhs: Geometric2): Geometric2;
        unlock(mv: Geometric2, token: number): void;
        uom(mv: Geometric2): Unit;
        write(source: Geometric2, target: Geometric2): void;
        writeVector(source: Geometric2, target: Geometric2): void;
        zero(): Geometric2;
    }

    class Euclidean3 implements Metric<Geometric3> {
        a(mv: Geometric3): number;
        add(lhs: Geometric3, rhs: Geometric3): Geometric3;
        addVector(lhs: Geometric3, rhs: Geometric3): Geometric3;
        applyMatrix(mv: Geometric3, matrix: MatrixLike): Geometric3;
        copy(source: Geometric3, target: Geometric3): Geometric3;
        copyBivector(source: Geometric3, target: Geometric3): Geometric3;
        copyScalar(a: number, uom: Unit, target: Geometric3): Geometric3;
        copyVector(source: Geometric3, target: Geometric3): Geometric3;
        direction(mv: Geometric3, mutate: boolean): Geometric3;
        divByScalar(lhs: Geometric3, a: number, uom: Unit): Geometric3;
        ext(lhs: Geometric3, rhs: Geometric3): Geometric3;
        isZero(mv: Geometric3): boolean;
        lock(mv: Geometric3): number;
        magnitude(mv: Geometric3, mutate: boolean): Geometric3;
        mulByNumber(lhs: Geometric3, alpha: number): Geometric3;
        mulByScalar(lhs: Geometric3, a: number, uom: Unit): Geometric3;
        mulByVector(lhs: Geometric3, rhs: Geometric3): Geometric3;
        neg(mv: Geometric3): Geometric3;
        quaditude(mv: Geometric3, mutate: boolean): Geometric3;
        rev(mv: Geometric3): Geometric3;
        rotate(mv: Geometric3, spinor: Geometric3): Geometric3;
        scalar(a: number, uom?: Unit): Geometric3;
        scp(lhs: Geometric3, rhs: Geometric3): Geometric3;
        setUom(mv: Geometric3, uom: Unit): void;
        sub(lhs: Geometric3, rhs: Geometric3): Geometric3;
        subScalar(lhs: Geometric3, rhs: Geometric3): Geometric3;
        subVector(lhs: Geometric3, rhs: Geometric3): Geometric3;
        unlock(mv: Geometric3, token: number): void;
        uom(mv: Geometric3): Unit;
        write(source: Geometric3, target: Geometric3): void;
        writeVector(source: Geometric3, target: Geometric3): void;
        zero(): Geometric3;
    }

    export interface Dynamics<T> {
        /**
         * The rate of change of position is the velocity.
         * dX/dt = V = P / M
         * 
         * @param rateOfChange 
         * @param idx 
         * @param body 
         */
        setPositionRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<T>): void;
        /**
         * 
         * @param rateOfChange 
         * @param idx 
         * @param body 
         */
        setAttitudeRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<T>): void;
        /**
         * 
         * @param rateOfChange
         * @param idx 
         */
        zeroLinearMomentum(rateOfChange: number[], idx: number): void;
        /**
         * 
         * @param rateOfChange
         * @param idx 
         */
        zeroAngularMomentum(rateOfChange: number[], idx: number): void;
        /**
         * 
         * @param vars 
         * @param idx 
         * @param body 
         */
        updateBody(vars: number[], idx: number, body: ForceBody<T>): void;
        updateVarsFromBody(body: ForceBody<T>, idx: number, vars: VarsList): void;

        addForce(rateOfChange: number[], idx: number, force: T): void;
        addTorque(rateOfChange: number[], idx: number, torque: T): void;
        epilog(bodies: ForceBody<T>[], forceLaws: ForceLaw<T>[], potentialOffset: T, vars: VarsList): void;
        discontinuousEnergyVariables(): number[];
        getOffsetName(offset: number): string;
        getVarNames(): string[];
        numVariablesPerBody(): number;
    }

    class Dynamics2 implements Dynamics<Geometric2> {
        setPositionRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<Geometric2>): void;
        setAttitudeRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<Geometric2>): void;
        zeroLinearMomentum(rateOfChange: number[], idx: number): void;
        zeroAngularMomentum(rateOfChange: number[], idx: number): void;
        updateBody(vars: number[], idx: number, body: ForceBody<Geometric2>): void;
        updateVarsFromBody(body: ForceBody<Geometric2>, idx: number, vars: VarsList): void;
        addForce(rateOfChange: number[], idx: number, force: Geometric2): void;
        addTorque(rateOfChange: number[], idx: number, torque: Geometric2): void;
        epilog(bodies: ForceBody<Geometric2>[], forceLaws: ForceLaw<Geometric2>[], potentialOffset: Geometric2, vars: VarsList): void;
        discontinuousEnergyVariables(): number[];
        getOffsetName(offset: number): string;
        getVarNames(): string[];
        numVariablesPerBody(): number;
    }

    class Dynamics3 implements Dynamics<Geometric3> {
        setPositionRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<Geometric3>): void;
        setAttitudeRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<Geometric3>): void;
        zeroLinearMomentum(rateOfChange: number[], idx: number): void;
        zeroAngularMomentum(rateOfChange: number[], idx: number): void;
        updateBody(vars: number[], idx: number, body: ForceBody<Geometric3>): void;
        updateVarsFromBody(body: ForceBody<Geometric3>, idx: number, vars: VarsList): void;
        addForce(rateOfChange: number[], idx: number, force: Geometric3): void;
        addTorque(rateOfChange: number[], idx: number, torque: Geometric3): void;
        epilog(bodies: ForceBody<Geometric3>[], forceLaws: ForceLaw<Geometric3>[], potentialOffset: Geometric3, vars: VarsList): void;
        discontinuousEnergyVariables(): number[];
        getOffsetName(offset: number): string;
        getVarNames(): string[];
        numVariablesPerBody(): number;
    }

    /**
     * 
     */
    class RigidBody<T> implements ForceBody<T>, SimObject {
        metric: Metric<T>;
        /**
         * The application defined unique identifier.
         */
        uuid: string;
        /**
         * The center of mass position vector in local coordinates.
         */
        centerOfMassLocal: T;
        /**
         * Mass (scalar).
         */
        M: T;
        /**
         * Electric Charge (scalar).
         */
        Q: T;
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
        X: T;
        /**
         * Attitude (spinor)
         */
        R: T;
        /**
         * Linear momentum (vector).
         */
        P: T;
        /**
         * Angular momentum (bivector).
         */
        L: T;
        /**
         * Angular velocity (bivector).
         */
        Ω: T;
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
        constructor(metric: Metric<T>);
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
        rotationalEnergy(): T;
        /**
         * 
         */
        translationalEnergy(): T;
    }

    /**
     * A rectangular block of uniform surface density.
     */
    class Block2 extends RigidBody<Geometric2> {
        width: Geometric2;
        height: Geometric2;
        constructor(width?: GeometricE2, height?: GeometricE2);
    }

    /**
     * A rectangular block of uniform volume density.
     */
    class Block3 extends RigidBody<Geometric3> {
        width: Geometric3;
        height: Geometric3;
        depth: Geometric3;
        constructor(width?: GeometricE3, height?: GeometricE3, depth?: GeometricE3);
    }

    /**
     * A solid cylinder of uniform density.
     */
    class Cylinder3 extends RigidBody<Geometric3> {
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
     * A thin, solid disk of uniform surface density.
     */
    class Disc2 extends RigidBody<Geometric2> {
        radius: Geometric2;
        constructor(radius?: GeometricE2);
    }

    /**
     * An object with no internal structure.
     */
    class Particle<T> extends RigidBody<T> {

        /**
         * M is the mass of the particle. Defaults to 1.
         * Q is the electric charge of the particle. Defaults to 0.
         */
        constructor(mass: T, charge: T, metric: Metric<T>);
    }

    /**
     * A solid sphere of uniform density.
     */
    class Sphere3 extends RigidBody<Geometric3> {
        /**
         * 
         */
        radius: Geometric3;
        /**
         * 
         */
        constructor(radius?: GeometricE3);
    }

    type CoordType = 0 | 1;

    /**
     * The application of a force to a particle in a rigid body.
     */
    class Force<T> implements SimObject {
        /**
         * 
         */
        F: T;
        /**
         * 
         */
        x: T;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body: RigidBody<T>, metric: Metric<T>);
        /**
         * 
         */
        getBody(): RigidBody<T>;
    }

    /**
     *
     */
    export class Force2 extends Force<Geometric2> {
        constructor(body: ForceBody<Geometric2>);
    }

    /**
     *
     */
    export class Force3 extends Force<Geometric3> {
        constructor(body: ForceBody<Geometric3>);
    }

    interface ForceLaw<T> extends SimObject {
        updateForces(): Force<T>[];
        disconnect(): void;
        potentialEnergy(): T;
    }

    /**
     * The State engine computes the derivatives of the kinematic variables X, R, P, J for each body,
     * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
     */
    class State<T> implements Simulation, EnergySystem<T> {
        /**
         * 
         */
        readonly metric: Metric<T>;
        /**
         * 
         */
        bodies: ForceBody<T>[];

        /**
         * Determines whether calculated forces will be added to the simulation list.
         */
        showForces: boolean;

        /**
         * 
         */
        simList: SimList;

        /**
         * 
         */
        time: number;

        /**
         * 
         */
        varsList: VarsList;

        /**
         * Constructs a Physics engine for 3D simulations.
         */
        constructor(metric: Metric<T>, dynamics: Dynamics<T>);

        /**
         * 
         */
        addBody(body: ForceBody<T>): void;

        /**
         * 
         */
        addForceLaw(forceLaw: ForceLaw<T>): void;

        /**
         * Handler for actions to be performed after the evaluate calls and setState.
         * Computes the system energy, linear momentum and angular momentum.
         */
        epilog(): void;

        /**
         * 
         */
        evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void;

        /**
         * 
         */
        getState(): number[];

        /**
         * 
         */
        prolog(): void;
        /**
         * 
         */
        removeBody(body: ForceBody<T>): void;
        /**
         * 
         */
        removeForceLaw(forceLaw: ForceLaw<T>): void;
        /**
         * Sets the 
         */
        setState(state: number[]): void;
        /**
         * 
         */
        totalEnergy(): T;
        /**
         * Update the state variables following a change to the simulation bodies.
         */
        updateFromBodies(): void;
    }

    /**
     * The Physics2 engine computes the derivatives of the kinematic variables X, R, P, J for each body,
     * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
     * It uses Geometric2 to provide the Geometric Algebra of Euclidean Space with a 3,0 metric.
     */
    export class Physics2 extends State<Geometric2> implements EnergySystem<Geometric2> {
        constructor();
    }

    /**
     * The Physics3 engine computes the derivatives of the kinematic variables X, R, P, J for each body,
     * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
     * It uses Geometric3 to provide the Geometric Algebra of Euclidean Space with a 3,0 metric.
     */
    export class Physics3 extends State<Geometric3> implements EnergySystem<Geometric3> {
        constructor();
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
     * A differential equation solver that achieves O(h*h*h) Local Truncation Error (LTE),
     * where h is the step size.
     */
    class RungeKutta implements DiffEqSolver {
        /**
         * Constructs a differential equation solver (integrator) that uses the classical Runge-Kutta method.
         */
        constructor(simulation: Simulation);
        /**
         * 
         */
        step(stepSize: number, uomStep: Unit): void;
    }

    export interface EnergySystem<T> {
        readonly metric: Metric<T>;
        totalEnergy(): T;
    }

    class AdaptiveStepSolver<T> implements DiffEqSolver {
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
        constructor(diffEq: Simulation, energySystem: EnergySystem<T>, diffEqSolver: DiffEqSolver);
        /**
         * 
         */
        step(stepSize: number, uomStep: Unit): void;
    }

    /**
     * An adaptive step solver that adjusts the step size in order to
     * ensure that the energy change be less than a tolerance amount.
     */
    class ConstantEnergySolver<T> implements DiffEqSolver {
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
         * Constructs an adaptive step solver that adjusts the step size in order to
         * ensure that the energy change be less than a tolerance amount.
         */
        constructor(simulation: Simulation, energySystem: EnergySystem<T>, solverMethod: DiffEqSolver);
        /**
         * 
         */
        step(stepSize: number, uomStep: Unit): void;
    }

    interface AdvanceStrategy {
        /**
         * 
         */
        advance(stepSize: number, uomStep?: Unit): void;
    }

    class DefaultAdvanceStrategy implements AdvanceStrategy {
        /**
         * 
         */
        constructor(simulation: Simulation, solver: DiffEqSolver);
        advance(stepSize: number, uomStep?: Unit): void;
    }

    /**
     * 
     */
    interface ForceBody<T> {
        /**
         * A placeholder for applications to define a unique identifier. 
         */
        uuid: string;

        /**
         * 
         */
        L: T;

        /**
         * 
         */
        M: T;

        /**
         * 
         */
        P: T;

        /**
         * 
         */
        R: T;

        /**
         * 
         */
        X: T;

        /**
         * 
         */
        expireTime: number;

        /**
         * 
         */
        varsIndex: number;

        /**
         * 
         */
        Ω: T;

        /**
         * 
         */
        rotationalEnergy(): T;

        /**
         * 
         */
        translationalEnergy(): T;

        /**
         * 
         */
        updateAngularVelocity(): void;
    }

    /**
     * 
     */
    class ConstantForceLaw<T> implements ForceLaw<T> {
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
        constructor(body: RigidBody<T>, vector: T, vectorCoordType?: CoordType);
        /**
         * 
         */
        updateForces(): Force<T>[];
        /**
         * 
         */
        disconnect(): void;
        /**
         * 
         */
        potentialEnergy(): T;
    }

    export class ConstantForceLaw2 extends ConstantForceLaw<Geometric2> {
        constructor(body: ForceBody<Geometric2>, vector: Geometric2, vectorCoordType?: CoordType);
    }

    export class ConstantForceLaw3 extends ConstantForceLaw<Geometric3> {
        constructor(body: ForceBody<Geometric3>, vector: Geometric3, vectorCoordType?: CoordType);
    }

    /**
     * 
     */
    class CoulombLaw<T> implements ForceLaw<T> {
        /**
         *
         */
        k: Geometric3;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body1: RigidBody<T>, body2: RigidBody<T>, G?: T);
        updateForces(): Force<T>[];
        disconnect(): void;
        potentialEnergy(): T;
    }

    export class GravitationLaw<T> implements ForceLaw<T> {
        /**
         * The proportionality constant, Newton's constant.
         * The default value is one (1).
         */
        public G: T;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body1_: RigidBody<T>, body2_: RigidBody<T>, G: T);
        /**
         * Computes the forces due to the gravitational interaction.
         * F = G * m1 * m2 * direction(r2 - r1) / quadrance(r2 - r1)
         */
        updateForces(): Force<T>[];
        /**
         * 
         */
        disconnect(): void;
        /**
         * Computes the potential energy of the gravitational interaction.
         * U = -G m1 m2 / r, where
         * r is the center-of-mass to center-of-mass separation of m1 and m2.
         */
        potentialEnergy(): T;
    }

    export class GravitationForceLaw2 extends GravitationLaw<Geometric2> {
        constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>);
    }

    export class GravitationForceLaw3 extends GravitationLaw<Geometric3> {
        constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>);
    }

    /**
     * 
     */
    class Spring<T> implements ForceLaw<T> {
        /**
         * 
         */
        restLength: T;
        /**
         * 
         */
        stiffness: T;
        /**
         * 
         */
        attach1: T;
        /**
         * 
         */
        attach2: T;
        /**
         * 
         */
        end1: T;
        /**
         * 
         */
        end2: T;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body1: RigidBody<T>, body2: RigidBody<T>);
        updateForces(): Force<T>[];
        disconnect(): void;
        potentialEnergy(): T;
    }

    /**
     *
     */
    export class Spring2 extends Spring<Geometric2> {
        constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>);
    }
    /**
     *
     */
    export class Spring3 extends Spring<Geometric3> {
        constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>);
    }

    /**
     * A rectangle whose boundaries are stored with double floating point precision.
     * This is an immutable class: once an instance is created it cannot be changed.
     * 
     * Note that for DoubleRect we regard the vertical coordinate as increasing upwards,
     * so the top coordinate is greater than the bottom coordinate.
     * This is in contrast to HTML5 canvas where vertical coordinates increase downwards.
     */
    class DoubleRect {
        /**
         * 
         */
        static EMPTY_RECT: DoubleRect;
        /**
         * 
         */
        constructor(left: number, bottom: number, right: number, top: number);
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

    /**
     * 
     */
    class EnergyTimeGraph extends Graph {

        /**
         * 
         */
        public translationalEnergyGraphLine: GraphLine;

        /**
         * 
         */
        public rotationalEnergyGraphLine: GraphLine;

        /**
         * 
         */
        public potentialEnergyGraphLine: GraphLine;

        /**
         * 
         */
        public totalEnergyGraphLine: GraphLine;

        /**
         * 
         */
        constructor(canvasId: string, varsList: VarsList);
    }
}
