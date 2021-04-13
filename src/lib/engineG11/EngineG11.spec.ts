import { Spacetime1 } from "../math/Spacetime1";
import { EngineG11 } from "./EngineG11";
import { ParticleG11 } from "./ParticleG11";

const e0 = Spacetime1.e0;

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

            bead.P = e0;

            console.log(`bead.X=${bead.X}`);
            console.log(`bead.P=${bead.P}`);

            engine.addBody(bead);

            console.log(`bead.X=${bead.X}`);
            console.log(`bead.P=${bead.P}`);

            engine.advance(0.001);

            console.log(`bead.X=${bead.X}`);
            console.log(`bead.P=${bead.P}`);

            expect(true).toBe(true);
        });
    });
});
