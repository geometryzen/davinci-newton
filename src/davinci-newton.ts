import AdaptiveStepSolver from './davinci-newton/solvers/AdaptiveStepSolver';
import AlignH from './davinci-newton/view/AlignH';
import AlignV from './davinci-newton/view/AlignV';
import AxisChoice from './davinci-newton/graph/AxisChoice';
import Bivector3 from './davinci-newton/math/Bivector3';
// import Block2 from './davinci-newton/engine2D/Block2';
import Block3 from './davinci-newton/engine3D/Block3';
import CircularList from './davinci-newton/util/CircularList';
import config from './davinci-newton/config';
import ConstantEnergySolver from './davinci-newton/solvers/ConstantEnergySolver';
import ConstantForceLaw3 from './davinci-newton/engine3D/ConstantForceLaw3';
import CoordType from './davinci-newton/model/CoordType';
import Cylinder3 from './davinci-newton/engine3D/Cylinder3';
import DefaultAdvanceStrategy from './davinci-newton/strategy/DefaultAdvanceStrategy';
import DisplayGraph from './davinci-newton/graph/DisplayGraph';
import DrawingMode from './davinci-newton/view/DrawingMode';
import EulerMethod from './davinci-newton/solvers/EulerMethod';
// import Force2 from './davinci-newton/engine2D/Force2';
import Force3 from './davinci-newton/engine3D/Force3';
import Graph from './davinci-newton/graph/Graph';
import GraphLine from './davinci-newton/graph/GraphLine';
// import GravitationLaw2 from './davinci-newton/engine2D/GravitationLaw2';
import GravitationLaw3 from './davinci-newton/engine3D/GravitationLaw3';
import LabCanvas from './davinci-newton/view/LabCanvas';
// import Matrix2 from './davinci-newton/math/Matrix2';
import Matrix3 from './davinci-newton/math/Matrix3';
import ModifiedEuler from './davinci-newton/solvers/ModifiedEuler';
// import RigidBody2 from './davinci-newton/engine2D/RigidBody2';
import RigidBody3 from './davinci-newton/engine3D/RigidBody3';
// import Physics2 from './davinci-newton/engine2D/Physics2';
import Physics3 from './davinci-newton/engine3D/Physics3';
import RungeKutta from './davinci-newton/solvers/RungeKutta';
import SimRunner from './davinci-newton/runner/SimRunner';
import SimView from './davinci-newton/view/SimView';
// import Sphere2 from './davinci-newton/engine2D/Sphere2';
import Sphere3 from './davinci-newton/engine3D/Sphere3';
// import Spring2 from './davinci-newton/engine2D/Spring2';
import Spring3 from './davinci-newton/engine3D/Spring3';
import VarsList from './davinci-newton/core/VarsList';
// import Vec2 from './davinci-newton/math/Vec2';
import Vec3 from './davinci-newton/math/Vec3';
//import Vector2 from './davinci-newton/math/Vector2';
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
    get Bivector3() { return Bivector3; },
    /**
     * 
     */
    // get Block2() { return Block2; },
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
    // get Force2() { return Force2; },
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
    // get GravitationLaw2() { return GravitationLaw2; },
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
    // get Matrix2() { return Matrix2; },
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
    // get Physics2() { return Physics2; },
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
    // get Sphere2() { return Sphere2; },
    /**
     * 
     */
    get Sphere3() { return Sphere3; },
    /**
     * 
     */
    // get Spring2() { return Spring2; },
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
    // get Vec2() { return Vec2; },
    /**
     * 
     */
    get Vec3() { return Vec3; },
    /**
     * 
     */
    // get Vector2() { return Vector2; },
    /**
     * 
     */
    get Vector3() { return Vector3; }
}

export default newton;
