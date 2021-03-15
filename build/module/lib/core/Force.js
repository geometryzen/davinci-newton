import { __extends } from "tslib";
import { LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
/**
 * @hidden
 */
var Force = /** @class */ (function (_super) {
    __extends(Force, _super);
    /**
     *
     */
    function Force(body, metric) {
        var _this = _super.call(this) || this;
        _this.body = body;
        _this.metric = metric;
        _this.location = metric.zero();
        _this.vector = metric.zero();
        _this.$temp1 = metric.zero();
        _this.$temp2 = metric.zero();
        return _this;
    }
    /**
     *
     */
    Force.prototype.getBody = function () {
        return this.body;
    };
    /**
     * Computes the force being applied (vector).
     *
     * @param force (output)
     */
    Force.prototype.computeForce = function (force) {
        switch (this.vectorCoordType) {
            case LOCAL: {
                this.metric.copyVector(this.vector, this.$temp2);
                this.metric.rotate(this.$temp2, this.body.R);
                this.metric.writeVector(this.$temp2, force);
                break;
            }
            case WORLD: {
                this.metric.copyVector(this.vector, this.$temp2);
                this.metric.writeVector(this.$temp2, force);
                break;
            }
        }
    };
    Object.defineProperty(Force.prototype, "F", {
        get: function () {
            this.computeForce(this.$temp2);
            return this.$temp2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "x", {
        get: function () {
            this.computePosition(this.$temp1);
            return this.$temp1;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Computes the point of application of the force in world coordinates.
     *
     * @param position (output)
     */
    Force.prototype.computePosition = function (position) {
        switch (this.locationCoordType) {
            case LOCAL: {
                this.metric.copyVector(this.location, this.$temp1);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero.
                this.metric.rotate(this.$temp1, this.body.R);
                this.metric.addVector(this.$temp1, this.body.X);
                this.metric.writeVector(this.$temp1, position);
                break;
            }
            case WORLD: {
                this.metric.copyVector(this.location, this.$temp1);
                this.metric.writeVector(this.$temp1, position);
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
        this.computePosition(this.$temp1);
        this.computeForce(this.$temp2);
        this.metric.subVector(this.$temp1, this.body.X); // position contains x - X
        this.metric.ext(this.$temp1, this.$temp2); // 
        this.metric.write(this.$temp1, torque);
    };
    return Force;
}(AbstractSimObject));
export { Force };
