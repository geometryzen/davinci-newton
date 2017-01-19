import HistoryList from './HistoryList';
import HistoryIterator from './HistoryIterator';
import UtilityCore from './UtilityCore';

const MAX_INDEX_ERROR = 'exceeded max int';

class CircularListIterator<T> implements HistoryIterator<T> {
    /**
     * 
     */
    private first_: boolean;
    /**
     * 
     */
    private index_: number;
    /**
     * 
     */
    private pointer_: number;
    /**
     * 
     */
    constructor(private cList_: CircularList<T>, startIndex: number) {
        this.first_ = cList_.size_ > 0;
        this.index_ = startIndex;
        this.pointer_ = cList_.indexToPointer(startIndex);
    }
    getIndex() {
        if (this.cList_.size_ === 0) {
            throw new Error('no data');
        }
        return this.index_;
    }

    getValue() {
        if (this.cList_.size_ === 0) {
            throw new Error('no data');
        }
        return this.cList_.values_[this.pointer_];
    }

    hasNext() {
        return this.first_ || this.index_ < this.cList_.getEndIndex();
    }

    hasPrevious() {
        return this.first_ || this.index_ > this.cList_.getStartIndex();
    }

    nextValue() {
        if (this.cList_.size_ === 0)
            throw new Error('no data');
        if (this.first_) {
            // first 'nextPoint' does nothing except clear this flag
            this.first_ = false;
        } else {
            if (this.index_ + 1 > this.cList_.getEndIndex()) {
                throw new Error('cannot iterate past end of list');
            }
            this.index_++;
            this.pointer_ = this.cList_.indexToPointer(this.index_);
        }
        return this.cList_.values_[this.pointer_];
    }


    previousValue() {
        if (this.cList_.size_ === 0)
            throw new Error('no data');
        if (this.first_) {
            // first 'previousPoint' does nothing except clear this flag
            this.first_ = false;
        } else {
            if (this.index_ - 1 < this.cList_.getStartIndex()) {
                throw new Error('cannot iterate prior to start of list');
            }
            this.index_--;
            this.pointer_ = this.cList_.indexToPointer(this.index_);
        }
        return this.cList_.values_[this.pointer_];
    }
}

export default class CircularList<T> implements HistoryList<T> {
    /**
     * 
     */
    size_ = 0;
    /**
     * 
     */
    cycles_ = 0;
    /**
     * 
     */
    nextPtr_ = 0;
    /**
     * 
     */
    lastPtr_ = -1;
    /**
     * 
     */
    values_: Array<T>;
    /**
     * 
     */
    constructor(private capacity_ = 3000) {
        this.values_ = new Array(this.capacity_);
    }

    /**
     * 
     */
    getEndIndex(): number {
        if (this.size_ === 0) {
            return -1;
        }
        let idx;
        if (this.nextPtr_ === 0)
            idx = this.pointerToIndex(this.size_ - 1);
        else
            idx = this.pointerToIndex(this.nextPtr_ - 1);
        return idx;
    }

    /**
     * 
     */
    getEndValue() {
        const idx = this.getEndIndex();
        return idx === -1 ? null : this.values_[this.indexToPointer(idx)];
    }

    /**
     * 
     */
    getIterator(index: number): HistoryIterator<T> {
        return new CircularListIterator(this, index);
    }

    getSize() {
        return this.size_;
    }

    getStartIndex() {
        const idx = (this.size_ < this.capacity_) ? 0 : this.pointerToIndex(this.nextPtr_);
        return idx;
    }

    getValue(index: number) {
        const i = this.indexToPointer(index);
        return this.values_[i];
    }

    indexToPointer(index: number): number {
        if (this.size_ < this.capacity_)
            return index;
        const p = index % this.capacity_;
        const idx = index - (this.cycles_ - (p < this.nextPtr_ ? 0 : 1)) * this.capacity_;
        return idx;
    }

    /**
     * 
     */
    pointerToIndex(pointer: number) {
        if (this.size_ < this.capacity_)
            return pointer;
        const idx = pointer +
            (this.cycles_ - (pointer < this.nextPtr_ ? 0 : 1)) * this.capacity_;
        if (idx >= UtilityCore.MAX_INTEGER)
            throw new Error(MAX_INDEX_ERROR);
        return idx;
    }

    reset(): void {
        this.nextPtr_ = this.size_ = 0;  // clear out the memory
        this.cycles_ = 0;
        this.lastPtr_ = -1;
    }

    store(value: T): number {
        this.lastPtr_ = this.nextPtr_;
        this.values_[this.nextPtr_] = value;
        this.nextPtr_++;
        if (this.size_ < this.capacity_)
            this.size_++;
        if (this.nextPtr_ >= this.capacity_) {  // wrap around at end
            this.cycles_++;
            this.nextPtr_ = 0;
        }
        return this.pointerToIndex(this.lastPtr_);
    }
}
