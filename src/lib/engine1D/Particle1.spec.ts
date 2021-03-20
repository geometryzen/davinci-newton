import { Geometric1 } from "../math/Geometric1";
import { Particle1 } from "./Particle1";

describe("Particle1", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const M = new Geometric1();
            const Q = new Geometric1();
            const particle = new Particle1(M, Q);
            expect(particle).toBeDefined();
        });
    });
});
