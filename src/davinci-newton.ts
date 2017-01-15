import config from './davinci-newton/config';
import PointMass from './davinci-newton/objects/PointMass';
import RigidBodySim from './davinci-newton/engine/RigidBodySim';
import RungeKutta from './davinci-newton/model/RungeKutta';
import SimpleAdvance from './davinci-newton/strategy/SimpleAdvance';
import SimRunner from './davinci-newton/runner/SimRunner';
import Spring from './davinci-newton/objects/Spring';

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
    get PointMass() { return PointMass; },
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
    get Spring() { return Spring; },
}

export default newton;
