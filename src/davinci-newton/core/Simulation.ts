import SimList from './SimList';
import VarsList from './VarsList';

/**
 * 
 */
export interface Simulation {
    /**
     * 
     */
    evaluate(vars: number[], change: number[], timeStep: number): void;
    /**
     * 
     */
    getSimList(): SimList;
    /**
     * 
     */
    getVarsList(): VarsList;
    /**
     * 
     */
    saveState(): void;
    /**
     * 
     */
    restoreState(): void;
    /**
     * 
     */
    getTime(): number;
    /**
     * 
     */
    modifyObjects(): void;
}

export default Simulation;
