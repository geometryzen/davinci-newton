"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = require("./State");
var Bivector3_1 = require("../math/Bivector3");
var Geometric3_1 = require("../math/Geometric3");
var Unit_1 = require("../math/Unit");
var Vector3_1 = require("../math/Vector3");
var Block3_1 = require("../engine3D/Block3");
var Dynamics3_1 = require("../engine3D/Dynamics3");
var Euclidean3_1 = require("../engine3D/Euclidean3");
describe("State", function () {
    describe("Ω calculation", function () {
        it("calculated using (1/2) Ω * L(Ω) should be same as (1/2) ω * L(ω)", function () {
            // Not actually using this yet, other than to test construction.
            var metric = new Euclidean3_1.Euclidean3();
            var dynamics = new Dynamics3_1.Dynamics3();
            var sim = new State_1.State(metric, dynamics);
            var body = new Block3_1.Block3(Geometric3_1.Geometric3.scalar(1), Geometric3_1.Geometric3.scalar(2), Geometric3_1.Geometric3.scalar(3));
            body.M = Geometric3_1.Geometric3.scalar(12);
            body.L.yz = 3;
            body.L.zx = 5;
            body.L.xy = 7;
            body.L.uom = Unit_1.Unit.KILOGRAM.mul(Unit_1.Unit.METER).mul(Unit_1.Unit.METER).div(Unit_1.Unit.SECOND);
            // We'll use a rotation of 90 degrees counter clockwise (from above) in the xy plane.
            body.R.a = 1 / Math.SQRT1_2;
            body.R.xy = -1 / Math.SQRT1_2;
            body.R.direction(true);
            /**
             * Rotor from world coordinates to local coordinates.
             */
            var ω = new Vector3_1.Vector3(body.L.yz, body.L.zx, body.L.xy, body.L.uom);
            ω.rotate(body.R.rev());
            ω.applyMatrix(body.Iinv);
            ω.rotate(body.R.rev());
            body.Ω.yz = ω.x;
            body.Ω.zx = ω.y;
            body.Ω.xy = ω.z;
            // Just to make the sim be used.
            sim.addBody(body);
            // const Ω = new Bivector3().copy(body.L).applyMatrix(Tmat).applyMatrix(body.Iinv).applyMatrix(Rmat);
            var Ω = new Bivector3_1.Bivector3(0, 0, 0, Unit_1.Unit.inv(Unit_1.Unit.SECOND)).copy(body.L).rotate(body.R.rev()).applyMatrix(body.Iinv).rotate(body.R.rev());
            expect(body.Ω.xy).toBeCloseTo(Ω.xy, 15);
            expect(body.Ω.yz).toBeCloseTo(Ω.yz, 15);
            expect(body.Ω.zx).toBeCloseTo(Ω.zx, 15);
        });
    });
});
