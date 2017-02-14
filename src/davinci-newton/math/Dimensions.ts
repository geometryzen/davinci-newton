import { QQ } from '../math/QQ';
import notSupported from '../i18n/notSupported';

const R0 = QQ.valueOf(0, 1);
const R1 = QQ.valueOf(1, 1);
const R2 = QQ.valueOf(2, 1);
const M1 = QQ.valueOf(-1, 1);
const M2 = QQ.valueOf(-2, 1);

function assertArgRational(name: string, arg: QQ): QQ {
    if (arg instanceof QQ) {
        return arg;
    }
    else {
        throw new Error("Argument '" + arg + "' must be a QQ");
    }
}

const magicCode = Math.random();

/**
 * Keeps track of the dimensions of a physical quantity using seven rational exponents.
 * Each of the exponents corresponds to a dimension in the S.I. system of units.
 */
export class Dimensions {

    /**
     * All exponents are zero, a dimensionless quantity.
     */
    public static readonly ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0, magicCode);

    /**
     * M<sup>1</sup>
     */
    public static readonly MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0, magicCode);

    /**
     * L<sup>1</sup>
     */
    public static readonly LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0, magicCode);
    /**
     * L<sup>2</sup>
     */
    public static readonly AREA = new Dimensions(R0, R2, R0, R0, R0, R0, R0, magicCode);

    /**
     * T<sup>1</sup>
     */
    public static readonly TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0, magicCode);

    /**
     * Q<sup>1</sup>
     */
    public static readonly CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0, magicCode);

    /**
     * Q<sup>1</sup>T<sup>-1<sup>
     */
    public static readonly CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0, magicCode);

    /**
     *
     */
    public static readonly TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0, magicCode);

    /**
     *
     */
    public static readonly AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0, magicCode);

    /**
     *
     */
    public static readonly INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1, magicCode);

    /**
     * Angular Momentum.
     */
    private static readonly ANGULAR_MOMENTUM = new Dimensions(R1, R2, M1, R0, R0, R0, R0, magicCode);

    /**
     * Rate of change of Area.
     */
    private static readonly RATE_OF_CHANGE_OF_AREA = new Dimensions(R0, R2, M1, R0, R0, R0, R0, magicCode);

    /**
     * Energy or Torque.
     */
    private static readonly ENERGY_OR_TORQUE = new Dimensions(R1, R2, M2, R0, R0, R0, R0, magicCode);

    /**
     * Force.
     */
    private static readonly FORCE = new Dimensions(R1, R1, M2, R0, R0, R0, R0, magicCode);

    /**
     * Inverse Mass.
     */
    private static readonly INV_MASS = new Dimensions(M1, R0, R0, R0, R0, R0, R0, magicCode);

    /**
     * Inverse Moment of Inertia.
     */
    private static readonly INV_MOMENT_OF_INERTIA = new Dimensions(M1, M2, R0, R0, R0, R0, R0, magicCode);

    /**
     * Inverse Time.
     */
    private static readonly INV_TIME = new Dimensions(R0, R0, M1, R0, R0, R0, R0, magicCode);

    /**
     * Moment of Inertia.
     */
    private static readonly MOMENT_OF_INERTIA = new Dimensions(R1, R2, R0, R0, R0, R0, R0, magicCode);

    /**
     * Momentum.
     */
    private static readonly MOMENTUM = new Dimensions(R1, R1, M1, R0, R0, R0, R0, magicCode);

    /**
     * Momentum squared.
     */
    private static readonly MOMENTUM_SQUARED = new Dimensions(R2, R2, M2, R0, R0, R0, R0, magicCode);

    /**
     * Stiffness.
     */
    private static readonly STIFFNESS = new Dimensions(R1, R0, M2, R0, R0, R0, R0, magicCode);

    /**
     * Time squared.
     */
    private static readonly TIME_SQUARED = new Dimensions(R0, R0, R2, R0, R0, R0, R0, magicCode);

    public readonly M: QQ;
    public readonly L: QQ;
    public readonly T: QQ;
    public readonly Q: QQ;
    public readonly temperature: QQ;
    public readonly amount: QQ;
    public readonly intensity: QQ;

    /**
     * The Dimensions class captures the physical dimensions associated with a unit of measure.
     *
     * @param M The mass component of the dimensions object.
     * @param L The length component of the dimensions object.
     * @param T The time component of the dimensions object.
     * @param Q The charge component of the dimensions object.
     * @param temperature The temperature component of the dimensions object.
     * @param amount The amount component of the dimensions object.
     * @param intensity The intensity component of the dimensions object.
     */
    private constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity: QQ, code: number) {
        if (code !== magicCode) {
            throw new Error("Use the static create method instead of the constructor");
        }
        this.M = assertArgRational('M', M);
        this.L = assertArgRational('L', L);
        this.T = assertArgRational('T', T);
        this.Q = assertArgRational('Q', Q);
        this.temperature = assertArgRational('temperature', temperature);
        this.amount = assertArgRational('amount', amount);
        this.intensity = assertArgRational('intensity', intensity);
        if (arguments.length !== 8) {
            throw new Error("Expecting 8 arguments");
        }
    }

    /**
     * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
     *
     * @param rhs
     * @returns
     */
    compatible(rhs: Dimensions): Dimensions {
        if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
            return this;
        }
        else {
            if (this.isOne()) {
                if (rhs.isOne()) {
                    throw new Error();
                }
                else {
                    throw new Error("Dimensions must be equal (dimensionless, " + rhs + ")");
                }
            }
            else {
                if (rhs.isOne()) {
                    throw new Error("Dimensions must be equal (" + this + ", dimensionless)");
                }
                else {
                    throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")");
                }
            }
        }
    }

    equals(rhs: Dimensions): boolean {
        if (this === rhs) {
            return true;
        }
        else {
            return this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity);
        }
    }

    /**
     * Multiplies dimensions by adding rational exponents.
     *
     * @param rhs
     * @returns <code>this * rhs</code>
     */
    mul(rhs: Dimensions): Dimensions {
        return Dimensions.valueOf(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
    }

    /**
     * Divides dimensions by subtracting rational exponents.
     *
     * @param rhs
     * @returns <code>this / rhs</code>
     */
    div(rhs: Dimensions): Dimensions {
        return Dimensions.valueOf(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
    }

    /**
     * Computes the power function by multiplying rational exponents.
     *
     * @param rhs
     * @returns <code>pow(this, rhs)</code>
     */
    pow(exponent: QQ): Dimensions {
        return Dimensions.valueOf(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
    }

    /**
     * Computes the square root by dividing each rational component by two.
     *
     * @returns
     */
    sqrt(): Dimensions {
        return Dimensions.valueOf(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
    }

    /**
     * Determines whether all the exponents of this dimensions number are zero.
     * This implies a dimensionless quantity. 
     *
     * @returns <code>true</code> if all the exponents are zero, otherwise <code>false</code>.
     */
    isOne(): boolean {
        if (this === Dimensions.ONE) {
            return true;
        }
        else {
            return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        }
    }

    /**
     * Computes the multiplicative inverse of this dimensions number.
     * This is achived by changing the signs of all the exponent quantities.
     *
     * @returns The multiplicative inverse of this dimensions number.
     */
    inv(): Dimensions {
        return Dimensions.valueOf(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
    }

    /**
     * Intentionally undocumented.
     */
    neg(): Dimensions {
        throw new Error(notSupported('neg').message);
    }

    /**
     * Creates a representation of this <code>Dimensions</code> instance.
     *
     * @returns
     */
    toString(): string {
        var stringify = function (rational: QQ, label: string): string {
            if (rational.numer === 0) {
                return null;
            } else if (rational.denom === 1) {
                if (rational.numer === 1) {
                    return "" + label;
                } else {
                    return "" + label + " ** " + rational.numer;
                }
            }
            return "" + label + " ** " + rational;
        };

        return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
            return typeof x === 'string';
        }).join(" * ");
    }

    /**
     * @returns this + rhs
     */
    __add__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @returns lhs + this
     */
    __radd__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
        }
        else {
            return void 0;
        }
    }

    /**
     *
     * @param rhs
     * @returns
     */
    __sub__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     *
     * @param lhs
     * @returns
     */
    __rsub__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
        }
        else {
            return void 0;
        }
    }

    /**
     *
     * @param rhs
     * @returns
     */
    __mul__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.mul(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     *
     * @param lhs
     * @returns
     */
    __rmul__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.mul(this);
        }
        else {
            return void 0;
        }
    }

    /**
     *
     * @param rhs
     * @returns
     */
    __div__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.div(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @param lhs
     * @returns
     */
    __rdiv__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.div(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * @returns
     */
    __pos__(): Dimensions {
        return this;
    }

    /**
     *
     * @returns
     */
    __neg__(): Dimensions {
        return this;
    }

    /**
     *
     * @param M The mass component of the dimensions object.
     * @param L The length component of the dimensions object.
     * @param T The time component of the dimensions object.
     * @param Q The charge component of the dimensions object.
     * @param temperature The temperature component of the dimensions object.
     * @param amount The amount component of the dimensions object.
     * @param intensity The intensity component of the dimensions object.
     */
    public static valueOf(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity: QQ) {
        if (temperature.isZero() && amount.isZero() && intensity.isZero()) {
            if (M.numer === -1) {
                if (M.denom === 1) {
                    if (L.numer === -2) {
                        if (L.denom === 1) {
                            if (T.numer === 0) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.INV_MOMENT_OF_INERTIA;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (L.numer === 0) {
                        if (L.denom === 1) {
                            if (T.numer === 0) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.INV_MASS;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (M.numer === 0) {
                if (M.denom === 1) {
                    if (L.numer === 0) {
                        if (L.denom === 1) {
                            if (T.numer === -1) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.INV_TIME;
                                        }
                                    }
                                }
                            }
                            else if (T.numer === 0) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.ONE;
                                        }
                                    }
                                }
                            }
                            else if (T.numer === 2) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.TIME_SQUARED;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (L.numer === 1) {
                        if (L.denom === 1) {
                            if (T.numer === 0) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.LENGTH;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (L.numer === 2) {
                        if (L.denom === 1) {
                            if (T.numer === -1) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.RATE_OF_CHANGE_OF_AREA;
                                        }
                                    }
                                }
                            }
                            else if (T.numer === 0) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.AREA;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (M.numer === 1) {
                if (M.denom === 1) {
                    if (L.numer === 0) {
                        if (L.denom === 1) {
                            if (T.numer === -2) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.STIFFNESS;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (L.numer === 1) {
                        if (L.denom === 1) {
                            if (T.numer === -2) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.FORCE;
                                        }
                                    }
                                }
                            }
                            else if (T.numer === -1) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.MOMENTUM;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (L.numer === 2) {
                        if (L.denom === 1) {
                            if (T.numer === -2) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.ENERGY_OR_TORQUE;
                                        }
                                    }
                                }
                            }
                            else if (T.numer === -1) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.ANGULAR_MOMENTUM;
                                        }
                                    }
                                }
                            }
                            else if (T.numer === 0) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.MOMENT_OF_INERTIA;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (M.numer === 2) {
                if (M.denom === 1) {
                    if (L.numer === 2) {
                        if (L.denom === 1) {
                            if (T.numer === -2) {
                                if (T.denom === 1) {
                                    if (Q.numer === 0) {
                                        if (Q.denom === 1) {
                                            return Dimensions.MOMENTUM_SQUARED;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            // No optimization.
            return new Dimensions(M, L, T, Q, temperature, amount, intensity, magicCode);
        }
        // console.warn(`Dimensions.valueOf(${M}, ${L}, ${T}, ${Q}) is not cached.`);
        return new Dimensions(M, L, T, Q, temperature, amount, intensity, magicCode);
    }
}

export default Dimensions;
