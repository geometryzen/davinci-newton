import { AdvanceStrategy } from '../runner/AdvanceStrategy';
import { Dynamics } from './Dynamics';
import { Metric } from './Metric';
import { State } from './State';
/**
 * An example of how to wire together the various components.
 */
export declare class Engine<T> {
    readonly contents: State<T>;
    readonly strategy: AdvanceStrategy;
    constructor(metric: Metric<T>, dynamics: Dynamics<T>);
}
