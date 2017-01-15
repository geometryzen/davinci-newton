(function(global, define) {
  var globalDefine = global.define;
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../bower_components/almond/almond", function(){});

define('davinci-newton/config',["require", "exports"], function (require, exports) {
    "use strict";
    var Newton = (function () {
        function Newton() {
            this.GITHUB = 'https://github.com/geometryzen/davinci-newton';
            this.LAST_MODIFIED = '2017-01-08';
            this.NAMESPACE = 'NEWTON';
            this.VERSION = '6.0.0';
        }
        Newton.prototype.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message);
        };
        Newton.prototype.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message);
        };
        Newton.prototype.warn = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.warn(message);
        };
        Newton.prototype.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.error(message);
        };
        return Newton;
    }());
    var config = new Newton();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

define('davinci-newton/objects/AbstractSimObject',["require", "exports"], function (require, exports) {
    "use strict";
    var AbstractSimObject = (function () {
        function AbstractSimObject(name, localName) {
        }
        AbstractSimObject.prototype.isMassObject = function () {
            return false;
        };
        return AbstractSimObject;
    }());
    exports.AbstractSimObject = AbstractSimObject;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractSimObject;
});

define('davinci-newton/math/Vector',["require", "exports"], function (require, exports) {
    "use strict";
    var Vector = (function () {
        function Vector(x_, y_, z_) {
            if (z_ === void 0) { z_ = 0; }
            this.x_ = x_;
            this.y_ = y_;
            this.z_ = z_;
        }
        Vector.prototype.getX = function () {
            return this.x_;
        };
        Vector.prototype.getY = function () {
            return this.y_;
        };
        Vector.prototype.add = function (rhs) {
            return void 0;
        };
        Vector.prototype.subtract = function (rhs) {
            return void 0;
        };
        Vector.prototype.multiply = function (alpha) {
            return void 0;
        };
        Vector.prototype.distanceTo = function (rhs) {
            return 0;
        };
        Vector.prototype.immutable = function () {
            return this;
        };
        Vector.prototype.length = function () {
            return 0;
        };
        Vector.prototype.normalize = function () {
            return void 0;
        };
        Vector.prototype.rotate = function (cosAngle, sinAngle) {
            return void 0;
        };
        return Vector;
    }());
    Vector.ORIGIN = new Vector(0, 0);
    exports.Vector = Vector;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/objects/AbstractMassObject',["require", "exports", "./AbstractSimObject", "../math/Vector"], function (require, exports, AbstractSimObject_1, Vector_1) {
    "use strict";
    var AbstractMassObject = (function (_super) {
        __extends(AbstractMassObject, _super);
        function AbstractMassObject(name, localName) {
            var _this = _super.call(this) || this;
            _this.loc_world_ = Vector_1.default.ORIGIN;
            _this.sinAngle_ = 0;
            _this.cosAngle_ = 1;
            _this.velocity_ = Vector_1.default.ORIGIN;
            _this.angular_velocity_ = 0;
            _this.cm_body_ = Vector_1.default.ORIGIN;
            return _this;
        }
        AbstractMassObject.prototype.bodyToWorld = function (p_body) {
            var rx = p_body.getX() - this.cm_body_.getX();
            var ry = p_body.getY() - this.cm_body_.getY();
            var vx = this.loc_world_.getX() + (rx * this.cosAngle_ - ry * this.sinAngle_);
            var vy = this.loc_world_.getY() + (rx * this.sinAngle_ + ry * this.cosAngle_);
            return new Vector_1.default(vx, vy);
        };
        AbstractMassObject.prototype.getVelocity = function (p_body) {
            if (p_body) {
                var r = this.rotateBodyToWorld(p_body.immutable().subtract(this.cm_body_));
                return new Vector_1.default(this.velocity_.getX() - r.getY() * this.angular_velocity_, this.velocity_.getY() + r.getX() * this.angular_velocity_);
            }
            else {
                return this.velocity_;
            }
        };
        AbstractMassObject.prototype.rotateBodyToWorld = function (v_body) {
            return v_body.immutable().rotate(this.cosAngle_, this.sinAngle_);
        };
        return AbstractMassObject;
    }(AbstractSimObject_1.default));
    exports.AbstractMassObject = AbstractMassObject;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractMassObject;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/objects/PointMass',["require", "exports", "./AbstractMassObject"], function (require, exports, AbstractMassObject_1) {
    "use strict";
    var PointMass = (function (_super) {
        __extends(PointMass, _super);
        function PointMass(name, localName) {
            return _super.call(this, name, localName) || this;
        }
        return PointMass;
    }(AbstractMassObject_1.default));
    exports.PointMass = PointMass;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointMass;
});

