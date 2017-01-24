import CircularList from './davinci-newton/util/CircularList';
import config from './davinci-newton/config';
import DisplayGraph from './davinci-newton/graph/DisplayGraph';
import DrawingMode from './davinci-newton/view/DrawingMode';
import EulerMethod from './davinci-newton/solvers/EulerMethod';
import Force from './davinci-newton/model/Force';
import Graph from './davinci-newton/graph/Graph';
import GraphLine from './davinci-newton/graph/GraphLine';
import GravitationLaw from './davinci-newton/objects/GravitationLaw';
import HorizAlign from './davinci-newton/view/HorizAlign';
import LabCanvas from './davinci-newton/view/LabCanvas';
import ModifiedEuler from './davinci-newton/solvers/ModifiedEuler';
import RigidBody from './davinci-newton/engine3D/RigidBody';
import RigidBodySim from './davinci-newton/engine3D/RigidBodySim';
import RungeKutta from './davinci-newton/solvers/RungeKutta';
import SimpleAdvance from './davinci-newton/strategy/SimpleAdvance';
import SimRunner from './davinci-newton/runner/SimRunner';
import SimView from './davinci-newton/view/SimView';
import Spring from './davinci-newton/objects/Spring';
import Vector from './davinci-newton/math/Vector';
import VerticalAlign from './davinci-newton/view/VerticalAlign';

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
    get CircularList() { return CircularList; },
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
    get Force() { return Force; },
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
    get HorizAlign() { return HorizAlign; },
    /**
     * 
     */
    get LabCanvas() { return LabCanvas; },
    /**
     * 
     */
    get ModifiedEuler() { return ModifiedEuler; },
    /**
     * 
     */
    get RigidBody() { return RigidBody; },
    /**
     * 
     */
    get RigidBodySim() { return RigidBodySim; },
    /**
     * 
     */
    get RungeKutta() { return RungeKutta; },
    /**
     * 
     */
    get SimpleAdvance() { return SimpleAdvance; },
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
    get Spring() { return Spring; },
    /**
     * 
     */
    get Vector() { return Vector; },
    /**
     * 
     */
    get VerticalAlign() { return VerticalAlign; },
}

export default newton;
