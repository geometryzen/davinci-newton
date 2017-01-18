export interface HistoryIterator<T> {
    getIndex(): number;
    getValue(): T;
    hasNext(): boolean;
    hasPrevious(): boolean;
    nextValue(): T;
    previousValue(): T;
}

export default HistoryIterator;