define('davinci-newton/util/toName',["require", "exports"], function (require, exports) {
    "use strict";
    function toName(text) {
        return text.toUpperCase().replace(/[ -]/g, '_');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = toName;
});

define('davinci-newton/util/validName',["require", "exports"], function (require, exports) {
    "use strict";
    function validName(text) {
        if (!text.match(/^[A-Z_][A-Z_0-9]*$/)) {
            throw new Error('not a valid name: ' + text);
        }
        return text;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = validName;
});

define('davinci-newton/util/AbstractSubject',["require", "exports", "../util/toName", "../util/validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var AbstractSubject = (function () {
        function AbstractSubject(name) {
            if (!name) {
                throw new Error('no name');
            }
            this.name_ = validName_1.default(toName_1.default(name));
        }
        AbstractSubject.prototype.getName = function () {
            return this.name_;
        };
        return AbstractSubject;
    }());
    exports.AbstractSubject = AbstractSubject;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractSubject;
});

define('davinci-newton/util/contains',["require", "exports"], function (require, exports) {
    "use strict";
    function contains(xs, x) {
        return true;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = contains;
});

define('davinci-newton/model/EnergyInfo',["require", "exports"], function (require, exports) {
    "use strict";
    var EnergyInfo = (function () {
        function EnergyInfo(potential, translational, rotational) {
        }
        EnergyInfo.prototype.getPotential = function () {
            return 0;
        };
        EnergyInfo.prototype.getTranslational = function () {
            return 0;
        };
        EnergyInfo.prototype.getRotational = function () {
            return 0;
        };
        EnergyInfo.prototype.getTotalEnergy = function () {
            return 0;
        };
        return EnergyInfo;
    }());
    exports.EnergyInfo = EnergyInfo;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EnergyInfo;
});

define('davinci-newton/util/remove',["require", "exports"], function (require, exports) {
    "use strict";
    function remove(xs, x) {
        throw new Error("TODO");
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = remove;
});

define('davinci-newton/core/SimList',["require", "exports"], function (require, exports) {
    "use strict";
    var SimList = (function () {
        function SimList() {
        }
        SimList.prototype.add = function (simObj) {
            throw new Error("TODO");
        };
        SimList.prototype.remove = function (simObj) {
            throw new Error("TODO");
        };
        SimList.prototype.removeTemporary = function (time) {
            throw new Error("TODO");
        };
        return SimList;
    }());
    exports.SimList = SimList;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimList;
});

define('davinci-newton/model/ConcreteVariable',["require", "exports", "../util/toName", "../util/validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var ConcreteVariable = (function () {
        function ConcreteVariable(varsList_, name, localName_) {
            this.varsList_ = varsList_;
            this.localName_ = localName_;
            this.value_ = 0;
            this.name_ = validName_1.default(toName_1.default(name));
        }
        ConcreteVariable.prototype.getValue = function () {
            return this.value_;
        };
        return ConcreteVariable;
    }());
    exports.ConcreteVariable = ConcreteVariable;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConcreteVariable;
});

