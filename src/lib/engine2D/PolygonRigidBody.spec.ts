import { PolygonRigidBody2 } from "./PolygonRigidBody2";

describe("PolygonRigidBody2", function () {
    it("constructor", function () {
        const body = new PolygonRigidBody2([]);
        expect(body).toBeDefined();
    });
    it("Inertia Tensor, I, should be initialized to [1]", function () {
        const body = new PolygonRigidBody2([]);
        expect(body.I).toBeDefined();
        expect(body.I.dimensions).toBe(1);
        expect(body.I.getElement(0, 0)).toBe(1);
    });
    it("Angular Momentum, L, should be initialized to 0", function () {
        const body = new PolygonRigidBody2([]);
        expect(body.L).toBeDefined();
        expect(body.L.isZero()).toBe(true);
        expect(body.L.uom).toBeUndefined();
    });
    it("Mass, M, should be initialized to 1", function () {
        const body = new PolygonRigidBody2([]);
        expect(body.M).toBeDefined();
        expect(body.M.isOne()).toBe(true);
        expect(body.L.uom).toBeUndefined();
    });
    it("Linear Momentum, P, should be initialized to 0", function () {
        const body = new PolygonRigidBody2([]);
        expect(body.P).toBeDefined();
        expect(body.P.isZero()).toBe(true);
        expect(body.P.uom).toBeUndefined();
    });
    it("Electric Charge, Q should be initialized to 0", function () {
        const body = new PolygonRigidBody2([]);
        expect(body.Q).toBeDefined();
        expect(body.Q.isZero()).toBe(true);
        expect(body.Q.uom).toBeUndefined();
    });
    it("Attitude, R should be initialized to 1", function () {
        const body = new PolygonRigidBody2([]);
        expect(body.R).toBeDefined();
        expect(body.R.isOne()).toBe(true);
        expect(body.R.uom).toBeUndefined();
    });
    it("updateInertiaTensor", function () {
        const body = new PolygonRigidBody2([]);
        body.updateInertiaTensor();
        expect(body).toBeDefined();
    });
});
