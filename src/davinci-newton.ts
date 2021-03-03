import { config } from './davinci-newton/config';
import { VarsList } from './davinci-newton/core/VarsList';
import { Block2 } from './davinci-newton/engine2D/Block2';
import { ConstantForceLaw2 } from './davinci-newton/engine2D/ConstantForceLaw2';
import { CoulombLaw2 } from './davinci-newton/engine2D/CoulombLaw2';
import { Cylinder2 } from './davinci-newton/engine2D/Cylinder2';
import { Force2 } from './davinci-newton/engine2D/Force2';
import { Particle2 } from './davinci-newton/engine2D/Particle2';
import { Physics2 } from './davinci-newton/engine2D/Physics2';
import { Block3 } from './davinci-newton/engine3D/Block3';
import { ConstantForceLaw3 } from './davinci-newton/engine3D/ConstantForceLaw3';
import { CoulombLaw3 } from './davinci-newton/engine3D/CoulombLaw3';
import { Cylinder3 } from './davinci-newton/engine3D/Cylinder3';
import { Force3 } from './davinci-newton/engine3D/Force3';
import { GravitationLaw3 } from './davinci-newton/engine3D/GravitationLaw3';
import { Particle3 } from './davinci-newton/engine3D/Particle3';
import { Physics3 } from './davinci-newton/engine3D/Physics3';
import { RigidBody3 } from './davinci-newton/engine3D/RigidBody3';
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
    get Block2() { return Block2; },
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
    get ConstantForceLaw2() { return ConstantForceLaw2; },
    /**
     * 
     */
    get ConstantForceLaw3() { return ConstantForceLaw3; },
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
    get CoulombLaw2() { return CoulombLaw2; },
    /**
     * 
     */
    get CoulombLaw3() { return CoulombLaw3; },
    /**
     * 
     */
    get Cylinder2() { return Cylinder2; },
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
    get EnergyTimeGraph() { return EnergyTimeGraph; },
    /**
     * 
     */
    get EulerMethod() { return EulerMethod; },
    /**
     * 
     */
    get Force2() { return Force2; },
    /**
     * 
     */
    get Force3() { return Force3; },
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
    get GravitationLaw3() { return GravitationLaw3; },
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
    get Particle2() { return Particle2; },
    /**
     * 
     */
    get Particle3() { return Particle3; },
    /**
     * 
     */
    get Physics2() { return Physics2; },
    /**
     * 
     */
    get Physics3() { return Physics3; },
    /**
     * 
     */
    get RigidBody3() { return RigidBody3; },
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
