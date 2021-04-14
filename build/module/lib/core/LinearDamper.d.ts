import { AbstractSimObject } from "../objects/AbstractSimObject";
import { Force } from "./Force";
import { ForceBody } from "./ForceBody";
import { ForceLaw } from "./ForceLaw";
/**
 *
 */
export declare class LinearDamper<T> extends AbstractSimObject implements ForceLaw<T> {
    private readonly body1;
    private readonly body2;
    /**
     * Friction Coefficient.
     */
    private $frictionCoefficient;
    /**
     * The force information on body1 due to body2.
     */
    private readonly F1;
    /**
     * The force information on body2 due to body1.
     */
    private readonly F2;
    /**
     *
     */
    private readonly $forces;
    /**
     *
     * @param body1
     * @param body2
     */
    constructor(body1: ForceBody<T>, body2: ForceBody<T>);
    get forces(): Force<T>[];
    get b(): T;
    set b(b: T);
    get frictionCoefficient(): T;
    set frictionCoefficient(frictionCoefficient: T);
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}
