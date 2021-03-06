import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
import { Metric } from './Metric';
import { RigidBody } from './RigidBody';
/**
 * @hidden
 */
export declare class Spring<T> extends AbstractSimObject implements ForceLaw<T> {
    private readonly body1;
    private readonly body2;
    /**
     *
     */
    private $restLength;
    private $restLengthLock;
    /**
     * Spring Constant.
     */
    private readonly $springConstant;
    /**
     * The attachment point to body1 in the local coordinates frame of body 1.
     */
    private attach1_;
    private attach1Lock;
    /**
     * The attachment point to body2 in the local coordinates frame of body 2.
     */
    private attach2_;
    private attach2Lock;
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
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end1_;
    private end1Lock_;
    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end2_;
    private end2Lock_;
    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_;
    private potentialEnergyLock_;
    readonly metric: Metric<T>;
    /**
     *
     */
    constructor(body1: RigidBody<T>, body2: RigidBody<T>);
    get forces(): Force<T>[];
    get restLength(): T;
    set restLength(restLength: T);
    get k(): T;
    set k(k: T);
    get springConstant(): T;
    set springConstant(springConstant: T);
    get stiffness(): T;
    set stiffness(stiffness: T);
    private computeBody1AttachPointInWorldCoords;
    private computeBody2AttachPointInWorldCoords;
    get attach1(): T;
    set attach1(attach1: T);
    get attach2(): T;
    set attach2(attach2: T);
    get end1(): T;
    get end2(): T;
    /**
     *
     */
    updateForces(): Force<T>[];
    /**
     *
     */
    disconnect(): void;
    /**
     *
     */
    potentialEnergy(): T;
}
