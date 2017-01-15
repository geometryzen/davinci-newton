System.register('davinci-newton/config.js', [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Newton, config;
    return {
        setters: [],
        execute: function () {
            Newton = function () {
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
            }();
            config = new Newton();
            exports_1("default", config);
        }
    };
});
System.register("davinci-newton/objects/AbstractSimObject.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject;
    return {
        setters: [],
        execute: function () {
            AbstractSimObject = function () {
                function AbstractSimObject(name, localName) {}
                AbstractSimObject.prototype.isMassObject = function () {
                    return false;
                };
                return AbstractSimObject;
            }();
            exports_1("AbstractSimObject", AbstractSimObject);
            exports_1("default", AbstractSimObject);
        }
    };
});
System.register("davinci-newton/objects/AbstractMassObject.js", ["./AbstractSimObject", "../math/Vector"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, Vector_1, AbstractMassObject;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Vector_1_1) {
            Vector_1 = Vector_1_1;
        }],
        execute: function () {
            AbstractMassObject = function (_super) {
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
                    } else {
                        return this.velocity_;
                    }
                };
                AbstractMassObject.prototype.rotateBodyToWorld = function (v_body) {
                    return v_body.immutable().rotate(this.cosAngle_, this.sinAngle_);
                };
                return AbstractMassObject;
            }(AbstractSimObject_1.default);
            exports_1("AbstractMassObject", AbstractMassObject);
            exports_1("default", AbstractMassObject);
        }
    };
});
System.register("davinci-newton/objects/PointMass.js", ["./AbstractMassObject"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractMassObject_1, PointMass;
    return {
        setters: [function (AbstractMassObject_1_1) {
            AbstractMassObject_1 = AbstractMassObject_1_1;
        }],
        execute: function () {
            PointMass = function (_super) {
                __extends(PointMass, _super);
                function PointMass(name, localName) {
                    return _super.call(this, name, localName) || this;
                }
                return PointMass;
            }(AbstractMassObject_1.default);
            exports_1("PointMass", PointMass);
            exports_1("default", PointMass);
        }
    };
});
System.register("davinci-newton/util/contains.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function contains(xs, x) {
        return true;
    }
    exports_1("default", contains);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/model/EnergyInfo.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var EnergyInfo;
    return {
        setters: [],
        execute: function () {
            EnergyInfo = function () {
                function EnergyInfo(potential, translational, rotational) {}
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
            }();
            exports_1("EnergyInfo", EnergyInfo);
            exports_1("default", EnergyInfo);
        }
    };
});
System.register("davinci-newton/util/remove.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function remove(xs, x) {
        throw new Error("TODO");
    }
    exports_1("default", remove);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/core/SimList.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var SimList;
    return {
        setters: [],
        execute: function () {
            SimList = function () {
                function SimList() {}
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
            }();
            exports_1("SimList", SimList);
            exports_1("default", SimList);
        }
    };
});
System.register("davinci-newton/model/ConcreteVariable.js", ["../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var toName_1, validName_1, ConcreteVariable;
    return {
        setters: [function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            ConcreteVariable = function () {
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
            }();
            exports_1("ConcreteVariable", ConcreteVariable);
            exports_1("default", ConcreteVariable);
        }
    };
});
System.register("davinci-newton/checks/isString.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isString(s) {
        return typeof s === 'string';
    }
    exports_1("default", isString);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/core/VarsList.js", ["../util/AbstractSubject", "../model/ConcreteVariable", "../checks/isString", "../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, ConcreteVariable_1, isString_1, toName_1, validName_1, TIME, VarsList;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (ConcreteVariable_1_1) {
            ConcreteVariable_1 = ConcreteVariable_1_1;
        }, function (isString_1_1) {
            isString_1 = isString_1_1;
        }, function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            TIME = 'TIME';
            VarsList = function (_super) {
                __extends(VarsList, _super);
                function VarsList(varNames, localNames, name) {
                    if (name === void 0) {
                        name = 'VARIABLES';
                    }
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
                    if (continuous === void 0) {
                        continuous = false;
                    }
                    throw new Error("TODO");
                };
                VarsList.prototype.setValue = function (index, value, continuous) {
                    if (continuous === void 0) {
                        continuous = false;
                    }
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
            }(AbstractSubject_1.default);
            exports_1("VarsList", VarsList);
            exports_1("default", VarsList);
        }
    };
});
System.register("davinci-newton/engine/RigidBodySim.js", ["../util/AbstractSubject", "../util/contains", "../model/EnergyInfo", "../util/remove", "../core/SimList", "../core/VarsList", "../math/Vector"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, contains_1, EnergyInfo_1, remove_1, SimList_1, VarsList_1, Vector_1, var_names, i18n_names, RigidBodySim;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (EnergyInfo_1_1) {
            EnergyInfo_1 = EnergyInfo_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }, function (SimList_1_1) {
            SimList_1 = SimList_1_1;
        }, function (VarsList_1_1) {
            VarsList_1 = VarsList_1_1;
        }, function (Vector_1_1) {
            Vector_1 = Vector_1_1;
        }],
        execute: function () {
            var_names = ['time', 'kinetic enetry', 'potential energy', 'total energy'];
            i18n_names = ['time', 'kinetic enetry', 'potential energy', 'total energy'];
            RigidBodySim = function (_super) {
                __extends(RigidBodySim, _super);
                function RigidBodySim(name) {
                    if (name === void 0) {
                        name = 'SIM';
                    }
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
                        if (idx < 0) return;
                        b.setPosition(new Vector_1.default(vars[idx + RigidBodySim.X_], vars[idx + RigidBodySim.Y_]), vars[idx + RigidBodySim.W_]);
                        b.setVelocity(new Vector_1.default(vars[idx + RigidBodySim.VX_], vars[idx + RigidBodySim.VY_]), vars[idx + RigidBodySim.VW_]);
                    });
                };
                RigidBodySim.prototype.evaluate = function (vars, change, time) {
                    var _this = this;
                    this.moveObjects(vars);
                    this.bods_.forEach(function (body) {
                        var idx = body.getVarsIndex();
                        if (idx < 0) return;
                        var mass = body.getMass();
                        if (mass === Number.POSITIVE_INFINITY) {
                            for (var k = 0; k < 6; k++) change[idx + k] = 0;
                        } else {
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
                    if (!contains_1.default(this.bods_, massObj)) {
                        return;
                    }
                    var body = massObj;
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
            }(AbstractSubject_1.default);
            RigidBodySim.X_ = 0;
            RigidBodySim.VX_ = 1;
            RigidBodySim.Y_ = 2;
            RigidBodySim.VY_ = 3;
            RigidBodySim.W_ = 4;
            RigidBodySim.VW_ = 5;
            exports_1("default", RigidBodySim);
        }
    };
});
System.register("davinci-newton/util/zeroArray.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function zeroArray(xs) {
        var n = xs.length;
        for (var i = 0; i < n; i++) {
            xs[i] = 0;
        }
    }
    exports_1("default", zeroArray);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/model/RungeKutta.js", ["../util/zeroArray"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var zeroArray_1, RungeKutta;
    return {
        setters: [function (zeroArray_1_1) {
            zeroArray_1 = zeroArray_1_1;
        }],
        execute: function () {
            RungeKutta = function () {
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
            }();
            exports_1("RungeKutta", RungeKutta);
            exports_1("default", RungeKutta);
        }
    };
});
System.register("davinci-newton/strategy/SimpleAdvance.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var SimpleAdvance;
    return {
        setters: [],
        execute: function () {
            SimpleAdvance = function () {
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
            }();
            exports_1("SimpleAdvance", SimpleAdvance);
            exports_1("default", SimpleAdvance);
        }
    };
});
System.register("davinci-newton/util/toName.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function toName(text) {
        return text.toUpperCase().replace(/[ -]/g, '_');
    }
    exports_1("default", toName);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/util/validName.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function validName(text) {
        if (!text.match(/^[A-Z_][A-Z_0-9]*$/)) {
            throw new Error('not a valid name: ' + text);
        }
        return text;
    }
    exports_1("default", validName);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/util/AbstractSubject.js", ["../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var toName_1, validName_1, AbstractSubject;
    return {
        setters: [function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            AbstractSubject = function () {
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
            }();
            exports_1("AbstractSubject", AbstractSubject);
            exports_1("default", AbstractSubject);
        }
    };
});
System.register("davinci-newton/util/getSystemTime.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function getSystemTime() {
        return Date.now() * 1E-3;
    }
    exports_1("default", getSystemTime);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/runner/Clock.js", ["../util/AbstractSubject", "../util/getSystemTime"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, getSystemTime_1, Clock;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (getSystemTime_1_1) {
            getSystemTime_1 = getSystemTime_1_1;
        }],
        execute: function () {
            Clock = function (_super) {
                __extends(Clock, _super);
                function Clock(name) {
                    if (name === void 0) {
                        name = 'CLOCK';
                    }
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
                    } else {
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
            }(AbstractSubject_1.default);
            exports_1("Clock", Clock);
            exports_1("default", Clock);
        }
    };
});
System.register("davinci-newton/runner/SimRunner.js", ["./Clock"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Clock_1, SimRunner;
    return {
        setters: [function (Clock_1_1) {
            Clock_1 = Clock_1_1;
        }],
        execute: function () {
            SimRunner = function () {
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
            }();
            exports_1("SimRunner", SimRunner);
            exports_1("default", SimRunner);
        }
    };
});
System.register("davinci-newton/model/CoordType.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var CoordType;
    return {
        setters: [],
        execute: function () {
            (function (CoordType) {
                CoordType[CoordType["BODY"] = 0] = "BODY";
                CoordType[CoordType["WORLD"] = 1] = "WORLD";
            })(CoordType || (CoordType = {}));
            exports_1("default", CoordType);
        }
    };
});
System.register("davinci-newton/model/Force.js", ["./CoordType"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var CoordType_1, Force;
    return {
        setters: [function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }],
        execute: function () {
            Force = function () {
                function Force(name, body_, location_, locationCoordType_, direction_, directionCoordType_, torque_) {
                    if (torque_ === void 0) {
                        torque_ = 0;
                    }
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
            }();
            exports_1("Force", Force);
            exports_1("default", Force);
        }
    };
});
System.register("davinci-newton/math/Vector.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Vector;
    return {
        setters: [],
        execute: function () {
            Vector = function () {
                function Vector(x_, y_, z_) {
                    if (z_ === void 0) {
                        z_ = 0;
                    }
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
            }();
            Vector.ORIGIN = new Vector(0, 0);
            exports_1("Vector", Vector);
            exports_1("default", Vector);
        }
    };
});
System.register("davinci-newton/objects/Spring.js", ["../model/CoordType", "../model/Force", "../math/Vector"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var CoordType_1, Force_1, Vector_1, Spring;
    return {
        setters: [function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (Force_1_1) {
            Force_1 = Force_1_1;
        }, function (Vector_1_1) {
            Vector_1 = Vector_1_1;
        }],
        execute: function () {
            Spring = function () {
                function Spring(name, body1_, attach1_, body2_, attach2_, restLength_, stiffness_, compressOnly_) {
                    if (stiffness_ === void 0) {
                        stiffness_ = 0;
                    }
                    if (compressOnly_ === void 0) {
                        compressOnly_ = false;
                    }
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
                        } else {
                            var n = p2.subtract(p1).normalize();
                            return p1.add(n.multiply(rlen));
                        }
                    } else {
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
                    return [new Force_1.default('spring', this.body1_, point1, CoordType_1.default.WORLD, f, CoordType_1.default.WORLD), new Force_1.default('spring', this.body2_, point2, CoordType_1.default.WORLD, f.multiply(-1), CoordType_1.default.WORLD)];
                };
                Spring.prototype.disconnect = function () {};
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
            }();
            exports_1("Spring", Spring);
            exports_1("default", Spring);
        }
    };
});
System.register("davinci-newton.js", ["./davinci-newton/config", "./davinci-newton/objects/PointMass", "./davinci-newton/engine/RigidBodySim", "./davinci-newton/model/RungeKutta", "./davinci-newton/strategy/SimpleAdvance", "./davinci-newton/runner/SimRunner", "./davinci-newton/objects/Spring"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var config_1, PointMass_1, RigidBodySim_1, RungeKutta_1, SimpleAdvance_1, SimRunner_1, Spring_1, newton;
    return {
        setters: [function (config_1_1) {
            config_1 = config_1_1;
        }, function (PointMass_1_1) {
            PointMass_1 = PointMass_1_1;
        }, function (RigidBodySim_1_1) {
            RigidBodySim_1 = RigidBodySim_1_1;
        }, function (RungeKutta_1_1) {
            RungeKutta_1 = RungeKutta_1_1;
        }, function (SimpleAdvance_1_1) {
            SimpleAdvance_1 = SimpleAdvance_1_1;
        }, function (SimRunner_1_1) {
            SimRunner_1 = SimRunner_1_1;
        }, function (Spring_1_1) {
            Spring_1 = Spring_1_1;
        }],
        execute: function () {
            newton = {
                get LAST_MODIFIED() {
                    return config_1.default.LAST_MODIFIED;
                },
                get VERSION() {
                    return config_1.default.VERSION;
                },
                get PointMass() {
                    return PointMass_1.default;
                },
                get RigidBodySim() {
                    return RigidBodySim_1.default;
                },
                get RungeKutta() {
                    return RungeKutta_1.default;
                },
                get SimpleAdvance() {
                    return SimpleAdvance_1.default;
                },
                get SimRunner() {
                    return SimRunner_1.default;
                },
                get Spring() {
                    return Spring_1.default;
                }
            };
            exports_1("default", newton);
        }
    };
});
//# sourceMappingURL=davinci-newton-system-es5.js.map