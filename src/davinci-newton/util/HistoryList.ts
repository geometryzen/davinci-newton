import HistoryIterator from './HistoryIterator';

export interface HistoryList<T> {
    /**
     * Returns the index of the ending value in this HistoryList.
     * The ending value is the newest value in this HistoryList.
     */
    getEndIndex(): number;
    /**
     * Returns the last value stored in this HistoryList.
     */
    getEndValue(): T;
    /**
     * 
     */
    getIterator(index?: number): HistoryIterator<T>;
}

export default HistoryList;
