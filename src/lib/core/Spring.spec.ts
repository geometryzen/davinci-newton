import { Spring } from './Spring';
import { Particle } from './Particle';
import { Euclidean2 } from '../engine2D/Euclidean2';
import { Geometric2 } from '../math/Geometric2';
describe("Spring", function () {
    describe("Potential Energy", function () {
        it("should be zero at the rest length separation.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.5, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.5, 0);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0);
        });
        it("should be increase when stretched.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-1, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(1, 0);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.5);
        });
        it("should be increase when compressed.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.25, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.25, 0);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.125);
        });
    });
    describe("Force", function () {
        it("should be zero at the rest length separation.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.5, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.5, 0);
            const spring = new Spring(Alice, Bob);
            const forces = spring.calculateForces();
            expect(forces.length).toBe(2);
            expect(forces[0].F.x).toBe(0);
            expect(forces[0].F.y).toBe(0);
            expect(forces[1].F.x).toBe(0);
            expect(forces[1].F.y).toBe(0);
            expect(spring.potentialEnergy().a).toBe(0);
        });
    });
    it("should be inward when extended.", function () {
        const metric = new Euclidean2();

        const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Alice.X = Geometric2.vector(-1, 0);
        const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Bob.X = Geometric2.vector(1, 0);
        const spring = new Spring(Alice, Bob);
        const forces = spring.calculateForces();
        expect(forces.length).toBe(2);
        expect(forces[0].F.x).toBe(1);
        expect(forces[0].F.y).toBe(0);
        expect(forces[1].F.x).toBe(-1);
        expect(forces[1].F.y).toBe(0);
        expect(spring.potentialEnergy().a).toBe(0.5);
    });
    it("should be outward when compressed.", function () {
        const metric = new Euclidean2();

        const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Alice.X = Geometric2.vector(-0.25, 0);
        const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Bob.X = Geometric2.vector(0.25, 0);
        const spring = new Spring(Alice, Bob);
        const forces = spring.calculateForces();
        expect(forces.length).toBe(2);
        expect(forces[0].F.x).toBe(-0.5);
        expect(forces[0].F.y).toBe(0);
        expect(forces[1].F.x).toBe(0.5);
        expect(forces[1].F.y).toBe(0);
        expect(spring.potentialEnergy().a).toBe(0.125);
    });
});
