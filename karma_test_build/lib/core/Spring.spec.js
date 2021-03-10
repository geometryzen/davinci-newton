"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Spring_1 = require("./Spring");
var Particle_1 = require("./Particle");
var Euclidean2_1 = require("../engine2D/Euclidean2");
var Geometric2_1 = require("../math/Geometric2");
describe("Spring", function () {
    describe("Potential Energy", function () {
        it("should be zero at the rest length separation.", function () {
            var metric = new Euclidean2_1.Euclidean2();
            var Alice = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Alice.X = Geometric2_1.Geometric2.vector(-0.5, 0);
            var Bob = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Bob.X = Geometric2_1.Geometric2.vector(0.5, 0);
            var spring = new Spring_1.Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0);
        });
        it("should be increase when stretched.", function () {
            var metric = new Euclidean2_1.Euclidean2();
            var Alice = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Alice.X = Geometric2_1.Geometric2.vector(-1, 0);
            var Bob = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Bob.X = Geometric2_1.Geometric2.vector(1, 0);
            var spring = new Spring_1.Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.5);
        });
        it("should be increase when compressed.", function () {
            var metric = new Euclidean2_1.Euclidean2();
            var Alice = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Alice.X = Geometric2_1.Geometric2.vector(-0.25, 0);
            var Bob = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Bob.X = Geometric2_1.Geometric2.vector(0.25, 0);
            var spring = new Spring_1.Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.125);
        });
    });
    describe("Force", function () {
        it("should be zero at the rest length separation.", function () {
            var metric = new Euclidean2_1.Euclidean2();
            var Alice = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Alice.X = Geometric2_1.Geometric2.vector(-0.5, 0);
            var Bob = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
            Bob.X = Geometric2_1.Geometric2.vector(0.5, 0);
            var spring = new Spring_1.Spring(Alice, Bob);
            var forces = spring.updateForces();
            expect(forces.length).toBe(2);
            expect(forces[0].F.x).toBe(0);
            expect(forces[0].F.y).toBe(0);
            expect(forces[1].F.x).toBe(0);
            expect(forces[1].F.y).toBe(0);
            expect(spring.potentialEnergy().a).toBe(0);
        });
    });
    it("should be inward when extended.", function () {
        var metric = new Euclidean2_1.Euclidean2();
        var Alice = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
        Alice.X = Geometric2_1.Geometric2.vector(-1, 0);
        var Bob = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
        Bob.X = Geometric2_1.Geometric2.vector(1, 0);
        var spring = new Spring_1.Spring(Alice, Bob);
        var forces = spring.updateForces();
        expect(forces.length).toBe(2);
        expect(forces[0].F.x).toBe(1);
        expect(forces[0].F.y).toBe(0);
        expect(forces[1].F.x).toBe(-1);
        expect(forces[1].F.y).toBe(0);
        expect(spring.potentialEnergy().a).toBe(0.5);
    });
    it("should be outward when compressed.", function () {
        var metric = new Euclidean2_1.Euclidean2();
        var Alice = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
        Alice.X = Geometric2_1.Geometric2.vector(-0.25, 0);
        var Bob = new Particle_1.Particle(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(0), metric);
        Bob.X = Geometric2_1.Geometric2.vector(0.25, 0);
        var spring = new Spring_1.Spring(Alice, Bob);
        var forces = spring.updateForces();
        expect(forces.length).toBe(2);
        expect(forces[0].F.x).toBe(-0.5);
        expect(forces[0].F.y).toBe(0);
        expect(forces[1].F.x).toBe(0.5);
        expect(forces[1].F.y).toBe(0);
        expect(spring.potentialEnergy().a).toBe(0.125);
    });
});
