import { HistoryIterator } from './HistoryIterator';
import { HistoryList } from './HistoryList';
/**
 * @hidden
 */
export declare class CircularList<T> implements HistoryList<T> {
    /**
     * capacity of the list, maximum size
     */
    private capacity_;
    /**
     * number of items now in memory list <= capacity
     */
    size_: number;
    /**
     * number of times the list has been overwritten
     */
    private cycles_;
    /**
     * pointer to next entry in list;  oldest entry if list has wrapped around.
     */
    private nextPtr_;
    /**
     * pointer to newest entry: index of last entry written to list or -1 if never written.
     */
    private lastPtr_;
    /**
     * values stored.
     */
    values_: Array<T>;
    /**
     * last value written to memory list
     */
    /**
     *
     */
    constructor(capacity?: number);
    /**
     * Causes the MAX_INDEX_ERROR exception to occur in near future by setting
     * the number of cycles to be near the maximum allowed, for testing.
     */
    causeMaxIntError(): void;
    /**
     *
     */
    getEndIndex(): number;
    /**
     *
     */
    getEndValue(): T;
    /**
     *
     */
    getIterator(index: number): HistoryIterator<T>;
    getSize(): number;
    getStartIndex(): number;
    getValue(index: number): T;
    /**
     * Converts an index (which includes cycles) into a pointer.
     * Pointer and index are the same until the list fills and 'wraps around'.
     * @param index the index number, which can be larger than the size of the list
     * @return the pointer to the corresponding point in the list
     */
    indexToPointer_(index: number): number;
    /**
     * Converts a pointer into the list to an index number that includes cycles.
     * Pointer and index are the same until the list fills and 'wraps around'.
     * @throws when the index number exceeds the maximum representable integer
     * @param pointer an index from 0 to size
     * @return the index number of this point including cycles
     */
    private pointerToIndex;
    reset(): void;
    store(value: T): number;
}
