import ForceApp from './ForceApp';

export interface ForceLaw {
    calculateForces(): ForceApp[];
    disconnect(): void;
    getPotentialEnergy(): number;
}

export default ForceLaw;
