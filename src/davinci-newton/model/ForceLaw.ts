import Force from './Force';

interface ForceLaw {
    calculateForces(): Force[];
    disconnect(): void;
    getPotentialEnergy(): number;
}

export default ForceLaw;
