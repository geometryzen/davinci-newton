import MemoList from './MemoList';

export interface AdvanceStrategy {
    /**
     * 
     */
    advance(timeStep: number, memoList?: MemoList): void;
    /**
     * 
     */
    getTime(): number;
    /**
     * 
     */
    getTimeStep(): number;
}

export default AdvanceStrategy;
