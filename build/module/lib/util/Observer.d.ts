import { SubjectEvent } from './SubjectEvent';
/**
 * @hidden
 */
export interface Observer {
    observe(event: SubjectEvent): void;
}
