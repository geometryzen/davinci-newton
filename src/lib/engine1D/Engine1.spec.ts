import { VarsList } from "../core/VarsList";
import { Geometric1 } from "../math/Geometric1";
import { Block1 } from "./Block1";
import { ConstantForceLaw1 } from "./ConstantForceLaw1";
import { Engine1 } from "./Engine1";
import { GravitationForceLaw1 } from "./GravitationForceLaw1";
import { Particle1 } from "./Particle1";
import { Spring1 } from "./Spring1";
import { SurfaceConstraint1 } from "./SurfaceConstraint1";

describe("Engine1", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const engine = new Engine1();
            expect(engine).toBeDefined();
        });
    });
    describe("varsList property", function () {
        it("should be defined.", function () {
            const engine = new Engine1();
            const varsList = engine.varsList;
            expect(varsList).toBeDefined();
            expect(varsList instanceof VarsList).toBe(true);
        });
    });
    describe("updateFromBodies() method", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            engine.updateFromBodies();
            expect(true).toBe(true);
        });
    });
    describe("advance() method with an empty system", function () {
        it("should work.", function () {
            const engine = new Engine1();
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("addBody() method", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            expect(true).toBe(true);
        });
    });
    describe("advance() method with a single particle", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("addForceLaw() method with a single particle", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const F = new Geometric1();
            const forceLaw = new ConstantForceLaw1(bead, F);
            engine.addForceLaw(forceLaw);
            expect(true).toBe(true);
        });
    });
    describe("addForceLaw() method with a single particle and simulation", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const F = new Geometric1();
            const forceLaw = new ConstantForceLaw1(bead, F);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("addConstraintLaw() method with a single particle and simulation", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const F = new Geometric1();
            const forceLaw = new ConstantForceLaw1(bead, F);
            engine.addForceLaw(forceLaw);
            const radiusFn = function (x: Geometric1, radius: Geometric1) {
                // Do nothing yet.
            };
            const rotationFn = function (x: Geometric1, plane: Geometric1) {
                // Do nothing yet.
            };
            const tangentFn = function (x: Geometric1, tangent: Geometric1) {
                // Do nothing yet.
            };
            const constraintLaw = new SurfaceConstraint1(bead, radiusFn, rotationFn, tangentFn);
            engine.addConstraint(constraintLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("Spring", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            const wall = new Particle1(M, Q);
            engine.addBody(bead);
            engine.addBody(wall);
            const forceLaw = new Spring1(bead, wall);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("GravitationLaw", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const G = new Geometric1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            const wall = new Particle1(M, Q);
            engine.addBody(bead);
            engine.addBody(wall);
            const forceLaw = new GravitationForceLaw1(bead, wall, G);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("Spring with a Block", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const width = new Geometric1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const block = new Block1(width);
            const wall = new Particle1(M, Q);
            engine.addBody(block);
            engine.addBody(wall);
            const forceLaw = new Spring1(block, wall);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("totalEnergy() with a Spring", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const width = new Geometric1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const block = new Block1(width);
            const wall = new Particle1(M, Q);
            engine.addBody(block);
            engine.addBody(wall);
            const forceLaw = new Spring1(block, wall);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            const E = engine.totalEnergy();
            expect(E).toBeDefined();
            expect(E instanceof Geometric1).toBe(true);
        });
    });
});
