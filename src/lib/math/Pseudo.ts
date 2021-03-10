import { Unit } from "./Unit";

export interface Pseudo {
  /**
   * The pseudoscalar coordinate as a number.I
   */
  b: number;
  /**
   * The unit of measure.
   */
  uom?: Unit;
}
