/**
 * The QQ class represents a rational number, ℚ.
 *
 * The QQ implementation is that of an <em>immutable</em> (value) type.
 *
 * The numerator and denominator are reduced to their lowest form.
 *
 * Construct new instances using the static <code>valueOf</code> method.
 * @hidden
 */
export class QQ {
  /**
   * The numerator of the rational number.
   */
  private readonly numer_: number;
  /**
   * The denominator of the rational number.
   */
  private readonly denom_: number;

  /**
   * @param n The numerator.
   * @param d The denominator.
   */
  private constructor(n: number, d: number) {
    let g: number;

    const gcd = function (a: number, b: number) {
      let temp: number;

      if (a < 0) {
        a = -a;
      }
      if (b < 0) {
        b = -b;
      }
      if (b > a) {
        temp = a;
        a = b;
        b = temp;
      }
      while (true) {
        a %= b;
        if (a === 0) {
          return b;
        }
        b %= a;
        if (b === 0) {
          return a;
        }
      }
    };

    if (d === 0) {
      throw new Error("denominator must not be zero");
    }
    if (n === 0) {
      g = 1;
    }
    else {
      g = gcd(Math.abs(n), Math.abs(d));
    }
    if (d < 0) {
      n = -n;
      d = -d;
    }
    this.numer_ = n / g;
    this.denom_ = d / g;
  }

  /**
   * The numerator of the rational number.
   */
  get numer(): number {
    return this.numer_;
  }

  /**
   * The denominator of the rational number.
   */
  get denom(): number {
    return this.denom_;
  }

  /**
   * @returns this + rhs
   */
  add(rhs: QQ): QQ {
    return QQ.valueOf(this.numer_ * rhs.denom_ + this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
  }

  /**
   * @returns this - rhs
   */
  sub(rhs: QQ): QQ {
    return QQ.valueOf(this.numer_ * rhs.denom_ - this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
  }

  /**
   * @returns this * rhs
   */
  mul(rhs: QQ): QQ {
    return QQ.valueOf(this.numer_ * rhs.numer_, this.denom_ * rhs.denom_);
  }

  /**
   * @returns this / rhs
   */
  div(rhs: QQ): QQ {
    const numer = this.numer_ * rhs.denom_;
    const denom = this.denom_ * rhs.numer_;
    if (numer === 0) {
      if (denom === 0) {
        // How do we handle undefined?
        return QQ.valueOf(numer, denom);
      }
      else {
        return QQ.ZERO;
      }
    }
    else {
      if (denom === 0) {
        // How do we handle division by zero.
        return QQ.valueOf(numer, denom);
      }
      else {
        return QQ.valueOf(numer, denom);
      }
    }
  }

  /**
   * @returns `true` if this rational number is one (1), otherwise `false`.
   */
  isOne(): boolean {
    return this.numer_ === 1 && this.denom_ === 1;
  }

  /**
   * @returns `true` if this rational number is zero (0), otherwise `false`.
   */
  isZero(): boolean {
    return this.numer_ === 0 && this.denom_ === 1;
  }

  /**
   * @returns 37 * numerator + 13 * denominator
   */
  hashCode(): number {
    return 37 * this.numer_ + 13 * this.denom_;
  }

  /**
   * Computes the multiplicative inverse of this rational number.
   *
   * @returns 1 / this
   */
  inv(): QQ {
    return QQ.valueOf(this.denom_, this.numer_);
  }

  /**
   * Computes the additive inverse of this rational number.
   *
   * @returns -this
   */
  neg(): QQ {
    return QQ.valueOf(-this.numer_, this.denom_);
  }

  /**
   * Determines whether two rational numbers are equal.
   *
   * @returns `true` if `this` rational number equals the `other` rational number.
   */
  equals(other: QQ): boolean {
    if (this === other) {
      return true;
    }
    else if (other instanceof QQ) {
      return this.numer_ * other.denom_ === this.denom_ * other.numer_;
    }
    else {
      return false;
    }
  }

  /**
   * Computes a non-normative string representation of this rational.
   *
   * @returns
   */
  toString(radix?: number): string {
    return "" + this.numer_.toString(radix) + "/" + this.denom_.toString(radix) + "";
  }

  /**
   * @returns this + rhs
   */
  __add__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
      return this.add(rhs);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns lhs + this
   */
  __radd__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.add(this);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns this - rhs
   */
  __sub__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
      return this.sub(rhs);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns lhs - this
   */
  __rsub__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.sub(this);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns this * rhs
   */
  __mul__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
      return this.mul(rhs);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns lhs * this
   */
  __rmul__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.mul(this);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns this / rhs
   */
  __div__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
      return this.div(rhs);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns lhs / this
   */
  __rdiv__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.div(this);
    }
    else {
      return void 0;
    }
  }

