// Copyright 2017 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import AbstractSubject from '../util/AbstractSubject';
import AlignH from '../view/AlignH';
import AlignV from '../view/AlignV';
import AutoScale from './AutoScale';
import DisplayAxes from './DisplayAxes';
import DisplayGraph from './DisplayGraph';
import DoubleRect from '../view/DoubleRect';
import GenericObserver from '../util/GenericObserver';
import GraphLine from './GraphLine';
import GraphVarsList from './GraphVarsList';
import LabCanvas from '../view/LabCanvas';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeString from '../checks/mustBeString';
import SimView from '../view/SimView';


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
    /**
     * 
     */
    private readonly view = new SimView(new DoubleRect(0, 0, 1, 1));

    /**
     * 
     */
    public autoScale = new AutoScale(this.view);

    /**
     * 
     */
    public axes: DisplayAxes;

    /**
     * 
     */
    private displayGraph: DisplayGraph;

    /**
     * 
     */
    private labCanvas: LabCanvas;

    /**
     * The index for the time variable in the varsList.
     */
    private timeIdx_: number;

    /**
     * 
     */
    private subscription: GenericObserver;

    /**
     * 
     */
    constructor(canvasId: string, private varsList: GraphVarsList) {
        super();
        const canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.labCanvas = new LabCanvas(canvas);

        this.view.hAxisAlign = AlignH.FULL;
        this.view.vAxisAlign = AlignV.FULL;
        this.labCanvas.addView(this.view);

        this.displayGraph = new DisplayGraph();
        this.displayGraph.setScreenRect(this.view.getScreenRect());

        this.view.getDisplayList().prepend(this.displayGraph);

        // Find out where the time is stored in the list of variables.
        this.timeIdx_ = varsList.timeIndex();

        this.axes = new DisplayAxes(this.view.getSimRect());
        this.subscription = new GenericObserver(this.view, (event) => {
            if (event.nameEquals(SimView.COORD_MAP_CHANGED)) {
                const simRect = this.view.getCoordMap().screenToSimRect(this.view.getScreenRect());
                this.axes.setSimRect(simRect);
            }
        });
        this.view.getDisplayList().add(this.axes);

        this.autoScale.extraMargin = 0.05;
    }

    protected destructor(): void {
        if (this.subscription) {
            this.subscription.disconnect();
            this.subscription = void 0;
        }
    }

    /**
     * 
     */
    addGraphLine(hCoordIndex: number, vCoordIndex: number, color = 'black'): GraphLine {
        mustBeNumber('hCoordIndex', hCoordIndex);
        mustBeNumber('vCoordIndex', vCoordIndex);
        mustBeString('color', color);
        const graphLine = new GraphLine(this.varsList);
        this.view.addMemo(graphLine);
        graphLine.hCoordIndex = hCoordIndex;
        graphLine.vCoordIndex = vCoordIndex;
        graphLine.color = color;
        graphLine.hotspotColor = color;
        this.displayGraph.addGraphLine(graphLine);
        // Don't use off-screen buffer with time variable because the auto-scale causes
        // graph to redraw every frame.
        this.displayGraph.setUseBuffer(graphLine.hCoordIndex !== this.timeIdx_);
        return graphLine;
    }

    removeGraphLine(graphLine: GraphLine): void {
        this.displayGraph.removeGraphLine(graphLine);
    }

    memorize(): void {
        this.labCanvas.memorize();
    }

    render(): void {
        this.labCanvas.paint();
    }

    reset(): void {
        this.autoScale.reset();
        this.displayGraph.reset();
    }
}

export default Graph;
