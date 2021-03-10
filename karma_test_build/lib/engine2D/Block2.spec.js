"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric2_1 = require("../math/Geometric2");
var Block2_1 = require("./Block2");
describe("Block2", function () {
    it("TODO", function () {
        var block = new Block2_1.Block2(Geometric2_1.Geometric2.scalar(1), Geometric2_1.Geometric2.scalar(1));
        expect(block.M.a).toBe(1);
        expect(block.width.a).toBe(1);
        expect(block.height.a).toBe(1);
        expect(block.centerOfMassLocal.x).toBe(0);
        expect(block.centerOfMassLocal.y).toBe(0);
        block.L = Geometric2_1.Geometric2.bivector(1);
        block.updateAngularVelocity();
        expect(block.Ω.b).toBe(6);
        block.width = Geometric2_1.Geometric2.scalar(2);
        block.updateAngularVelocity();
        expect(block.Ω.b).toBe(2.4);
    });
});
