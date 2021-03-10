import { __extends } from "tslib";
import { LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
/**
 *
 */
var Force = /** @class */ (function (_super) {
    __extends(Force, _super);
    /**
     *
     */
    function Force(body_, metric) {
        var _this = _super.call(this) || this;
        _this.body_ = body_;
        _this.metric = metric;
        _this.location = metric.zero();
        _this.vector = metric.zero();
        _this.position_ = metric.zero();
        _this.force_ = metric.zero();
        return _this;
    }
    /**
     *
     */
    Force.prototype.getBody = function () {
        return this.body_;
    };
    /**
     * Computes the force being applied (vector).
     */
    Force.prototype.computeForce = function (force) {
        switch (this.vectorCoordType) {
            case LOCAL: {
                this.metric.copyVector(this.vector, this.force_); // force_ contains this.vector.
                this.metric.rotate(this.force_, this.body_.R);
                this.metric.writeVector(this.force_, force);
                break;
            }
            case WORLD: {
                this.metric.copyVector(this.vector, this.force_);
                this.metric.writeVector(this.force_, force);
                break;
            }
        }
    };
    Object.defineProperty(Force.prototype, "F", {
        get: function () {
            this.computeForce(this.force_);
            return this.force_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "x", {
        get: function () {
            this.computePosition(this.position_);
            return this.position_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Computes the point of application of the force in world coordinates.
     */
    Force.prototype.computePosition = function (position) {
        switch (this.locationCoordType) {
            case LOCAL: {
                this.metric.copyVector(this.location, this.position_);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero.
                this.metric.rotate(this.position_, this.body_.R);
                this.metric.addVector(this.position_, this.body_.X);
                this.metric.writeVector(this.position_, position);
                break;
            }
            case WORLD: {
                this.metric.copyVector(this.location, this.position_);
                this.metric.writeVector(this.position_, position);
                break;
            }
        }
    };
    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     */
    Force.prototype.computeTorque = function (torque) {
        this.computePosition(this.position_);
        this.computeForce(this.force_);
        this.metric.subVector(this.position_, this.body_.X); // position contains x - X
        this.metric.ext(this.position_, this.force_); // 
        this.metric.write(this.position_, torque);
    };
    return Force;
}(AbstractSimObject));
export { Force };
