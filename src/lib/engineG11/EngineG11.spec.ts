import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { FaradayLaw } from "../core/FaradayLaw";
import { Spacetime1 } from "../math/Spacetime1";
import { Unit } from "../math/Unit";
import { EngineG11 } from "./EngineG11";
import { ParticleG11 } from "./ParticleG11";

const one = Spacetime1.one;
const zero = Spacetime1.zero;
const e0 = Spacetime1.e0;
const e1 = Spacetime1.e1;
const e01 = e0.mul(e1);
const kilogram = Spacetime1.kilogram;
const meter = Spacetime1.meter;
const second = Spacetime1.second;

describe("EngineG11", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const engine = new EngineG11();
            expect(engine).toBeDefined();
        });
    });
    describe("particle", function () {
        it("should be defined.", function () {
            const engine = new EngineG11();
            expect(engine).toBeDefined();

            const bead = new ParticleG11();
            expect(bead).toBeDefined();
        });
    });
    describe("addBody", function () {
        it("should be defined.", function () {
            const engine = new EngineG11();

            const bead = new ParticleG11();

            engine.addBody(bead);
            expect(true).toBe(true);
        });
    });
    describe("advance", function () {
        it("", function () {
            const engine = new EngineG11();

            const bead = new ParticleG11();

            // The bead is initially spatially at rest.
            // This implies that it is moving through time.
            bead.P = e0;

            expect(bead.X.equals(zero)).toBeTrue();
            expect(bead.P.equals(e0)).toBeTrue();

            engine.addBody(bead);

            const steps = 1024;
            for (let i = 0; i < steps; i++) {
                engine.advance(1 / steps);
            }

            // The bead ends up at e0.
            expect(bead.X.equals(e0)).toBeTrue();
            // The linear momentum does not change.
            expect(bead.P.equals(e0)).toBeTrue();
        });
    });
    //
    // Motion under the influence of a constant force.
    // See Introduction to Electrodynamics
    // DAVID J. GRIFFITHS
    // 10.2.4 Relativistic Dynamics Example 10
    //
    // x = (m * c^2 / F) * [sqrt(1 + (Ft/mc)^2) - 1]
    //
    describe("ConstantForceLaw", function () {
        it("dimensionless", function () {
            const engine = new EngineG11();

            const bead = new ParticleG11();

            // The bead is initially spatially at rest.
            // This implies that it is moving through time.
            bead.P = e0;

            expect(bead.X.equals(zero)).toBeTrue();
            expect(bead.P.equals(e0)).toBeTrue();

            engine.addBody(bead);

            const constantForceLaw = new ConstantForceLaw(bead, e1);
            expect(constantForceLaw).toBeDefined();

            engine.addForceLaw(constantForceLaw);

            const factor = 5;
            const steps = 1024 * 4;
            for (let i = 0; i < steps * factor; i++) {
                engine.advance(1 / steps);
                const t = engine.varsList.getTime();
                const x = Math.sqrt(1 + t * t) - 1;
                expect(bead.X.x).toBeCloseTo(x, 10);
            }

            const t = engine.varsList.getTime();
            const x = Math.sqrt(1 + t * t) - 1;
            expect(bead.X.x).toBeCloseTo(x, 10);
        });
        it("S.I. Units", function () {
            const c = meter.div(second).mulByNumber(3e8);
            const M = kilogram;
            const Q = Spacetime1.coulomb;
            const E = M.mul(c).mul(c);
            // Scale up the force so that (FT/mc) is same as dimensionless example. 
            const F = Spacetime1.newton.mulByVector(e1).mulByNumber(3e8);
            const engine = new EngineG11();
            engine.speedOfLight = c;

            const bead = new ParticleG11(M, Q);

            // The bead is initially spatially at rest.
            // This implies that it is moving through time.
            // TODO: Do a better job of bootstrapping quantities that are zero.
            bead.X = meter.mulByNumber(0); // TODO: Bootstrap
            bead.R = one;
            bead.P = E.div(c).mulByVector(e0);
            bead.L = Spacetime1.joule.mul(second).mulByNumber(0);

            engine.addBody(bead);

            const constantForceLaw = new ConstantForceLaw(bead, F);
            expect(constantForceLaw).toBeDefined();

            engine.addForceLaw(constantForceLaw);

            const factor = 5;
            const steps = 1024 * 4;
            for (let i = 0; i < steps * factor; i++) {
                engine.advance(1 / steps, Unit.SECOND);
                const t = engine.varsList.getTime();
                const FTdivMC = F.x * t / (M.a * c.a);
                const x = (M.a * c.a * c.a / F.x) * (Math.sqrt(1 + FTdivMC * FTdivMC) - 1);
                expect(bead.X.x).toBeCloseTo(x, 5);
            }
        });
    });
    describe("FaradayLaw", function () {
        it("", function () {
            const engine = new EngineG11();

            const bead = new ParticleG11();

            // The bead is initially spatially at rest.
            // This implies that it is moving through time.
            bead.P = e0;

            expect(bead.X.equals(zero)).toBeTrue();
            expect(bead.P.equals(e0)).toBeTrue();

            engine.addBody(bead);

            const faradayLaw = new FaradayLaw(bead, function (X: Spacetime1) { return e01; });
            expect(faradayLaw).toBeDefined();

            engine.addForceLaw(faradayLaw);

            const steps = 1024 * 4;
            for (let i = 0; i < steps; i++) {
                engine.advance(1 / steps);
            }
            expect(true).toBeTrue();
        });
    });
});
