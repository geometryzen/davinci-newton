/**
 * Returns the current time as given by the system clock, in seconds.
 */
export default function getSystemTime(): number {
    return Date.now() * 1E-3;
}
