import AbstractSimObject from '../objects/AbstractSimObject';
import Vector from '../math/Vector';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class RigidBody extends AbstractSimObject {

    /**
     * 
     */
    private body_old_: any;

    /**
     * the index into the variables array for this Block, or -1 if not in vars array.
     */
    private varsIndex_ = -1;

    /**
     * Position (in world coordinates)
     */
    private x = 0;
    private y = 0;
    private z = 0;

    /**
     * 
     */
    private vx = 0;
    private vy = 0;
    private vz = 0;

    /**
     * Attitude.
     */
    private angle = 0;

    /**
     * Angular Velocity.
     */
    private omega_ = 0;

    /**
     * Mass.
     */
    protected mass_ = 1;

    /**
     * 
     */
    protected sinAngle_ = 0;

    /**
     * 
     */
    protected cosAngle_ = 1;

    /**
     * center of mass in body coordinates.
     */
    protected cm_body_ = Vector.ORIGIN;

    /**
     * 
     */
    constructor(name: string) {
        super(name);
    }

    /**
     * 
     */
    getExpireTime(): number {
        return Number.POSITIVE_INFINITY;
    }

    /**
     *
     */
    eraseOldCopy(): void {
        this.body_old_ = null;
    }

    /**
     * 
     */
    getVarsIndex(): number {
        return this.varsIndex_;
    }

    /**
     * 
     */
    setVarsIndex(index: number) {
        this.varsIndex_ = index;
    }
    /**
     * 
     */
    getVarName(index: number, localized: boolean): string {
        switch (index) {
            case 0: return "position x";
            case 1: return "position y";
            case 2: return "position z";
            case 3: return "velocity x";
            case 4: return "velocity y";
            case 5: return "velocity z";
            case 6: return "angle";
            case 7: return "omega";
        }
        throw new Error(`getVarName(${index})`);
    }
    /**
     * 
     */
    getAttitude(): number {
        return this.angle;
    }

    /**
     * 
     */
    getAngularVelocity(): number {
        return this.omega_;
    }

    /**
     * 
     */
    getPosition(): VectorE3 {
        return new Vector(this.x, this.y, this.z);
    }

    /**
     * 
     */
    setPosition(x: number, y: number, z: number): void {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 
     */
    setAttitude(angle?: number): void {
        this.angle = angle;
        this.cosAngle_ = Math.cos(angle);
        this.sinAngle_ = Math.sin(angle);
    }

    /**
     *
     */
    getVelocity(): VectorE3 {
        return new Vector(this.vx, this.vy, this.vz);
    }

    /**
     * 
     */
    setVelocity(vx: number, vy: number, vz: number): void {
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
    }

    setAngularVelocity(omega?: number): void {
        this.omega_ = omega;
    }

    /**
     * 
     */
    getMass(): number {
        return this.mass_;
    }

    /**
     * 
     */
    setMass(mass: number): void {
        this.mass_ = mass;
    }

    /**
     * 
     */
    momentAboutCM(): number {
        return 1;
    }

    /**
     * 
     */
    rotationalEnergy(): number {
        return 0;
    }

    /**
     * 
     */
    translationalEnergy(): number {
        return 0;
    }

    /**
     * 
     */
    saveOldCopy(): void {
        // Do nothing yet.
    }

    /**
     * 
     */
    bodyToWorld(bodyPoint: VectorE3): Vector {
        const rx = bodyPoint.x - this.cm_body_.x;  // vector from cm to bodyPoint
        const ry = bodyPoint.y - this.cm_body_.y;
        const x = this.x + (rx * this.cosAngle_ - ry * this.sinAngle_);
        const y = this.y + (rx * this.sinAngle_ + ry * this.cosAngle_);
        return new Vector(x, y, 0);
    }

    /**
     * 
     */
    worldVelocityOfBodyPoint(bodyPoint: VectorE3): Vector {
        const r = this.rotateBodyToWorld(Vector.fromVector(bodyPoint).subtract(this.cm_body_));
        const vx = this.vx - r.y * this.omega_;
        const vy = this.vy + r.x * this.omega_;
        return new Vector(vx, vy, 0);
    }

    /**
     * 
     */
    rotateBodyToWorld(bodyPoint: VectorE3): Vector {
        return Vector.fromVector(bodyPoint).rotate(this.cosAngle_, this.sinAngle_);
    }
}

export default RigidBody;
