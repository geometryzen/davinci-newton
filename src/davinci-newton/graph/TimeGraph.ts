import AbstractSubject from '../util/AbstractSubject';
import AutoScale from './AutoScale';
import DisplayGraph from './DisplayGraph';
import DoubleRect from '../view/DoubleRect';
import GraphLine from './GraphLine';
import HorizAlign from '../view/HorizAlign';
import LabCanvas from '../view/LabCanvas';
import SimView from '../view/SimView';
import VarsList from '../core/VarsList';
import VerticalAlign from '../view/VerticalAlign';


/**
 * Creates a single graph showing several independent GraphLines, and with a horizontal
 * time axis. Because there is a single SimView and DisplayGraph, all the GraphLines are
 * plotted in the same graph coordinates. The horizontal variable can be changed to
 * something other than time. Creates an AutoScale that ensures all of the GraphLines are
 * visible. Creates several controls to modify the graph.
 * 
 * This class is a user interface control. It may manipulate the DOM, adding controls.
 */
export class TimeGraph extends AbstractSubject {
    private readonly view = new SimView('TIME_GRAPH_VIEW', new DoubleRect(0, 0, 1, 1));
    private line1: GraphLine;
    private autoScale: AutoScale;
    private displayGraph: DisplayGraph;
    constructor(varsList: VarsList, labCanvas: LabCanvas) {
        super('TIME_GRAPH_LAYOUT');

        this.view.setHorizAlign(HorizAlign.FULL);
        this.view.setVerticalAlign(VerticalAlign.FULL);
        labCanvas.addView(this.view);


        this.displayGraph = new DisplayGraph();
        this.displayGraph.setScreenRect(this.view.getScreenRect());

        // Find out where the time is stored in the list of variables.
        const timeIdx = varsList.timeIndex();

        // Add as many lines as you want...
        this.line1 = new GraphLine('TIME_GRAPH_LINE_1', varsList);
        this.view.addMemo(this.line1);
        this.line1.setXVariable(timeIdx);
        this.line1.setYVariable(1);
        this.line1.setColor('lime');
        this.displayGraph.addGraphLine(this.line1);

        // Crate an AutoScale based upon one of the lines.
        this.autoScale = new AutoScale('TIME_GRAPH_AUTO_SCALE', this.line1, this.view);
        this.autoScale.extraMargin = 0.05;

        // Don't use off-screen buffer with time variable because the auto-scale causes
        // graph to redraw every frame.
        this.displayGraph.setUseBuffer(this.line1.getXVariable() !== timeIdx);
    }
}

export default TimeGraph;
