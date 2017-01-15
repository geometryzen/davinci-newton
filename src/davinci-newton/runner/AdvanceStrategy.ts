import MemoList from './MemoList';

interface AdvanceStrategy {
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
