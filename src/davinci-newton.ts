import CircularList from './davinci-newton/util/CircularList';
import config from './davinci-newton/config';
import DisplayGraph from './davinci-newton/graph/DisplayGraph';
import ForceApp from './davinci-newton/model/ForceApp';
import Graph from './davinci-newton/graph/Graph';
import LabCanvas from './davinci-newton/view/LabCanvas';
import RigidBody from './davinci-newton/engine/RigidBody';
import RigidBodySim from './davinci-newton/engine/RigidBodySim';
import RungeKutta from './davinci-newton/model/RungeKutta';
import SimpleAdvance from './davinci-newton/strategy/SimpleAdvance';
import SimRunner from './davinci-newton/runner/SimRunner';
import SimView from './davinci-newton/view/SimView';
import Spring from './davinci-newton/objects/Spring';
import Vector from './davinci-newton/math/Vector';

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
    get ForceApp() { return ForceApp; },
    /**
     * 
     */
    get Graph() { return Graph; },
    /**
     * 
     */
    get LabCanvas() { return LabCanvas; },
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
}

export default newton;
