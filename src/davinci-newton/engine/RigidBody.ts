import AbstractSimObject from '../objects/AbstractSimObject';
import BivectorE3 from '../math/BivectorE3';
import MutableSpinor from '../math/MutableSpinor';
import MutableVector from '../math/MutableVector';
import SpinorE3 from '../math/SpinorE3';
import Vector from '../math/Vector';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class RigidBody extends AbstractSimObject {

    /**
     * the index into the variables array for this Block, or -1 if not in vars array.
     */
    private varsIndex_ = -1;

    private readonly position_ = new MutableVector();
    private readonly attitude_ = new MutableSpinor();
    private readonly momentum_ = new MutableVector();

    /**
     * Angular Velocity.
     */
    public readonly Ω: BivectorE3 = { xy: 0, yz: 0, zx: 0 };

    /**
     * Mass.
     */
    protected mass_ = 1;

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

    get X(): VectorE3 {
        return this.position_;
    }

    set X(position: VectorE3) {
        this.position_.copy(position);
    }

    get R(): SpinorE3 {
        return this.attitude_;
    }

    set R(attitude: SpinorE3) {
        this.attitude_.copy(attitude);
    }

    get P(): VectorE3 {
        return this.momentum_;
    }

    set P(momentum: VectorE3) {
        this.momentum_.copy(momentum);
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
    bodyToWorld(bodyPoint: VectorE3): Vector {
        const r = Vector.fromVector(bodyPoint).subtract(this.cm_body_);
        return r.rotate(this.R).add(this.X);
        // const rx = bodyPoint.x - this.cm_body_.x;  // vector from cm to bodyPoint
        // const ry = bodyPoint.y - this.cm_body_.y;
        // const x = this.X.x + (rx * this.cosAngle_ - ry * this.sinAngle_);
        // const y = this.X.y + (rx * this.sinAngle_ + ry * this.cosAngle_);
        // return new Vector(x, y, 0);
    }

    /**
     * Returns dx/dt where
     * 
     * dx/dt = ω x [R bodyPoint] + dX/dt (t argument suppressed)
     * 
     * The implementation uses the angular velocity bivector, Ω = I * ω, where I is the
     * unit pseudoscalar.
     * 
     * Using the identity, ω x r = r << Ω, enables us to calculate directly.
     */
    worldVelocityOfBodyPoint(bodyPoint: VectorE3): Vector {
        // r = R(t) * [bodyPoint relative to body center of mass]
        const r = this.rotateBodyToWorld(Vector.fromVector(bodyPoint).subtract(this.cm_body_));
        // ω = - I * Ω
        const ω = new Vector(-this.Ω.yz, -this.Ω.zx, -this.Ω.xy);
        // dx/dt = ω x r + dX/dt
        return ω.cross(r).add(this.P).multiply(1 / this.mass_);
    }

    /**
     * 
     */
    rotateBodyToWorld(bodyPoint: VectorE3): Vector {
        return Vector.fromVector(bodyPoint).rotate(this.R);
    }
}

export default RigidBody;
