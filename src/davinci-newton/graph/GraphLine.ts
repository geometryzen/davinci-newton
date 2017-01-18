import CircularList from '../util/CircularList';
// import DrawingMode from '../view/DrawingMode';
import GraphPoint from './GraphPoint';
import GraphStyle from './GraphStyle';
import HistoryList from '../util/HistoryList';
import VarsList from '../core/VarsList';

export default class GraphLine {
    /**
     * 
     */
    dataPoints_: CircularList<GraphPoint>;

    /**
     * 
     */
    styles_: GraphStyle[] = [];

    /**
     * 
     */
    constructor(name: string, varsList: VarsList, capacity: number) {
        // Do nothing yet.
    }

    /**
     * 
     */
    getGraphPoints(): HistoryList<GraphPoint> {
        return this.dataPoints_;
    }

    /**
     * 
     */
    getGraphStyle(index: number): GraphStyle {
        const styles = this.styles_;
        if (styles.length === 0) {
            throw new Error('graph styles list is empty');
        }
        // Find the latest style in the styles list with an index less than or
        // equal to the given index.
        let last = styles[0];
        for (let i = 1, len = styles.length; i < len; i++) {
            const s = styles[i];
            // assert that indices in style list are non-decreasing
            if (s.index_ > index)
                break;
            last = s;
        }
        return last;
    }

    /**
     * 
     */
    getHotSpotColor(): string {
        throw new Error("TODO");
    }
}
