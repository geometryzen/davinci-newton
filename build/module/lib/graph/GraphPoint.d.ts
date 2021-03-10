export default class GraphPoint {
    x: number;
    y: number;
    seqX: number;
    seqY: number;
    constructor(x: number, y: number, seqX: number, seqY: number);
    /**
     * Returns whether this GraphPoint is identical to another GraphPoint
     * @param other the GraphPoint to compare with
     * @return `true` if this GraphPoint is identical to the other GraphPoint
     */
    equals(other: GraphPoint): boolean;
}
