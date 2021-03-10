"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var RungeKutta_1 = require("../solvers/RungeKutta");
var DefaultAdvanceStrategy_1 = require("../strategy/DefaultAdvanceStrategy");
var State_1 = require("./State");
/**
 * An example of how to wire together the various components.
 */
var Engine = /** @class */ (function () {
    function Engine(metric, dynamics) {
        this.contents = new State_1.State(metric, dynamics);
        var rk4 = new RungeKutta_1.RungeKutta(this.contents);
        this.strategy = new DefaultAdvanceStrategy_1.DefaultAdvanceStrategy(this.contents, rk4);
    }
    return Engine;
}());
exports.Engine = Engine;
