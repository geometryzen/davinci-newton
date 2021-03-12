import { Unit } from "../math/Unit";
import { DiffEqSolverSystem } from "../core/DiffEqSolverSystem";
import { EulerMethod } from "./EulerMethod";

class MockSystem implements DiffEqSolverSystem {
    constructor(private readonly state: number[], private readonly rateOfChange: number[], public readonly stateEnd: number[]) {

    }
    /**
     * This is the first method of the Simulation that is called by the solver.
     */
    getState(): number[] {
        return this.state;
    }
    /**
     * This is the second method of the simulation that is called by the solver.
     * @param state 
     * @param rateOfChange 
     * @param Δt 
     * @param uomTime 
     */
    evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void {
        const N = this.rateOfChange.length;
        expect(state.length).toBe(N, "state.length should be N.");
        expect(rateOfChange.length).toBe(N, "rateOfChange.length should be N.");
        expect(typeof Δt === 'number').toBe(true, "Δt should be a number");
        for (let i = 0; i < N; i++) {
            rateOfChange[i] = this.rateOfChange[i];
        }
    }
    /**
     * This is the third method of the simulation that is called by the solver.
     * @param state 
     */
    setState(state: number[]): void {
        const N = state.length;
        for (let i = 0; i < N; i++) {
            this.stateEnd.push(state[i]);
        }
    }
}

describe("EulerMethod", function () {
    it("constructor", function () {
        const x = Math.random();
        const ΔxOverΔt = Math.random();
        const state = [x];
        const rateOfChange = [ΔxOverΔt];
        const stateEnd: number[] = [];
        const system = new MockSystem(state, rateOfChange, stateEnd);
        const method = new EulerMethod(system);
        expect(method).toBeDefined();
    });
    it("step", function () {
        const x = Math.random();
        const ΔxOverΔt = Math.random();
        const Δt = Math.random();
        const state = [x];
        const rateOfChange = [ΔxOverΔt];
        const stateEnd: number[] = [];
        const system = new MockSystem(state, rateOfChange, stateEnd);
        const method = new EulerMethod(system);
        method.step(Δt);
        expect(system.stateEnd.length).toBe(1);
        expect(system.stateEnd[0]).toBe(x + ΔxOverΔt * Δt);
    });
});
