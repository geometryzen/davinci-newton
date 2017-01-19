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
export class Graph extends AbstractSubject {
    private readonly view = new SimView('TIME_GRAPH_VIEW', new DoubleRect(0, 0, 1, 1));
    private autoScale: AutoScale;
    private displayGraph: DisplayGraph;
    private labCanvas: LabCanvas;
    /**
     * The index for the time variable in the varsList.
     */
    private timeIdx_: number;
    /**
     * 
     */
    constructor(canvasId: string, private varsList: VarsList) {
        super('TIME_GRAPH_LAYOUT');
        const canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.labCanvas = new LabCanvas(canvas, 'GRAPH_CANVAS');

        this.view.setHorizAlign(HorizAlign.FULL);
        this.view.setVerticalAlign(VerticalAlign.FULL);
        this.labCanvas.addView(this.view);

        this.displayGraph = new DisplayGraph();
        this.displayGraph.setScreenRect(this.view.getScreenRect());

        this.view.getDisplayList().prepend(this.displayGraph);

        // Find out where the time is stored in the list of variables.
        this.timeIdx_ = varsList.timeIndex();
    }

    /**
     * 
     */
    addTrace(name: string): GraphLine {
        const trace = new GraphLine(name, this.varsList);
        this.view.addMemo(trace);
        // trace.setXVariable(timeIdx);
        // trace.setYVariable(1);
        trace.setColor('black');
        this.displayGraph.addGraphLine(trace);
        // Don't use off-screen buffer with time variable because the auto-scale causes
        // graph to redraw every frame.
        this.displayGraph.setUseBuffer(trace.getXVariable() !== this.timeIdx_);
        return trace;
    }

    memorize(): void {
        this.labCanvas.memorize();
    }

    render(): void {
        this.labCanvas.paint();
    }

    /**
     * 
     */
    setAutoScale(trace: GraphLine): void {
        // Crate an AutoScale based upon one of the lines.
        this.autoScale = new AutoScale('TIME_GRAPH_AUTO_SCALE', trace, this.view);
        this.autoScale.extraMargin = 0.05;
    }
}

export default Graph;
