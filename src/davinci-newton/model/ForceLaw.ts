import Force from './Force';

export interface ForceLaw {
    calculateForces(): Force[];
    disconnect(): void;
    getPotentialEnergy(): number;
}

export default ForceLaw;
