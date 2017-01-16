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
                    this.LAST_MODIFIED = '2017-01-16';
                    this.NAMESPACE = 'NEWTON';
                    this.VERSION = '0.0.3';
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
System.register("davinci-newton/engine/RigidBody.js", ["../objects/AbstractSimObject", "../math/Vector"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, Vector_1, RigidBody;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Vector_1_1) {
            Vector_1 = Vector_1_1;
        }],
        execute: function () {
            RigidBody = function (_super) {
                __extends(RigidBody, _super);
                function RigidBody(name) {
                    var _this = _super.call(this, name) || this;
                    _this.varsIndex_ = -1;
                    _this.x = 0;
                    _this.y = 0;
                    _this.z = 0;
                    _this.vx = 0;
                    _this.vy = 0;
                    _this.vz = 0;
                    _this.angle = 0;
                    _this.omega_ = 0;
                    _this.mass_ = 1;
                    _this.sinAngle_ = 0;
                    _this.cosAngle_ = 1;
                    _this.cm_body_ = Vector_1.default.ORIGIN;
                    return _this;
                }
                RigidBody.prototype.getExpireTime = function () {
                    return Number.POSITIVE_INFINITY;
                };
                RigidBody.prototype.eraseOldCopy = function () {
                    this.body_old_ = null;
                };
                RigidBody.prototype.getVarsIndex = function () {
                    return this.varsIndex_;
                };
                RigidBody.prototype.setVarsIndex = function (index) {
                    this.varsIndex_ = index;
                };
                RigidBody.prototype.getVarName = function (index, localized) {
                    switch (index) {
                        case 0:
                            return "position x";
                        case 1:
                            return "position y";
                        case 2:
                            return "position z";
                        case 3:
                            return "velocity x";
                        case 4:
                            return "velocity y";
                        case 5:
                            return "velocity z";
                        case 6:
                            return "angle";
                        case 7:
                            return "omega";
                    }
                    throw new Error("getVarName(" + index + ")");
                };
                RigidBody.prototype.getAttitude = function () {
                    return this.angle;
                };
                RigidBody.prototype.getAngularVelocity = function () {
                    return this.omega_;
                };
                RigidBody.prototype.getPosition = function () {
                    return new Vector_1.default(this.x, this.y, this.z);
                };
                RigidBody.prototype.setPosition = function (x, y, z) {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                };
                RigidBody.prototype.setAttitude = function (angle) {
                    this.angle = angle;
                    this.cosAngle_ = Math.cos(angle);
                    this.sinAngle_ = Math.sin(angle);
                };
                RigidBody.prototype.getVelocity = function () {
                    return new Vector_1.default(this.vx, this.vy, this.vz);
                };
                RigidBody.prototype.setVelocity = function (vx, vy, vz) {
                    this.vx = vx;
                    this.vy = vy;
                    this.vz = vz;
                };
                RigidBody.prototype.setAngularVelocity = function (omega) {
                    this.omega_ = omega;
                };
                RigidBody.prototype.getMass = function () {
                    return this.mass_;
                };
                RigidBody.prototype.setMass = function (mass) {
                    this.mass_ = mass;
                };
                RigidBody.prototype.momentAboutCM = function () {
                    return 1;
                };
                RigidBody.prototype.rotationalEnergy = function () {
                    return 0;
                };
                RigidBody.prototype.translationalEnergy = function () {
                    return 0;
                };
                RigidBody.prototype.saveOldCopy = function () {};
                RigidBody.prototype.bodyToWorld = function (bodyPoint) {
                    var rx = bodyPoint.x - this.cm_body_.x;
                    var ry = bodyPoint.y - this.cm_body_.y;
                    var x = this.x + (rx * this.cosAngle_ - ry * this.sinAngle_);
                    var y = this.y + (rx * this.sinAngle_ + ry * this.cosAngle_);
                    return new Vector_1.default(x, y, 0);
                };
                RigidBody.prototype.worldVelocityOfBodyPoint = function (bodyPoint) {
                    var r = this.rotateBodyToWorld(Vector_1.default.fromVector(bodyPoint).subtract(this.cm_body_));
                    var vx = this.vx - r.y * this.omega_;
                    var vy = this.vy + r.x * this.omega_;
                    return new Vector_1.default(vx, vy, 0);
                };
                RigidBody.prototype.rotateBodyToWorld = function (bodyPoint) {
                    return Vector_1.default.fromVector(bodyPoint).rotate(this.cosAngle_, this.sinAngle_);
                };
                return RigidBody;
            }(AbstractSimObject_1.default);
            exports_1("RigidBody", RigidBody);
            exports_1("default", RigidBody);
        }
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
        throw new Error("TODO: remove");
    }
    exports_1("default", remove);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/util/contains.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function contains(xs, x) {
        var length = xs.length;
        for (var i = 0; i < length; i++) {
            if (xs[i] === x) {
                return true;
            }
        }
        return false;
    }
    exports_1("default", contains);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustSatisfy.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            var message = messageBuilder ? messageBuilder() : "satisfy some condition";
            var context = contextBuilder ? " in " + contextBuilder() : "";
            throw new Error(name + " must " + message + context + ".");
        }
    }
    exports_1("default", mustSatisfy);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/isNull.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function default_1(x) {
        return x === null;
    }
    exports_1("default", default_1);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/isObject.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isObject(x) {
        return typeof x === 'object';
    }
    exports_1("default", isObject);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustBeNonNullObject.js", ["../checks/mustSatisfy", "../checks/isNull", "../checks/isObject"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function beObject() {
        return "be a non-null `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value) && !isNull_1.default(value), beObject, contextBuilder);
        return value;
    }
    exports_1("default", mustBeObject);
    var mustSatisfy_1, isNull_1, isObject_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isNull_1_1) {
            isNull_1 = isNull_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/core/SimList.js", ["../util/AbstractSubject", "../util/contains", "../util/GenericEvent", "../checks/mustBeNonNullObject"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, contains_1, GenericEvent_1, mustBeNonNullObject_1, SimList;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }],
        execute: function () {
            SimList = function (_super) {
                __extends(SimList, _super);
                function SimList() {
                    var _this = _super.call(this, 'SIM_LIST') || this;
                    _this.elements_ = [];
                    return _this;
                }
                SimList.prototype.add = function (simObj) {
                    for (var i = 0; i < arguments.length; i++) {
                        var element = arguments[i];
                        mustBeNonNullObject_1.default('element', element);
                        if (!contains_1.default(this.elements_, element)) {
                            this.elements_.push(element);
                            this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_ADDED, element));
                        }
                    }
                };
                SimList.prototype.remove = function (simObj) {
                    throw new Error("TODO");
                };
                SimList.prototype.removeTemporary = function (time) {
                    for (var i = this.elements_.length - 1; i >= 0; i--) {
                        var simobj = this.elements_[i];
                        if (simobj.getExpireTime() < time) {
                            this.elements_.splice(i, 1);
                            this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_REMOVED, simobj));
                        }
                    }
                };
                return SimList;
            }(AbstractSubject_1.default);
            SimList.OBJECT_ADDED = 'OBJECT_ADDED';
            SimList.OBJECT_REMOVED = 'OBJECT_REMOVED';
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
                    this.seq_ = 0;
                    this.doesBroadcast_ = false;
                    this.name_ = validName_1.default(toName_1.default(name));
                }
                ConcreteVariable.prototype.getName = function (localized) {
                    return localized ? this.localName_ : this.name_;
                };
                ConcreteVariable.prototype.getSubject = function () {
                    return this.varsList_;
                };
                ConcreteVariable.prototype.getValue = function () {
                    return this.value_;
                };
                ConcreteVariable.prototype.setValue = function (value) {
                    if (this.value_ !== value) {
                        this.value_ = value;
                        this.seq_++;
                        if (this.doesBroadcast_) {
                            this.varsList_.broadcast(this);
                        }
                    }
                };
                ConcreteVariable.prototype.setValueSmooth = function (value) {
                    this.value_ = value;
                };
                ConcreteVariable.prototype.incrSequence = function () {
                    this.seq_++;
                };
                return ConcreteVariable;
            }();
            exports_1("ConcreteVariable", ConcreteVariable);
            exports_1("default", ConcreteVariable);
        }
    };
});
System.register("davinci-newton/checks/isArray.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    exports_1("default", isArray);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/util/extendArray.js", ["../checks/isArray"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function extendArray(array, quantity, value) {
        if (quantity === 0) {
            return;
        }
        if (quantity < 0) {
            throw new Error();
        }
        var startIdx = array.length;
        array.length = startIdx + quantity;
        if (isArray_1.default(value)) {
            var vs = value;
            if (vs.length !== quantity) {
                throw new Error();
            }
            for (var i = startIdx, n = array.length; i < n; i++) {
                array[i] = value[i - startIdx];
            }
        } else {
            for (var i = startIdx, n = array.length; i < n; i++) {
                array[i] = value;
            }
        }
    }
    exports_1("default", extendArray);
    var isArray_1;
    return {
        setters: [function (isArray_1_1) {
            isArray_1 = isArray_1_1;
        }],
        execute: function () {}
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
System.register("davinci-newton/core/VarsList.js", ["../util/AbstractSubject", "../model/ConcreteVariable", "../util/extendArray", "../util/GenericEvent", "../checks/isString", "../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, ConcreteVariable_1, extendArray_1, GenericEvent_1, isString_1, toName_1, validName_1, VarsList;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (ConcreteVariable_1_1) {
            ConcreteVariable_1 = ConcreteVariable_1_1;
        }, function (extendArray_1_1) {
            extendArray_1 = extendArray_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (isString_1_1) {
            isString_1 = isString_1_1;
        }, function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
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
                        if (s === VarsList.TIME) {
                            _this.timeIdx_ = i;
                        }
                    }
                    for (var i = 0, n = varNames.length; i < n; i++) {
                        _this.varList_.push(new ConcreteVariable_1.default(_this, varNames[i], localNames[i]));
                    }
                    return _this;
                }
                VarsList.prototype.findOpenSlot_ = function (quantity) {
                    var found = 0;
                    var startIdx = -1;
                    for (var i = 0, n = this.varList_.length; i < n; i++) {
                        if (this.varList_[i].getName() === VarsList.DELETED) {
                            if (startIdx === -1) {
                                startIdx = i;
                            }
                            found++;
                            if (found >= quantity) {
                                return startIdx;
                            }
                        } else {
                            startIdx = -1;
                            found = 0;
                        }
                    }
                    var expand;
                    if (found > 0) {
                        expand = quantity - found;
                    } else {
                        startIdx = this.varList_.length;
                        expand = quantity;
                    }
                    var newVars = [];
                    for (i = 0; i < expand; i++) {
                        newVars.push(new ConcreteVariable_1.default(this, VarsList.DELETED, VarsList.DELETED));
                    }
                    extendArray_1.default(this.varList_, expand, newVars);
                    return startIdx;
                };
                VarsList.prototype.addVariables = function (names, localNames) {
                    var howMany = names.length;
                    if (howMany === 0) {
                        throw new Error();
                    }
                    if (names.length !== localNames.length) {
                        throw new Error('names and localNames are different lengths');
                    }
                    var position = this.findOpenSlot_(howMany);
                    for (var i = 0; i < howMany; i++) {
                        var name_1 = validName_1.default(toName_1.default(names[i]));
                        if (name_1 === VarsList.DELETED) {
                            throw new Error("variable cannot be named ''+VarsList.DELETED+''");
                        }
                        var idx = position + i;
                        this.varList_[idx] = new ConcreteVariable_1.default(this, name_1, localNames[i]);
                        if (name_1 === VarsList.TIME) {
                            this.timeIdx_ = idx;
                        }
                    }
                    this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
                    return position;
                };
                VarsList.prototype.deleteVariables = function (index, howMany) {
                    throw new Error("TODO");
                };
                VarsList.prototype.incrSequence = function () {
                    var indexes = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        indexes[_i] = arguments[_i];
                    }
                    if (arguments.length === 0) {
                        for (var i = 0, n = this.varList_.length; i < n; i++) {
                            this.varList_[i].incrSequence();
                        }
                    } else {
                        for (var i = 0, n = arguments.length; i < n; i++) {
                            var idx = arguments[i];
                            this.checkIndex_(idx);
                            this.varList_[idx].incrSequence();
                        }
                    }
                };
                VarsList.prototype.getValue = function (index) {
                    this.checkIndex_(index);
                    return this.varList_[index].getValue();
                };
                VarsList.prototype.getValues = function () {
                    return this.varList_.map(function (v) {
                        return v.getValue();
                    });
                };
                VarsList.prototype.setValues = function (vars, continuous) {
                    if (continuous === void 0) {
                        continuous = false;
                    }
                    var N = this.varList_.length;
                    var n = vars.length;
                    if (n > N) {
                        throw new Error("setValues bad length n = " + n + " > N = " + N);
                    }
                    for (var i = 0; i < N; i++) {
                        if (i < n) {
                            this.setValue(i, vars[i], continuous);
                        }
                    }
                };
                VarsList.prototype.setValue = function (index, value, continuous) {
                    if (continuous === void 0) {
                        continuous = false;
                    }
                    this.checkIndex_(index);
                    var variable = this.varList_[index];
                    if (isNaN(value)) {
                        throw new Error('cannot set variable ' + variable.getName() + ' to NaN');
                    }
                    if (continuous) {
                        variable.setValueSmooth(value);
                    } else {
                        variable.setValue(value);
                    }
                };
                VarsList.prototype.getTime = function () {
                    if (this.timeIdx_ < 0) {
                        throw new Error('no time variable');
                    }
                    return this.getValue(this.timeIdx_);
                };
                VarsList.prototype.timeIndex = function () {
                    return this.timeIdx_;
                };
                VarsList.prototype.checkIndex_ = function (index) {
                    if (index < 0 || index >= this.varList_.length) {
                        throw new Error('bad variable index=' + index + '; numVars=' + this.varList_.length);
                    }
                };
                return VarsList;
            }(AbstractSubject_1.default);
            VarsList.DELETED = 'DELETED';
            VarsList.TIME = 'TIME';
            VarsList.VARS_MODIFIED = 'VARS_MODIFIED';
            exports_1("VarsList", VarsList);
            exports_1("default", VarsList);
        }
    };
});
System.register("davinci-newton/engine/RigidBodySim.js", ["../util/AbstractSubject", "../util/contains", "../model/EnergyInfo", "../util/remove", "../core/SimList", "../core/VarsList"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, contains_1, EnergyInfo_1, remove_1, SimList_1, VarsList_1, var_names, i18n_names, NUM_VARS_IN_STATE, RigidBodySim;
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
        }],
        execute: function () {
            var_names = ['time', 'kinetic enetry', 'potential energy', 'total energy'];
            i18n_names = ['time', 'kinetic enetry', 'potential energy', 'total energy'];
            NUM_VARS_IN_STATE = 8;
            RigidBodySim = function (_super) {
                __extends(RigidBodySim, _super);
                function RigidBodySim(name) {
                    if (name === void 0) {
                        name = 'SIM';
                    }
                    var _this = _super.call(this, name) || this;
                    _this.simList_ = new SimList_1.default();
                    _this.bods_ = [];
                    _this.forceLaws_ = [];
                    _this.varsList_ = new VarsList_1.default(var_names, i18n_names, _this.getName() + '_VARS');
                    return _this;
                }
                RigidBodySim.prototype.addBody = function (body) {
                    if (!contains_1.default(this.bods_, body)) {
                        var names = [];
                        for (var k = 0; k < NUM_VARS_IN_STATE; k++) {
                            names.push(body.getVarName(k, false));
                        }
                        var localNames = [];
                        for (var k = 0; k < NUM_VARS_IN_STATE; k++) {
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
                        this.varsList_.deleteVariables(body.getVarsIndex(), NUM_VARS_IN_STATE);
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
                        if (idx < 0) {
                            return;
                        }
                        var x = vars[idx + RigidBodySim.X_];
                        var y = vars[idx + RigidBodySim.Y_];
                        var z = vars[idx + RigidBodySim.Z_];
                        b.setPosition(x, y, z);
                        b.setAttitude(vars[idx + RigidBodySim.W_]);
                        var vx = vars[idx + RigidBodySim.VX_];
                        var vy = vars[idx + RigidBodySim.VY_];
                        var vz = vars[idx + RigidBodySim.VZ_];
                        b.setVelocity(vx, vy, vz);
                        b.setAngularVelocity(vars[idx + RigidBodySim.VW_]);
                    });
                };
                RigidBodySim.prototype.evaluate = function (vars, change, time) {
                    var _this = this;
                    this.moveObjects(vars);
                    this.bods_.forEach(function (body) {
                        var idx = body.getVarsIndex();
                        if (idx < 0) {
                            return;
                        }
                        var mass = body.getMass();
                        if (mass === Number.POSITIVE_INFINITY) {
                            for (var k = 0; k < NUM_VARS_IN_STATE; k++) change[idx + k] = 0;
                        } else {
                            change[idx + RigidBodySim.X_] = vars[idx + RigidBodySim.VX_];
                            change[idx + RigidBodySim.Y_] = vars[idx + RigidBodySim.VY_];
                            change[idx + RigidBodySim.Z_] = vars[idx + RigidBodySim.VZ_];
                            change[idx + RigidBodySim.W_] = vars[idx + RigidBodySim.VW_];
                            change[idx + RigidBodySim.VX_] = 0;
                            change[idx + RigidBodySim.VY_] = 0;
                            change[idx + RigidBodySim.VZ_] = 0;
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
                    change[idx + RigidBodySim.VX_] += forceDir.x / mass;
                    change[idx + RigidBodySim.VY_] += forceDir.y / mass;
                    change[idx + RigidBodySim.VZ_] += forceDir.z / mass;
                    var position = body.getPosition();
                    var rx = forceLoc.x - position.x;
                    var ry = forceLoc.y - position.y;
                    change[idx + RigidBodySim.VW_] += (rx * forceDir.y - ry * forceDir.x) / body.momentAboutCM();
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
                        var position = body.getPosition();
                        va.setValue(RigidBodySim.X_ + idx, position.x);
                        va.setValue(RigidBodySim.Y_ + idx, position.y);
                        va.setValue(RigidBodySim.Z_ + idx, position.z);
                        va.setValue(RigidBodySim.W_ + idx, body.getAttitude());
                        var velocity = body.getVelocity();
                        va.setValue(RigidBodySim.VX_ + idx, velocity.x);
                        va.setValue(RigidBodySim.VY_ + idx, velocity.y);
                        va.setValue(RigidBodySim.VZ_ + idx, velocity.z);
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
            RigidBodySim.Y_ = 1;
            RigidBodySim.Z_ = 2;
            RigidBodySim.VX_ = 3;
            RigidBodySim.VY_ = 4;
            RigidBodySim.VZ_ = 5;
            RigidBodySim.W_ = 6;
            RigidBodySim.VW_ = 7;
            exports_1("default", RigidBodySim);
        }
    };
});
System.register("davinci-newton/util/zeroArray.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function zeroArray(xs) {
        var length = xs.length;
        for (var i = 0; i < length; i++) {
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
                        throw new Error("error during advance " + err);
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
                    this.doBroadcast_ = true;
                    this.observers_ = [];
                    if (!name) {
                        throw new Error('no name');
                    }
                    this.name_ = validName_1.default(toName_1.default(name));
                }
                AbstractSubject.prototype.getName = function () {
                    return this.name_;
                };
                AbstractSubject.prototype.broadcast = function (event) {
                    if (this.doBroadcast_) {
                        var len = this.observers_.length;
                        for (var i = 0; i < len; i++) {
                            this.observers_[i].observe(event);
                        }
                    }
                };
                return AbstractSubject;
            }();
            exports_1("AbstractSubject", AbstractSubject);
            exports_1("default", AbstractSubject);
        }
    };
});
System.register("davinci-newton/util/GenericEvent.js", ["./toName", "./validName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var toName_1, validName_1, GenericEvent;
    return {
        setters: [function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            GenericEvent = function () {
                function GenericEvent(subject_, name, value_) {
                    this.subject_ = subject_;
                    this.value_ = value_;
                    this.name_ = validName_1.default(toName_1.default(name));
                }
                GenericEvent.prototype.getName = function (localized) {
                    return this.name_;
                };
                GenericEvent.prototype.getSubject = function () {
                    return this.subject_;
                };
                return GenericEvent;
            }();
            exports_1("GenericEvent", GenericEvent);
            exports_1("default", GenericEvent);
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
System.register("davinci-newton/runner/Clock.js", ["../util/AbstractSubject", "../util/GenericEvent", "../util/getSystemTime"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, GenericEvent_1, getSystemTime_1, Clock;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
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
                    _this.saveRealTime_secs_ = 0;
                    _this.stepMode_ = false;
                    _this.tasks_ = [];
                    _this.timeRate_ = 1;
                    _this.realStart_sys_secs_ = _this.clockStart_sys_secs_;
                    return _this;
                }
                Clock.prototype.clearStepMode = function () {
                    this.stepMode_ = false;
                };
                Clock.prototype.getTime = function () {
                    if (this.isRunning_) {
                        return (getSystemTime_1.default() - this.clockStart_sys_secs_) * this.timeRate_;
                    } else {
                        return this.saveTime_secs_;
                    }
                };
                Clock.prototype.resume = function () {
                    this.clearStepMode();
                    if (!this.isRunning_) {
                        this.isRunning_ = true;
                        this.setTimePrivate(this.saveTime_secs_);
                        this.setRealTime(this.saveRealTime_secs_);
                        this.broadcast(new GenericEvent_1.default(this, Clock.CLOCK_RESUME));
                    }
                };
                Clock.prototype.setTime = function (time_secs) {
                    this.setTimePrivate(time_secs);
                    this.broadcast(new GenericEvent_1.default(this, Clock.CLOCK_SET_TIME));
                };
                Clock.prototype.setTimePrivate = function (time_secs) {
                    if (this.isRunning_) {
                        this.clockStart_sys_secs_ = getSystemTime_1.default() - time_secs / this.timeRate_;
                        this.scheduleAllClockTasks();
                    } else {
                        this.saveTime_secs_ = time_secs;
                    }
                };
                Clock.prototype.scheduleAllClockTasks = function () {
                    var _this = this;
                    this.tasks_.forEach(function (task) {
                        _this.scheduleTask(task);
                    });
                };
                Clock.prototype.scheduleTask = function (task) {
                    task.cancel();
                    if (this.isRunning_) {
                        var nowTime = this.clockToSystem(this.getTime());
                        var taskTime = this.clockToSystem(task.getTime());
                        if (taskTime >= nowTime) {
                            task.schedule(taskTime - nowTime);
                        }
                    }
                };
                Clock.prototype.setRealTime = function (time_secs) {
                    if (this.isRunning_) {
                        this.realStart_sys_secs_ = getSystemTime_1.default() - time_secs / this.timeRate_;
                    } else {
                        this.saveRealTime_secs_ = time_secs;
                    }
                };
                Clock.prototype.clockToSystem = function (clockTime) {
                    return clockTime / this.timeRate_ + this.clockStart_sys_secs_;
                };
                return Clock;
            }(AbstractSubject_1.default);
            Clock.CLOCK_RESUME = 'CLOCK_RESUME';
            Clock.CLOCK_SET_TIME = 'CLOCK_SET_TIME';
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
                SimRunner.prototype.getClock = function () {
                    return this.clock_;
                };
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
                SimRunner.prototype.memorize = function () {};
                return SimRunner;
            }();
            exports_1("SimRunner", SimRunner);
            exports_1("default", SimRunner);
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
System.register("davinci-newton/objects/AbstractSimObject.js", ["../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var toName_1, validName_1, AbstractSimObject;
    return {
        setters: [function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            AbstractSimObject = function () {
                function AbstractSimObject(name) {
                    this.expireTime_ = Number.POSITIVE_INFINITY;
                    this.name_ = validName_1.default(toName_1.default(name || "SIM_OBJ" + AbstractSimObject.ID++));
                }
                AbstractSimObject.prototype.getExpireTime = function () {
                    return this.expireTime_;
                };
                AbstractSimObject.prototype.getName = function () {
                    return this.name_;
                };
                return AbstractSimObject;
            }();
            AbstractSimObject.ID = 1;
            exports_1("AbstractSimObject", AbstractSimObject);
            exports_1("default", AbstractSimObject);
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
            exports_1("CoordType", CoordType);
            exports_1("default", CoordType);
        }
    };
});
System.register("davinci-newton/model/Force.js", ["../objects/AbstractSimObject", "./CoordType"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, CoordType_1, Force;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }],
        execute: function () {
            Force = function (_super) {
                __extends(Force, _super);
                function Force(name, body_, location_, locationCoordType_, direction_, directionCoordType_, torque_) {
                    if (torque_ === void 0) {
                        torque_ = 0;
                    }
                    var _this = _super.call(this, name) || this;
                    _this.body_ = body_;
                    _this.location_ = location_;
                    _this.locationCoordType_ = locationCoordType_;
                    _this.direction_ = direction_;
                    _this.directionCoordType_ = directionCoordType_;
                    _this.torque_ = torque_;
                    return _this;
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
                Force.prototype.getEndPoint = function () {
                    return this.getStartPoint().add(this.getVector());
                };
                Force.prototype.getTorque = function () {
                    return this.torque_;
                };
                Force.prototype.setExpireTime = function (time) {
                    throw new Error("TODO");
                };
                return Force;
            }(AbstractSimObject_1.default);
            exports_1("Force", Force);
            exports_1("default", Force);
        }
    };
});
System.register("davinci-newton/objects/Spring.js", ["./AbstractSimObject", "../model/CoordType", "../model/Force", "../math/Vector"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, CoordType_1, Force_1, Vector_1, Spring;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (Force_1_1) {
            Force_1 = Force_1_1;
        }, function (Vector_1_1) {
            Vector_1 = Vector_1_1;
        }],
        execute: function () {
            Spring = function (_super) {
                __extends(Spring, _super);
                function Spring(name, body1_, body2_) {
                    var _this = _super.call(this, name) || this;
                    _this.body1_ = body1_;
                    _this.body2_ = body2_;
                    _this.damping_ = 0;
                    _this.compressOnly_ = false;
                    _this.restLength_ = 1;
                    _this.stiffness_ = 1;
                    _this.attach1_ = Vector_1.default.ORIGIN;
                    _this.attach2_ = Vector_1.default.ORIGIN;
                    return _this;
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
                            var n = p2.subtract(p1).direction();
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
                    var len = v.magnitude();
                    var sf = -this.stiffness_ * (len - this.restLength_);
                    var fx = -sf * (v.x / len);
                    var fy = -sf * (v.y / len);
                    var fz = -sf * (v.z / len);
                    var f = new Vector_1.default(fx, fy, fz);
                    if (this.damping_ !== 0) {
                        if (!this.compressOnly_ || len < this.restLength_ - 1E-10) {
                            var v1 = this.body1_.worldVelocityOfBodyPoint(this.attach1_);
                            var v2 = this.body2_.worldVelocityOfBodyPoint(this.attach2_);
                            var df = v1.subtract(v2).multiply(-this.damping_);
                            f = f.add(df);
                        }
                    }
                    return [new Force_1.default('spring', this.body1_, point1, CoordType_1.default.WORLD, f, CoordType_1.default.WORLD), new Force_1.default('spring', this.body2_, point2, CoordType_1.default.WORLD, f.multiply(-1), CoordType_1.default.WORLD)];
                };
                Spring.prototype.disconnect = function () {};
                Spring.prototype.getPotentialEnergy = function () {
                    return 0;
                };
                Spring.prototype.getVector = function () {
                    return this.getEndPoint().subtract(this.getStartPoint());
                };
                return Spring;
            }(AbstractSimObject_1.default);
            exports_1("Spring", Spring);
            exports_1("default", Spring);
        }
    };
});
System.register("davinci-newton/util/veryDifferent.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function veryDifferent(arg1, arg2, epsilon, magnitude) {
        if (epsilon === void 0) {
            epsilon = 1E-14;
        }
        if (magnitude === void 0) {
            magnitude = 1;
        }
        if (epsilon <= 0) {
            throw new Error("epsilon (" + epsilon + ") must be positive.");
        }
        if (magnitude <= 0) {
            throw new Error("magnitude (" + magnitude + ") must be positive.");
        }
        var maxArg = Math.max(Math.abs(arg1), Math.abs(arg2));
        var max = maxArg > magnitude ? maxArg : magnitude;
        return Math.abs(arg1 - arg2) > max * epsilon;
    }
    exports_1("default", veryDifferent);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/Vector.js", ["../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var veryDifferent_1, Vector;
    return {
        setters: [function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            Vector = function () {
                function Vector(x_, y_, z_) {
                    this.x_ = x_;
                    this.y_ = y_;
                    this.z_ = z_;
                }
                Object.defineProperty(Vector.prototype, "x", {
                    get: function () {
                        return this.x_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector.prototype, "y", {
                    get: function () {
                        return this.y_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector.prototype, "z", {
                    get: function () {
                        return this.z_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vector.prototype.add = function (rhs) {
                    return new Vector(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
                };
                Vector.prototype.subtract = function (rhs) {
                    return new Vector(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
                };
                Vector.prototype.multiply = function (alpha) {
                    return new Vector(alpha * this.x, alpha * this.y, alpha * this.z);
                };
                Vector.prototype.distanceTo = function (rhs) {
                    var Δx = this.x - rhs.x;
                    var Δy = this.y - rhs.y;
                    var Δz = this.z - rhs.z;
                    return Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
                };
                Vector.prototype.immutable = function () {
                    return this;
                };
                Vector.prototype.magnitude = function () {
                    var x = this.x;
                    var y = this.y;
                    var z = this.z;
                    return Math.sqrt(x * x + y * y + z * z);
                };
                Vector.prototype.nearEqual = function (vector, tolerance) {
                    if (veryDifferent_1.default(this.x_, vector.x, tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.y_, vector.y, tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.z_, vector.z, tolerance)) {
                        return false;
                    }
                    return true;
                };
                Vector.prototype.direction = function () {
                    var magnitude = this.magnitude();
                    if (magnitude !== 1) {
                        if (magnitude === 0) {
                            throw new Error("direction is undefined.");
                        } else {
                            return this.multiply(1 / magnitude);
                        }
                    } else {
                        return this;
                    }
                };
                Vector.prototype.rotate = function (cosAngle, sinAngle) {
                    throw new Error("TODO: rotate");
                };
                Vector.fromVector = function (v) {
                    return new Vector(v.x, v.y, v.z);
                };
                return Vector;
            }();
            Vector.ORIGIN = new Vector(0, 0, 0);
            exports_1("Vector", Vector);
            exports_1("default", Vector);
        }
    };
});
System.register("davinci-newton.js", ["./davinci-newton/config", "./davinci-newton/engine/RigidBody", "./davinci-newton/engine/RigidBodySim", "./davinci-newton/model/RungeKutta", "./davinci-newton/strategy/SimpleAdvance", "./davinci-newton/runner/SimRunner", "./davinci-newton/objects/Spring", "./davinci-newton/math/Vector"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var config_1, RigidBody_1, RigidBodySim_1, RungeKutta_1, SimpleAdvance_1, SimRunner_1, Spring_1, Vector_1, newton;
    return {
        setters: [function (config_1_1) {
            config_1 = config_1_1;
        }, function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
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
        }, function (Vector_1_1) {
            Vector_1 = Vector_1_1;
        }],
        execute: function () {
            newton = {
                get LAST_MODIFIED() {
                    return config_1.default.LAST_MODIFIED;
                },
                get VERSION() {
                    return config_1.default.VERSION;
                },
                get RigidBody() {
                    return RigidBody_1.default;
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
                },
                get Vector() {
                    return Vector_1.default;
                }
            };
            exports_1("default", newton);
        }
    };
});
//# sourceMappingURL=davinci-newton-system-es5.js.map