export default class GraphPoint {
    constructor(public x: number, public y: number, public seqX: number, public seqY: number) {

    }

    /**
     * Returns whether this GraphPoint is identical to another GraphPoint
     * @param other the GraphPoint to compare with
     * @return `true` if this GraphPoint is identical to the other GraphPoint
     */
    equals(other: GraphPoint): boolean {
        return this.x === other.x && this.y === other.y && this.seqX === other.seqX && this.seqY === other.seqY;
    }

}
