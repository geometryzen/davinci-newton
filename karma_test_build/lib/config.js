"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var Newton = /** @class */ (function () {
    /**
     *
     */
    function Newton() {
        this.GITHUB = 'https://github.com/geometryzen/davinci-newton';
        this.LAST_MODIFIED = '2021-03-05';
        this.NAMESPACE = 'NEWTON';
        this.VERSION = '1.0.22';
    }
    Newton.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    };
    Newton.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    };
    Newton.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        // This should allow us to unit test and run in environments without a console.
        console.warn(message);
    };
    Newton.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        // This should allow us to unit test and run in environments without a console.
        console.error(message);
    };
    return Newton;
}());
/**
 *
 */
exports.config = new Newton();