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
    function Force(body) {
        var _this = _super.call(this) || this;
        _this.body = body;
        var metric = body.metric;
        _this.location = metric.scalar(0);
        _this.$locationCoordType = LOCAL;
        _this.vector = metric.scalar(0);
        _this.$vectorCoordType = WORLD;
        _this.$temp1 = metric.scalar(0);
        _this.$temp2 = metric.scalar(0);
        return _this;
    }
    Object.defineProperty(Force.prototype, "locationCoordType", {
        /**
         *
         */
        get: function () {
            return this.$locationCoordType;
        },
        set: function (locationCoordType) {
            if (locationCoordType !== LOCAL && locationCoordType !== WORLD) {
                throw new Error("locationCoordType must be LOCAL (0) or WORLD (1).");
            }
            this.$locationCoordType = locationCoordType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "vectorCoordType", {
        /**
         *
         */
        get: function () {
            return this.$vectorCoordType;
        },
        set: function (vectorCoordType) {
            if (vectorCoordType !== LOCAL && vectorCoordType !== WORLD) {
                throw new Error("vectorCoordType must be LOCAL (0) or WORLD (1).");
            }
            this.$vectorCoordType = vectorCoordType;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    Force.prototype.getBody = function () {
        return this.body;
    };
    /**
     * Computes the point of application of the force in world coordinates.
     *
     * @param position (output)
     */
    Force.prototype.computePosition = function (position) {
        var metric = this.body.metric;
        switch (this.$locationCoordType) {
            case LOCAL: {
                metric.copyVector(this.location, position);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero.
                metric.rotate(position, this.body.R);
                metric.addVector(position, this.body.X);
                break;
            }
            case WORLD: {
                metric.copyVector(this.location, position);
                break;
            }
        }
    };
    /**
     * Computes the force being applied (vector) in WORLD coordinates.
     *
     * @param force (output)
     */
    Force.prototype.computeForce = function (force) {
        var metric = this.body.metric;
        switch (this.$vectorCoordType) {
            case LOCAL: {
                metric.copyVector(this.vector, force);
                metric.rotate(force, this.body.R);
                break;
            }
            case WORLD: {
                metric.copyVector(this.vector, force);
                break;
            }
        }
    };
    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     *
     * @param torque (output)
     */
    Force.prototype.computeTorque = function (torque) {
        var metric = this.body.metric;
        this.computePosition(torque); // torque = x
        this.computeForce(this.$temp2); // temp2 = F
        metric.subVector(torque, this.body.X); // torque = x - X
        metric.ext(torque, this.$temp2); // torque = (x - X) ^ F
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
    return Force;
}(AbstractSimObject));
export { Force };
