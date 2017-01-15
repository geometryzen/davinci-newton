import DiffEqSolver from '../core/DiffEqSolver';
import Simulation from '../core/Simulation';
import zeroArray from '../util/zeroArray';

export class RungeKutta implements DiffEqSolver {
    private inp_: number[] = [];
    private k1_: number[] = [];
    private k2_: number[] = [];
    private k3_: number[] = [];
    private k4_: number[] = [];
    constructor(private ode_: Simulation) {

    }
    step(stepSize: number): void {
        var error, i;
        const va = this.ode_.getVarsList();
        const vars = va.getValues();
        const N = vars.length;
        if (this.inp_.length < N) {
            this.inp_ = new Array(N);
            this.k1_ = new Array(N);
            this.k2_ = new Array(N);
            this.k3_ = new Array(N);
            this.k4_ = new Array(N);
        }
        const inp = this.inp_;
        const k1 = this.k1_;
        const k2 = this.k2_;
        const k3 = this.k3_;
        const k4 = this.k4_;
        // evaluate at time t
        for (i = 0; i < N; i++) {
            inp[i] = vars[i];
        }
        zeroArray(k1);
        error = this.ode_.evaluate(inp, k1, 0);
        if (error !== null) {
            return error;
        }
        // evaluate at time t+stepSize/2
        for (i = 0; i < N; i++) {
            inp[i] = vars[i] + k1[i] * stepSize / 2;
        }
        zeroArray(k2);
        error = this.ode_.evaluate(inp, k2, stepSize / 2);
        if (error !== null) {
            return error;
        }
        // evaluate at time t+stepSize/2
        for (i = 0; i < N; i++) {
            inp[i] = vars[i] + k2[i] * stepSize / 2;
        }
        zeroArray(k3);
        error = this.ode_.evaluate(inp, k3, stepSize / 2);
        if (error !== null) {
            return error;
        }
        // evaluate at time t+stepSize
        for (i = 0; i < N; i++) {
            inp[i] = vars[i] + k3[i] * stepSize;
        }
        zeroArray(k4);
        error = this.ode_.evaluate(inp, k4, stepSize);
        if (error !== null) {
            return error;
        }
        for (i = 0; i < N; i++) {
            vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
        }
        va.setValues(vars, true);
        return null;
    }
}

export default RungeKutta;
