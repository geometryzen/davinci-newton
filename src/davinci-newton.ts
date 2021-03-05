import { config } from './davinci-newton/config';
import { ConstantForceLaw } from './davinci-newton/core/ConstantForceLaw';
import { CoulombLaw } from './davinci-newton/core/CoulombLaw';
import { Force } from './davinci-newton/core/Force';
import { GravitationLaw } from './davinci-newton/core/GravitationLaw';
import { Particle } from './davinci-newton/core/Particle';
import { RigidBody } from './davinci-newton/core/RigidBody';
import { Spring } from './davinci-newton/core/Spring';
import { State } from './davinci-newton/core/State';
import { VarsList } from './davinci-newton/core/VarsList';
import { Block2 } from './davinci-newton/engine2D/Block2';
import { Disc2 } from './davinci-newton/engine2D/Disc2';
import { Dynamics2 } from './davinci-newton/engine2D/Dynamics2';
import { Euclidean2 } from './davinci-newton/engine2D/Euclidean2';
import { Block3 } from './davinci-newton/engine3D/Block3';
import { Cylinder3 } from './davinci-newton/engine3D/Cylinder3';
import { Dynamics3 } from './davinci-newton/engine3D/Dynamics3';
import { Euclidean3 } from './davinci-newton/engine3D/Euclidean3';
import { Physics3 } from './davinci-newton/engine3D/Physics3';
import { Sphere3 } from './davinci-newton/engine3D/Sphere3';
import { Spring3 } from './davinci-newton/engine3D/Spring3';
import { AxisChoice } from './davinci-newton/graph/AxisChoice';
import { DisplayGraph } from './davinci-newton/graph/DisplayGraph';
import { EnergyTimeGraph } from './davinci-newton/graph/EnergyTimeGraph';
import { Graph } from './davinci-newton/graph/Graph';
import { GraphLine } from './davinci-newton/graph/GraphLine';
import { Dimensions } from './davinci-newton/math/Dimensions';
import { Geometric2 } from './davinci-newton/math/Geometric2';
import { Geometric3 } from './davinci-newton/math/Geometric3';
import { Matrix3 } from './davinci-newton/math/Matrix3';
import { QQ } from './davinci-newton/math/QQ';
import { Unit } from './davinci-newton/math/Unit';
import { Vec3 } from './davinci-newton/math/Vec3';
import { LOCAL, WORLD } from './davinci-newton/model/CoordType';
import { AdaptiveStepSolver } from './davinci-newton/solvers/AdaptiveStepSolver';
import { ConstantEnergySolver } from './davinci-newton/solvers/ConstantEnergySolver';
import { EulerMethod } from './davinci-newton/solvers/EulerMethod';
import { ModifiedEuler } from './davinci-newton/solvers/ModifiedEuler';
import { RungeKutta } from './davinci-newton/solvers/RungeKutta';
import { DefaultAdvanceStrategy } from './davinci-newton/strategy/DefaultAdvanceStrategy';
import { CircularList } from './davinci-newton/util/CircularList';
import { AlignH } from './davinci-newton/view/AlignH';
import { AlignV } from './davinci-newton/view/AlignV';
import { DrawingMode } from './davinci-newton/view/DrawingMode';
import { LabCanvas } from './davinci-newton/view/LabCanvas';
import { SimView } from './davinci-newton/view/SimView';

/**
 *
 */
const newton = {
    /**
     * The publish date of the latest version of the library.
     */
    get LAST_MODIFIED() { return config.LAST_MODIFIED; },
    /**
     * The semantic version of the library.
     */
    get VERSION() { return config.VERSION; },
    /**
     * 
     */
    get AdaptiveStepSolver() { return AdaptiveStepSolver; },
    /**
     * 
     */
    get AlignH() { return AlignH; },
    /**
     * 
     */
    get AlignV() { return AlignV; },
    /**
     * 
     */
    get AxisChoice() { return AxisChoice; },
    /**
     * 
     */
    get Block() { return Block2; },
    /**
     * 
     */
    get Block3() { return Block3; },
    /**
     * 
     */
    get CircularList() { return CircularList; },
    /**
     * 
     */
    get ConstantEnergySolver() { return ConstantEnergySolver; },
    /**
     * 
     */
    get ConstantForceLaw() { return ConstantForceLaw; },
    /**
     * 
     */
    get LOCAL() { return LOCAL; },
    /**
     * 
     */
    get WORLD() { return WORLD; },
    /**
     * 
     */
    get CoulombLaw() { return CoulombLaw; },
    /**
     * 
     */
    get Disc2() { return Disc2; },
    /**
     * 
     */
    get Cylinder3() { return Cylinder3; },
    /**
     * 
     */
    get DefaultAdvanceStrategy() { return DefaultAdvanceStrategy; },
    /**
     * 
     */
    get Dimensions() { return Dimensions; },
    /**
     * 
     */
    get DisplayGraph() { return DisplayGraph; },
    /**
     * 
     */
    get DrawingMode() { return DrawingMode; },
    /**
     * 
     */
    get Dynamic2() { return Dynamics2; },
    /**
     * 
     */
    get Dynamic3() { return Dynamics3; },
    /**
     * 
     */
    get EnergyTimeGraph() { return EnergyTimeGraph; },
    /**
     * 
     */
    get EulerMethod() { return EulerMethod; },
    /**
     * 
     */
    get Euclidean2() { return Euclidean2; },
    /**
     * 
     */
    get Euclidean3() { return Euclidean3; },
    /**
     * 
     */
    get Force() { return Force; },
    /**
     * 
     */
    get Geometric2() { return Geometric2; },
    /**
     * 
     */
    get Geometric3() { return Geometric3; },
    /**
     * 
     */
    get Graph() { return Graph; },
    /**
     * 
     */
    get GraphLine() { return GraphLine; },
    /**
     * 
     */
    get GravitationLaw() { return GravitationLaw; },
    /**
     * 
     */
    get LabCanvas() { return LabCanvas; },
    /**
     * 
     */
    get Matrix3() { return Matrix3; },
    /**
     * 
     */
    get ModifiedEuler() { return ModifiedEuler; },
    /**
     * 
     */
    get QQ() { return QQ; },
    /**
     * 
     */
    get Particle() { return Particle; },
    /**
     * 
     */
    get Physics3() { return Physics3; },
    /**
     * 
     */
    get State() { return State; },
    /**
     * 
     */
    get RigidBody() { return RigidBody; },
    /**
     * 
     */
    get RungeKutta() { return RungeKutta; },
    /**
     * 
     */
    get SimView() { return SimView; },
    /**
     * 
     */
    get Sphere3() { return Sphere3; },
    /**
     * 
     */
    get Spring() { return Spring; },
    /**
     * @deprecated Use Spring instead.
     * This will be removed in version 2.0.
     */
    get Spring3() { return Spring3; },
    /**
     * 
     */
    get Unit() { return Unit; },
    /**
     * 
     */
    get VarsList() { return VarsList; },
    /**
     * 
     */
    get Vec3() { return Vec3; }
};

export default newton;
