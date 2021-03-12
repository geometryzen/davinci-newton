import { AdvanceStrategy } from '../runner/AdvanceStrategy';
import { Dynamics } from './Dynamics';
import { Metric } from './Metric';
import { Physics } from './Physics';
/**
 * An example of how to wire together the various components.
 * @hidden
 */
export declare class Engine<T> {
    readonly contents: Physics<T>;
    readonly strategy: AdvanceStrategy;
    constructor(metric: Metric<T>, dynamics: Dynamics<T>);
}
