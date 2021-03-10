import { VectorE2 } from './VectorE2';
/**
 * Determines whether the argument supports the VectorE3 interface.
 * The argument must be a non-null object and must support the x, y, and z numeric properties.
 * @deprecated Do not use this because it could accept types that have scalar and bivector components.
 */
export declare function isVectorE2(v: any): v is VectorE2;