  /**
   * @returns +this
   */
  __pos__(): this {
    return this;
  }

  /**
   * @returns -this
   */
  __neg__(): QQ {
    return this.neg();
  }

  //
  // Immutable constants allow us to avoid creating
  // temporary QQ instances for the common values.
  //
  private static readonly POS_08_01: QQ = new QQ(8, 1);
  private static readonly POS_07_01: QQ = new QQ(7, 1);
  private static readonly POS_06_01: QQ = new QQ(6, 1);
  private static readonly POS_05_01: QQ = new QQ(5, 1);
  private static readonly POS_04_01: QQ = new QQ(4, 1);
  private static readonly POS_03_01: QQ = new QQ(3, 1);
  private static readonly POS_02_01: QQ = new QQ(2, 1);
  private static readonly ONE: QQ = new QQ(1, 1);
  private static readonly POS_01_02: QQ = new QQ(1, 2);
  private static readonly POS_01_03: QQ = new QQ(1, 3);
  private static readonly POS_01_04: QQ = new QQ(1, 4);
  private static readonly POS_01_05: QQ = new QQ(1, 5);
  private static readonly ZERO: QQ = new QQ(0, 1);
  private static readonly NEG_01_03: QQ = new QQ(-1, 3);
  private static readonly NEG_01_01: QQ = new QQ(-1, 1);
  private static readonly NEG_02_01: QQ = new QQ(-2, 1);
  private static readonly NEG_03_01: QQ = new QQ(-3, 1);

  private static readonly POS_02_03: QQ = new QQ(2, 3);

  /**
   * @param numer The numerator of the rational number.
   * @param denom The denominator of the rational number.
   * @returns The rational number numer / denom reduced to its lowest form.
   */
  static valueOf(n: number, d: number): QQ {
    if (n === 0) {
      if (d !== 0) {
        return QQ.ZERO;
      }
      else {
        // This is the undefined case, 0/0.
      }
    }
    else if (d === 0) {
      // Fall through
    }
    else if (n === d) {
      return QQ.ONE;
    }
    else if (n === 1) {
      if (d === 2) {
        return QQ.POS_01_02;
      }
      else if (d === 3) {
        return QQ.POS_01_03;
      }
      else if (d === 4) {
        return QQ.POS_01_04;
      }
      else if (d === 5) {
        return QQ.POS_01_05;
      }
      else if (d === -3) {
        return QQ.NEG_01_03;
      }
    }
    else if (n === -1) {
      if (d === 1) {
        return QQ.NEG_01_01;
      }
      else if (d === 3) {
        return QQ.NEG_01_03;
      }
    }
    else if (n === 2) {
      if (d === 1) {
        return QQ.POS_02_01;
      }
      else if (d === 3) {
        return QQ.POS_02_03;
      }
    }
    else if (n === -2) {
      if (d === 1) {
        return QQ.NEG_02_01;
      }
    }
    else if (n === 3) {
      if (d === 1) {
        return QQ.POS_03_01;
      }
    }
    else if (n === -3) {
      if (d === 1) {
        return QQ.NEG_03_01;
      }
    }
    else if (n === 4) {
      if (d === 1) {
        return QQ.POS_04_01;
      }
    }
    else if (n === 5) {
      if (d === 1) {
        return QQ.POS_05_01;
      }
    }
    else if (n === 6) {
      if (d === 1) {
        return QQ.POS_06_01;
      }
    }
    else if (n === 7) {
      if (d === 1) {
        return QQ.POS_07_01;
      }
    }
    else if (n === 8) {
      if (d === 1) {
        return QQ.POS_08_01;
      }
    }
    // console.warn(`QQ.valueOf(${n},${d}) is not cached.`);
    return new QQ(n, d);
  }
}
