import GenericVector from '../math/GenericVector';
import SimObject from '../core/SimObject';

interface RigidBody extends SimObject {
    eraseOldCopy(): void;
    getVarsIndex(): number;
    setVarsIndex(index: number): void;
    getVarName(index: number, localized: boolean): string;
    getAngle(): number;
    getAngularVelocity(): number;
    getPosition(): GenericVector;
    setPosition(worldLocation: GenericVector, angle?: number): void;
    getVelocity(): GenericVector;
    setVelocity(worldVelocity: GenericVector, angularVelocity?: number): void;
    getMass(): number;
    momentAboutCM(): number;
    rotationalEnergy(): number;
    translationalEnergy(): number;
    saveOldCopy(): void;
}

export default RigidBody;
