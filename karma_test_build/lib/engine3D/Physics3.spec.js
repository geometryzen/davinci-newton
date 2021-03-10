"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric3_1 = require("../math/Geometric3");
var ConstantEnergySolver_1 = require("../solvers/ConstantEnergySolver");
var RungeKutta_1 = require("../solvers/RungeKutta");
var DefaultAdvanceStrategy_1 = require("../strategy/DefaultAdvanceStrategy");
var Block3_1 = require("./Block3");
var Physics3_1 = require("./Physics3");
var Spring3_1 = require("./Spring3");
describe("Physics3", function () {
    it("should be backwards compatible.", function () {
        var e1 = Geometric3_1.Geometric3.e1;
        // const e2 = G3.e2;
        var e3 = Geometric3_1.Geometric3.e3;
        /**
         * kilogram
         */
        var kg = Geometric3_1.Geometric3.kilogram;
        /**
         * meter
         */
        var m = Geometric3_1.Geometric3.meter;
        /**
         * second
         */
        var s = Geometric3_1.Geometric3.second;
        var N = Geometric3_1.Geometric3.newton;
        var state = new Physics3_1.Physics3();
        var rk4 = new RungeKutta_1.RungeKutta(state);
        var solver = new ConstantEnergySolver_1.ConstantEnergySolver(state, state, rk4);
        solver.tolerance = 1E-5;
        solver.stepLowerBound = 1E-7;
        var strategy = new DefaultAdvanceStrategy_1.DefaultAdvanceStrategy(state, solver);
        var Δt = Geometric3_1.Geometric3.scalar(0.01).mul(s);
        var width = Geometric3_1.Geometric3.scalar(0.5).mul(m);
        var height = Geometric3_1.Geometric3.scalar(0.1).mul(m);
        var depth = Geometric3_1.Geometric3.scalar(0.5).mul(m);
        var block1 = new Block3_1.Block3(width, height, depth);
        var block2 = new Block3_1.Block3(width, height, depth);
        block1.M = Geometric3_1.Geometric3.scalar(1).mul(kg);
        block2.M = Geometric3_1.Geometric3.scalar(1).mul(kg);
        block1.X = Geometric3_1.Geometric3.scalar(-1.0).mul(e1).mul(m);
        block2.X = Geometric3_1.Geometric3.scalar(+1.0).mul(e1).mul(m);
        state.addBody(block1);
        state.addBody(block2);
        state.showForces = true;
        var spring = new Spring3_1.Spring3(block1, block2);
        spring.restLength = Geometric3_1.Geometric3.scalar(1).mul(m);
        spring.stiffness = Geometric3_1.Geometric3.scalar(1).mul(N).divByScalar(m.a, m.uom);
        state.addForceLaw(spring);
        spring.attach1 = Geometric3_1.Geometric3.scalar(1).mul(block1.width).mul(e1).add(Geometric3_1.Geometric3.scalar(1).mul(block1.depth).mul(e3)).divByNumber(2);
        // Advance one step so that the forces are computed and visible.
        strategy.advance(Δt.a, Δt.uom);
        // Can't actually execute this code because of the DOM dependency.
        // const graph = new EnergyTimeGraph('graph', state.varsList);
        // graph.axes.hAxisScale = s.uom;
        // graph.axes.vAxisScale = state.totalEnergy().uom;
        expect(true).toBe(true);
    });
});
