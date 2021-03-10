import SubjectEvent from './SubjectEvent';
export interface Observer {
    observe(event: SubjectEvent): void;
}
export default Observer;
