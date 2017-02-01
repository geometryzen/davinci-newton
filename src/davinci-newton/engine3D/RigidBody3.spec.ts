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
import RigidBody3 from './RigidBody3';
import Vec3 from '../math/Vec3';
import Vector3 from '../math/Vector3';

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
            expect(body.M).toBe(1);
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
            body.X.copy({ x: Math.random(), y: Math.random(), z: Math.random() });
            // We'll use a rotation of 90 degrees counter clockwise (from above) in the xy plane.
            body.R.a = 1 / Math.SQRT1_2;
            body.R.xy = -1 / Math.SQRT1_2;
            body.centerOfMassLocal = { x: Math.random(), y: Math.random(), z: Math.random() };
            const localPoint = new Vec3(0, 0, 0);
            const xActual = new Vector3();
            const xExpect = new Vector3();
            xExpect.copy(localPoint).sub(body.centerOfMassLocal).rotate(body.R).add(body.X);
            body.localPointToWorldPoint(localPoint, xActual);

            expect(xActual.x).toBe(xExpect.x);
            expect(xActual.y).toBe(xExpect.y);
            expect(xActual.z).toBe(xExpect.z);
        });
    });
    describe("rotationalEnergy", function () {
        it("calculated using (1/2) Ω * L(Ω) should be same as (1/2) ω * L(ω)", function () {
            const body = new Block3(1, 1, 1);
            body.M = 12;
            const ω = new Vec3(0, 0, 1);
            body.L.yz = 0;
            body.L.zx = 0;
            body.L.xy = 1;
            body.Ω.yz = ω.x;
            body.Ω.zx = ω.y;
            body.Ω.xy = ω.z;
            const J = new Vec3(body.L.yz, body.L.zx, body.L.xy);
            const rotationalEnergy = 0.5 * ω.dot(J);
            expect(body.rotationalEnergy()).toBe(rotationalEnergy);
        });
    });
});
