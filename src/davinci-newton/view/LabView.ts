import CoordMap from './CoordMap';
import DisplayList from './DisplayList';
import DoubleRect from './DoubleRect';
import ScreenRect from './ScreenRect';
import Memorizable from '../util/Memorizable';

export interface LabView extends Memorizable {
    /**
     * Called when this LabView becomes the focus view of the LabCanvas.
     */
    gainFocus(): void;

    /**
     * Returns the CoordMap used by this LabView.
     */
    getCoordMap(): CoordMap;

    /**
     * Returns the DisplayList of this LabView.
     */
    getDisplayList(): DisplayList;

    /**
     * Returns the name of this LabView, for use in scripting or debugging.
     */
    getName(): string;

    /**
     * Returns the screen rectangle that this LabView is occupying within the
     * LabCanvas, in screen coordinates.
     */
    getScreenRect(): ScreenRect;

    /**
     * Returns the bounding rectangle for this LabView in simulation coordinates.
     */
    getSimRect(): DoubleRect;

    /**
     * Called when this LabView is no longer the focus view of the LabCanvas.
     */
    loseFocus(): void;

    /**
     * Paints this LabView into the given CanvasRenderingContext2D.
     * @param context the canvas's context to draw into
     */
    paint(context: CanvasRenderingContext2D): void;

    /**
     * Sets the CoordMap used by this LabView.
     * @param map the CoordMap to use for this LabView
     */
    setCoordMap(map: CoordMap): void;

    /**
     * Sets the area that this LabView will occupy within the LabCanvas,
     * in screen coordinates.
     * @param sreenRect the screen coordinates of the area this LabView should occupy
     */
    setScreenRect(screenRect: ScreenRect): void;

    /**
     * Sets the bounding rectangle for this LabView, ensures this rectangle
     * is visible, and turns off auto-scaling. The result is to generate a new CoordMap for
     * this SimView so that the simulation rectangle maps to the current screen rectangle.
     * @param simRect the bounding rectangle for this
     * LabView in simulation coordinates.
     */
    setSimRect(simRect: DoubleRect): void;
}

export default LabView;
