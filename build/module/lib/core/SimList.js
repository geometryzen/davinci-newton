import { __extends } from "tslib";
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { AbstractSubject } from '../util/AbstractSubject';
import { contains } from '../util/contains';
import { GenericEvent } from '../util/GenericEvent';
import { remove } from '../util/remove';
/**
 * @hidden
 */
var SimList = /** @class */ (function (_super) {
    __extends(SimList, _super);
    /**
     *
     */
    function SimList() {
        var _this = _super.call(this) || this;
        /**
         *
         */
        _this.$elements = [];
        return _this;
    }
    /**
     *
     */
    SimList.prototype.add = function (element) {
        mustBeNonNullObject('element', element);
        if (!contains(this.$elements, element)) {
            this.$elements.push(element);
            this.broadcast(new GenericEvent(this, SimList.OBJECT_ADDED, element));
        }
    };
    /**
     *
     */
    SimList.prototype.forEach = function (callBack) {
        return this.$elements.forEach(callBack);
    };
    /**
     *
     */
    SimList.prototype.remove = function (simObject) {
        if (remove(this.$elements, simObject)) {
            this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simObject));
        }
    };
    /**
     * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
     * Notifies Observers by broadcasting the `OBJECT_REMOVED` event for each SimObject removed.
     * @param time the current simulation time
     */
    SimList.prototype.removeTemporary = function (time) {
        for (var i = this.$elements.length - 1; i >= 0; i--) {
            var simobj = this.$elements[i];
            if (simobj.expireTime < time) {
                this.$elements.splice(i, 1);
                this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simobj));
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
}(AbstractSubject));
export { SimList };