define('davinci-newton/checks/isString',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(s) {
        return (typeof s === 'string');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isString;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/core/VarsList',["require", "exports", "../util/AbstractSubject", "../model/ConcreteVariable", "../checks/isString", "../util/toName", "../util/validName"], function (require, exports, AbstractSubject_1, ConcreteVariable_1, isString_1, toName_1, validName_1) {
    "use strict";
    var TIME = 'TIME';
    var VarsList = (function (_super) {
        __extends(VarsList, _super);
        function VarsList(varNames, localNames, name) {
            if (name === void 0) { name = 'VARIABLES'; }
            var _this = _super.call(this, name) || this;
            _this.timeIdx_ = -1;
            _this.varList_ = [];
            if (varNames.length !== localNames.length) {
                throw new Error('varNames and localNames are different lengths');
            }
            for (var i = 0, n = varNames.length; i < n; i++) {
                var s = varNames[i];
                if (!isString_1.default(s)) {
                    throw new Error('variable name ' + s + ' is not a string i=' + i);
                }
                s = validName_1.default(toName_1.default(s));
                varNames[i] = s;
                if (s === TIME) {
                    _this.timeIdx_ = i;
                }
            }
            for (var i = 0, n = varNames.length; i < n; i++) {
                _this.varList_.push(new ConcreteVariable_1.default(_this, varNames[i], localNames[i]));
            }
            return _this;
        }
        VarsList.prototype.addVariables = function (names, localNames) {
            throw new Error("TODO");
        };
        VarsList.prototype.deleteVariables = function (index, howMany) {
            throw new Error("TODO");
        };
        VarsList.prototype.incrSequence = function () {
            var indexes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                indexes[_i] = arguments[_i];
            }
            throw new Error("TODO");
        };
        VarsList.prototype.getValue = function (index) {
            this.checkIndex_(index);
            return this.varList_[index].getValue();
        };
        VarsList.prototype.getValues = function () {
            throw new Error("TODO");
        };
        VarsList.prototype.setValues = function (values, continuous) {
            if (continuous === void 0) { continuous = false; }
            throw new Error("TODO");
        };
        VarsList.prototype.setValue = function (index, value, continuous) {
            if (continuous === void 0) { continuous = false; }
            throw new Error("TODO");
        };
        VarsList.prototype.getTime = function () {
            if (this.timeIdx_ < 0) {
                throw new Error('no time variable');
            }
            return this.getValue(this.timeIdx_);
        };
        VarsList.prototype.timeIndex = function () {
            throw new Error("TODO");
        };
        VarsList.prototype.checkIndex_ = function (index) {
            if (index < 0 || index >= this.varList_.length) {
                throw new Error('bad variable index=' + index + '; numVars=' + this.varList_.length);
            }
        };
        return VarsList;
    }(AbstractSubject_1.default));
    exports.VarsList = VarsList;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VarsList;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/engine/RigidBodySim',["require", "exports", "../util/AbstractSubject", "../util/contains", "../model/EnergyInfo", "../util/remove", "../core/SimList", "../core/VarsList", "../math/Vector"], function (require, exports, AbstractSubject_1, contains_1, EnergyInfo_1, remove_1, SimList_1, VarsList_1, Vector_1) {
    "use strict";
    var var_names = [
        'time',
        'kinetic enetry',
        'potential energy',
        'total energy'
    ];
    var i18n_names = [
        'time',
        'kinetic enetry',
        'potential energy',
        'total energy'
    ];
    var RigidBodySim = (function (_super) {
        __extends(RigidBodySim, _super);
        function RigidBodySim(name) {
            if (name === void 0) { name = 'SIM'; }
            var _this = _super.call(this, name) || this;
            _this.simList_ = new SimList_1.default();
            _this.varsList_ = new VarsList_1.default(var_names, i18n_names, _this.getName() + '_VARS');
            _this.bods_ = [];
            _this.forceLaws_ = [];
            return _this;
        }
        RigidBodySim.prototype.addBody = function (body) {
            if (!contains_1.default(this.bods_, body)) {
                var names = [];
                for (var k = 0; k < 6; k++) {
                    names.push(body.getVarName(k, false));
                }
                var localNames = [];
                for (var k = 0; k < 6; k++) {
                    localNames.push(body.getVarName(k, true));
                }
                var idx = this.varsList_.addVariables(names, localNames);
                body.setVarsIndex(idx);
                this.bods_.push(body);
                this.getSimList().add(body);
            }
            this.initializeFromBody(body);
            this.bods_.forEach(function (b) {
                b.eraseOldCopy();
            });
        };
        RigidBodySim.prototype.removeBody = function (body) {
            if (contains_1.default(this.bods_, body)) {
                this.varsList_.deleteVariables(body.getVarsIndex(), 6);
                remove_1.default(this.bods_, body);
                body.setVarsIndex(-1);
            }
            this.getSimList().remove(body);
            this.getVarsList().incrSequence(1, 2, 3);
        };
        RigidBodySim.prototype.addForceLaw = function (forceLaw) {
            if (!contains_1.default(this.forceLaws_, forceLaw)) {
                this.forceLaws_.push(forceLaw);
            }
            this.getVarsList().incrSequence(1, 2, 3);
        };
        RigidBodySim.prototype.removeForceLaw = function (forceLaw) {
            forceLaw.disconnect();
            this.getVarsList().incrSequence(1, 2, 3);
            return remove_1.default(this.forceLaws_, forceLaw);
        };
        ;
        RigidBodySim.prototype.moveObjects = function (vars) {
            this.bods_.forEach(function (b) {
                var idx = b.getVarsIndex();
                if (idx < 0)
                    return;
                b.setPosition(new Vector_1.default(vars[idx + RigidBodySim.X_], vars[idx + RigidBodySim.Y_]), vars[idx + RigidBodySim.W_]);
                b.setVelocity(new Vector_1.default(vars[idx + RigidBodySim.VX_], vars[idx + RigidBodySim.VY_]), vars[idx + RigidBodySim.VW_]);
            });
        };
        RigidBodySim.prototype.evaluate = function (vars, change, time) {
            var _this = this;
            this.moveObjects(vars);
            this.bods_.forEach(function (body) {
                var idx = body.getVarsIndex();
                if (idx < 0)
                    return;
                var mass = body.getMass();
                if (mass === Number.POSITIVE_INFINITY) {
                    for (var k = 0; k < 6; k++)
                        change[idx + k] = 0;
                }
                else {
                    change[idx + RigidBodySim.X_] = vars[idx + RigidBodySim.VX_];
                    change[idx + RigidBodySim.Y_] = vars[idx + RigidBodySim.VY_];
                    change[idx + RigidBodySim.W_] = vars[idx + RigidBodySim.VW_];
                    change[idx + RigidBodySim.VX_] = 0;
                    change[idx + RigidBodySim.VY_] = 0;
                    change[idx + RigidBodySim.VW_] = 0;
                }
            });
            this.forceLaws_.forEach(function (forceLaw) {
                var forces = forceLaw.calculateForces();
                forces.forEach(function (force) {
                    _this.applyForce(change, force);
                });
            });
            change[this.varsList_.timeIndex()] = 1;
            return null;
        };
        RigidBodySim.prototype.applyForce = function (change, force) {
            var massObj = force.getBody();
            if (!(contains_1.default(this.bods_, massObj))) {
                return;
            }
            var body = (massObj);
            var idx = body.getVarsIndex();
            if (idx < 0) {
                return;
            }
            var forceDir = force.getVector();
            var forceLoc = force.getStartPoint();
            var mass = body.getMass();
            change[idx + RigidBodySim.VX_] += forceDir.getX() / mass;
            change[idx + RigidBodySim.VY_] += forceDir.getY() / mass;
            var rx = forceLoc.getX() - body.getPosition().getX();
            var ry = forceLoc.getY() - body.getPosition().getY();
            change[idx + RigidBodySim.VW_] += (rx * forceDir.getY() - ry * forceDir.getX()) / body.momentAboutCM();
            var torque = force.getTorque();
            if (torque !== 0) {
                change[idx + RigidBodySim.VW_] += torque / body.momentAboutCM();
            }
            if (this.showForces_) {
                force.setExpireTime(this.getTime());
                this.getSimList().add(force);
            }
        };
        RigidBodySim.prototype.getTime = function () {
            return this.varsList_.getTime();
        };
        RigidBodySim.prototype.initializeFromBody = function (body) {
            body.eraseOldCopy();
            var idx = body.getVarsIndex();
            if (idx > -1) {
                var va = this.varsList_;
                va.setValue(RigidBodySim.X_ + idx, body.getPosition().getX());
                va.setValue(RigidBodySim.Y_ + idx, body.getPosition().getY());
                va.setValue(RigidBodySim.W_ + idx, body.getAngle());
                va.setValue(RigidBodySim.VX_ + idx, body.getVelocity().getX());
                va.setValue(RigidBodySim.VY_ + idx, body.getVelocity().getY());
                va.setValue(RigidBodySim.VW_ + idx, body.getAngularVelocity());
            }
            this.getVarsList().incrSequence(1, 2, 3);
        };
        RigidBodySim.prototype.modifyObjects = function () {
            var va = this.varsList_;
            var vars = va.getValues();
            this.moveObjects(vars);
            var einfo = this.getEnergyInfo_(vars);
            va.setValue(1, einfo.getTranslational() + einfo.getRotational(), true);
            va.setValue(2, einfo.getPotential(), true);
            va.setValue(3, einfo.getTotalEnergy(), true);
        };
        ;
        RigidBodySim.prototype.getSimList = function () {
            return this.simList_;
        };
        RigidBodySim.prototype.getVarsList = function () {
            return this.varsList_;
        };
        RigidBodySim.prototype.getEnergyInfo_ = function (vars) {
            var pe = 0;
            var re = 0;
            var te = 0;
            this.bods_.forEach(function (b) {
                if (isFinite(b.getMass())) {
                    re += b.rotationalEnergy();
                    te += b.translationalEnergy();
                }
            });
            this.forceLaws_.forEach(function (forceLaw) {
                pe += forceLaw.getPotentialEnergy();
            });
            return new EnergyInfo_1.default(pe + this.potentialOffset_, te, re);
        };
        RigidBodySim.prototype.saveState = function () {
            this.recentState_ = this.varsList_.getValues();
            this.bods_.forEach(function (b) {
                b.saveOldCopy();
            });
        };
        RigidBodySim.prototype.restoreState = function () {
            if (this.recentState_ != null) {
                this.varsList_.setValues(this.recentState_, true);
            }
            this.bods_.forEach(function (b) {
                b.eraseOldCopy();
            });
        };
        RigidBodySim.prototype.findCollisions = function (collisions, vars, stepSize) {
            throw new Error("TODO: findCollisions");
        };
        return RigidBodySim;
    }(AbstractSubject_1.default));
    RigidBodySim.X_ = 0;
    RigidBodySim.VX_ = 1;
    RigidBodySim.Y_ = 2;
    RigidBodySim.VY_ = 3;
    RigidBodySim.W_ = 4;
    RigidBodySim.VW_ = 5;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RigidBodySim;
});

