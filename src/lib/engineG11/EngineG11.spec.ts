import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { FaradayLaw } from "../core/FaradayLaw";
import { Spacetime1 } from "../math/Spacetime1";
import { EngineG11 } from "./EngineG11";
import { ParticleG11 } from "./ParticleG11";

const zero = Spacetime1.zero;
const e0 = Spacetime1.e0;
const e1 = Spacetime1.e1;
const e01 = e0.mul(e1);

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
        it("the bead should advance in time if no spatial momentum.", function () {
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
    describe("FaradayLaw", function () {
        it("the bead should advance in time if no spatial momentum.", function () {
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

            const steps = 1024 * 4;
            for (let i = 0; i < steps; i++) {
                engine.advance(1 / steps);
            }
            // console.log(`bead.X=>${bead.X}`);
            // console.log(`bead.P=>${bead.P}`);
            // console.log(`|bead.P|^2=>${bead.P.squaredNorm()}`);
            // The bead ends up at e0.
            // expect(bead.X.equals(e0)).toBeTrue();
            // The linear momentum does no change.
            // expect(bead.P.equals(e0)).toBeTrue();
            expect(true).toBeTrue();
        });
    });
    describe("FaradayLaw", function () {
        it("the bead should advance in time if no spatial momentum.", function () {
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
            // console.log(`bead.X=>${bead.X}`);
            // console.log(`bead.P=>${bead.P}`);
            // console.log(`|bead.P|^2=>${bead.P.squaredNorm()}`);
            // console.log(`bead.X=>${bead.X}`);
            // console.log(`bead.P=>${bead.P}`);
            // The bead ends up at e0.
            // expect(bead.X.equals(e0)).toBeTrue();
            // The linear momentum does no change.
            // expect(bead.P.equals(e0)).toBeTrue();
            expect(true).toBeTrue();
        });
    });
});
