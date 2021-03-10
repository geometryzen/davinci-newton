/**
 * Returns a new array which is an expanded copy of the given array.
 * Adds `quantity` new entries at `position` location in the array.
 * Negative quantity will delete array entries.
 */
export default function extendArray<T>(array: T[], quantity: number, value: T | T[]): void;