define('davinci-newton/util/zeroArray',["require", "exports"], function (require, exports) {
    "use strict";
    function zeroArray(xs) {
        var n = xs.length;
        for (var i = 0; i < n; i++) {
            xs[i] = 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = zeroArray;
});

define('davinci-newton/model/RungeKutta',["require", "exports", "../util/zeroArray"], function (require, exports, zeroArray_1) {
    "use strict";
    var RungeKutta = (function () {
        function RungeKutta(ode_) {
            this.ode_ = ode_;
            this.inp_ = [];
            this.k1_ = [];
            this.k2_ = [];
            this.k3_ = [];
            this.k4_ = [];
        }
        RungeKutta.prototype.step = function (stepSize) {
            var error, i;
            var va = this.ode_.getVarsList();
            var vars = va.getValues();
            var N = vars.length;
            if (this.inp_.length < N) {
                this.inp_ = new Array(N);
                this.k1_ = new Array(N);
                this.k2_ = new Array(N);
                this.k3_ = new Array(N);
                this.k4_ = new Array(N);
            }
            var inp = this.inp_;
            var k1 = this.k1_;
            var k2 = this.k2_;
            var k3 = this.k3_;
            var k4 = this.k4_;
            for (i = 0; i < N; i++) {
                inp[i] = vars[i];
            }
            zeroArray_1.default(k1);
            error = this.ode_.evaluate(inp, k1, 0);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                inp[i] = vars[i] + k1[i] * stepSize / 2;
            }
            zeroArray_1.default(k2);
            error = this.ode_.evaluate(inp, k2, stepSize / 2);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                inp[i] = vars[i] + k2[i] * stepSize / 2;
            }
            zeroArray_1.default(k3);
            error = this.ode_.evaluate(inp, k3, stepSize / 2);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                inp[i] = vars[i] + k3[i] * stepSize;
            }
            zeroArray_1.default(k4);
            error = this.ode_.evaluate(inp, k4, stepSize);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
            }
            va.setValues(vars, true);
            return null;
        };
        return RungeKutta;
    }());
    exports.RungeKutta = RungeKutta;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RungeKutta;
});

