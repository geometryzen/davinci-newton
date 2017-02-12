import { Dimensions } from '../math/Dimensions';
import isUndefined from '../checks/isUndefined';
import { QQ } from '../math/QQ';

// const NAMES_SI = ['kilogram', 'meter', 'second', 'coulomb', 'kelvin', 'mole', 'candela'];
const SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];

/**
 * The numerator, denominator values for each dimension (M, L, T, Q, temperature, amount, intensity).
 */
const patterns =
  [
    [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F/m
    [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // S
    [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F
    [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/kg
    [-1, 1, +3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], // N·m·m/kg·kg (Gravitational Constant G)
    [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/m**3
    [+0, 1, -2, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/m**2
    [+0, 1, -1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/m
    [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // J/kg
    [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Hz
    [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // A
    [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s**2
    [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s
    [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // kg·m/s
    [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa
    [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa·s
    [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W/m**2
    [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N/m
    [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // T
    [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // W/(m·K)
    [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V/m
    [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N
    [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H/m
    [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/K
    [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/(kg·K)
    [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1], // J/(mol·K)
    [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],  // J/(mol)
    [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J
    [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J·s
    [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W
    [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V
    [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],  // Ω
    [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H
    [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]   // Wb
  ];

/**
 * The string literals for the patterns.
 * The convention is to write the unit compactly (without whitespace).
 */
const decodes =
  [
    ["F/m"],
    ["S or A/V"],
    ["F or C/V"],
    ["C/kg"],
    ["N·m·m/kg·kg"],
    ["C/m**3"],
    ["C/m**2"],
    ["C/m"],
    ["J/kg"],
    ["Hz"],
    ["A"],
    ["m/s**2"],
    ["m/s"],
    ["kg·m/s"],
    ["Pa or N/m**2"],
    ["Pa·s"],
    ["W/m**2"],
    ["N/m"],
    ["T or Wb/m**2"],
    ["W/(m·K)"],
    ["V/m"],
    ["N"],
    ["H/m"],
    ["J/K"],
    ["J/(kg·K)"],
    ["J/(mol·K)"],
    ["J/mol"],
    ["J or N·m"],
    ["J·s"],
    ["W or J/s"],
    ["V or W/A"],
    ["Ω or V/A"],
    ["H or Wb/A"],
    ["Wb"]
  ];

const dumbString = function (multiplier: number, formatted: string, dimensions: Dimensions, labels: string[], compact: boolean) {
  const stringify = function (rational: QQ, label: string): string {
    if (rational.numer === 0) {
      return null;
    }
    else if (rational.denom === 1) {
      if (rational.numer === 1) {
        if (compact) {
          return "" + label;
        }
        else {
          return "" + label;
        }
      }
      else {
        return "" + label + " ** " + rational.numer;
      }
    }
    return "" + label + " ** " + rational;
  };

  const operatorStr = multiplier === 1 || dimensions.isOne() ? (compact ? "" : " ") : " ";
  const scaleString = multiplier === 1 ? (compact ? "" : formatted) : formatted;
  const unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
    return typeof x === 'string';
  }).join(" ");
  return "" + scaleString + operatorStr + unitsString;
};

const unitString = function (multiplier: number, formatted: string, dimensions: Dimensions, labels: string[], compact: boolean): string {
  const M = dimensions.M;
  const L = dimensions.L;
  const T = dimensions.T;
  const Q = dimensions.Q;
  const temperature = dimensions.temperature;
  const amount = dimensions.amount;
  const intensity = dimensions.intensity;
  for (let i = 0, len = patterns.length; i < len; i++) {
    const pattern = patterns[i];
    if (M.numer === pattern[0] && M.denom === pattern[1] &&
      L.numer === pattern[2] && L.denom === pattern[3] &&
      T.numer === pattern[4] && T.denom === pattern[5] &&
      Q.numer === pattern[6] && Q.denom === pattern[7] &&
      temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
      amount.numer === pattern[10] && amount.denom === pattern[11] &&
      intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
      if (!compact) {
        return multiplier + " * " + decodes[i][0];
      }
      else {
        if (multiplier !== 1) {
          return multiplier + " * " + decodes[i][0];
        }
        else {
          return decodes[i][0];
        }
      }
    }
  }
  return dumbString(multiplier, formatted, dimensions, labels, compact);
};

function add(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function sub(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function mul(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
}

function scale(α: number, unit: Unit): Unit {
  return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
}

function div(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
}

/**
 * <p>
 * The Unit class represents the units for a measure.
 * </p>
 */
export class Unit {
  /**
   * Internal symbolic constant to improve code readability.
   * May be undefined or an instance of Unit.
   */
  private static readonly ONE: Unit = new Unit(1, Dimensions.ONE, SYMBOLS_SI);

  /**
   *
   */
  public static readonly KILOGRAM = new Unit(1, Dimensions.MASS, SYMBOLS_SI);

  /**
   *
   */
  public static readonly METER = new Unit(1, Dimensions.LENGTH, SYMBOLS_SI);

  /**
   *
   */
  public static readonly SECOND = new Unit(1, Dimensions.TIME, SYMBOLS_SI);

  /**
   *
   */
  public static readonly COULOMB = new Unit(1, Dimensions.CHARGE, SYMBOLS_SI);

  /**
   *
   */
  public static readonly AMPERE = new Unit(1, Dimensions.CURRENT, SYMBOLS_SI);

  /**
   *
   */
  public static readonly KELVIN = new Unit(1, Dimensions.TEMPERATURE, SYMBOLS_SI);

  /**
   *
   */
  public static readonly MOLE = new Unit(1, Dimensions.AMOUNT, SYMBOLS_SI);

  /**
   *
   */
  public static readonly CANDELA = new Unit(1, Dimensions.INTENSITY, SYMBOLS_SI);

  /**
   * @param multiplier
   * @param dimensions
   * @param labels The label strings to use for each dimension.
   */
  constructor(public readonly multiplier: number, public readonly dimensions: Dimensions, public readonly labels: string[]) {
    if (labels.length !== 7) {
      throw new Error("Expecting 7 elements in the labels array.");
    }
    this.multiplier = multiplier;
    this.dimensions = dimensions;
    this.labels = labels;
  }

  private compatible(rhs: Unit): Unit {
    if (rhs instanceof Unit) {
      this.dimensions.compatible(rhs.dimensions);
      return this;
    }
    else {
      throw new Error("Illegal Argument for Unit.compatible: " + rhs);
    }
  }

  private isCompatible(rhs: Unit): boolean {
    if (rhs instanceof Unit) {
      return this.dimensions.equals(rhs.dimensions);
    }
    else {
      throw new Error("Illegal Argument for Unit.compatible: " + rhs);
    }
  }

  public __add__(rhs: Unit) {
    if (rhs instanceof Unit) {
      return add(this, rhs);
    }
    else {
      return void 0;
    }
  }

  public __radd__(lhs: Unit) {
    if (lhs instanceof Unit) {
      return add(lhs, this);
    }
    else {
      return void 0;
    }
  }

  public __sub__(rhs: Unit) {
    if (rhs instanceof Unit) {
      return sub(this, rhs);
    }
    else {
      return void 0;
    }
  }

  public __rsub__(lhs: Unit) {
    if (lhs instanceof Unit) {
      return sub(lhs, this);
    }
    else {
      return void 0;
    }
  }

  /**
   * Computes the unit equal to `this * rhs`.
   */
  public mul(rhs: Unit): Unit {
    return mul(this, rhs);
  }

  public __mul__(rhs: number | Unit) {
    if (rhs instanceof Unit) {
      return mul(this, rhs);
    }
    else if (typeof rhs === 'number') {
      return scale(rhs, this);
    }
    else {
      return void 0;
    }
  }

  public __rmul__(lhs: number | Unit) {
    if (lhs instanceof Unit) {
      return mul(lhs, this);
    }
    else if (typeof lhs === 'number') {
      return scale(lhs, this);
    }
    else {
      return void 0;
    }
  }

  /**
   * Computes the unit equal to `this / rhs`.
   */
  public div(rhs: Unit): Unit {
    return div(this, rhs);
  }

  public __div__(rhs: number | Unit) {
    if (rhs instanceof Unit) {
      return div(this, rhs);
    }
    else if (typeof rhs === 'number') {
      return new Unit(this.multiplier / rhs, this.dimensions, this.labels);
    }
    else {
      return void 0;
    }
  }

  public __rdiv__(lhs: number | Unit) {
    if (lhs instanceof Unit) {
      return div(lhs, this);
    }
    else if (typeof lhs === 'number') {
      return new Unit(lhs / this.multiplier, this.dimensions.inv(), this.labels);
    }
    else {
      return void 0;
    }
  }

  private pow(exponent: QQ): Unit {
    return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
  }

  private inv(): Unit {
    return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
  }

  private neg(): Unit {
    return new Unit(-this.multiplier, this.dimensions, this.labels);
  }

  private isOne(): boolean {
    return this.dimensions.isOne() && (this.multiplier === 1);
  }

  private sqrt(): Unit {
    return new Unit(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels);
  }

  toExponential(fractionDigits?: number, compact?: boolean): string {
    return unitString(this.multiplier, this.multiplier.toExponential(fractionDigits), this.dimensions, this.labels, compact);
  }

  toFixed(fractionDigits?: number, compact?: boolean): string {
    return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels, compact);
  }

  toPrecision(precision?: number, compact?: boolean): string {
    return unitString(this.multiplier, this.multiplier.toPrecision(precision), this.dimensions, this.labels, compact);
  }

  toString(radix?: number, compact?: boolean): string {
    return unitString(this.multiplier, this.multiplier.toString(radix), this.dimensions, this.labels, compact);
  }

  __pos__(): Unit {
    return this;
  }

  __neg__(): Unit {
    return this.neg();
  }

  /**
   * @param uom The unit of measure.
   */
  static isOne(uom: Unit): boolean {
    if (uom === void 0) {
      return true;
    }
    else if (uom instanceof Unit) {
      return uom.isOne();
    }
    else {
      throw new Error("isOne argument must be a Unit or undefined.");
    }
  }

  /**
   * @param uom The unit of measure that must be dimensionless.
   */
  static assertDimensionless(uom: Unit): void {
    if (!Unit.isOne(uom)) {
      throw new Error(`uom ${uom} must be dimensionless.`);
    }
  }

  /**
   * @param lhs
   * @param rhs
   * @returns
   */
  static compatible(lhs: Unit, rhs: Unit): Unit {
    if (lhs) {
      if (rhs) {
        return lhs.compatible(rhs);
      }
      else {
        if (lhs.isOne()) {
          return void 0;
        }
        else {
          throw new Error(lhs + " is incompatible with 1");
        }
      }
    }
    else {
      if (rhs) {
        if (rhs.isOne()) {
          return void 0;
        }
        else {
          throw new Error("1 is incompatible with " + rhs);
        }
      }
      else {
        return void 0;
      }
    }
  }

  static isCompatible(lhs: Unit, rhs: Unit): boolean {
    if (lhs) {
      if (rhs) {
        return lhs.isCompatible(rhs);
      }
      else {
        if (lhs.isOne()) {
          return true;
        }
        else {
          return false;
        }
      }
    }
    else {
      if (rhs) {
        if (rhs.isOne()) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }
  }

  /**
   * @param lhs
   * @param rhs
   * @returns
   */
  static mul(lhs: Unit, rhs: Unit): Unit {
    if (lhs) {
      if (rhs) {
        return lhs.mul(rhs);
      }
      else if (Unit.isOne(rhs)) {
        return lhs;
      }
      else {
        return void 0;
      }
    }
    else if (Unit.isOne(lhs)) {
      return rhs;
    }
    else {
      return void 0;
    }
  }

  /**
   * @param lhs
   * @param rhs
   */
  static div(lhs: Unit, rhs: Unit): Unit {
    if (lhs) {
      if (rhs) {
        return lhs.div(rhs);
      }
      else {
        return lhs;
      }
    }
    else {
      if (rhs) {
        return rhs.inv();
      }
      else {
        return Unit.ONE;
      }
    }
  }

  /**
   * Computes the multiplicative inverse of the specified unit of measure. 
   */
  static inv(uom: Unit): Unit {
    if (uom instanceof Unit) {
      if (uom.isOne()) {
        return Unit.ONE;
      }
      else {
        return uom.inv();
      }
    }
    else {
      return Unit.ONE;
    }
  }

  /**
   * 
   */
  static mustBeUnit(name: string, uom: Unit): Unit {
    if (uom instanceof Unit) {
      return uom;
    }
    else if (isUndefined(uom)) {
      return Unit.ONE;
    }
    else {
      throw new Error(`${name} must be a Unit or undefined (meaning 1).`);
    }
  }

  /**
   * Computes the value of the unit of measure raised to the specified power. 
   */
  static pow(uom: Unit, exponent: QQ): Unit {
    if (uom instanceof Unit) {
      if (uom.isOne()) {
        return void 0;
      }
      else {
        if (exponent.isZero()) {
          return void 0;
        }
        else {
          return uom.pow(exponent);
        }
      }
    }
    else {
      return void 0;
    }
  }

  /**
   * @param uom
   * @returns
   */
  static sqrt(uom: Unit): Unit {
    if (uom instanceof Unit) {
      if (uom.isOne()) {
        return void 0;
      }
      else {
        return uom.sqrt();
      }
    }
    else {
      return void 0;
    }
  }
}

export default Unit;
