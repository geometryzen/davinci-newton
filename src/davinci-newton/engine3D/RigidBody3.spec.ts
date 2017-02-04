// Copyright 2017 David Holmes.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Block3 from './Block3';
import Geometric3 from '../math/Geometric3';
import RigidBody3 from './RigidBody3';
import Unit from '../math/Unit';
import Vec3 from '../math/Vec3';
import Vector3 from '../math/Vector3';

/**
 * The unit of linear momentum. It's what Newton meant by motion.
 */
const MOTION = Unit.KILOGRAM.mul(Unit.METER).div(Unit.SECOND);

describe("RigidBody3", function () {
    describe("constructor", function () {
        it("should initialize X to zero", function () {
            const body = new RigidBody3();
            expect(body.X.x).toBe(0);
            expect(body.X.y).toBe(0);
            expect(body.X.z).toBe(0);
            expect(body.X.isZero()).toBeTruthy();
        });
        it("should initialize R to one", function () {
            const body = new RigidBody3();
            expect(body.R.a).toBe(1);
            expect(body.R.xy).toBe(0);
            expect(body.R.yz).toBe(0);
            expect(body.R.zx).toBe(0);
            expect(body.R.isOne()).toBeTruthy();
        });
        it("should initialize P to zero", function () {
            const body = new RigidBody3();
            expect(body.P.x).toBe(0);
            expect(body.P.y).toBe(0);
            expect(body.P.z).toBe(0);
            expect(body.P.isZero()).toBeTruthy();
        });
        it("should initialize L to zero", function () {
            const body = new RigidBody3();
            expect(body.L.xy).toBe(0);
            expect(body.L.yz).toBe(0);
            expect(body.L.zx).toBe(0);
            expect(body.L.isZero()).toBeTruthy();
        });
        it("should initialize M to one", function () {
            const body = new RigidBody3();
            expect(body.M.a).toBe(1);
        });
        it("should initialize Ω to zero", function () {
            const body = new RigidBody3();
            expect(body.Ω.xy).toBe(0);
            expect(body.Ω.yz).toBe(0);
            expect(body.Ω.zx).toBe(0);
            expect(body.Ω.isZero()).toBeTruthy();
        });
        it("should initialize I to one", function () {
            const body = new RigidBody3();
            expect(body.I.getElement(0, 0)).toBe(1);
            expect(body.I.getElement(0, 1)).toBe(0);
            expect(body.I.getElement(0, 2)).toBe(0);
            expect(body.I.getElement(1, 0)).toBe(0);
            expect(body.I.getElement(1, 1)).toBe(1);
            expect(body.I.getElement(1, 2)).toBe(0);
            expect(body.I.getElement(2, 0)).toBe(0);
            expect(body.I.getElement(2, 1)).toBe(0);
            expect(body.I.getElement(2, 2)).toBe(1);
        });
    });
    describe("localToWorld", function () {
        it("should depend correctly on X, R, centerOfMassLocal, localPoint", function () {
            // x = rotate((localPoint - centerOfMassLocal), R) + X
            const body = new RigidBody3();
            body.X.copyVector({ x: Math.random(), y: Math.random(), z: Math.random(), uom: Unit.METER });
            // We'll use a rotation of 90 degrees counter clockwise (from above) in the xy plane.
            body.R.a = 1 / Math.SQRT1_2;
            body.R.xy = -1 / Math.SQRT1_2;
            body.centerOfMassLocal = { x: Math.random(), y: Math.random(), z: Math.random(), uom: Unit.METER };
            const localPoint = new Vec3(0, 0, 0, Unit.METER);
            const xActual = new Vector3(0, 0, 0, Unit.METER);
            const xExpect = new Vector3(0, 0, 0, Unit.METER);
            xExpect.copy(localPoint).sub(body.centerOfMassLocal).rotate(body.R).add(body.X);
            body.localPointToWorldPoint(localPoint, xActual);

            expect(xActual.x).toBe(xExpect.x);
            expect(xActual.y).toBe(xExpect.y);
            expect(xActual.z).toBe(xExpect.z);
        });
    });
    describe("rotationalEnergy", function () {
        describe("calculated using (1/2) Ω * ~L(Ω)", function () {
            const body = new Block3(Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()));
            body.M = Geometric3.scalar(12);
            const ω = new Vec3(Math.random(), Math.random(), Math.random(), Unit.inv(Unit.SECOND));
            body.L.yz = Math.random();
            body.L.zx = Math.random();
            body.L.xy = Math.random();
            body.L.uom = Unit.METER.mul(MOTION);

            body.Ω.yz = ω.x;
            body.Ω.zx = ω.y;
            body.Ω.xy = ω.z;
            body.Ω.uom = ω.uom;

            const J = new Vec3(body.L.yz, body.L.zx, body.L.xy, body.L.uom);
            const expectRotationalEnergy = 0.5 * ω.dot(J);
            const actualRotationalEnergy = body.rotationalEnergy();
            const uom = actualRotationalEnergy.uom;
            it("should get the quantity", function () {
                expect(actualRotationalEnergy.a).toBeCloseTo(expectRotationalEnergy, 10);
            });
            it("should have M dimension 1", function () {
                expect(uom.dimensions.M.numer).toBe(1);
                expect(uom.dimensions.M.denom).toBe(1);
            });
            it("should have L dimension 2", function () {
                expect(uom.dimensions.L.numer).toBe(2);
                expect(uom.dimensions.L.denom).toBe(1);
            });
            it("should have T dimension -2", function () {
                expect(uom.dimensions.T.numer).toBe(-2);
                expect(uom.dimensions.T.denom).toBe(1);
            });
            it("should have Q dimension 0", function () {
                expect(uom.dimensions.Q.numer).toBe(0);
                expect(uom.dimensions.Q.denom).toBe(1);
            });
        });
    });
    describe("translationalEnergy", function () {
        describe("calculated using (1/2) P * P / M", function () {
            const body = new Block3(Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()));

            body.M = Geometric3.scalar(12, Unit.KILOGRAM);

            body.P.x = Math.random();
            body.P.y = Math.random();
            body.P.z = Math.random();
            body.P.uom = Unit.KILOGRAM.mul(Unit.METER).div(Unit.SECOND);

            const expectTranslationalEnergy = 0.5 * (body.P.x * body.P.x + body.P.y * body.P.y + body.P.z * body.P.z) / body.M.a;
            const actualTranslationalEnergy = body.translationalEnergy();
            const uom = actualTranslationalEnergy.uom;
            it("should get the quantity", function () {
                expect(actualTranslationalEnergy.a).toBe(expectTranslationalEnergy);
            });
            it("M dimension", function () {
                expect(uom.dimensions.M.numer).toBe(1);
                expect(uom.dimensions.M.denom).toBe(1);
            });
            it("L", function () {
                expect(uom.dimensions.L.numer).toBe(2);
                expect(uom.dimensions.L.denom).toBe(1);
            });
            it("T", function () {
                expect(uom.dimensions.T.numer).toBe(-2);
                expect(uom.dimensions.T.denom).toBe(1);
            });
            it("Q", function () {
                expect(uom.dimensions.Q.numer).toBe(0);
                expect(uom.dimensions.Q.denom).toBe(1);
            });
        });
    });
});