define('davinci-newton/strategy/SimpleAdvance',["require", "exports"], function (require, exports) {
    "use strict";
    var SimpleAdvance = (function () {
        function SimpleAdvance(sim_, odeSolver_) {
            this.sim_ = sim_;
            this.odeSolver_ = odeSolver_;
            this.timeStep_ = 0.025;
        }
        SimpleAdvance.prototype.advance = function (timeStep, memoList) {
            this.sim_.getSimList().removeTemporary(this.sim_.getTime());
            var err = this.odeSolver_.step(timeStep);
            if (err != null) {
                throw new Error('error during advance ' + err);
            }
            this.sim_.modifyObjects();
            if (memoList !== undefined) {
                memoList.memorize();
            }
        };
        SimpleAdvance.prototype.getTime = function () {
            return this.sim_.getTime();
        };
        SimpleAdvance.prototype.getTimeStep = function () {
            return this.timeStep_;
        };
        return SimpleAdvance;
    }());
    exports.SimpleAdvance = SimpleAdvance;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimpleAdvance;
});

define('davinci-newton/util/getSystemTime',["require", "exports"], function (require, exports) {
    "use strict";
    function getSystemTime() {
        return Date.now() * 1E-3;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getSystemTime;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/runner/Clock',["require", "exports", "../util/AbstractSubject", "../util/getSystemTime"], function (require, exports, AbstractSubject_1, getSystemTime_1) {
    "use strict";
    var Clock = (function (_super) {
        __extends(Clock, _super);
        function Clock(name) {
            if (name === void 0) { name = 'CLOCK'; }
            var _this = _super.call(this, name) || this;
            _this.clockStart_sys_secs_ = getSystemTime_1.default();
            _this.isRunning_ = false;
            _this.saveTime_secs_ = 0;
            _this.timeRate_ = 1;
            return _this;
        }
        Clock.prototype.getTime = function () {
            if (this.isRunning_) {
                return (getSystemTime_1.default() - this.clockStart_sys_secs_) * this.timeRate_;
            }
            else {
                return this.saveTime_secs_;
            }
        };
        Clock.prototype.setTime = function (time) {
            throw new Error("TODO");
        };
        Clock.prototype.setRealTime = function (time) {
            throw new Error("TODO");
        };
        return Clock;
    }(AbstractSubject_1.default));
    exports.Clock = Clock;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Clock;
});

define('davinci-newton/runner/SimRunner',["require", "exports", "./Clock"], function (require, exports, Clock_1) {
    "use strict";
    var SimRunner = (function () {
        function SimRunner(advanceStrategy_, name) {
            this.advanceStrategy_ = advanceStrategy_;
            this.clock_ = new Clock_1.default();
            this.timeStep_ = advanceStrategy_.getTimeStep();
        }
        SimRunner.prototype.advanceToTargetTime = function (strategy, targetTime) {
            var simTime = strategy.getTime();
            while (simTime < targetTime) {
                strategy.advance(this.timeStep_, this);
                var lastSimTime = simTime;
                simTime = strategy.getTime();
                if (simTime - lastSimTime <= 1e-15) {
                    throw new Error('SimRunner time did not advance');
                }
            }
        };
        SimRunner.prototype.update = function () {
            var clockTime = this.clock_.getTime();
            var simTime = this.advanceStrategy_.getTime();
            if (clockTime > simTime + 1 || clockTime < simTime - 1) {
                var t = simTime + this.timeStep_;
                this.clock_.setTime(t);
                this.clock_.setRealTime(t);
                clockTime = t;
            }
            var startTime = clockTime;
            var targetTime = startTime - this.timeStep_ / 10;
            this.advanceToTargetTime(this.advanceStrategy_, targetTime);
        };
        SimRunner.prototype.memorize = function () {
            throw new Error("SimRunner.memorize()");
        };
        return SimRunner;
    }());
    exports.SimRunner = SimRunner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimRunner;
});

define('davinci-newton/model/CoordType',["require", "exports"], function (require, exports) {
    "use strict";
    var CoordType;
    (function (CoordType) {
        CoordType[CoordType["BODY"] = 0] = "BODY";
        CoordType[CoordType["WORLD"] = 1] = "WORLD";
    })(CoordType || (CoordType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoordType;
});

define('davinci-newton/model/Force',["require", "exports", "./CoordType"], function (require, exports, CoordType_1) {
    "use strict";
    var Force = (function () {
        function Force(name, body_, location_, locationCoordType_, direction_, directionCoordType_, torque_) {
            if (torque_ === void 0) { torque_ = 0; }
            this.body_ = body_;
            this.location_ = location_;
            this.locationCoordType_ = locationCoordType_;
            this.direction_ = direction_;
            this.directionCoordType_ = directionCoordType_;
            this.torque_ = torque_;
        }
        Force.prototype.getBody = function () {
            return this.body_;
        };
        Force.prototype.getVector = function () {
            return this.directionCoordType_ === CoordType_1.default.BODY ? this.body_.rotateBodyToWorld(this.direction_) : this.direction_;
        };
        Force.prototype.getStartPoint = function () {
            return this.locationCoordType_ === CoordType_1.default.BODY ? this.body_.bodyToWorld(this.location_) : this.location_;
        };
        Force.prototype.getTorque = function () {
            return this.torque_;
        };
        Force.prototype.isMassObject = function () {
            return false;
        };
        Force.prototype.setExpireTime = function (time) {
            throw new Error("TODO");
        };
        return Force;
    }());
    exports.Force = Force;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Force;
});

define('davinci-newton/objects/Spring',["require", "exports", "../model/CoordType", "../model/Force", "../math/Vector"], function (require, exports, CoordType_1, Force_1, Vector_1) {
    "use strict";
    var Spring = (function () {
        function Spring(name, body1_, attach1_, body2_, attach2_, restLength_, stiffness_, compressOnly_) {
            if (stiffness_ === void 0) { stiffness_ = 0; }
            if (compressOnly_ === void 0) { compressOnly_ = false; }
            this.body1_ = body1_;
            this.attach1_ = attach1_;
            this.body2_ = body2_;
            this.attach2_ = attach2_;
            this.restLength_ = restLength_;
            this.stiffness_ = stiffness_;
            this.compressOnly_ = compressOnly_;
            this.damping_ = 0;
        }
        Spring.prototype.getStartPoint = function () {
            if (this.attach1_ == null || this.body1_ == null) {
                throw new Error();
            }
            return this.body1_.bodyToWorld(this.attach1_);
        };
        Spring.prototype.getEndPoint = function () {
            if (this.attach2_ == null || this.body2_ == null) {
                throw new Error();
            }
            var p2 = this.body2_.bodyToWorld(this.attach2_);
            if (this.compressOnly_) {
                var p1 = this.getStartPoint();
                var dist = p1.distanceTo(p2);
                var rlen = this.restLength_;
                if (dist <= rlen) {
                    return p2;
                }
                else {
                    var n = p2.subtract(p1).normalize();
                    return p1.add(n.multiply(rlen));
                }
            }
            else {
                return p2;
            }
        };
        Spring.prototype.calculateForces = function () {
            var point1 = this.getStartPoint();
            var point2 = this.getEndPoint();
            var v = point2.subtract(point1);
            var len = v.length();
            var sf = -this.stiffness_ * (len - this.restLength_);
            var fx = -sf * (v.getX() / len);
            var fy = -sf * (v.getY() / len);
            var f = new Vector_1.default(fx, fy, 0);
            if (this.damping_ !== 0) {
                if (!this.compressOnly_ || len < this.restLength_ - 1E-10) {
                    var v1 = this.body1_.getVelocity(this.attach1_);
                    var v2 = this.body2_.getVelocity(this.attach2_);
                    var df = v1.subtract(v2).multiply(-this.damping_);
                    f = f.add(df);
                }
            }
            return [
                new Force_1.default('spring', this.body1_, point1, CoordType_1.default.WORLD, f, CoordType_1.default.WORLD),
                new Force_1.default('spring', this.body2_, point2, CoordType_1.default.WORLD, f.multiply(-1), CoordType_1.default.WORLD)
            ];
        };
        Spring.prototype.disconnect = function () {
        };
        Spring.prototype.isMassObject = function () {
            return false;
        };
        Spring.prototype.getPotentialEnergy = function () {
            return 0;
        };
        Spring.prototype.getVector = function () {
            return this.getEndPoint().subtract(this.getStartPoint());
        };
        return Spring;
    }());
    exports.Spring = Spring;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spring;
});

define('davinci-newton',["require", "exports", "./davinci-newton/config", "./davinci-newton/objects/PointMass", "./davinci-newton/engine/RigidBodySim", "./davinci-newton/model/RungeKutta", "./davinci-newton/strategy/SimpleAdvance", "./davinci-newton/runner/SimRunner", "./davinci-newton/objects/Spring"], function (require, exports, config_1, PointMass_1, RigidBodySim_1, RungeKutta_1, SimpleAdvance_1, SimRunner_1, Spring_1) {
    "use strict";
    var newton = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get PointMass() { return PointMass_1.default; },
        get RigidBodySim() { return RigidBodySim_1.default; },
        get RungeKutta() { return RungeKutta_1.default; },
        get SimpleAdvance() { return SimpleAdvance_1.default; },
        get SimRunner() { return SimRunner_1.default; },
        get Spring() { return Spring_1.default; },
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = newton;
});

  var library = require('davinci-newton').default;
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['NEWTON'] = library;
  }
}(this));
