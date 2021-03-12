import { AbstractSubject } from '../util/AbstractSubject';
import { CoordMap } from './CoordMap';
import { DisplayObject } from './DisplayObject';
/**
 * Displays a set of DisplayObject(s)}, which show the state of the simulation.
 * A DisplayObject typically represents a SimObject, but not always.
 *
 * zzIndex
 * ------
 * DisplayObjects with a lower `zIndex` appear underneath those with higher `zIndex`.
 * The DisplayList is sorted by `zIndex`.
 * @hidden
 */
export declare class DisplayList extends AbstractSubject {
    /**
     * Name of event broadcast when a DisplayObject is added.
     */
    static readonly OBJECT_ADDED = "OBJECT_ADDED";
    /**
     * Name of event broadcast when a DisplayObject is removed.
     */
    static readonly OBJECT_REMOVED = "OBJECT_REMOVED";
    /**
     *
     */
    private readonly drawables_;
    /**
     *
     */
    constructor();
    /**
     * Adds the DisplayObject, inserting it at the end of the group of DisplayObjects
     * with the same zIndex; the item will appear visually over objects that have
     * the same (or lower) `zIndex`.
     * @param dispObj the DisplayObject to add
     */
    add(dispObj: DisplayObject): void;
    /**
     * Draws the DisplayObjects in order, which means that DisplayObjects drawn later (at
     * the end of the list) will appear to be on top of those drawn earlier (at start of the list).
     * @param context the canvas's context to draw this object into
     * @param map the mapping to use for translating between simulation and screen coordinates
     */
    draw(context: CanvasRenderingContext2D, coordMap: CoordMap): void;
    /**
     * Adds the DisplayObject, inserting it at the front of the group of DisplayObjects
     * with the same zIndex; the item will appear visually under objects that have
     * the same (or higher) `zIndex`.
     * @param dispObj the DisplayObject to prepend
     */
    prepend(dispObj: DisplayObject): void;
    private sort;
}
