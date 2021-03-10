"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimList = void 0;
var tslib_1 = require("tslib");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var AbstractSubject_1 = require("../util/AbstractSubject");
var contains_1 = require("../util/contains");
var GenericEvent_1 = require("../util/GenericEvent");
var remove_1 = require("../util/remove");
/**
 *
 */
var SimList = /** @class */ (function (_super) {
    tslib_1.__extends(SimList, _super);
    /**
     *
     */
    function SimList() {
        var _this = _super.call(this) || this;
        /**
         *
         */
        _this.elements_ = [];
        return _this;
    }
    /**
     *
     */
    SimList.prototype.add = function (simObject) {
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            mustBeNonNullObject_1.default('element', element);
            if (!contains_1.default(this.elements_, element)) {
                this.elements_.push(element);
                this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_ADDED, element));
            }
        }
    };
    /**
     *
     */
    SimList.prototype.forEach = function (callBack) {
        return this.elements_.forEach(callBack);
    };
    /**
     *
     */
    SimList.prototype.remove = function (simObject) {
        if (remove_1.default(this.elements_, simObject)) {
            this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_REMOVED, simObject));
        }
    };
    /**
     * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
     * Notifies Observers by broadcasting the `OBJECT_REMOVED` event for each SimObject removed.
     * @param time the current simulation time
     */
    SimList.prototype.removeTemporary = function (time) {
        for (var i = this.elements_.length - 1; i >= 0; i--) {
            var simobj = this.elements_[i];
            if (simobj.expireTime < time) {
                this.elements_.splice(i, 1);
                this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_REMOVED, simobj));
            }
        }
    };
    /**
     *
     */
    SimList.OBJECT_ADDED = 'OBJECT_ADDED';
    /**
     *
     */
    SimList.OBJECT_REMOVED = 'OBJECT_REMOVED';
    return SimList;
}(AbstractSubject_1.default));
exports.SimList = SimList;
exports.default = SimList;
