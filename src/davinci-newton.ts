import AdaptiveStepSolver from './davinci-newton/solvers/AdaptiveStepSolver';
import AlignH from './davinci-newton/view/AlignH';
import AlignV from './davinci-newton/view/AlignV';
import AxisChoice from './davinci-newton/graph/AxisChoice';
import Block3 from './davinci-newton/engine3D/Block3';
import CircularList from './davinci-newton/util/CircularList';
import config from './davinci-newton/config';
import ConstantForceLaw3 from './davinci-newton/engine3D/ConstantForceLaw3';
import CoordType from './davinci-newton/model/CoordType';
import Cylinder3 from './davinci-newton/engine3D/Cylinder3';
import DefaultAdvanceStrategy from './davinci-newton/strategy/DefaultAdvanceStrategy';
import DisplayGraph from './davinci-newton/graph/DisplayGraph';
import DrawingMode from './davinci-newton/view/DrawingMode';
import EulerMethod from './davinci-newton/solvers/EulerMethod';
import Force3 from './davinci-newton/engine3D/Force3';
import Graph from './davinci-newton/graph/Graph';
import GraphLine from './davinci-newton/graph/GraphLine';
import GravitationLaw3 from './davinci-newton/engine3D/GravitationLaw3';
import LabCanvas from './davinci-newton/view/LabCanvas';
import Matrix3 from './davinci-newton/math/Matrix3';
import ModifiedEuler from './davinci-newton/solvers/ModifiedEuler';
import RigidBody3 from './davinci-newton/engine3D/RigidBody3';
import Physics3 from './davinci-newton/engine3D/Physics3';
import RungeKutta from './davinci-newton/solvers/RungeKutta';
import SimRunner from './davinci-newton/runner/SimRunner';
import SimView from './davinci-newton/view/SimView';
import Sphere3 from './davinci-newton/engine3D/Sphere3';
import Spring3 from './davinci-newton/engine3D/Spring3';
import VarsList from './davinci-newton/core/VarsList';
import Vec3 from './davinci-newton/math/Vec3';
import Vector3 from './davinci-newton/math/Vector3';

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
    get Block3() { return Block3; },
    /**
     * 
     */
    get CircularList() { return CircularList; },
    /**
     * 
     */
    get ConstantForceLaw3() { return ConstantForceLaw3; },
    /**
     * 
     */
    get CoordType() { return CoordType; },
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
    get DisplayGraph() { return DisplayGraph; },
    /**
     * 
     */
    get DrawingMode() { return DrawingMode; },
    /**
     * 
     */
    get EulerMethod() { return EulerMethod; },
    /**
     * 
     */
    get Force3() { return Force3; },
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
    get SimRunner() { return SimRunner; },
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
    get VarsList() { return VarsList; },
    /**
     * 
     */
    get Vec3() { return Vec3; },
    /**
     * 
     */
    get Vector3() { return Vector3; }
}

export default newton;
