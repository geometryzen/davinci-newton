import AbstractSubject from '../util/AbstractSubject';
import AutoScale from './AutoScale';
import DisplayAxes from './DisplayAxes';
import { GraphLine } from './GraphLine';
import GraphVarsList from './GraphVarsList';
/**
 * Creates a single graph showing several independent GraphLines, and with a horizontal
 * time axis. Because there is a single SimView and DisplayGraph, all the GraphLines are
 * plotted in the same graph coordinates. The horizontal variable can be changed to
 * something other than time. Creates an AutoScale that ensures all of the GraphLines are
 * visible. Creates several controls to modify the graph.
 *
 * This class is a user interface control. It may manipulate the DOM, adding controls.
 */
export declare class Graph extends AbstractSubject {
    private varsList;
    /**
     *
     */
    private readonly view;
    /**
     *
     */
    autoScale: AutoScale;
    /**
     *
     */
    axes: DisplayAxes;
    /**
     *
     */
    private displayGraph;
    /**
     *
     */
    private labCanvas;
    /**
     * The index for the time variable in the varsList.
     */
    private timeIdx_;
    /**
     *
     */
    private subscription;
    /**
     *
     */
    constructor(canvasId: string, varsList: GraphVarsList);
    protected destructor(): void;
    /**
     *
     */
    addGraphLine(hCoordIndex: number, vCoordIndex: number, color?: string): GraphLine;
    removeGraphLine(graphLine: GraphLine): void;
    memorize(): void;
    render(): void;
    reset(): void;
}
