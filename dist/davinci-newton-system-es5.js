System.register("davinci-newton/solvers/AdaptiveStepSolver.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AdaptiveStepSolver;
    return {
        setters: [],
        execute: function () {
            AdaptiveStepSolver = function () {
                function AdaptiveStepSolver(diffEq, energySystem, diffEqSolver) {
                    this.stepUBound = 1;
                    this.stepLBound = 1E-5;
                    this.diffEq_ = diffEq;
                    this.energySystem_ = energySystem;
                    this.odeSolver_ = diffEqSolver;
                    this.totSteps_ = 0;
                    this.secondDiff_ = true;
                    this.tolerance_ = 1E-6;
                }
                AdaptiveStepSolver.prototype.step = function (stepSize) {
                    this.savedState = this.diffEq_.getState();
                    var startTime = this.diffEq_.time;
                    var d_t = stepSize;
                    var steps = 0;
                    this.diffEq_.epilog();
                    var startEnergy = this.energySystem_.totalEnergy();
                    var lastEnergyDiff = Number.POSITIVE_INFINITY;
                    var value = Number.POSITIVE_INFINITY;
                    var firstTime = true;
                    if (stepSize < this.stepLBound) {
                        return;
                    }
                    do {
                        var t = startTime;
                        if (!firstTime) {
                            this.diffEq_.setState(this.savedState);
                            this.diffEq_.epilog();
                            d_t = d_t / 5;
                            if (d_t < this.stepLBound) {
                                throw new Error("time step " + d_t + " too small. startEnergy => " + startEnergy + " lastEnergyDiff => " + lastEnergyDiff);
                            }
                        }
                        steps = 0;
                        while (t < startTime + stepSize) {
                            var h = d_t;
                            if (t + h > startTime + stepSize - 1E-10) {
                                h = startTime + stepSize - t;
                            }
                            steps++;
                            this.odeSolver_.step(h);
                            this.diffEq_.epilog();
                            t += h;
                        }
                        var finishEnergy = this.energySystem_.totalEnergy();
                        var energyDiff = Math.abs(startEnergy - finishEnergy);
                        if (this.secondDiff_) {
                            if (!firstTime) {
                                value = Math.abs(energyDiff - lastEnergyDiff);
                            }
                        } else {
                            value = energyDiff;
                        }
                        lastEnergyDiff = energyDiff;
                        firstTime = false;
                    } while (value > this.tolerance_);
                    this.totSteps_ += steps;
                };
                Object.defineProperty(AdaptiveStepSolver.prototype, "secondDiff", {
                    get: function () {
                        return this.secondDiff_;
                    },
                    set: function (value) {
                        this.secondDiff_ = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AdaptiveStepSolver.prototype, "tolerance", {
                    get: function () {
                        return this.tolerance_;
                    },
                    set: function (value) {
                        this.tolerance_ = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return AdaptiveStepSolver;
            }();
            exports_1("AdaptiveStepSolver", AdaptiveStepSolver);
            exports_1("default", AdaptiveStepSolver);
        }
    };
});
System.register("davinci-newton/engine3D/Block3.js", ["../math/Matrix3", "./RigidBody3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var Matrix3_1, RigidBody3_1, Block3;
    return {
        setters: [function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (RigidBody3_1_1) {
            RigidBody3_1 = RigidBody3_1_1;
        }],
        execute: function () {
            Block3 = function (_super) {
                __extends(Block3, _super);
                function Block3(width, height, depth) {
                    if (width === void 0) {
                        width = 1;
                    }
                    if (height === void 0) {
                        height = 1;
                    }
                    if (depth === void 0) {
                        depth = 1;
                    }
                    var _this = _super.call(this) || this;
                    _this.width_ = 1;
                    _this.height_ = 1;
                    _this.depth_ = 1;
                    _this.width_ = width;
                    _this.height_ = height;
                    _this.depth_ = depth;
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Block3.prototype, "width", {
                    get: function () {
                        return this.width_;
                    },
                    set: function (width) {
                        if (this.width !== width) {
                            this.width_ = width;
                            this.updateInertiaTensor();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Block3.prototype, "height", {
                    get: function () {
                        return this.height_;
                    },
                    set: function (height) {
                        if (this.height !== height) {
                            this.height_ = height;
                            this.updateInertiaTensor();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Block3.prototype, "depth", {
                    get: function () {
                        return this.depth_;
                    },
                    set: function (depth) {
                        if (this.depth !== depth) {
                            this.depth_ = depth;
                            this.updateInertiaTensor();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Block3.prototype.updateInertiaTensor = function () {
                    var x = this.width_;
                    var y = this.height_;
                    var z = this.depth_;
                    var xx = x * x;
                    var yy = y * y;
                    var zz = z * z;
                    var s = this.M / 12;
                    var I = Matrix3_1.default.zero();
                    I.setElement(0, 0, s * (yy + zz));
                    I.setElement(1, 1, s * (zz + xx));
                    I.setElement(2, 2, s * (xx + yy));
                    this.I = I;
                };
                return Block3;
            }(RigidBody3_1.default);
            exports_1("Block3", Block3);
            exports_1("default", Block3);
        }
    };
});
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
                    this.LAST_MODIFIED = '2017-01-28';
                    this.NAMESPACE = 'NEWTON';
                    this.VERSION = '0.0.19';
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
System.register("davinci-newton/engine3D/ConstantForceLaw3.js", ["../objects/AbstractSimObject", "../model/CoordType", "./Force3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, CoordType_1, Force3_1, ConstantForceLaw3;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (Force3_1_1) {
            Force3_1 = Force3_1_1;
        }],
        execute: function () {
            ConstantForceLaw3 = function (_super) {
                __extends(ConstantForceLaw3, _super);
                function ConstantForceLaw3(body_, vector, vectorCoordType) {
                    if (vectorCoordType === void 0) {
                        vectorCoordType = CoordType_1.default.WORLD;
                    }
                    var _this = _super.call(this) || this;
                    _this.body_ = body_;
                    _this.forces = [];
                    _this.force_ = new Force3_1.default(_this.body_);
                    _this.force_.locationCoordType = CoordType_1.default.BODY;
                    _this.force_.vector.copy(vector);
                    _this.force_.vectorCoordType = vectorCoordType;
                    _this.forces = [_this.force_];
                    return _this;
                }
                Object.defineProperty(ConstantForceLaw3.prototype, "location", {
                    get: function () {
                        return this.force_.location;
                    },
                    set: function (location) {
                        this.force_.location.copy(location);
                    },
                    enumerable: true,
                    configurable: true
                });
                ConstantForceLaw3.prototype.updateForces = function () {
                    return this.forces;
                };
                ConstantForceLaw3.prototype.disconnect = function () {};
                ConstantForceLaw3.prototype.potentialEnergy = function () {
                    return 0;
                };
                return ConstantForceLaw3;
            }(AbstractSimObject_1.default);
            exports_1("ConstantForceLaw3", ConstantForceLaw3);
            exports_1("default", ConstantForceLaw3);
        }
    };
});
System.register("davinci-newton/engine3D/Cylinder3.js", ["../math/Matrix3", "./RigidBody3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var Matrix3_1, RigidBody3_1, Cylinder3;
    return {
        setters: [function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (RigidBody3_1_1) {
            RigidBody3_1 = RigidBody3_1_1;
        }],
        execute: function () {
            Cylinder3 = function (_super) {
                __extends(Cylinder3, _super);
                function Cylinder3(radius, height) {
                    if (radius === void 0) {
                        radius = 1;
                    }
                    if (height === void 0) {
                        height = 1;
                    }
                    var _this = _super.call(this) || this;
                    _this.radius_ = 1;
                    _this.height_ = 1;
                    _this.radius_ = radius;
                    _this.height_ = height;
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Cylinder3.prototype, "radius", {
                    get: function () {
                        return this.radius_;
                    },
                    set: function (radius) {
                        if (this.radius !== radius) {
                            this.radius_ = radius;
                            this.updateInertiaTensor();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Cylinder3.prototype, "height", {
                    get: function () {
                        return this.height_;
                    },
                    set: function (height) {
                        if (this.height !== height) {
                            this.height_ = height;
                            this.updateInertiaTensor();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Cylinder3.prototype.updateInertiaTensor = function () {
                    var r = this.radius_;
                    var h = this.height_;
                    var rr = r * r;
                    var hh = h * h;
                    var Irr = this.M * (3 * rr + hh) / 12;
                    var Ihh = this.M * rr / 2;
                    var I = Matrix3_1.default.zero();
                    I.setElement(0, 0, Irr);
                    I.setElement(1, 1, Ihh);
                    I.setElement(2, 2, Irr);
                    this.I = I;
                };
                return Cylinder3;
            }(RigidBody3_1.default);
            exports_1("Cylinder3", Cylinder3);
            exports_1("default", Cylinder3);
        }
    };
});
System.register("davinci-newton/strategy/DefaultAdvanceStrategy.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var DefaultAdvanceStrategy;
    return {
        setters: [],
        execute: function () {
            DefaultAdvanceStrategy = function () {
                function DefaultAdvanceStrategy(sim_, odeSolver_) {
                    this.sim_ = sim_;
                    this.odeSolver_ = odeSolver_;
                    this.timeStep_ = 0.025;
                }
                DefaultAdvanceStrategy.prototype.advance = function (timeStep, memoList) {
                    this.sim_.prolog();
                    this.odeSolver_.step(timeStep);
                    this.sim_.epilog();
                    if (memoList !== undefined) {
                        memoList.memorize();
                    }
                };
                DefaultAdvanceStrategy.prototype.getTime = function () {
                    return this.sim_.time;
                };
                DefaultAdvanceStrategy.prototype.getTimeStep = function () {
                    return this.timeStep_;
                };
                return DefaultAdvanceStrategy;
            }();
            exports_1("DefaultAdvanceStrategy", DefaultAdvanceStrategy);
            exports_1("default", DefaultAdvanceStrategy);
        }
    };
});
System.register("davinci-newton/solvers/EulerMethod.js", ["../util/zeroArray"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var zeroArray_1, EulerMethod;
    return {
        setters: [function (zeroArray_1_1) {
            zeroArray_1 = zeroArray_1_1;
        }],
        execute: function () {
            EulerMethod = function () {
                function EulerMethod(sim_) {
                    this.sim_ = sim_;
                    this.inp_ = [];
                    this.k1_ = [];
                }
                EulerMethod.prototype.step = function (stepSize) {
                    var vars = this.sim_.getState();
                    var N = vars.length;
                    if (this.inp_.length !== N) {
                        this.inp_ = new Array(N);
                        this.k1_ = new Array(N);
                    }
                    var inp = this.inp_;
                    var k1 = this.k1_;
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i];
                    }
                    zeroArray_1.default(k1);
                    this.sim_.evaluate(inp, k1, 0);
                    for (var i = 0; i < N; i++) {
                        vars[i] += k1[i] * stepSize;
                    }
                    this.sim_.setState(vars);
                };
                return EulerMethod;
            }();
            exports_1("EulerMethod", EulerMethod);
            exports_1("default", EulerMethod);
        }
    };
});
System.register("davinci-newton/graph/AxisChoice.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AxisChoice;
    return {
        setters: [],
        execute: function () {
            (function (AxisChoice) {
                AxisChoice[AxisChoice["HORIZONTAL"] = 1] = "HORIZONTAL";
                AxisChoice[AxisChoice["VERTICAL"] = 2] = "VERTICAL";
                AxisChoice[AxisChoice["BOTH"] = 3] = "BOTH";
            })(AxisChoice || (AxisChoice = {}));
            exports_1("AxisChoice", AxisChoice);
            exports_1("default", AxisChoice);
        }
    };
});
System.register("davinci-newton/graph/AutoScale.js", ["../util/AbstractSubject", "./AxisChoice", "../util/contains", "../view/DoubleRect", "../util/GenericEvent", "./GraphLine", "../util/removeAt", "../util/ParameterNumber", "../util/repeat", "../view/SimView", "../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, AxisChoice_1, contains_1, DoubleRect_1, GenericEvent_1, GraphLine_1, removeAt_1, ParameterNumber_1, repeat_1, SimView_1, veryDifferent_1, AutoScale;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (AxisChoice_1_1) {
            AxisChoice_1 = AxisChoice_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
        }, function (removeAt_1_1) {
            removeAt_1 = removeAt_1_1;
        }, function (ParameterNumber_1_1) {
            ParameterNumber_1 = ParameterNumber_1_1;
        }, function (repeat_1_1) {
            repeat_1 = repeat_1_1;
        }, function (SimView_1_1) {
            SimView_1 = SimView_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            AutoScale = function (_super) {
                __extends(AutoScale, _super);
                function AutoScale(simView) {
                    var _this = _super.call(this) || this;
                    _this.graphLines_ = [];
                    _this.enabled_ = true;
                    _this.isActive_ = true;
                    _this.ownEvent_ = false;
                    _this.rangeSetX_ = false;
                    _this.rangeSetY_ = false;
                    _this.rangeXHi_ = 0;
                    _this.rangeXLo_ = 0;
                    _this.rangeYHi_ = 0;
                    _this.rangeYLo_ = 0;
                    _this.timeWindow_ = 10;
                    _this.extraMargin = 0.01;
                    _this.minSize = 1E-14;
                    _this.axisChoice_ = AxisChoice_1.default.BOTH;
                    _this.simView_ = simView;
                    simView.addMemo(_this);
                    simView.addObserver(_this);
                    _this.lastIndex_ = repeat_1.default(-1, _this.graphLines_.length);
                    _this.addParameter(new ParameterNumber_1.default(_this, AutoScale.TIME_WINDOW, function () {
                        return _this.timeWindow;
                    }, function (timeWindow) {
                        return _this.timeWindow = timeWindow;
                    }).setSignifDigits(3));
                    var choiceNames = ['VERTICAL', 'HORIZONTAL', 'BOTH'];
                    var choices = [AxisChoice_1.default.VERTICAL, AxisChoice_1.default.HORIZONTAL, AxisChoice_1.default.BOTH];
                    _this.addParameter(new ParameterNumber_1.default(_this, AutoScale.AXIS, function () {
                        return _this.axisChoice;
                    }, function (axisChoice) {
                        return _this.axisChoice = axisChoice;
                    }, choiceNames, choices));
                    _this.setComputed(_this.isActive_);
                    return _this;
                }
                AutoScale.prototype.addGraphLine = function (graphLine) {
                    if (GraphLine_1.default.isDuckType(graphLine)) {
                        if (!contains_1.default(this.graphLines_, graphLine)) {
                            this.graphLines_.push(graphLine);
                            graphLine.addObserver(this);
                            this.lastIndex_.push(-1);
                        }
                    } else {
                        throw new Error('not a GraphLine ' + graphLine);
                    }
                };
                AutoScale.prototype.clearRange = function () {
                    this.rangeXLo_ = 0;
                    this.rangeXHi_ = 0;
                    this.rangeSetX_ = false;
                    this.rangeYLo_ = 0;
                    this.rangeYHi_ = 0;
                    this.rangeSetY_ = false;
                };
                Object.defineProperty(AutoScale.prototype, "active", {
                    get: function () {
                        return this.isActive_;
                    },
                    set: function (value) {
                        if (this.isActive_ !== value) {
                            if (value) {
                                if (this.enabled_) {
                                    this.reset();
                                    this.simView_.addMemo(this);
                                    this.setComputed(true);
                                    this.isActive_ = true;
                                    this.broadcast(new GenericEvent_1.default(this, AutoScale.ACTIVE, this.isActive_));
                                }
                            } else {
                                this.simView_.removeMemo(this);
                                this.setComputed(false);
                                this.isActive_ = false;
                                this.broadcast(new GenericEvent_1.default(this, AutoScale.ACTIVE, this.isActive_));
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AutoScale.prototype, "axisChoice", {
                    get: function () {
                        return this.axisChoice_;
                    },
                    set: function (value) {
                        if (value === AxisChoice_1.default.VERTICAL || value === AxisChoice_1.default.HORIZONTAL || value === AxisChoice_1.default.BOTH) {
                            this.axisChoice_ = value;
                            this.broadcastParameter(AutoScale.AXIS);
                        } else {
                            throw new Error('unknown ' + value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AutoScale.prototype, "enabled", {
                    get: function () {
                        return this.enabled_;
                    },
                    set: function (enabled) {
                        if (this.enabled_ !== enabled) {
                            this.enabled_ = enabled;
                            this.active = enabled;
                            this.broadcast(new GenericEvent_1.default(this, AutoScale.ENABLED, this.enabled_));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                AutoScale.prototype.getRangeRect = function () {
                    return new DoubleRect_1.default(this.rangeXLo_, this.rangeYLo_, this.rangeXHi_, this.rangeYHi_);
                };
                Object.defineProperty(AutoScale.prototype, "timeWindow", {
                    get: function () {
                        return this.timeWindow_;
                    },
                    set: function (timeWindow) {
                        if (veryDifferent_1.default(timeWindow, this.timeWindow_)) {
                            this.timeWindow_ = timeWindow;
                            this.reset();
                            this.active = true;
                            this.broadcastParameter(AutoScale.TIME_WINDOW);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                AutoScale.prototype.memorize = function () {
                    for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                        var graphPts = this.graphLines_[i].getGraphPoints();
                        if (this.lastIndex_[i] > graphPts.getEndIndex()) {
                            this.reset();
                        }
                    }
                    for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                        var graphPts = this.graphLines_[i].getGraphPoints();
                        var iter = graphPts.getIterator(this.lastIndex_[i]);
                        while (iter.hasNext()) {
                            var gp = iter.nextValue();
                            this.updateRange_(this.graphLines_[i], gp.x, gp.y);
                            this.lastIndex_[i] = iter.getIndex();
                        }
                    }
                    this.rangeCheck_();
                };
                AutoScale.prototype.observe = function (event) {
                    if (event.getSubject() === this.simView_) {
                        if (event.nameEquals(SimView_1.default.SIM_RECT_CHANGED)) {
                            if (!this.ownEvent_) {
                                this.active = false;
                            }
                        }
                    } else if (contains_1.default(this.graphLines_, event.getSubject())) {
                        if (event.nameEquals(GraphLine_1.default.PARAM_NAME_X_VARIABLE) || event.nameEquals(GraphLine_1.default.PARAM_NAME_Y_VARIABLE)) {
                            this.reset();
                        } else if (event.nameEquals(GraphLine_1.default.RESET)) {
                            this.active = true;
                        }
                    }
                };
                AutoScale.prototype.rangeCheck_ = function () {
                    var e = this.minSize;
                    if (this.rangeXHi_ - this.rangeXLo_ < e) {
                        var avg = (this.rangeXHi_ + this.rangeXLo_) / 2;
                        var incr = Math.max(avg * e, e);
                        this.rangeXHi_ = avg + incr;
                        this.rangeXLo_ = avg - incr;
                    }
                    if (this.rangeYHi_ - this.rangeYLo_ < e) {
                        var avg = (this.rangeYHi_ + this.rangeYLo_) / 2;
                        var incr = Math.max(avg * e, e);
                        this.rangeYHi_ = avg + incr;
                        this.rangeYLo_ = avg - incr;
                    }
                    var nr = this.getRangeRect();
                    var sr = this.simView_.getSimRect();
                    if (this.axisChoice_ === AxisChoice_1.default.VERTICAL) {
                        nr = new DoubleRect_1.default(sr.getLeft(), nr.getBottom(), sr.getRight(), nr.getTop());
                    } else if (this.axisChoice_ === AxisChoice_1.default.HORIZONTAL) {
                        nr = new DoubleRect_1.default(nr.getLeft(), sr.getBottom(), nr.getRight(), sr.getTop());
                    }
                    if (this.isActive_ && !nr.nearEqual(sr)) {
                        this.ownEvent_ = true;
                        this.simView_.setSimRect(nr);
                        this.ownEvent_ = false;
                        this.broadcast(new GenericEvent_1.default(this, AutoScale.AUTO_SCALE, nr));
                    }
                };
                AutoScale.prototype.removeGraphLine = function (graphLine) {
                    if (GraphLine_1.default.isDuckType(graphLine)) {
                        var idx = this.graphLines_.indexOf(graphLine);
                        removeAt_1.default(this.graphLines_, idx);
                        removeAt_1.default(this.lastIndex_, idx);
                        this.reset();
                    } else {
                        throw new Error('not a GraphLine ' + graphLine);
                    }
                };
                AutoScale.prototype.reset = function () {
                    this.clearRange();
                    for (var i = 0, n = this.lastIndex_.length; i < n; i++) {
                        this.lastIndex_[i] = -1;
                    }
                };
                AutoScale.prototype.setComputed = function (value) {
                    var _this = this;
                    var names = [SimView_1.default.PARAM_NAME_WIDTH, SimView_1.default.PARAM_NAME_HEIGHT, SimView_1.default.PARAM_NAME_CENTER_X, SimView_1.default.PARAM_NAME_CENTER_Y];
                    names.forEach(function (name) {
                        var p = _this.simView_.getParameter(name);
                        p.setComputed(value);
                    });
                };
                AutoScale.prototype.updateRange_ = function (line, nowX, nowY) {
                    if (!isFinite(nowX)) {
                        if (nowX === Number.POSITIVE_INFINITY) {
                            nowX = 1e308;
                        } else if (nowX === Number.NEGATIVE_INFINITY) {
                            nowX = -1e308;
                        }
                    }
                    if (!isFinite(nowY)) {
                        if (nowY === Number.POSITIVE_INFINITY) {
                            nowY = 1e308;
                        } else if (nowY === Number.NEGATIVE_INFINITY) {
                            nowY = -1e308;
                        }
                    }
                    var timeIdx = line.varsList.timeIndex();
                    var xIsTimeVar = line.hCoordIndex === timeIdx;
                    var yIsTimeVar = line.vCoordIndex === timeIdx;
                    if (!this.rangeSetX_) {
                        this.rangeXLo_ = nowX;
                        this.rangeXHi_ = nowX + (xIsTimeVar ? this.timeWindow_ : 0);
                        this.rangeSetX_ = true;
                    } else {
                        if (nowX < this.rangeXLo_) {
                            if (xIsTimeVar) {
                                this.rangeXLo_ = nowX;
                                this.rangeXHi_ = nowX + this.timeWindow_;
                            } else {
                                this.rangeXLo_ = nowX - this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                            }
                        }
                        if (xIsTimeVar) {
                            if (nowX > this.rangeXHi_ - this.extraMargin * this.timeWindow_) {
                                this.rangeXHi_ = nowX + this.extraMargin * this.timeWindow_;
                                this.rangeXLo_ = this.rangeXHi_ - this.timeWindow_;
                            }
                        } else {
                            if (nowX > this.rangeXHi_) {
                                this.rangeXHi_ = nowX + this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                            }
                        }
                    }
                    if (!this.rangeSetY_) {
                        this.rangeYLo_ = nowY;
                        this.rangeYHi_ = nowY + (yIsTimeVar ? this.timeWindow_ : 0);
                        this.rangeSetY_ = true;
                    } else {
                        if (nowY < this.rangeYLo_) {
                            if (yIsTimeVar) {
                                this.rangeYLo_ = nowY;
                                this.rangeYHi_ = nowY + this.timeWindow_;
                            } else {
                                this.rangeYLo_ = nowY - this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                            }
                        }
                        if (yIsTimeVar) {
                            if (nowY > this.rangeYHi_ - this.extraMargin * this.timeWindow_) {
                                this.rangeYHi_ = nowY + this.extraMargin * this.timeWindow_;
                                this.rangeYLo_ = this.rangeYHi_ - this.timeWindow_;
                            }
                        } else {
                            if (nowY > this.rangeYHi_) {
                                this.rangeYHi_ = nowY + this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                            }
                        }
                    }
                };
                return AutoScale;
            }(AbstractSubject_1.default);
            AutoScale.AXIS = 'AXIS';
            AutoScale.TIME_WINDOW = 'TIME_WINDOW';
            AutoScale.ACTIVE = 'ACTIVE';
            AutoScale.AUTO_SCALE = 'AUTO_SCALE';
            AutoScale.ENABLED = 'ENABLED';
            exports_1("default", AutoScale);
        }
    };
});
System.register("davinci-newton/graph/DisplayAxes.js", ["../view/AlignH", "../view/AlignV", "../view/DoubleRect", "../checks/isDefined"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AlignH_1, AlignV_1, DoubleRect_1, isDefined_1, DisplayAxes;
    return {
        setters: [function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }],
        execute: function () {
            DisplayAxes = function () {
                function DisplayAxes(simRect, font, color) {
                    if (simRect === void 0) {
                        simRect = DoubleRect_1.default.EMPTY_RECT;
                    }
                    if (font === void 0) {
                        font = '14pt sans-serif';
                    }
                    if (color === void 0) {
                        color = 'gray';
                    }
                    this.simRect_ = simRect;
                    this.numFont_ = font;
                    this.drawColor_ = color;
                    this.fontDescent = 8;
                    this.fontAscent = 12;
                    this.hAxisAlign_ = AlignV_1.default.BOTTOM;
                    this.vAxisAlign_ = AlignH_1.default.LEFT;
                    this.numDecimal_ = 0;
                    this.needRedraw_ = true;
                    this.hLabel_ = 'x';
                    this.vLabel_ = 'y';
                    this.zIndex_ = 100;
                }
                DisplayAxes.prototype.draw = function (context, map) {
                    context.save();
                    context.strokeStyle = this.drawColor_;
                    context.fillStyle = this.drawColor_;
                    context.font = this.numFont_;
                    context.textAlign = 'start';
                    context.textBaseline = 'alphabetic';
                    var x0, y0;
                    var r = this.simRect_;
                    var sim_x1 = r.getLeft();
                    var sim_x2 = r.getRight();
                    var sim_y1 = r.getBottom();
                    var sim_y2 = r.getTop();
                    switch (this.vAxisAlign_) {
                        case AlignH_1.default.RIGHT:
                            x0 = map.simToScreenX(sim_x2 - 0.05 * (sim_x2 - sim_x1));
                            break;
                        case AlignH_1.default.LEFT:
                            x0 = map.simToScreenX(sim_x1 + 0.05 * (sim_x2 - sim_x1));
                            break;
                        default:
                            x0 = map.simToScreenX(r.getCenterX());
                    }
                    switch (this.hAxisAlign_) {
                        case AlignV_1.default.TOP:
                            y0 = map.simToScreenY(sim_y2) + (10 + this.fontDescent + this.fontAscent);
                            break;
                        case AlignV_1.default.BOTTOM:
                            y0 = map.simToScreenY(sim_y1) - (10 + this.fontDescent + this.fontAscent);
                            break;
                        default:
                            y0 = map.simToScreenY(r.getCenterY());
                    }
                    context.beginPath();
                    context.moveTo(map.simToScreenX(sim_x1), y0);
                    context.lineTo(map.simToScreenX(sim_x2), y0);
                    context.stroke();
                    this.drawHorizTicks(y0, context, map, this.simRect_);
                    context.beginPath();
                    context.moveTo(x0, map.simToScreenY(sim_y1));
                    context.lineTo(x0, map.simToScreenY(sim_y2));
                    context.stroke();
                    this.drawVertTicks(x0, context, map, this.simRect_);
                    context.restore();
                    this.needRedraw_ = false;
                };
                DisplayAxes.prototype.drawHorizTicks = function (y0, context, map, r) {
                    var y1 = y0 - 4;
                    var y2 = y1 + 8;
                    var sim_x1 = r.getLeft();
                    var sim_x2 = r.getRight();
                    var graphDelta = this.getNiceIncrement(sim_x2 - sim_x1);
                    var x_sim = DisplayAxes.getNiceStart(sim_x1, graphDelta);
                    while (x_sim < sim_x2) {
                        var x_screen = map.simToScreenX(x_sim);
                        context.beginPath();
                        context.moveTo(x_screen, y1);
                        context.lineTo(x_screen, y2);
                        context.stroke();
                        var next_x_sim = x_sim + graphDelta;
                        if (next_x_sim > x_sim) {
                            var s = x_sim.toFixed(this.numDecimal_);
                            var textWidth = context.measureText(s).width;
                            context.fillText(s, x_screen - textWidth / 2, y2 + this.fontAscent);
                        } else {
                            context.fillText('scale is too small', x_screen, y2 + this.fontAscent);
                            break;
                        }
                        x_sim = next_x_sim;
                    }
                    var w = context.measureText(this.hLabel_).width;
                    context.fillText(this.hLabel_, map.simToScreenX(sim_x2) - w - 5, y0 - 8);
                };
                DisplayAxes.prototype.drawVertTicks = function (x0, context, map, r) {
                    var x1 = x0 - 4;
                    var x2 = x1 + 8;
                    var sim_y1 = r.getBottom();
                    var sim_y2 = r.getTop();
                    var graphDelta = this.getNiceIncrement(sim_y2 - sim_y1);
                    var y_sim = DisplayAxes.getNiceStart(sim_y1, graphDelta);
                    while (y_sim < sim_y2) {
                        var y_screen = map.simToScreenY(y_sim);
                        context.beginPath();
                        context.moveTo(x1, y_screen);
                        context.lineTo(x2, y_screen);
                        context.stroke();
                        var next_y_sim = y_sim + graphDelta;
                        if (next_y_sim > y_sim) {
                            var s = y_sim.toFixed(this.numDecimal_);
                            var textWidth = context.measureText(s).width;
                            if (this.vAxisAlign_ === AlignH_1.default.RIGHT) {
                                context.fillText(s, x2 - (textWidth + 10), y_screen + this.fontAscent / 2);
                            } else {
                                context.fillText(s, x2 + 5, y_screen + this.fontAscent / 2);
                            }
                        } else {
                            context.fillText('scale is too small', x2, y_screen);
                            break;
                        }
                        y_sim = next_y_sim;
                    }
                    var w = context.measureText(this.vLabel_).width;
                    if (this.vAxisAlign_ === AlignH_1.default.RIGHT) {
                        context.fillText(this.vLabel_, x0 - (w + 6), map.simToScreenY(sim_y2) + 13);
                    } else {
                        context.fillText(this.vLabel_, x0 + 6, map.simToScreenY(sim_y2) + 13);
                    }
                };
                Object.defineProperty(DisplayAxes.prototype, "color", {
                    get: function () {
                        return this.drawColor_;
                    },
                    set: function (color) {
                        this.drawColor_ = color;
                        this.needRedraw_ = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                DisplayAxes.prototype.getFont = function () {
                    return this.numFont_;
                };
                Object.defineProperty(DisplayAxes.prototype, "hAxisLabel", {
                    get: function () {
                        return this.hLabel_;
                    },
                    set: function (hAxisLabel) {
                        this.hLabel_ = hAxisLabel;
                        this.needRedraw_ = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                DisplayAxes.prototype.getNiceIncrement = function (range) {
                    var power = Math.pow(10, Math.floor(Math.log(range) / Math.LN10));
                    var logTot = range / power;
                    var incr;
                    if (logTot >= 8) incr = 2;else if (logTot >= 5) incr = 1;else if (logTot >= 3) incr = 0.5;else if (logTot >= 2) incr = 0.4;else incr = 0.2;
                    incr *= power;
                    var dlog = Math.log(incr) / Math.LN10;
                    this.numDecimal_ = dlog < 0 ? Math.ceil(-dlog) : 0;
                    return incr;
                };
                DisplayAxes.getNiceStart = function (start, incr) {
                    return Math.ceil(start / incr) * incr;
                };
                DisplayAxes.prototype.getSimRect = function () {
                    return this.simRect_;
                };
                Object.defineProperty(DisplayAxes.prototype, "vAxisLabel", {
                    get: function () {
                        return this.vLabel_;
                    },
                    set: function (vAxisLabel) {
                        this.vLabel_ = vAxisLabel;
                        this.needRedraw_ = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DisplayAxes.prototype, "hAxisAlign", {
                    get: function () {
                        return this.hAxisAlign_;
                    },
                    set: function (alignment) {
                        this.hAxisAlign_ = alignment;
                        this.needRedraw_ = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DisplayAxes.prototype, "vAxisAlign", {
                    get: function () {
                        return this.vAxisAlign_;
                    },
                    set: function (alignment) {
                        this.vAxisAlign_ = alignment;
                        this.needRedraw_ = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                DisplayAxes.prototype.getZIndex = function () {
                    return this.zIndex_;
                };
                DisplayAxes.prototype.isDragable = function () {
                    return false;
                };
                DisplayAxes.prototype.needsRedraw = function () {
                    return this.needRedraw_;
                };
                DisplayAxes.prototype.setDragable = function (dragable) {};
                DisplayAxes.prototype.setFont = function (font) {
                    this.numFont_ = font;
                    this.needRedraw_ = true;
                };
                DisplayAxes.prototype.setSimRect = function (simRect) {
                    this.simRect_ = simRect;
                    this.needRedraw_ = true;
                };
                DisplayAxes.prototype.setZIndex = function (zIndex) {
                    if (isDefined_1.default(zIndex)) {
                        this.zIndex_ = zIndex;
                    }
                };
                return DisplayAxes;
            }();
            exports_1("default", DisplayAxes);
        }
    };
});
System.register("davinci-newton/util/repeat.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function repeat(value, N) {
        var xs = [];
        for (var i = 0; i < N; i++) {
            xs[i] = value;
        }
        return xs;
    }
    exports_1("default", repeat);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/graph/DisplayGraph.js", ["../util/contains", "../view/DrawingMode", "./GraphLine", "../checks/isDefined", "../checks/mustBeNonNullObject", "../util/removeAt", "../util/repeat", "../view/ScreenRect"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var contains_1, DrawingMode_1, GraphLine_1, isDefined_1, mustBeNonNullObject_1, removeAt_1, repeat_1, ScreenRect_1, DisplayGraph;
    return {
        setters: [function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (DrawingMode_1_1) {
            DrawingMode_1 = DrawingMode_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
        }, function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }, function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }, function (removeAt_1_1) {
            removeAt_1 = removeAt_1_1;
        }, function (repeat_1_1) {
            repeat_1 = repeat_1_1;
        }, function (ScreenRect_1_1) {
            ScreenRect_1 = ScreenRect_1_1;
        }],
        execute: function () {
            DisplayGraph = function () {
                function DisplayGraph() {
                    this.graphLines_ = [];
                    this.memDraw_ = repeat_1.default(-1, this.graphLines_.length);
                    this.offScreen_ = null;
                    this.lastMap_ = null;
                    this.screenRect_ = ScreenRect_1.default.EMPTY_RECT;
                    this.needRedraw_ = false;
                    this.useBuffer_ = false;
                    this.zIndex = 0;
                }
                DisplayGraph.prototype.draw = function (context, map) {
                    if (this.screenRect_.isEmpty()) {
                        return;
                    }
                    var graphLines = this.graphLines_;
                    var N = graphLines.length;
                    context.save();
                    if (this.lastMap_ == null || this.lastMap_ !== map) {
                        this.lastMap_ = map;
                        this.needRedraw_ = true;
                    }
                    for (var i = 0; i < N; i++) {
                        if (this.memDraw_[i] > graphLines[i].getGraphPoints().getEndIndex()) {
                            this.reset();
                            break;
                        }
                    }
                    if (!this.useBuffer_) {
                        this.needRedraw_ = true;
                        if (this.needRedraw_) {
                            this.fullDraw(context, map);
                            this.needRedraw_ = false;
                        } else {
                            this.incrementalDraw(context, map);
                        }
                    } else {
                        var w = this.screenRect_.getWidth();
                        var h = this.screenRect_.getHeight();
                        if (this.offScreen_ == null) {
                            this.offScreen_ = document.createElement('canvas');
                            this.offScreen_.width = w;
                            this.offScreen_.height = h;
                            this.needRedraw_ = true;
                        }
                        var osb = this.offScreen_.getContext('2d');
                        if (this.needRedraw_) {
                            osb.clearRect(0, 0, w, h);
                            this.fullDraw(osb, map);
                            this.needRedraw_ = false;
                        } else {
                            this.incrementalDraw(osb, map);
                        }
                        context.drawImage(this.offScreen_, 0, 0, w, h);
                    }
                    for (var i = 0; i < N; i++) {
                        this.drawHotSpot(context, map, graphLines[i]);
                    }
                    context.restore();
                };
                DisplayGraph.prototype.drawHotSpot = function (context, coordMap, graphLine) {
                    var p = graphLine.getGraphPoints().getEndValue();
                    if (p != null) {
                        var x = coordMap.simToScreenX(p.x);
                        var y = coordMap.simToScreenY(p.y);
                        var color = graphLine.hotspotColor;
                        if (color) {
                            context.fillStyle = color;
                            context.fillRect(x - 2, y - 2, 5, 5);
                        }
                    }
                };
                DisplayGraph.prototype.drawPoints = function (context, coordMap, from, graphLine) {
                    var simRect = coordMap.screenToSimRect(this.screenRect_);
                    var iter = graphLine.getGraphPoints().getIterator(from);
                    if (!iter.hasNext()) {
                        return from;
                    }
                    var next = iter.nextValue();
                    mustBeNonNullObject_1.default('first', next);
                    var style = graphLine.getGraphStyle(iter.getIndex());
                    if (style.drawingMode === DrawingMode_1.default.DOTS) {
                        var x = coordMap.simToScreenX(next.x);
                        var y = coordMap.simToScreenY(next.y);
                        var w = style.lineWidth;
                        context.fillStyle = style.color_;
                        context.fillRect(x, y, w, w);
                    }
                    while (iter.hasNext()) {
                        var last = next;
                        next = iter.nextValue();
                        mustBeNonNullObject_1.default('next', next);
                        if (next.x === last.x && next.y === last.y) {
                            continue;
                        }
                        var style_1 = graphLine.getGraphStyle(iter.getIndex());
                        var continuous = next.seqX === last.seqX && next.seqY === last.seqY;
                        if (style_1.drawingMode === DrawingMode_1.default.DOTS || !continuous) {
                            if (!simRect.contains(next)) {
                                continue;
                            }
                            var x = coordMap.simToScreenX(next.x);
                            var y = coordMap.simToScreenY(next.y);
                            var w = style_1.lineWidth;
                            context.fillStyle = style_1.color_;
                            context.fillRect(x, y, w, w);
                        } else {
                            if (!simRect.maybeVisible(last, next)) {
                                continue;
                            }
                            var x1 = coordMap.simToScreenX(last.x);
                            var y1 = coordMap.simToScreenY(last.y);
                            var x2 = coordMap.simToScreenX(next.x);
                            var y2 = coordMap.simToScreenY(next.y);
                            context.strokeStyle = style_1.color_;
                            context.lineWidth = style_1.lineWidth;
                            context.beginPath();
                            context.moveTo(x1, y1);
                            context.lineTo(x2, y2);
                            context.stroke();
                        }
                    }
                    return iter.getIndex();
                };
                DisplayGraph.prototype.fullDraw = function (context, coordMap) {
                    this.memDraw_ = repeat_1.default(-1, this.graphLines_.length);
                    this.incrementalDraw(context, coordMap);
                };
                DisplayGraph.prototype.getZIndex = function () {
                    return this.zIndex;
                };
                DisplayGraph.prototype.setZIndex = function (zIndex) {
                    this.zIndex = isDefined_1.default(zIndex) ? zIndex : 0;
                };
                DisplayGraph.prototype.incrementalDraw = function (context, coordMap) {
                    for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                        this.memDraw_[i] = this.drawPoints(context, coordMap, this.memDraw_[i], this.graphLines_[i]);
                    }
                };
                DisplayGraph.prototype.isDragable = function () {
                    return false;
                };
                DisplayGraph.prototype.addGraphLine = function (graphLine) {
                    if (GraphLine_1.default.isDuckType(graphLine)) {
                        if (!contains_1.default(this.graphLines_, graphLine)) {
                            this.graphLines_.push(graphLine);
                            this.memDraw_.push(-1);
                        }
                    } else {
                        throw new Error('not a GraphLine ' + graphLine);
                    }
                };
                DisplayGraph.prototype.removeGraphLine = function (graphLine) {
                    if (GraphLine_1.default.isDuckType(graphLine)) {
                        var idx = this.graphLines_.indexOf(graphLine);
                        removeAt_1.default(this.graphLines_, idx);
                        removeAt_1.default(this.memDraw_, idx);
                        this.needRedraw_ = true;
                    } else {
                        throw new Error('not a GraphLine ' + graphLine);
                    }
                };
                DisplayGraph.prototype.setDragable = function (dragable) {};
                DisplayGraph.prototype.setScreenRect = function (screenRect) {
                    this.screenRect_ = screenRect;
                    this.offScreen_ = null;
                };
                DisplayGraph.prototype.setUseBuffer = function (value) {
                    this.useBuffer_ = value;
                    if (!this.useBuffer_) {
                        this.offScreen_ = null;
                    }
                };
                DisplayGraph.prototype.reset = function () {
                    var graphLines = this.graphLines_;
                    var N = graphLines.length;
                    this.memDraw_ = repeat_1.default(-1, N);
                    for (var i = 0; i < N; i++) {
                        graphLines[i].reset();
                    }
                    this.needRedraw_ = true;
                };
                return DisplayGraph;
            }();
            exports_1("default", DisplayGraph);
        }
    };
});
System.register("davinci-newton/util/GenericObserver.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var GenericObserver;
    return {
        setters: [],
        execute: function () {
            GenericObserver = function () {
                function GenericObserver(subject, observeFn) {
                    this.subject_ = subject;
                    subject.addObserver(this);
                    this.observeFn_ = observeFn;
                }
                GenericObserver.prototype.disconnect = function () {
                    this.subject_.removeObserver(this);
                };
                GenericObserver.prototype.observe = function (event) {
                    this.observeFn_(event);
                };
                return GenericObserver;
            }();
            exports_1("GenericObserver", GenericObserver);
            exports_1("default", GenericObserver);
        }
    };
});
System.register("davinci-newton/checks/mustBeString.js", ["../checks/mustSatisfy", "../checks/isString"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function beAString() {
        return "be a string";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
        return value;
    }
    exports_1("default", default_1);
    var mustSatisfy_1, isString_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isString_1_1) {
            isString_1 = isString_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/graph/Graph.js", ["../util/AbstractSubject", "../view/AlignH", "../view/AlignV", "./AutoScale", "./DisplayAxes", "./DisplayGraph", "../view/DoubleRect", "../util/GenericObserver", "./GraphLine", "../view/LabCanvas", "../checks/mustBeNumber", "../checks/mustBeString", "../view/SimView"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, AlignH_1, AlignV_1, AutoScale_1, DisplayAxes_1, DisplayGraph_1, DoubleRect_1, GenericObserver_1, GraphLine_1, LabCanvas_1, mustBeNumber_1, mustBeString_1, SimView_1, Graph;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (AutoScale_1_1) {
            AutoScale_1 = AutoScale_1_1;
        }, function (DisplayAxes_1_1) {
            DisplayAxes_1 = DisplayAxes_1_1;
        }, function (DisplayGraph_1_1) {
            DisplayGraph_1 = DisplayGraph_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (GenericObserver_1_1) {
            GenericObserver_1 = GenericObserver_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
        }, function (LabCanvas_1_1) {
            LabCanvas_1 = LabCanvas_1_1;
        }, function (mustBeNumber_1_1) {
            mustBeNumber_1 = mustBeNumber_1_1;
        }, function (mustBeString_1_1) {
            mustBeString_1 = mustBeString_1_1;
        }, function (SimView_1_1) {
            SimView_1 = SimView_1_1;
        }],
        execute: function () {
            Graph = function (_super) {
                __extends(Graph, _super);
                function Graph(canvasId, varsList) {
                    var _this = _super.call(this) || this;
                    _this.varsList = varsList;
                    _this.view = new SimView_1.default(new DoubleRect_1.default(0, 0, 1, 1));
                    _this.autoScale = new AutoScale_1.default(_this.view);
                    var canvas = document.getElementById(canvasId);
                    _this.labCanvas = new LabCanvas_1.default(canvas);
                    _this.view.hAxisAlign = AlignH_1.default.FULL;
                    _this.view.vAxisAlign = AlignV_1.default.FULL;
                    _this.labCanvas.addView(_this.view);
                    _this.displayGraph = new DisplayGraph_1.default();
                    _this.displayGraph.setScreenRect(_this.view.getScreenRect());
                    _this.view.getDisplayList().prepend(_this.displayGraph);
                    _this.timeIdx_ = varsList.timeIndex();
                    _this.axes = new DisplayAxes_1.default(_this.view.getSimRect());
                    new GenericObserver_1.default(_this.view, function (event) {
                        if (event.nameEquals(SimView_1.default.COORD_MAP_CHANGED)) {
                            var simRect = _this.view.getCoordMap().screenToSimRect(_this.view.getScreenRect());
                            _this.axes.setSimRect(simRect);
                        }
                    });
                    _this.view.getDisplayList().add(_this.axes);
                    _this.autoScale.extraMargin = 0.05;
                    return _this;
                }
                Graph.prototype.addGraphLine = function (hCoordIndex, vCoordIndex, color) {
                    if (color === void 0) {
                        color = 'black';
                    }
                    mustBeNumber_1.default('hCoordIndex', hCoordIndex);
                    mustBeNumber_1.default('vCoordIndex', vCoordIndex);
                    mustBeString_1.default('color', color);
                    var graphLine = new GraphLine_1.default(this.varsList);
                    this.view.addMemo(graphLine);
                    graphLine.hCoordIndex = hCoordIndex;
                    graphLine.vCoordIndex = vCoordIndex;
                    graphLine.color = color;
                    graphLine.hotspotColor = color;
                    this.displayGraph.addGraphLine(graphLine);
                    this.displayGraph.setUseBuffer(graphLine.hCoordIndex !== this.timeIdx_);
                    return graphLine;
                };
                Graph.prototype.removeGraphLine = function (graphLine) {
                    this.displayGraph.removeGraphLine(graphLine);
                };
                Graph.prototype.memorize = function () {
                    this.labCanvas.memorize();
                };
                Graph.prototype.render = function () {
                    this.labCanvas.paint();
                };
                Graph.prototype.reset = function () {
                    this.autoScale.reset();
                    this.displayGraph.reset();
                };
                return Graph;
            }(AbstractSubject_1.default);
            exports_1("Graph", Graph);
            exports_1("default", Graph);
        }
    };
});
System.register("davinci-newton/util/UtilityCore.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var UtilityCore;
    return {
        setters: [],
        execute: function () {
            UtilityCore = function () {
                function UtilityCore() {}
                return UtilityCore;
            }();
            UtilityCore.MAX_INTEGER = Math.pow(2, 53);
            exports_1("default", UtilityCore);
        }
    };
});
System.register("davinci-newton/util/CircularList.js", ["./UtilityCore"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var UtilityCore_1, MAX_INDEX_ERROR, CircularList, CircularListIterator;
    return {
        setters: [function (UtilityCore_1_1) {
            UtilityCore_1 = UtilityCore_1_1;
        }],
        execute: function () {
            MAX_INDEX_ERROR = 'exceeded max int';
            CircularList = function () {
                function CircularList(capacity) {
                    if (capacity === void 0) {
                        capacity = 3000;
                    }
                    this.size_ = 0;
                    this.cycles_ = 0;
                    this.nextPtr_ = 0;
                    this.lastPtr_ = -1;
                    this.capacity_ = capacity || 3000;
                    if (this.capacity_ < 2) {
                        throw new Error();
                    }
                    this.size_ = 0;
                    this.cycles_ = 0;
                    this.nextPtr_ = 0;
                    this.lastPtr_ = -1;
                    this.values_ = new Array(this.capacity_);
                    this.lastValue_ = null;
                }
                CircularList.prototype.causeMaxIntError = function () {
                    this.size_ = this.capacity_;
                    this.cycles_ = Math.floor(UtilityCore_1.default.MAX_INTEGER / this.capacity_) - 1;
                };
                CircularList.prototype.getEndIndex = function () {
                    if (this.size_ === 0) {
                        return -1;
                    }
                    var idx;
                    if (this.nextPtr_ === 0) idx = this.pointerToIndex(this.size_ - 1);else idx = this.pointerToIndex(this.nextPtr_ - 1);
                    return idx;
                };
                CircularList.prototype.getEndValue = function () {
                    var idx = this.getEndIndex();
                    return idx === -1 ? null : this.values_[this.indexToPointer_(idx)];
                };
                CircularList.prototype.getIterator = function (index) {
                    return new CircularListIterator(this, index);
                };
                CircularList.prototype.getSize = function () {
                    return this.size_;
                };
                CircularList.prototype.getStartIndex = function () {
                    var idx = this.size_ < this.capacity_ ? 0 : this.pointerToIndex(this.nextPtr_);
                    return idx;
                };
                CircularList.prototype.getValue = function (index) {
                    var i = this.indexToPointer_(index);
                    return this.values_[i];
                };
                CircularList.prototype.indexToPointer_ = function (index) {
                    if (this.size_ < this.capacity_) return index;
                    var p = index % this.capacity_;
                    var idx = index - (this.cycles_ - (p < this.nextPtr_ ? 0 : 1)) * this.capacity_;
                    return idx;
                };
                CircularList.prototype.pointerToIndex = function (pointer) {
                    if (this.size_ < this.capacity_) return pointer;
                    var idx = pointer + (this.cycles_ - (pointer < this.nextPtr_ ? 0 : 1)) * this.capacity_;
                    if (idx >= UtilityCore_1.default.MAX_INTEGER) throw new Error(MAX_INDEX_ERROR);
                    return idx;
                };
                CircularList.prototype.reset = function () {
                    this.nextPtr_ = this.size_ = 0;
                    this.cycles_ = 0;
                    this.lastPtr_ = -1;
                };
                CircularList.prototype.store = function (value) {
                    this.lastPtr_ = this.nextPtr_;
                    this.values_[this.nextPtr_] = value;
                    this.nextPtr_++;
                    if (this.size_ < this.capacity_) this.size_++;
                    if (this.nextPtr_ >= this.capacity_) {
                        this.cycles_++;
                        this.nextPtr_ = 0;
                    }
                    return this.pointerToIndex(this.lastPtr_);
                };
                return CircularList;
            }();
            exports_1("default", CircularList);
            CircularListIterator = function () {
                function CircularListIterator(cList, startIndex) {
                    this.cList = cList;
                    this.first_ = cList.size_ > 0;
                    this.cList_ = cList;
                    if (startIndex === undefined || startIndex < 0) {
                        startIndex = cList.getStartIndex();
                    }
                    if (cList.size_ > 0 && (startIndex < cList.getStartIndex() || startIndex > cList.getEndIndex())) {
                        throw new Error('out of range startIndex=' + startIndex);
                    }
                    this.index_ = startIndex;
                    this.pointer_ = cList.indexToPointer_(startIndex);
                }
                CircularListIterator.prototype.getIndex = function () {
                    if (this.cList_.size_ === 0) {
                        throw new Error('no data');
                    }
                    return this.index_;
                };
                CircularListIterator.prototype.getValue = function () {
                    if (this.cList_.size_ === 0) {
                        throw new Error('no data');
                    }
                    return this.cList_.values_[this.pointer_];
                };
                CircularListIterator.prototype.hasNext = function () {
                    return this.first_ || this.index_ < this.cList_.getEndIndex();
                };
                CircularListIterator.prototype.hasPrevious = function () {
                    return this.first_ || this.index_ > this.cList_.getStartIndex();
                };
                CircularListIterator.prototype.nextValue = function () {
                    if (this.cList_.size_ === 0) throw new Error('no data');
                    if (this.first_) {
                        this.first_ = false;
                    } else {
                        if (this.index_ + 1 > this.cList_.getEndIndex()) {
                            throw new Error('cannot iterate past end of list');
                        }
                        this.index_++;
                        this.pointer_ = this.cList_.indexToPointer_(this.index_);
                    }
                    return this.cList_.values_[this.pointer_];
                };
                CircularListIterator.prototype.previousValue = function () {
                    if (this.cList_.size_ === 0) throw new Error('no data');
                    if (this.first_) {
                        this.first_ = false;
                    } else {
                        if (this.index_ - 1 < this.cList_.getStartIndex()) {
                            throw new Error('cannot iterate prior to start of list');
                        }
                        this.index_--;
                        this.pointer_ = this.cList_.indexToPointer_(this.index_);
                    }
                    return this.cList_.values_[this.pointer_];
                };
                return CircularListIterator;
            }();
        }
    };
});
System.register("davinci-newton/view/DrawingMode.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var DrawingMode;
    return {
        setters: [],
        execute: function () {
            (function (DrawingMode) {
                DrawingMode[DrawingMode["DOTS"] = 0] = "DOTS";
                DrawingMode[DrawingMode["LINES"] = 1] = "LINES";
            })(DrawingMode || (DrawingMode = {}));
            exports_1("DrawingMode", DrawingMode);
            exports_1("default", DrawingMode);
        }
    };
});
System.register("davinci-newton/graph/GraphPoint.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var GraphPoint;
    return {
        setters: [],
        execute: function () {
            GraphPoint = function () {
                function GraphPoint(x, y, seqX, seqY) {
                    this.x = x;
                    this.y = y;
                    this.seqX = seqX;
                    this.seqY = seqY;
                }
                GraphPoint.prototype.equals = function (other) {
                    return this.x === other.x && this.y === other.y && this.seqX === other.seqX && this.seqY === other.seqY;
                };
                return GraphPoint;
            }();
            exports_1("default", GraphPoint);
        }
    };
});
System.register("davinci-newton/graph/GraphStyle.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var GraphStyle;
    return {
        setters: [],
        execute: function () {
            GraphStyle = function () {
                function GraphStyle(index_, drawingMode, color_, lineWidth) {
                    this.index_ = index_;
                    this.drawingMode = drawingMode;
                    this.color_ = color_;
                    this.lineWidth = lineWidth;
                }
                return GraphStyle;
            }();
            exports_1("default", GraphStyle);
        }
    };
});
System.register("davinci-newton/checks/isLE.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function default_1(value, limit) {
        return value <= limit;
    }
    exports_1("default", default_1);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustBeLE.js", ["../checks/mustSatisfy", "../checks/isLE"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isLE_1.default(value, limit), function () {
            return "be less than or equal to " + limit;
        }, contextBuilder);
        return value;
    }
    exports_1("default", default_1);
    var mustSatisfy_1, isLE_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isLE_1_1) {
            isLE_1 = isLE_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustBeObject.js", ["../checks/mustSatisfy", "../checks/isObject"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function beObject() {
        return "be an `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value), beObject, contextBuilder);
        return value;
    }
    exports_1("default", mustBeObject);
    var mustSatisfy_1, isObject_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/graph/GraphLine.js", ["../util/AbstractSubject", "../util/CircularList", "../view/DrawingMode", "../util/GenericEvent", "./GraphPoint", "./GraphStyle", "../checks/isObject", "../checks/mustBeLE", "../checks/mustBeObject", "../util/ParameterNumber", "../util/ParameterString", "../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, CircularList_1, DrawingMode_1, GenericEvent_1, GraphPoint_1, GraphStyle_1, isObject_1, mustBeLE_1, mustBeObject_1, ParameterNumber_1, ParameterString_1, veryDifferent_1, GraphLine;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (CircularList_1_1) {
            CircularList_1 = CircularList_1_1;
        }, function (DrawingMode_1_1) {
            DrawingMode_1 = DrawingMode_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (GraphPoint_1_1) {
            GraphPoint_1 = GraphPoint_1_1;
        }, function (GraphStyle_1_1) {
            GraphStyle_1 = GraphStyle_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }, function (mustBeLE_1_1) {
            mustBeLE_1 = mustBeLE_1_1;
        }, function (mustBeObject_1_1) {
            mustBeObject_1 = mustBeObject_1_1;
        }, function (ParameterNumber_1_1) {
            ParameterNumber_1 = ParameterNumber_1_1;
        }, function (ParameterString_1_1) {
            ParameterString_1 = ParameterString_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            GraphLine = function (_super) {
                __extends(GraphLine, _super);
                function GraphLine(varsList, capacity) {
                    var _this = _super.call(this) || this;
                    _this.lineWidth_ = 1.0;
                    _this.hotspotColor_ = 'red';
                    _this.styles_ = [];
                    _this.varsList_ = varsList;
                    varsList.addObserver(_this);
                    _this.xVar_ = -1;
                    _this.yVar_ = -1;
                    _this.xVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_X_VARIABLE, function () {
                        return _this.hCoordIndex;
                    }, function (hCoordIndex) {
                        return _this.hCoordIndex = hCoordIndex;
                    });
                    _this.xVarParam_.setLowerLimit(-1);
                    _this.addParameter(_this.xVarParam_);
                    _this.yVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_Y_VARIABLE, function () {
                        return _this.vCoordIndex;
                    }, function (vCoordIndex) {
                        return _this.vCoordIndex = vCoordIndex;
                    });
                    _this.yVarParam_.setLowerLimit(-1);
                    _this.addParameter(_this.yVarParam_);
                    _this.dataPoints_ = new CircularList_1.default(capacity || 100000);
                    _this.drawColor_ = 'lime';
                    _this.drawingMode_ = DrawingMode_1.default.LINES;
                    _this.addGraphStyle();
                    _this.xTransform = function (x, y) {
                        return x;
                    };
                    _this.yTransform = function (x, y) {
                        return y;
                    };
                    _this.addParameter(new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_LINE_WIDTH, function () {
                        return _this.lineWidth;
                    }, function (lineWidth) {
                        return _this.lineWidth = lineWidth;
                    }));
                    _this.addParameter(new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_DRAWING_MODE, function () {
                        return _this.drawingMode;
                    }, function (drawingMode) {
                        return _this.drawingMode = drawingMode;
                    }));
                    _this.addParameter(new ParameterString_1.default(_this, GraphLine.PARAM_NAME_COLOR, function () {
                        return _this.color;
                    }, function (color) {
                        return _this.color = color;
                    }));
                    return _this;
                }
                GraphLine.prototype.addGraphStyle = function () {
                    this.styles_.push(new GraphStyle_1.default(this.dataPoints_.getEndIndex() + 1, this.drawingMode_, this.drawColor_, this.lineWidth_));
                };
                GraphLine.isDuckType = function (obj) {
                    if (obj instanceof GraphLine) {
                        return true;
                    }
                    return isObject_1.default(obj) && obj.setXVariable !== undefined && obj.setYVariable !== undefined && obj.color !== undefined && obj.lineWidth !== undefined && obj.setAxes !== undefined && obj.varsList !== undefined && obj.reset !== undefined && obj.getGraphStyle !== undefined;
                };
                Object.defineProperty(GraphLine.prototype, "color", {
                    get: function () {
                        return this.drawColor_;
                    },
                    set: function (color) {
                        if (this.drawColor_ !== color) {
                            this.drawColor_ = color;
                            this.addGraphStyle();
                            this.broadcastParameter(GraphLine.PARAM_NAME_COLOR);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GraphLine.prototype, "drawingMode", {
                    get: function () {
                        return this.drawingMode_;
                    },
                    set: function (drawingMode) {
                        if (this.drawingMode_ !== drawingMode) {
                            this.drawingMode_ = drawingMode;
                            this.addGraphStyle();
                        }
                        this.broadcastParameter(GraphLine.PARAM_NAME_DRAWING_MODE);
                    },
                    enumerable: true,
                    configurable: true
                });
                GraphLine.prototype.getGraphPoints = function () {
                    return this.dataPoints_;
                };
                GraphLine.prototype.getGraphStyle = function (index) {
                    var styles = this.styles_;
                    if (styles.length === 0) {
                        throw new Error('graph styles list is empty');
                    }
                    var last = styles[0];
                    for (var i = 1, len = styles.length; i < len; i++) {
                        var s = styles[i];
                        mustBeLE_1.default('', last.index_, s.index_);
                        if (s.index_ > index) break;
                        last = s;
                    }
                    mustBeObject_1.default('last', last);
                    return last;
                };
                Object.defineProperty(GraphLine.prototype, "hotspotColor", {
                    get: function () {
                        return this.hotspotColor_;
                    },
                    set: function (color) {
                        this.hotspotColor_ = color;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GraphLine.prototype, "lineWidth", {
                    get: function () {
                        return this.lineWidth_;
                    },
                    set: function (lineWidth) {
                        if (veryDifferent_1.default(lineWidth, this.lineWidth_)) {
                            this.lineWidth_ = lineWidth;
                            this.addGraphStyle();
                            this.broadcastParameter(GraphLine.PARAM_NAME_LINE_WIDTH);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GraphLine.prototype, "varsList", {
                    get: function () {
                        return this.varsList_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GraphLine.prototype, "hCoordIndex", {
                    get: function () {
                        return this.xVar_;
                    },
                    set: function (xVar) {
                        this.checkVarIndex(GraphLine.PARAM_NAME_X_VARIABLE, xVar);
                        if (xVar !== this.xVar_) {
                            this.xVar_ = xVar;
                            this.reset();
                            this.broadcastParameter(GraphLine.PARAM_NAME_X_VARIABLE);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                GraphLine.prototype.getXVarName = function () {
                    return this.xVar_ > -1 ? this.varsList_.getName(this.xVar_) : '';
                };
                Object.defineProperty(GraphLine.prototype, "vCoordIndex", {
                    get: function () {
                        return this.yVar_;
                    },
                    set: function (yVar) {
                        this.checkVarIndex(GraphLine.PARAM_NAME_Y_VARIABLE, yVar);
                        if (yVar !== this.yVar_) {
                            this.yVar_ = yVar;
                            this.reset();
                            this.broadcastParameter(GraphLine.PARAM_NAME_Y_VARIABLE);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                GraphLine.prototype.getYVarName = function () {
                    return this.yVar_ > -1 ? this.varsList_.getName(this.yVar_) : '';
                };
                GraphLine.prototype.memorize = function () {
                    if (this.xVar_ > -1 && this.yVar_ > -1) {
                        var varsList = this.varsList_;
                        var x = varsList.getValue(this.xVar_);
                        var y = varsList.getValue(this.yVar_);
                        var nextX = this.xTransform(x, y);
                        var nextY = this.yTransform(x, y);
                        var seqX = varsList.getSequence(this.xVar_);
                        var seqY = varsList.getSequence(this.xVar_);
                        var newPoint = new GraphPoint_1.default(nextX, nextY, seqX, seqY);
                        var last = this.dataPoints_.getEndValue();
                        if (last == null || !last.equals(newPoint)) {
                            this.dataPoints_.store(newPoint);
                        }
                    }
                };
                GraphLine.prototype.observe = function (event) {};
                GraphLine.prototype.reset = function () {
                    this.dataPoints_.reset();
                    this.resetStyle();
                    this.broadcast(new GenericEvent_1.default(this, GraphLine.RESET));
                };
                GraphLine.prototype.resetStyle = function () {
                    this.styles_ = [];
                    this.addGraphStyle();
                };
                GraphLine.prototype.checkVarIndex = function (name, index) {
                    if (index < -1 || index > this.varsList_.numVariables() - 1) {
                        throw new Error(name + " bad index: " + index);
                    }
                };
                return GraphLine;
            }(AbstractSubject_1.default);
            GraphLine.PARAM_NAME_X_VARIABLE = 'X variable';
            GraphLine.PARAM_NAME_Y_VARIABLE = 'Y variable';
            GraphLine.PARAM_NAME_LINE_WIDTH = 'line width';
            GraphLine.PARAM_NAME_COLOR = 'color';
            GraphLine.PARAM_NAME_DRAWING_MODE = 'drawing mode';
            GraphLine.RESET = 'RESET';
            exports_1("default", GraphLine);
        }
    };
});
System.register("davinci-newton/engine3D/GravitationLaw3.js", ["../objects/AbstractSimObject", "../model/CoordType", "./Force3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, CoordType_1, Force3_1, GravitationLaw3;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (Force3_1_1) {
            Force3_1 = Force3_1_1;
        }],
        execute: function () {
            GravitationLaw3 = function (_super) {
                __extends(GravitationLaw3, _super);
                function GravitationLaw3(body1_, body2_) {
                    var _this = _super.call(this) || this;
                    _this.body1_ = body1_;
                    _this.body2_ = body2_;
                    _this.G = 1;
                    _this.forces = [];
                    _this.F1 = new Force3_1.default(_this.body1_);
                    _this.F1.locationCoordType = CoordType_1.default.WORLD;
                    _this.F1.vectorCoordType = CoordType_1.default.WORLD;
                    _this.F2 = new Force3_1.default(_this.body2_);
                    _this.F2.locationCoordType = CoordType_1.default.WORLD;
                    _this.F2.vectorCoordType = CoordType_1.default.WORLD;
                    _this.forces = [_this.F1, _this.F2];
                    return _this;
                }
                GravitationLaw3.prototype.updateForces = function () {
                    this.F1.location.copy(this.body1_.X);
                    this.F2.location.copy(this.body2_.X);
                    var m1 = this.body1_.M;
                    var m2 = this.body2_.M;
                    var r2 = this.F1.location.quadranceTo(this.F2.location);
                    var sf = this.G * m1 * m2 / r2;
                    this.F1.vector.copy(this.F2.location).subtract(this.F1.location).direction().mulByScalar(sf);
                    this.F2.vector.copy(this.F1.vector).neg();
                    return this.forces;
                };
                GravitationLaw3.prototype.disconnect = function () {};
                GravitationLaw3.prototype.potentialEnergy = function () {
                    var m1 = this.body1_.M;
                    var m2 = this.body2_.M;
                    var r = this.F1.location.distanceTo(this.F2.location);
                    return -this.G * m1 * m2 / r;
                };
                return GravitationLaw3;
            }(AbstractSimObject_1.default);
            exports_1("GravitationLaw3", GravitationLaw3);
            exports_1("default", GravitationLaw3);
        }
    };
});
System.register("davinci-newton/util/isEmpty.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isEmpty(xs) {
        return xs.length === 0;
    }
    exports_1("default", isEmpty);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/view/LabCanvas.js", ["../util/AbstractSubject", "../util/clone", "../util/contains", "../util/GenericEvent", "../util/isEmpty", "../checks/isNumber", "../checks/mustBeNonNullObject", "../util/remove", "./ScreenRect", "../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, clone_1, contains_1, GenericEvent_1, isEmpty_1, isNumber_1, mustBeNonNullObject_1, remove_1, ScreenRect_1, veryDifferent_1, WIDTH, HEIGHT, ALPHA, BACKGROUND, LabCanvas;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (clone_1_1) {
            clone_1 = clone_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (isEmpty_1_1) {
            isEmpty_1 = isEmpty_1_1;
        }, function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }, function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }, function (ScreenRect_1_1) {
            ScreenRect_1 = ScreenRect_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            WIDTH = 'width';
            HEIGHT = 'height';
            ALPHA = 'alpha';
            BACKGROUND = 'background';
            LabCanvas = function (_super) {
                __extends(LabCanvas, _super);
                function LabCanvas(canvas) {
                    var _this = _super.call(this) || this;
                    _this.labViews_ = [];
                    _this.memorizables_ = [];
                    _this.focusView_ = null;
                    _this.alpha_ = 1;
                    _this.background_ = '';
                    _this.canvas_ = canvas;
                    canvas.contentEditable = 'false';
                    return _this;
                }
                LabCanvas.prototype.addMemo = function (memorizable) {
                    if (!contains_1.default(this.memorizables_, memorizable)) {
                        this.memorizables_.push(memorizable);
                    }
                };
                LabCanvas.prototype.addView = function (view) {
                    mustBeNonNullObject_1.default('view', view);
                    if (this.getWidth() > 0 && this.getHeight() > 0) {
                        var sr = new ScreenRect_1.default(0, 0, this.getWidth(), this.getHeight());
                        view.setScreenRect(sr);
                    }
                    this.labViews_.push(view);
                    this.addMemo(view);
                    this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_ADDED, view));
                    this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_LIST_MODIFIED));
                    if (this.focusView_ == null) {
                        this.setFocusView(view);
                    }
                };
                LabCanvas.prototype.focus = function () {
                    this.canvas_.focus();
                };
                LabCanvas.prototype.getAlpha = function () {
                    return this.alpha_;
                };
                LabCanvas.prototype.getBackground = function () {
                    return this.background_;
                };
                LabCanvas.prototype.getCanvas = function () {
                    return this.canvas_;
                };
                LabCanvas.prototype.getContext = function () {
                    return this.canvas_.getContext('2d');
                };
                LabCanvas.prototype.getFocusView = function () {
                    return this.focusView_;
                };
                LabCanvas.prototype.getHeight = function () {
                    return this.canvas_.height;
                };
                LabCanvas.prototype.getMemos = function () {
                    return clone_1.default(this.memorizables_);
                };
                LabCanvas.prototype.getScreenRect = function () {
                    return new ScreenRect_1.default(0, 0, this.canvas_.width, this.canvas_.height);
                };
                LabCanvas.prototype.getViews = function () {
                    return clone_1.default(this.labViews_);
                };
                LabCanvas.prototype.getWidth = function () {
                    return this.canvas_.width;
                };
                LabCanvas.prototype.memorize = function () {
                    for (var i = 0, n = this.memorizables_.length; i < n; i++) {
                        this.memorizables_[i].memorize();
                    }
                };
                LabCanvas.prototype.notifySizeChanged = function () {
                    var r = this.getScreenRect();
                    this.labViews_.forEach(function (view) {
                        view.setScreenRect(r);
                    });
                    this.broadcast(new GenericEvent_1.default(this, LabCanvas.SIZE_CHANGED));
                };
                LabCanvas.prototype.paint = function () {
                    if (this.canvas_.offsetParent != null) {
                        var context = this.canvas_.getContext('2d');
                        context.save();
                        if (this.background_ !== '') {
                            context.globalAlpha = this.alpha_;
                            context.fillStyle = this.background_;
                            context.fillRect(0, 0, this.canvas_.width, this.canvas_.height);
                            context.globalAlpha = 1;
                        } else {
                            context.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
                        }
                        var vs = this.labViews_;
                        var N = vs.length;
                        for (var i = 0; i < N; i++) {
                            vs[i].paint(context);
                        }
                        context.restore();
                    }
                };
                LabCanvas.prototype.removeMemo = function (memorizable) {
                    remove_1.default(this.memorizables_, memorizable);
                };
                LabCanvas.prototype.removeView = function (view) {
                    mustBeNonNullObject_1.default('view', view);
                    remove_1.default(this.labViews_, view);
                    this.removeMemo(view);
                    if (this.focusView_ === view) {
                        this.setFocusView(isEmpty_1.default(this.labViews_) ? null : this.labViews_[0]);
                    }
                    this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_REMOVED, view));
                    this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_LIST_MODIFIED));
                };
                LabCanvas.prototype.setAlpha = function (value) {
                    if (veryDifferent_1.default(this.alpha_, value)) {
                        this.alpha_ = value;
                        if (veryDifferent_1.default(value, 1) && this.background_ === '') {
                            this.setBackground('white');
                        }
                        this.broadcastParameter(ALPHA);
                    }
                };
                LabCanvas.prototype.setBackground = function (value) {
                    if (this.background_ !== value) {
                        this.background_ = value;
                        this.broadcastParameter(BACKGROUND);
                    }
                };
                LabCanvas.prototype.setFocusView = function (view) {
                    if (view != null && !contains_1.default(this.labViews_, view)) throw new Error('cannot set focus to unknown view ' + view);
                    if (this.focusView_ !== view) {
                        if (this.focusView_ != null) {
                            this.focusView_.loseFocus();
                        }
                        this.focusView_ = view;
                        if (view != null) {
                            view.gainFocus();
                        }
                        this.broadcast(new GenericEvent_1.default(this, LabCanvas.FOCUS_VIEW_CHANGED, view));
                    }
                };
                LabCanvas.prototype.setHeight = function (value) {
                    if (veryDifferent_1.default(value, this.canvas_.height)) {
                        this.canvas_.height = value;
                    }
                    this.notifySizeChanged();
                    this.broadcastParameter(HEIGHT);
                };
                LabCanvas.prototype.setScreenRect = function (sr) {
                    if (!ScreenRect_1.default.isDuckType(sr)) {
                        throw new Error('not a ScreenRect ' + sr);
                    }
                    if (sr.getTop() !== 0 || sr.getLeft() !== 0) {
                        throw new Error('top left must be 0,0, was: ' + sr);
                    }
                    this.setSize(sr.getWidth(), sr.getHeight());
                };
                LabCanvas.prototype.setSize = function (width, height) {
                    if (!isNumber_1.default(width) || width <= 0 || !isNumber_1.default(height) || height <= 0) {
                        throw new Error('bad size ' + width + ', ' + height);
                    }
                    this.canvas_.width = width;
                    this.canvas_.height = height;
                    this.notifySizeChanged();
                    this.broadcastParameter(WIDTH);
                    this.broadcastParameter(HEIGHT);
                };
                ;
                LabCanvas.prototype.setWidth = function (value) {
                    if (veryDifferent_1.default(value, this.canvas_.width)) {
                        this.canvas_.width = value;
                    }
                    this.notifySizeChanged();
                    this.broadcastParameter(WIDTH);
                };
                return LabCanvas;
            }(AbstractSubject_1.default);
            LabCanvas.FOCUS_VIEW_CHANGED = 'FOCUS_VIEW_CHANGED';
            LabCanvas.SIZE_CHANGED = 'SIZE_CHANGED';
            LabCanvas.VIEW_LIST_MODIFIED = 'VIEW_LIST_MODIFIED';
            LabCanvas.VIEW_ADDED = 'VIEW_ADDED';
            LabCanvas.VIEW_REMOVED = 'VIEW_REMOVED';
            exports_1("LabCanvas", LabCanvas);
            exports_1("default", LabCanvas);
        }
    };
});
System.register("davinci-newton/solvers/ModifiedEuler.js", ["../util/zeroArray"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var zeroArray_1, ModifiedEuler;
    return {
        setters: [function (zeroArray_1_1) {
            zeroArray_1 = zeroArray_1_1;
        }],
        execute: function () {
            ModifiedEuler = function () {
                function ModifiedEuler(sim_) {
                    this.sim_ = sim_;
                    this.inp_ = [];
                    this.k1_ = [];
                    this.k2_ = [];
                }
                ModifiedEuler.prototype.step = function (stepSize) {
                    var vars = this.sim_.getState();
                    var N = vars.length;
                    if (this.inp_.length !== N) {
                        this.inp_ = new Array(N);
                        this.k1_ = new Array(N);
                        this.k2_ = new Array(N);
                    }
                    var inp = this.inp_;
                    var k1 = this.k1_;
                    var k2 = this.k2_;
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i];
                    }
                    zeroArray_1.default(k1);
                    this.sim_.evaluate(inp, k1, 0);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k1[i] * stepSize;
                    }
                    zeroArray_1.default(k2);
                    this.sim_.evaluate(inp, k2, stepSize);
                    for (var i = 0; i < N; i++) {
                        vars[i] += (k1[i] + k2[i]) * stepSize / 2;
                    }
                    this.sim_.setState(vars);
                };
                return ModifiedEuler;
            }();
            exports_1("ModifiedEuler", ModifiedEuler);
            exports_1("default", ModifiedEuler);
        }
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
                    var _this = _super.call(this) || this;
                    _this.elements_ = [];
                    return _this;
                }
                SimList.prototype.add = function (simObject) {
                    for (var i = 0; i < arguments.length; i++) {
                        var element = arguments[i];
                        mustBeNonNullObject_1.default('element', element);
                        if (!contains_1.default(this.elements_, element)) {
                            this.elements_.push(element);
                            this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_ADDED, element));
                        }
                    }
                };
                SimList.prototype.forEach = function (callBack) {
                    return this.elements_.forEach(callBack);
                };
                SimList.prototype.remove = function (simObject) {
                    throw new Error("TODO");
                };
                SimList.prototype.removeTemporary = function (time) {
                    for (var i = this.elements_.length - 1; i >= 0; i--) {
                        var simobj = this.elements_[i];
                        if (simobj.expireTime < time) {
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
System.register("davinci-newton/engine3D/Physics3.js", ["../util/AbstractSubject", "../math/Bivector3", "../util/contains", "../math/Matrix3", "../util/remove", "../core/SimList", "../core/VarsList", "../math/Vector3", "../math/wedge"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    function getVarName(index) {
        switch (index) {
            case Physics3.OFFSET_POSITION_X:
                return "position x";
            case Physics3.OFFSET_POSITION_Y:
                return "position y";
            case Physics3.OFFSET_POSITION_Z:
                return "position z";
            case Physics3.OFFSET_ATTITUDE_A:
                return "attitude a";
            case Physics3.OFFSET_ATTITUDE_YZ:
                return "attitude yz";
            case Physics3.OFFSET_ATTITUDE_ZX:
                return "attitude zx";
            case Physics3.OFFSET_ATTITUDE_XY:
                return "attitude xy";
            case Physics3.OFFSET_LINEAR_MOMENTUM_X:
                return "linear momentum x";
            case Physics3.OFFSET_LINEAR_MOMENTUM_Y:
                return "linear momentum y";
            case Physics3.OFFSET_LINEAR_MOMENTUM_Z:
                return "linear momentum z";
            case Physics3.OFFSET_ANGULAR_MOMENTUM_YZ:
                return "angular momentum yz";
            case Physics3.OFFSET_ANGULAR_MOMENTUM_ZX:
                return "angular momentum zx";
            case Physics3.OFFSET_ANGULAR_MOMENTUM_XY:
                return "angular momentum xy";
        }
        throw new Error("getVarName(" + index + ")");
    }
    var AbstractSubject_1, Bivector3_1, contains_1, Matrix3_1, remove_1, SimList_1, VarsList_1, Vector3_1, wedge_1, var_names, NUM_VARIABLES_PER_BODY, Physics3;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (Bivector3_1_1) {
            Bivector3_1 = Bivector3_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }, function (SimList_1_1) {
            SimList_1 = SimList_1_1;
        }, function (VarsList_1_1) {
            VarsList_1 = VarsList_1_1;
        }, function (Vector3_1_1) {
            Vector3_1 = Vector3_1_1;
        }, function (wedge_1_1) {
            wedge_1 = wedge_1_1;
        }],
        execute: function () {
            var_names = [VarsList_1.default.TIME, "translational kinetic energy", "rotational kinetic energy", "potential energy", "total energy", "total linear momentum - x", "total linear momentum - y", "total linear momentum - z", "total angular momentum - yz", "total angular momentum - zx", "total angular momentum - xy"];
            NUM_VARIABLES_PER_BODY = 13;
            Physics3 = function (_super) {
                __extends(Physics3, _super);
                function Physics3() {
                    var _this = _super.call(this) || this;
                    _this.simList_ = new SimList_1.default();
                    _this.bodies_ = [];
                    _this.forceLaws_ = [];
                    _this.showForces_ = false;
                    _this.potentialOffset_ = 0;
                    _this.force_ = new Vector3_1.default(0, 0, 0);
                    _this.torque_ = new Bivector3_1.default();
                    _this.R_ = Matrix3_1.default.one();
                    _this.T_ = Matrix3_1.default.one();
                    _this.varsList_ = new VarsList_1.default(var_names);
                    return _this;
                }
                Object.defineProperty(Physics3.prototype, "showForces", {
                    get: function () {
                        return this.showForces_;
                    },
                    set: function (showForces) {
                        this.showForces_ = showForces;
                    },
                    enumerable: true,
                    configurable: true
                });
                Physics3.prototype.addBody = function (body) {
                    if (!contains_1.default(this.bodies_, body)) {
                        var names = [];
                        for (var k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                            names.push(getVarName(k));
                        }
                        body.varsIndex = this.varsList_.addVariables(names);
                        this.bodies_.push(body);
                        this.simList_.add(body);
                    }
                    this.initializeFromBody(body);
                    this.bodies_.forEach(function (b) {});
                    this.discontinuosChangeToEnergy();
                };
                Physics3.prototype.removeBody = function (body) {
                    if (contains_1.default(this.bodies_, body)) {
                        this.varsList_.deleteVariables(body.varsIndex, NUM_VARIABLES_PER_BODY);
                        remove_1.default(this.bodies_, body);
                        body.varsIndex = -1;
                    }
                    this.simList_.remove(body);
                    this.discontinuosChangeToEnergy();
                };
                Physics3.prototype.addForceLaw = function (forceLaw) {
                    if (!contains_1.default(this.forceLaws_, forceLaw)) {
                        this.forceLaws_.push(forceLaw);
                    }
                    this.discontinuosChangeToEnergy();
                };
                Physics3.prototype.removeForceLaw = function (forceLaw) {
                    forceLaw.disconnect();
                    this.discontinuosChangeToEnergy();
                    remove_1.default(this.forceLaws_, forceLaw);
                };
                Physics3.prototype.discontinuosChangeToEnergy = function () {
                    this.varsList_.incrSequence(Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY, Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY, Physics3.INDEX_POTENTIAL_ENERGY, Physics3.INDEX_TOTAL_ENERGY, Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_X, Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Y, Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Z, Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_XY);
                };
                Physics3.prototype.moveObjects = function (vars) {
                    var R = this.R_;
                    var T = this.T_;
                    var bodies = this.bodies_;
                    var N = bodies.length;
                    for (var i = 0; i < N; i++) {
                        var body = bodies[i];
                        var idx = body.varsIndex;
                        if (idx < 0) {
                            return;
                        }
                        body.X.x = vars[idx + Physics3.OFFSET_POSITION_X];
                        body.X.y = vars[idx + Physics3.OFFSET_POSITION_Y];
                        body.X.z = vars[idx + Physics3.OFFSET_POSITION_Z];
                        body.R.a = vars[idx + Physics3.OFFSET_ATTITUDE_A];
                        body.R.xy = vars[idx + Physics3.OFFSET_ATTITUDE_XY];
                        body.R.yz = vars[idx + Physics3.OFFSET_ATTITUDE_YZ];
                        body.R.zx = vars[idx + Physics3.OFFSET_ATTITUDE_ZX];
                        body.R.normalize();
                        body.P.x = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X];
                        body.P.y = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y];
                        body.P.z = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z];
                        body.L.xy = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY];
                        body.L.yz = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ];
                        body.L.zx = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX];
                        R.rotation(body.R);
                        T.copy(R).transpose();
                        var ω = Vector3_1.default.dual(body.L).neg();
                        ω.applyMatrix(T);
                        ω.applyMatrix(body.Iinv);
                        ω.applyMatrix(R);
                        body.Ω.dual(ω);
                    }
                };
                Physics3.prototype.prolog = function () {
                    this.simList.removeTemporary(this.varsList.getTime());
                };
                Physics3.prototype.getState = function () {
                    return this.varsList_.getValues();
                };
                Physics3.prototype.setState = function (state) {
                    this.varsList.setValues(state, true);
                };
                Physics3.prototype.evaluate = function (state, change, timeOffset) {
                    var _this = this;
                    this.moveObjects(state);
                    this.bodies_.forEach(function (body) {
                        var idx = body.varsIndex;
                        if (idx < 0) {
                            return;
                        }
                        var mass = body.M;
                        if (mass === Number.POSITIVE_INFINITY) {
                            for (var k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                                change[idx + k] = 0;
                            }
                        } else {
                            change[idx + Physics3.OFFSET_POSITION_X] = state[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] / mass;
                            change[idx + Physics3.OFFSET_POSITION_Y] = state[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] / mass;
                            change[idx + Physics3.OFFSET_POSITION_Z] = state[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] / mass;
                            var R = body.R;
                            var Ω = body.Ω;
                            change[idx + Physics3.OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
                            change[idx + Physics3.OFFSET_ATTITUDE_YZ] = -0.5 * (Ω.yz * R.a + Ω.xy * R.zx - Ω.zx * R.xy);
                            change[idx + Physics3.OFFSET_ATTITUDE_ZX] = -0.5 * (Ω.zx * R.a + Ω.yz * R.xy - Ω.xy * R.yz);
                            change[idx + Physics3.OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a + Ω.zx * R.yz - Ω.yz * R.zx);
                            change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] = 0;
                            change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] = 0;
                            change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] = 0;
                            change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY] = 0;
                            change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
                            change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
                        }
                    });
                    this.forceLaws_.forEach(function (forceLaw) {
                        var forces = forceLaw.updateForces();
                        forces.forEach(function (force) {
                            _this.applyForce(change, force);
                        });
                    });
                    change[this.varsList_.timeIndex()] = 1;
                    return null;
                };
                Physics3.prototype.applyForce = function (change, forceApp) {
                    var body = forceApp.getBody();
                    if (!contains_1.default(this.bodies_, body)) {
                        return;
                    }
                    var idx = body.varsIndex;
                    if (idx < 0) {
                        return;
                    }
                    forceApp.computeForce(this.force_);
                    var F = this.force_;
                    change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] += F.x;
                    change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] += F.y;
                    change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] += F.z;
                    forceApp.computeTorque(this.torque_);
                    var Γ = this.torque_;
                    change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ] += Γ.yz;
                    change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX] += Γ.zx;
                    change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY] += Γ.xy;
                    if (this.showForces_) {
                        forceApp.expireTime = this.varsList_.getTime();
                        this.simList_.add(forceApp);
                    }
                };
                Object.defineProperty(Physics3.prototype, "time", {
                    get: function () {
                        return this.varsList_.getTime();
                    },
                    enumerable: true,
                    configurable: true
                });
                Physics3.prototype.initializeFromBody = function (body) {
                    var idx = body.varsIndex;
                    if (idx > -1) {
                        var va = this.varsList_;
                        va.setValue(Physics3.OFFSET_POSITION_X + idx, body.X.x);
                        va.setValue(Physics3.OFFSET_POSITION_Y + idx, body.X.y);
                        va.setValue(Physics3.OFFSET_POSITION_Z + idx, body.X.z);
                        va.setValue(Physics3.OFFSET_ATTITUDE_A + idx, body.R.a);
                        va.setValue(Physics3.OFFSET_ATTITUDE_XY + idx, body.R.xy);
                        va.setValue(Physics3.OFFSET_ATTITUDE_YZ + idx, body.R.yz);
                        va.setValue(Physics3.OFFSET_ATTITUDE_ZX + idx, body.R.zx);
                        va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
                        va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
                        va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);
                        va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
                        va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
                        va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
                    }
                };
                Physics3.prototype.epilog = function () {
                    var varsList = this.varsList_;
                    var vars = varsList.getValues();
                    this.moveObjects(vars);
                    var pe = this.potentialOffset_;
                    var re = 0;
                    var te = 0;
                    var Px = 0;
                    var Py = 0;
                    var Pz = 0;
                    var Lyz = 0;
                    var Lzx = 0;
                    var Lxy = 0;
                    var bs = this.bodies_;
                    var Nb = bs.length;
                    for (var i = 0; i < Nb; i++) {
                        var b = bs[i];
                        if (isFinite(b.M)) {
                            re += b.rotationalEnergy();
                            te += b.translationalEnergy();
                            Px += b.P.x;
                            Py += b.P.y;
                            Pz += b.P.z;
                            Lyz += wedge_1.wedgeYZ(b.X, b.P);
                            Lzx += wedge_1.wedgeZX(b.X, b.P);
                            Lxy += wedge_1.wedgeXY(b.X, b.P);
                            Lyz += b.L.yz;
                            Lzx += b.L.zx;
                            Lxy += b.L.xy;
                        }
                    }
                    var fs = this.forceLaws_;
                    var Nf = fs.length;
                    for (var i = 0; i < Nf; i++) {
                        pe += fs[i].potentialEnergy();
                    }
                    varsList.setValue(Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
                    varsList.setValue(Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
                    varsList.setValue(Physics3.INDEX_POTENTIAL_ENERGY, pe, true);
                    varsList.setValue(Physics3.INDEX_TOTAL_ENERGY, te + re + pe, true);
                    varsList.setValue(Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
                    varsList.setValue(Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
                    varsList.setValue(Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz, true);
                    varsList.setValue(Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz, true);
                    varsList.setValue(Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx, true);
                    varsList.setValue(Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
                };
                Object.defineProperty(Physics3.prototype, "simList", {
                    get: function () {
                        return this.simList_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Physics3.prototype, "varsList", {
                    get: function () {
                        return this.varsList_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Physics3.prototype.totalEnergy = function () {
                    var pe = this.potentialOffset_;
                    var re = 0;
                    var te = 0;
                    var bs = this.bodies_;
                    var Nb = bs.length;
                    for (var i = 0; i < Nb; i++) {
                        var b = bs[i];
                        if (isFinite(b.M)) {
                            re += b.rotationalEnergy();
                            te += b.translationalEnergy();
                        }
                    }
                    var fs = this.forceLaws_;
                    var Nf = fs.length;
                    for (var i = 0; i < Nf; i++) {
                        pe += fs[i].potentialEnergy();
                    }
                    return te + re + pe;
                };
                return Physics3;
            }(AbstractSubject_1.default);
            Physics3.INDEX_TIME = 0;
            Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
            Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
            Physics3.INDEX_POTENTIAL_ENERGY = 3;
            Physics3.INDEX_TOTAL_ENERGY = 4;
            Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_X = 5;
            Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Y = 6;
            Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Z = 7;
            Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = 8;
            Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = 9;
            Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_XY = 10;
            Physics3.OFFSET_POSITION_X = 0;
            Physics3.OFFSET_POSITION_Y = 1;
            Physics3.OFFSET_POSITION_Z = 2;
            Physics3.OFFSET_ATTITUDE_A = 3;
            Physics3.OFFSET_ATTITUDE_YZ = 4;
            Physics3.OFFSET_ATTITUDE_ZX = 5;
            Physics3.OFFSET_ATTITUDE_XY = 6;
            Physics3.OFFSET_LINEAR_MOMENTUM_X = 7;
            Physics3.OFFSET_LINEAR_MOMENTUM_Y = 8;
            Physics3.OFFSET_LINEAR_MOMENTUM_Z = 9;
            Physics3.OFFSET_ANGULAR_MOMENTUM_YZ = 10;
            Physics3.OFFSET_ANGULAR_MOMENTUM_ZX = 11;
            Physics3.OFFSET_ANGULAR_MOMENTUM_XY = 12;
            exports_1("Physics3", Physics3);
            exports_1("default", Physics3);
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
System.register("davinci-newton/solvers/RungeKutta.js", ["../util/zeroArray"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var zeroArray_1, RungeKutta;
    return {
        setters: [function (zeroArray_1_1) {
            zeroArray_1 = zeroArray_1_1;
        }],
        execute: function () {
            RungeKutta = function () {
                function RungeKutta(sim_) {
                    this.sim_ = sim_;
                    this.inp_ = [];
                    this.k1_ = [];
                    this.k2_ = [];
                    this.k3_ = [];
                    this.k4_ = [];
                }
                RungeKutta.prototype.step = function (stepSize) {
                    var vars = this.sim_.getState();
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
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i];
                    }
                    zeroArray_1.default(k1);
                    this.sim_.evaluate(inp, k1, 0);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k1[i] * stepSize / 2;
                    }
                    zeroArray_1.default(k2);
                    this.sim_.evaluate(inp, k2, stepSize / 2);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k2[i] * stepSize / 2;
                    }
                    zeroArray_1.default(k3);
                    this.sim_.evaluate(inp, k3, stepSize / 2);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k3[i] * stepSize;
                    }
                    zeroArray_1.default(k4);
                    this.sim_.evaluate(inp, k4, stepSize);
                    for (var i = 0; i < N; i++) {
                        vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
                    }
                    this.sim_.setState(vars);
                };
                return RungeKutta;
            }();
            exports_1("RungeKutta", RungeKutta);
            exports_1("default", RungeKutta);
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
                function Clock() {
                    var _this = _super.call(this) || this;
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
System.register("davinci-newton/view/AffineTransform.js", ["./Point"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Point_1, AffineTransform;
    return {
        setters: [function (Point_1_1) {
            Point_1 = Point_1_1;
        }],
        execute: function () {
            AffineTransform = function () {
                function AffineTransform(m11, m12, m21, m22, dx, dy) {
                    this.m11_ = m11;
                    this.m12_ = m12;
                    this.m21_ = m21;
                    this.m22_ = m22;
                    this.dx_ = dx;
                    this.dy_ = dy;
                }
                AffineTransform.prototype.applyTransform = function (context) {
                    context.transform(this.m11_, this.m12_, this.m21_, this.m22_, this.dx_, this.dy_);
                    return this;
                };
                AffineTransform.prototype.concatenate = function (at) {
                    var m11 = this.m11_ * at.m11_ + this.m21_ * at.m12_;
                    var m12 = this.m12_ * at.m11_ + this.m22_ * at.m12_;
                    var m21 = this.m11_ * at.m21_ + this.m21_ * at.m22_;
                    var m22 = this.m12_ * at.m21_ + this.m22_ * at.m22_;
                    var dx = this.m11_ * at.dx_ + this.m21_ * at.dy_ + this.dx_;
                    var dy = this.m12_ * at.dx_ + this.m22_ * at.dy_ + this.dy_;
                    return new AffineTransform(m11, m12, m21, m22, dx, dy);
                };
                AffineTransform.prototype.lineTo = function (x, y, context) {
                    var p = this.transform(x, y);
                    context.lineTo(p.x, p.y);
                    return this;
                };
                AffineTransform.prototype.moveTo = function (x, y, context) {
                    var p = this.transform(x, y);
                    context.moveTo(p.x, p.y);
                    return this;
                };
                AffineTransform.prototype.rotate = function (angle) {
                    var c = Math.cos(angle);
                    var s = Math.sin(angle);
                    var m11 = c * this.m11_ + s * this.m21_;
                    var m12 = c * this.m12_ + s * this.m22_;
                    var m21 = -s * this.m11_ + c * this.m21_;
                    var m22 = -s * this.m12_ + c * this.m22_;
                    return new AffineTransform(m11, m12, m21, m22, this.dx_, this.dy_);
                };
                AffineTransform.prototype.scale = function (x, y) {
                    var m11 = this.m11_ * x;
                    var m12 = this.m12_ * x;
                    var m21 = this.m21_ * y;
                    var m22 = this.m22_ * y;
                    return new AffineTransform(m11, m12, m21, m22, this.dx_, this.dy_);
                };
                AffineTransform.prototype.setTransform = function (context) {
                    context.setTransform(this.m11_, this.m12_, this.m21_, this.m22_, this.dx_, this.dy_);
                    return this;
                };
                AffineTransform.prototype.transform = function (x, y) {
                    var x2 = this.m11_ * x + this.m21_ * y + this.dx_;
                    var y2 = this.m12_ * x + this.m22_ * y + this.dy_;
                    return new Point_1.default(x2, y2);
                };
                AffineTransform.prototype.translate = function (x, y) {
                    var dx = this.dx_ + this.m11_ * x + this.m21_ * y;
                    var dy = this.dy_ + this.m12_ * x + this.m22_ * y;
                    return new AffineTransform(this.m11_, this.m12_, this.m21_, this.m22_, dx, dy);
                };
                return AffineTransform;
            }();
            AffineTransform.IDENTITY = new AffineTransform(1, 0, 0, 1, 0, 0);
            exports_1("default", AffineTransform);
        }
    };
});
System.register("davinci-newton/view/AlignH.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AlignH;
    return {
        setters: [],
        execute: function () {
            (function (AlignH) {
                AlignH[AlignH["LEFT"] = 0] = "LEFT";
                AlignH[AlignH["MIDDLE"] = 1] = "MIDDLE";
                AlignH[AlignH["RIGHT"] = 2] = "RIGHT";
                AlignH[AlignH["FULL"] = 3] = "FULL";
            })(AlignH || (AlignH = {}));
            exports_1("AlignH", AlignH);
            exports_1("default", AlignH);
        }
    };
});
System.register("davinci-newton/view/AlignV.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AlignV;
    return {
        setters: [],
        execute: function () {
            (function (AlignV) {
                AlignV[AlignV["TOP"] = 0] = "TOP";
                AlignV[AlignV["MIDDLE"] = 1] = "MIDDLE";
                AlignV[AlignV["BOTTOM"] = 2] = "BOTTOM";
                AlignV[AlignV["FULL"] = 3] = "FULL";
            })(AlignV || (AlignV = {}));
            exports_1("AlignV", AlignV);
            exports_1("default", AlignV);
        }
    };
});
System.register('davinci-newton/checks/mustBeFinite.js', [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function mustBeFinite(value) {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error('not a finite number ' + value);
        }
        return value;
    }
    exports_1("default", mustBeFinite);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/view/CoordMap.js", ["./AffineTransform", "./AlignH", "./AlignV", "./DoubleRect", "../checks/mustBeFinite", "./Point", "./ScreenRect"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AffineTransform_1, AlignH_1, AlignV_1, DoubleRect_1, mustBeFinite_1, Point_1, ScreenRect_1, MIN_SIZE, CoordMap;
    return {
        setters: [function (AffineTransform_1_1) {
            AffineTransform_1 = AffineTransform_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (mustBeFinite_1_1) {
            mustBeFinite_1 = mustBeFinite_1_1;
        }, function (Point_1_1) {
            Point_1 = Point_1_1;
        }, function (ScreenRect_1_1) {
            ScreenRect_1 = ScreenRect_1_1;
        }],
        execute: function () {
            MIN_SIZE = 1E-15;
            CoordMap = function () {
                function CoordMap(screen_left, screen_bottom, sim_left, sim_bottom, pixel_per_unit_x, pixel_per_unit_y) {
                    this.screen_left_ = mustBeFinite_1.default(screen_left);
                    this.screen_bottom_ = mustBeFinite_1.default(screen_bottom);
                    this.sim_left_ = mustBeFinite_1.default(sim_left);
                    this.sim_bottom_ = mustBeFinite_1.default(sim_bottom);
                    this.pixel_per_unit_x_ = mustBeFinite_1.default(pixel_per_unit_x);
                    this.pixel_per_unit_y_ = mustBeFinite_1.default(pixel_per_unit_y);
                    var at = AffineTransform_1.default.IDENTITY;
                    at = at.translate(this.screen_left_, this.screen_bottom_);
                    at = at.scale(this.pixel_per_unit_x_, -this.pixel_per_unit_y_);
                    at = at.translate(-this.sim_left_, -this.sim_bottom_);
                    this.transform_ = at;
                }
                CoordMap.make = function (screenRect, simRect, horizAlign, verticalAlign, aspectRatio) {
                    if (horizAlign === void 0) {
                        horizAlign = AlignH_1.default.MIDDLE;
                    }
                    if (verticalAlign === void 0) {
                        verticalAlign = AlignV_1.default.MIDDLE;
                    }
                    if (aspectRatio === void 0) {
                        aspectRatio = 1;
                    }
                    if (aspectRatio < MIN_SIZE || !isFinite(aspectRatio)) {
                        throw new Error('bad aspectRatio ' + aspectRatio);
                    }
                    var simLeft = simRect.getLeft();
                    var simBottom = simRect.getBottom();
                    var sim_width = simRect.getRight() - simLeft;
                    var sim_height = simRect.getTop() - simBottom;
                    if (sim_width < MIN_SIZE || sim_height < MIN_SIZE) {
                        throw new Error('simRect cannot be empty ' + simRect);
                    }
                    var screen_top = screenRect.getTop();
                    var screen_left = screenRect.getLeft();
                    var screen_width = screenRect.getWidth();
                    var screen_height = screenRect.getHeight();
                    var offset_x = 0;
                    var offset_y = 0;
                    var pixel_per_unit_x = 0;
                    var pixel_per_unit_y = 0;
                    if (horizAlign === AlignH_1.default.FULL) {
                        pixel_per_unit_x = screen_width / sim_width;
                        offset_x = 0;
                    }
                    if (verticalAlign === AlignV_1.default.FULL) {
                        pixel_per_unit_y = screen_height / sim_height;
                        offset_y = 0;
                    }
                    if (horizAlign !== AlignH_1.default.FULL || verticalAlign !== AlignV_1.default.FULL) {
                        var horizFull;
                        if (horizAlign === AlignH_1.default.FULL) {
                            pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                            horizFull = true;
                        } else if (verticalAlign === AlignV_1.default.FULL) {
                            pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                            horizFull = false;
                        } else {
                            pixel_per_unit_x = screen_width / sim_width;
                            pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                            horizFull = true;
                            var ideal_height = Math.floor(0.5 + pixel_per_unit_y * sim_height);
                            if (screen_height < ideal_height) {
                                pixel_per_unit_y = screen_height / sim_height;
                                pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                                horizFull = false;
                            }
                        }
                        if (!horizFull) {
                            offset_y = 0;
                            var ideal_width = Math.floor(0.5 + sim_width * pixel_per_unit_x);
                            switch (horizAlign) {
                                case AlignH_1.default.LEFT:
                                    offset_x = 0;
                                    break;
                                case AlignH_1.default.MIDDLE:
                                    offset_x = (screen_width - ideal_width) / 2;
                                    break;
                                case AlignH_1.default.RIGHT:
                                    offset_x = screen_width - ideal_width;
                                    break;
                                default:
                                    throw new Error();
                            }
                        } else {
                            offset_x = 0;
                            var ideal_height = Math.floor(0.5 + sim_height * pixel_per_unit_y);
                            switch (verticalAlign) {
                                case AlignV_1.default.BOTTOM:
                                    offset_y = 0;
                                    break;
                                case AlignV_1.default.MIDDLE:
                                    offset_y = (screen_height - ideal_height) / 2;
                                    break;
                                case AlignV_1.default.TOP:
                                    offset_y = screen_height - ideal_height;
                                    break;
                                default:
                                    {
                                        throw new Error();
                                    }
                            }
                        }
                    }
                    var coordMap = new CoordMap(screen_left, screen_top + screen_height, simLeft - offset_x / pixel_per_unit_x, simBottom - offset_y / pixel_per_unit_y, pixel_per_unit_x, pixel_per_unit_y);
                    return coordMap;
                };
                CoordMap.isDuckType = function (obj) {
                    if (obj instanceof CoordMap) {
                        return true;
                    }
                    return obj.getAffineTransform !== undefined && obj.simToScreenX !== undefined && obj.simToScreenY !== undefined && obj.screenToSimX !== undefined && obj.screenToSimY !== undefined && obj.getScaleX !== undefined && obj.getScaleY !== undefined;
                };
                CoordMap.prototype.getAffineTransform = function () {
                    return this.transform_;
                };
                CoordMap.prototype.getScaleX = function () {
                    return this.pixel_per_unit_x_;
                };
                CoordMap.prototype.getScaleY = function () {
                    return this.pixel_per_unit_y_;
                };
                CoordMap.prototype.screenToSim = function (scr_x, scr_y) {
                    return new Point_1.default(this.screenToSimX(scr_x), this.screenToSimY(scr_y));
                };
                CoordMap.prototype.screenToSimRect = function (rect) {
                    return new DoubleRect_1.default(this.screenToSimX(rect.getLeft()), this.screenToSimY(rect.getTop() + rect.getHeight()), this.screenToSimX(rect.getLeft() + rect.getWidth()), this.screenToSimY(rect.getTop()));
                };
                CoordMap.prototype.screenToSimScaleX = function (scr_x) {
                    return scr_x / this.pixel_per_unit_x_;
                };
                CoordMap.prototype.screenToSimScaleY = function (scr_y) {
                    return scr_y / this.pixel_per_unit_y_;
                };
                CoordMap.prototype.screenToSimX = function (scr_x) {
                    return this.sim_left_ + (scr_x - this.screen_left_) / this.pixel_per_unit_x_;
                };
                CoordMap.prototype.screenToSimY = function (scr_y) {
                    return this.sim_bottom_ + (this.screen_bottom_ - scr_y) / this.pixel_per_unit_y_;
                };
                CoordMap.prototype.simToScreen = function (p_sim) {
                    return new Point_1.default(this.simToScreenX(p_sim.x), this.simToScreenY(p_sim.y));
                };
                CoordMap.prototype.simToScreenRect = function (r) {
                    return new ScreenRect_1.default(this.simToScreenX(r.getLeft()), this.simToScreenY(r.getTop()), this.simToScreenScaleX(r.getWidth()), this.simToScreenScaleY(r.getHeight()));
                };
                CoordMap.prototype.simToScreenScaleX = function (length_x) {
                    return length_x * this.pixel_per_unit_x_;
                };
                CoordMap.prototype.simToScreenScaleY = function (length_y) {
                    return length_y * this.pixel_per_unit_y_;
                };
                CoordMap.prototype.simToScreenX = function (sim_x) {
                    return this.screen_left_ + (sim_x - this.sim_left_) * this.pixel_per_unit_x_;
                };
                CoordMap.prototype.simToScreenY = function (sim_y) {
                    return this.screen_bottom_ - (sim_y - this.sim_bottom_) * this.pixel_per_unit_y_;
                };
                return CoordMap;
            }();
            exports_1("default", CoordMap);
        }
    };
});
System.register("davinci-newton/util/insertAt.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function slice(xs, start, opt_end) {
        if (arguments.length <= 2) {
            return Array.prototype.slice.call(xs, start);
        } else {
            return Array.prototype.slice.call(xs, start, opt_end);
        }
    }
    function splice(xs, index, howMany, var_args) {
        return Array.prototype.splice.apply(xs, slice(arguments, 1));
    }
    function insertAt(xs, x, index) {
        if (index === void 0) {
            index = 0;
        }
        splice(xs, index, 0, x);
    }
    exports_1("default", insertAt);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/view/DisplayList.js", ["../util/AbstractSubject", "../util/GenericEvent", "../util/insertAt", "../checks/isObject"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, GenericEvent_1, insertAt_1, isObject_1, DisplayList;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (insertAt_1_1) {
            insertAt_1 = insertAt_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }],
        execute: function () {
            DisplayList = function (_super) {
                __extends(DisplayList, _super);
                function DisplayList() {
                    var _this = _super.call(this) || this;
                    _this.drawables_ = [];
                    return _this;
                }
                DisplayList.prototype.add = function (dispObj) {
                    if (!isObject_1.default(dispObj)) {
                        throw new Error('non-object passed to DisplayList.add');
                    }
                    var zIndex = dispObj.getZIndex();
                    this.sort();
                    for (var i = 0, n = this.drawables_.length; i < n; i++) {
                        var z = this.drawables_[i].getZIndex();
                        if (zIndex < z) {
                            break;
                        }
                    }
                    insertAt_1.default(this.drawables_, dispObj, i);
                    this.broadcast(new GenericEvent_1.default(this, DisplayList.OBJECT_ADDED, dispObj));
                };
                DisplayList.prototype.draw = function (context, coordMap) {
                    this.sort();
                    var ds = this.drawables_;
                    var N = ds.length;
                    for (var i = 0; i < N; i++) {
                        ds[i].draw(context, coordMap);
                    }
                };
                DisplayList.prototype.prepend = function (dispObj) {
                    if (!isObject_1.default(dispObj)) {
                        throw new Error('non-object passed to DisplayList.add');
                    }
                    var zIndex = dispObj.getZIndex();
                    this.sort();
                    var N = this.drawables_.length;
                    for (var i = N; i > 0; i--) {
                        var z = this.drawables_[i - 1].getZIndex();
                        if (zIndex > z) {
                            break;
                        }
                    }
                    insertAt_1.default(this.drawables_, dispObj, i);
                    this.broadcast(new GenericEvent_1.default(this, DisplayList.OBJECT_ADDED, dispObj));
                };
                DisplayList.prototype.sort = function () {};
                return DisplayList;
            }(AbstractSubject_1.default);
            DisplayList.OBJECT_ADDED = 'OBJECT_ADDED';
            DisplayList.OBJECT_REMOVED = 'OBJECT_REMOVED';
            exports_1("DisplayList", DisplayList);
            exports_1("default", DisplayList);
        }
    };
});
System.register("davinci-newton/view/Point.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Point;
    return {
        setters: [],
        execute: function () {
            Point = function () {
                function Point(x_, y_) {
                    this.x_ = x_;
                    this.y_ = y_;
                }
                Object.defineProperty(Point.prototype, "x", {
                    get: function () {
                        return this.x_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Point.prototype, "y", {
                    get: function () {
                        return this.y_;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Point;
            }();
            exports_1("default", Point);
        }
    };
});
System.register("davinci-newton/view/DoubleRect.js", ["./Point", "../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Point_1, veryDifferent_1, DoubleRect;
    return {
        setters: [function (Point_1_1) {
            Point_1 = Point_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            DoubleRect = function () {
                function DoubleRect(left, bottom, right, top) {
                    this.left_ = left;
                    this.right_ = right;
                    this.bottom_ = bottom;
                    this.top_ = top;
                    if (left > right) {
                        throw new Error('DoubleRect: left > right ' + left + ' > ' + right);
                    }
                    if (bottom > top) {
                        throw new Error('DoubleRect: bottom > top ' + bottom + ' > ' + top);
                    }
                }
                DoubleRect.clone = function (rect) {
                    return new DoubleRect(rect.getLeft(), rect.getBottom(), rect.getRight(), rect.getTop());
                };
                DoubleRect.isDuckType = function (obj) {
                    if (obj instanceof DoubleRect) {
                        return true;
                    }
                    return obj.getLeft !== undefined && obj.getRight !== undefined && obj.getTop !== undefined && obj.getBottom !== undefined && obj.translate !== undefined && obj.scale !== undefined;
                };
                DoubleRect.make = function (point1, point2) {
                    var left = Math.min(point1.x, point2.x);
                    var right = Math.max(point1.x, point2.x);
                    var bottom = Math.min(point1.y, point2.y);
                    var top_ = Math.max(point1.y, point2.y);
                    return new DoubleRect(left, bottom, right, top_);
                };
                DoubleRect.makeCentered = function (center, width, height) {
                    var x = center.x;
                    var y = center.y;
                    return new DoubleRect(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
                };
                ;
                DoubleRect.makeCentered2 = function (center, size) {
                    var x = center.x;
                    var y = center.y;
                    var w = size.x;
                    var h = size.y;
                    return new DoubleRect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
                };
                DoubleRect.prototype.contains = function (point) {
                    return point.x >= this.left_ && point.x <= this.right_ && point.y >= this.bottom_ && point.y <= this.top_;
                };
                DoubleRect.prototype.equals = function (obj) {
                    if (obj === this) return true;
                    if (obj instanceof DoubleRect) {
                        return obj.getLeft() === this.left_ && obj.getRight() === this.right_ && obj.getBottom() === this.bottom_ && obj.getTop() === this.top_;
                    } else {
                        return false;
                    }
                };
                DoubleRect.prototype.expand = function (marginX, marginY) {
                    marginY = marginY === undefined ? marginX : marginY;
                    return new DoubleRect(this.getLeft() - marginX, this.getBottom() - marginY, this.getRight() + marginX, this.getTop() + marginX);
                };
                DoubleRect.prototype.getBottom = function () {
                    return this.bottom_;
                };
                DoubleRect.prototype.getCenter = function () {
                    return new Point_1.default(this.getCenterX(), this.getCenterY());
                };
                DoubleRect.prototype.getCenterX = function () {
                    return (this.left_ + this.right_) / 2.0;
                };
                DoubleRect.prototype.getCenterY = function () {
                    return (this.bottom_ + this.top_) / 2.0;
                };
                DoubleRect.prototype.getHeight = function () {
                    return this.top_ - this.bottom_;
                };
                DoubleRect.prototype.getLeft = function () {
                    return this.left_;
                };
                DoubleRect.prototype.getRight = function () {
                    return this.right_;
                };
                DoubleRect.prototype.getTop = function () {
                    return this.top_;
                };
                DoubleRect.prototype.getWidth = function () {
                    return this.right_ - this.left_;
                };
                DoubleRect.prototype.isEmpty = function (tolerance) {
                    if (tolerance === void 0) {
                        tolerance = 1E-16;
                    }
                    return this.getWidth() < tolerance || this.getHeight() < tolerance;
                };
                DoubleRect.prototype.maybeVisible = function (p1, p2) {
                    if (this.contains(p1) || this.contains(p2)) {
                        return true;
                    }
                    var p1x = p1.x;
                    var p1y = p1.y;
                    var p2x = p2.x;
                    var p2y = p2.y;
                    var d = this.left_;
                    if (p1x < d && p2x < d) {
                        return false;
                    }
                    d = this.right_;
                    if (p1x > d && p2x > d) {
                        return false;
                    }
                    d = this.bottom_;
                    if (p1y < d && p2y < d) {
                        return false;
                    }
                    d = this.top_;
                    if (p1y > d && p2y > d) {
                        return false;
                    }
                    return true;
                };
                DoubleRect.prototype.nearEqual = function (rect, opt_tolerance) {
                    if (veryDifferent_1.default(this.left_, rect.getLeft(), opt_tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.bottom_, rect.getBottom(), opt_tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.right_, rect.getRight(), opt_tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.top_, rect.getTop(), opt_tolerance)) {
                        return false;
                    }
                    return true;
                };
                DoubleRect.prototype.scale = function (factorX, factorY) {
                    factorY = factorY === undefined ? factorX : factorY;
                    var x0 = this.getCenterX();
                    var y0 = this.getCenterY();
                    var w = this.getWidth();
                    var h = this.getHeight();
                    return new DoubleRect(x0 - factorX * w / 2, y0 - factorY * h / 2, x0 + factorX * w / 2, y0 + factorY * h / 2);
                };
                DoubleRect.prototype.translate = function (x, y) {
                    return new DoubleRect(this.left_ + x, this.bottom_ + y, this.right_ + x, this.top_ + y);
                };
                DoubleRect.prototype.union = function (rect) {
                    return new DoubleRect(Math.min(this.left_, rect.getLeft()), Math.min(this.bottom_, rect.getBottom()), Math.max(this.right_, rect.getRight()), Math.max(this.top_, rect.getTop()));
                };
                DoubleRect.prototype.unionPoint = function (point) {
                    return new DoubleRect(Math.min(this.left_, point.x), Math.min(this.bottom_, point.y), Math.max(this.right_, point.x), Math.max(this.top_, point.y));
                };
                return DoubleRect;
            }();
            DoubleRect.EMPTY_RECT = new DoubleRect(0, 0, 0, 0);
            exports_1("default", DoubleRect);
        }
    };
});
System.register("davinci-newton/view/ScreenRect.js", ["../checks/isFunction", "../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var isFunction_1, veryDifferent_1, ScreenRect;
    return {
        setters: [function (isFunction_1_1) {
            isFunction_1 = isFunction_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            ScreenRect = function () {
                function ScreenRect(left, top_, width, height) {
                    if (width < 0 || height < 0) {
                        throw new Error();
                    }
                    this.left_ = left;
                    this.top_ = top_;
                    this.width_ = width;
                    this.height_ = height;
                }
                ScreenRect.clone = function (rect) {
                    return new ScreenRect(rect.left_, rect.top_, rect.width_, rect.height_);
                };
                ScreenRect.prototype.equals = function (otherRect) {
                    return this.left_ === otherRect.left_ && this.top_ === otherRect.top_ && this.width_ === otherRect.width_ && this.height_ === otherRect.height_;
                };
                ScreenRect.isDuckType = function (obj) {
                    if (obj instanceof ScreenRect) {
                        return true;
                    }
                    return obj.getLeft !== undefined && obj.getTop !== undefined && obj.getWidth !== undefined && obj.getHeight !== undefined && obj.isEmpty !== undefined && obj.equals !== undefined && obj.nearEqual !== undefined;
                };
                ScreenRect.prototype.getCenterX = function () {
                    return this.left_ + this.width_ / 2;
                };
                ScreenRect.prototype.getCenterY = function () {
                    return this.top_ + this.height_ / 2;
                };
                ScreenRect.prototype.getHeight = function () {
                    return this.height_;
                };
                ScreenRect.prototype.getLeft = function () {
                    return this.left_;
                };
                ScreenRect.prototype.getTop = function () {
                    return this.top_;
                };
                ScreenRect.prototype.getWidth = function () {
                    return this.width_;
                };
                ScreenRect.prototype.isEmpty = function (tolerance) {
                    if (tolerance === void 0) {
                        tolerance = 1E-14;
                    }
                    return this.width_ < tolerance || this.height_ < tolerance;
                };
                ScreenRect.prototype.makeOval = function (context) {
                    var w = this.width_ / 2;
                    var h = this.height_ / 2;
                    if (isFunction_1.default(context.ellipse)) {
                        context.beginPath();
                        context.moveTo(this.left_ + this.width_, this.top_ + h);
                        context.ellipse(this.left_ + w, this.top_ + h, w, h, 0, 0, 2 * Math.PI, false);
                    } else {
                        var min = Math.min(w, h);
                        context.beginPath();
                        context.moveTo(this.left_ + this.width_, this.top_);
                        context.arc(this.left_ + w, this.top_ + h, min, 0, 2 * Math.PI, false);
                        context.closePath();
                    }
                };
                ScreenRect.prototype.makeRect = function (context) {
                    context.rect(this.left_, this.top_, this.width_, this.height_);
                };
                ScreenRect.prototype.nearEqual = function (otherRect, opt_tolerance) {
                    if (veryDifferent_1.default(this.left_, otherRect.left_, opt_tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.top_, otherRect.top_, opt_tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.width_, otherRect.width_, opt_tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.height_, otherRect.height_, opt_tolerance)) {
                        return false;
                    }
                    return true;
                };
                return ScreenRect;
            }();
            ScreenRect.EMPTY_RECT = new ScreenRect(0, 0, 0, 0);
            exports_1("default", ScreenRect);
        }
    };
});
System.register("davinci-newton/view/SimView.js", ["../util/AbstractSubject", "./AlignH", "./AlignV", "../util/clone", "../util/contains", "./CoordMap", "./DisplayList", "./DoubleRect", "../util/GenericEvent", "../util/ParameterBoolean", "../util/ParameterNumber", "../util/remove", "./ScreenRect", "../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, AlignH_1, AlignV_1, clone_1, contains_1, CoordMap_1, DisplayList_1, DoubleRect_1, GenericEvent_1, ParameterBoolean_1, ParameterNumber_1, remove_1, ScreenRect_1, veryDifferent_1, SimView;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (clone_1_1) {
            clone_1 = clone_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (CoordMap_1_1) {
            CoordMap_1 = CoordMap_1_1;
        }, function (DisplayList_1_1) {
            DisplayList_1 = DisplayList_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (ParameterBoolean_1_1) {
            ParameterBoolean_1 = ParameterBoolean_1_1;
        }, function (ParameterNumber_1_1) {
            ParameterNumber_1 = ParameterNumber_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }, function (ScreenRect_1_1) {
            ScreenRect_1 = ScreenRect_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            SimView = function (_super) {
                __extends(SimView, _super);
                function SimView(simRect) {
                    var _this = _super.call(this) || this;
                    _this.panX = 0.05;
                    _this.panY = 0.05;
                    _this.zoom = 1.1;
                    _this.screenRect_ = new ScreenRect_1.default(0, 0, 800, 600);
                    _this.horizAlign_ = AlignH_1.default.MIDDLE;
                    _this.verticalAlign_ = AlignV_1.default.MIDDLE;
                    _this.aspectRatio_ = 1.0;
                    _this.displayList_ = new DisplayList_1.default();
                    _this.scaleTogether_ = true;
                    _this.opaqueness = 1.0;
                    _this.memorizables_ = [];
                    if (!(simRect instanceof DoubleRect_1.default) || simRect.isEmpty()) {
                        throw new Error('bad simRect: ' + simRect);
                    }
                    _this.simRect_ = simRect;
                    _this.coordMap_ = CoordMap_1.default.make(_this.screenRect_, _this.simRect_, _this.horizAlign_, _this.verticalAlign_, _this.aspectRatio_);
                    _this.width_ = simRect.getWidth();
                    _this.height_ = simRect.getHeight();
                    _this.centerX_ = simRect.getCenterX();
                    _this.centerY_ = simRect.getCenterY();
                    _this.ratio_ = _this.height_ / _this.width_;
                    _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_WIDTH, function () {
                        return _this.getWidth();
                    }, function (width) {
                        return _this.setWidth(width);
                    }));
                    _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_HEIGHT, function () {
                        return _this.getHeight();
                    }, function (height) {
                        return _this.setHeight(height);
                    }));
                    _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_CENTER_X, function () {
                        return _this.getCenterX();
                    }, function (centerX) {
                        return _this.setCenterX(centerX);
                    }).setLowerLimit(Number.NEGATIVE_INFINITY));
                    _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_CENTER_Y, function () {
                        return _this.getCenterY();
                    }, function (centerY) {
                        return _this.setCenterY(centerY);
                    }).setLowerLimit(Number.NEGATIVE_INFINITY));
                    _this.addParameter(new ParameterBoolean_1.default(_this, SimView.PARAM_NAME_SCALE_TOGETHER, function () {
                        return _this.getScaleTogether();
                    }, function (scaleTogether) {
                        return _this.setScaleTogether(scaleTogether);
                    }));
                    _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_VERTICAL_ALIGN, function () {
                        return _this.vAxisAlign;
                    }, function (vAxisAlign) {
                        return _this.vAxisAlign = vAxisAlign;
                    }));
                    _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_HORIZONTAL_ALIGN, function () {
                        return _this.hAxisAlign;
                    }, function (hAxisAlign) {
                        return _this.hAxisAlign = hAxisAlign;
                    }));
                    _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_ASPECT_RATIO, function () {
                        return _this.getAspectRatio();
                    }, function (aspectRatio) {
                        return _this.setAspectRatio(aspectRatio);
                    }));
                    return _this;
                }
                ;
                SimView.prototype.addMemo = function (memorizable) {
                    if (!contains_1.default(this.memorizables_, memorizable)) {
                        this.memorizables_.push(memorizable);
                    }
                };
                SimView.prototype.gainFocus = function () {};
                SimView.prototype.getAspectRatio = function () {
                    return this.aspectRatio_;
                };
                SimView.prototype.getCenterX = function () {
                    return this.centerX_;
                };
                SimView.prototype.getCenterY = function () {
                    return this.centerY_;
                };
                SimView.prototype.getCoordMap = function () {
                    return this.coordMap_;
                };
                SimView.prototype.getDisplayList = function () {
                    return this.displayList_;
                };
                SimView.prototype.getHeight = function () {
                    return this.height_;
                };
                Object.defineProperty(SimView.prototype, "hAxisAlign", {
                    get: function () {
                        return this.horizAlign_;
                    },
                    set: function (alignHoriz) {
                        this.horizAlign_ = alignHoriz;
                        this.realign();
                        this.broadcastParameter(SimView.PARAM_NAME_HORIZONTAL_ALIGN);
                    },
                    enumerable: true,
                    configurable: true
                });
                SimView.prototype.getMemos = function () {
                    return clone_1.default(this.memorizables_);
                };
                SimView.prototype.getScaleTogether = function () {
                    return this.scaleTogether_;
                };
                SimView.prototype.getScreenRect = function () {
                    return this.screenRect_;
                };
                SimView.prototype.getSimRect = function () {
                    return this.simRect_;
                };
                Object.defineProperty(SimView.prototype, "vAxisAlign", {
                    get: function () {
                        return this.verticalAlign_;
                    },
                    set: function (alignVert) {
                        this.verticalAlign_ = alignVert;
                        this.realign();
                        this.broadcastParameter(SimView.PARAM_NAME_VERTICAL_ALIGN);
                    },
                    enumerable: true,
                    configurable: true
                });
                SimView.prototype.getWidth = function () {
                    return this.width_;
                };
                SimView.prototype.loseFocus = function () {};
                SimView.prototype.paint = function (context) {
                    context.save();
                    context.globalAlpha = this.opaqueness;
                    this.displayList_.draw(context, this.coordMap_);
                    context.restore();
                };
                SimView.prototype.setCoordMap = function (map) {
                    if (!CoordMap_1.default.isDuckType(map)) throw new Error('not a CoordMap: ' + map);
                    this.coordMap_ = map;
                    this.broadcast(new GenericEvent_1.default(this, SimView.COORD_MAP_CHANGED));
                };
                SimView.prototype.setScreenRect = function (screenRect) {
                    if (!ScreenRect_1.default.isDuckType(screenRect)) throw new Error('not a ScreenRect: ' + screenRect);
                    if (screenRect.isEmpty()) {
                        throw new Error('empty screenrect');
                    }
                    if (!this.screenRect_.equals(screenRect)) {
                        this.screenRect_ = screenRect;
                        this.realign();
                        this.broadcast(new GenericEvent_1.default(this, SimView.SCREEN_RECT_CHANGED));
                    }
                };
                SimView.prototype.setSimRect = function (simRect) {
                    if (!DoubleRect_1.default.isDuckType(simRect)) throw new Error('not a DoubleRect: ' + simRect);
                    if (!simRect.equals(this.simRect_)) {
                        this.simRect_ = simRect;
                        this.realign();
                        this.broadcastParameter(SimView.PARAM_NAME_WIDTH);
                        this.broadcastParameter(SimView.PARAM_NAME_HEIGHT);
                        this.broadcastParameter(SimView.PARAM_NAME_CENTER_X);
                        this.broadcastParameter(SimView.PARAM_NAME_CENTER_Y);
                        this.broadcast(new GenericEvent_1.default(this, SimView.SIM_RECT_CHANGED));
                    }
                };
                SimView.prototype.memorize = function () {
                    for (var i = 0, n = this.memorizables_.length; i < n; i++) {
                        this.memorizables_[i].memorize();
                    }
                };
                SimView.prototype.realign = function () {
                    this.setCoordMap(CoordMap_1.default.make(this.screenRect_, this.simRect_, this.horizAlign_, this.verticalAlign_, this.aspectRatio_));
                    this.width_ = this.simRect_.getWidth();
                    this.height_ = this.simRect_.getHeight();
                    this.centerX_ = this.simRect_.getCenterX();
                    this.centerY_ = this.simRect_.getCenterY();
                    this.ratio_ = this.height_ / this.width_;
                };
                SimView.prototype.modifySimRect = function () {
                    var left = this.centerX_ - this.width_ / 2.0;
                    var bottom = this.centerY_ - this.height_ / 2.0;
                    var r = new DoubleRect_1.default(left, bottom, left + this.width_, bottom + this.height_);
                    this.setSimRect(r);
                };
                SimView.prototype.panDown = function () {
                    this.setCenterY(this.centerY_ - this.panY * this.height_);
                };
                SimView.prototype.panLeft = function () {
                    this.setCenterX(this.centerX_ - this.panX * this.width_);
                };
                SimView.prototype.panRight = function () {
                    this.setCenterX(this.centerX_ + this.panX * this.width_);
                };
                SimView.prototype.panUp = function () {
                    this.setCenterY(this.centerY_ + this.panY * this.height_);
                };
                SimView.prototype.removeMemo = function (memorizable) {
                    remove_1.default(this.memorizables_, memorizable);
                };
                SimView.prototype.setAspectRatio = function (aspectRatio) {
                    if (veryDifferent_1.default(this.aspectRatio_, aspectRatio)) {
                        this.aspectRatio_ = aspectRatio;
                        this.realign();
                        this.broadcastParameter(SimView.PARAM_NAME_ASPECT_RATIO);
                    }
                };
                SimView.prototype.setCenterX = function (centerX) {
                    if (veryDifferent_1.default(this.centerX_, centerX)) {
                        this.centerX_ = centerX;
                        this.modifySimRect();
                    }
                };
                SimView.prototype.setCenterY = function (value) {
                    if (veryDifferent_1.default(this.centerY_, value)) {
                        this.centerY_ = value;
                        this.modifySimRect();
                    }
                };
                SimView.prototype.setHeight = function (value) {
                    if (veryDifferent_1.default(this.height_, value)) {
                        this.height_ = value;
                        if (this.scaleTogether_) {
                            this.width_ = this.height_ / this.ratio_;
                        }
                        this.modifySimRect();
                    }
                };
                SimView.prototype.setScaleTogether = function (value) {
                    if (this.scaleTogether_ !== value) {
                        this.scaleTogether_ = value;
                        if (this.scaleTogether_) {
                            this.ratio_ = this.height_ / this.width_;
                        }
                        this.broadcastParameter(SimView.PARAM_NAME_SCALE_TOGETHER);
                    }
                };
                SimView.prototype.setWidth = function (value) {
                    if (veryDifferent_1.default(this.width_, value)) {
                        this.width_ = value;
                        if (this.scaleTogether_) {
                            this.height_ = this.width_ * this.ratio_;
                        }
                        this.modifySimRect();
                    }
                };
                SimView.prototype.zoomIn = function () {
                    this.setHeight(this.height_ / this.zoom);
                };
                SimView.prototype.zoomOut = function () {
                    this.setHeight(this.height_ * this.zoom);
                };
                return SimView;
            }(AbstractSubject_1.default);
            SimView.PARAM_NAME_WIDTH = 'width';
            SimView.PARAM_NAME_HEIGHT = 'height';
            SimView.PARAM_NAME_CENTER_X = 'center-x';
            SimView.PARAM_NAME_CENTER_Y = 'center-y';
            SimView.PARAM_NAME_HORIZONTAL_ALIGN = 'horizontal-align';
            SimView.PARAM_NAME_VERTICAL_ALIGN = 'vertical-align';
            SimView.PARAM_NAME_ASPECT_RATIO = 'aspect-ratio';
            SimView.PARAM_NAME_SCALE_TOGETHER = 'scale X-Y together';
            SimView.COORD_MAP_CHANGED = 'COORD_MAP_CHANGED';
            SimView.SCREEN_RECT_CHANGED = 'SCREEN_RECT_CHANGED';
            SimView.SIM_RECT_CHANGED = 'SIM_RECT_CHANGED';
            exports_1("SimView", SimView);
            exports_1("default", SimView);
        }
    };
});
System.register("davinci-newton/math/Mat3.js", ["./Matrix3"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Matrix3_1, Mat3;
    return {
        setters: [function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }],
        execute: function () {
            Mat3 = function () {
                function Mat3(source) {
                    this.data = Matrix3_1.default.one();
                    var n11 = source.getElement(0, 0);
                    var n12 = source.getElement(0, 1);
                    var n13 = source.getElement(0, 2);
                    var n21 = source.getElement(1, 0);
                    var n22 = source.getElement(1, 1);
                    var n23 = source.getElement(1, 2);
                    var n31 = source.getElement(2, 0);
                    var n32 = source.getElement(2, 1);
                    var n33 = source.getElement(2, 2);
                    this.data.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
                }
                Object.defineProperty(Mat3.prototype, "dimensions", {
                    get: function () {
                        return 3;
                    },
                    enumerable: true,
                    configurable: true
                });
                Mat3.prototype.getElement = function (row, column) {
                    return this.data.getElement(row, column);
                };
                Mat3.prototype.row = function (i) {
                    return this.data.row(i);
                };
                Mat3.prototype.toString = function (radix) {
                    return this.data.toString(radix);
                };
                return Mat3;
            }();
            exports_1("Mat3", Mat3);
            exports_1("default", Mat3);
        }
    };
});
System.register("davinci-newton/checks/isDefined.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isDefined(arg) {
        return typeof arg !== 'undefined';
    }
    exports_1("default", isDefined);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustBeDefined.js", ["../checks/mustSatisfy", "../checks/isDefined"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function beDefined() {
        return "not be 'undefined'";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
        return value;
    }
    exports_1("default", mustBeDefined);
    var mustSatisfy_1, isDefined_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/isInteger.js", ["../checks/isNumber"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    exports_1("default", isInteger);
    var isNumber_1;
    return {
        setters: [function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustBeInteger.js", ["../checks/mustSatisfy", "../checks/isInteger"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function beAnInteger() {
        return "be an integer";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
        return value;
    }
    exports_1("default", mustBeInteger);
    var mustSatisfy_1, isInteger_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isInteger_1_1) {
            isInteger_1 = isInteger_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/isUndefined.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isUndefined(arg) {
        return typeof arg === 'undefined';
    }
    exports_1("default", isUndefined);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/expectArg.js", ["../checks/isUndefined", "../checks/mustBeNumber"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function message(standard, override) {
        return isUndefined_1.default(override) ? standard : override();
    }
    function expectArg(name, value) {
        var arg = {
            toSatisfy: function (condition, message) {
                if (isUndefined_1.default(condition)) {
                    throw new Error("condition must be specified");
                }
                if (isUndefined_1.default(message)) {
                    throw new Error("message must be specified");
                }
                if (!condition) {
                    throw new Error(message);
                }
                return arg;
            },
            toBeBoolean: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'boolean') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
                }
                return arg;
            },
            toBeDefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue === 'undefined') {
                    var message_1 = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
                    throw new Error(message_1);
                }
                return arg;
            },
            toBeInClosedInterval: function (lower, upper) {
                var something = value;
                var x = something;
                mustBeNumber_1.default('x', x);
                if (x >= lower && x <= upper) {
                    return arg;
                } else {
                    var message_2 = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
                    throw new Error(message_2);
                }
            },
            toBeFunction: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'function') {
                    var message_3 = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
                    throw new Error(message_3);
                }
                return arg;
            },
            toBeNumber: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'number') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
                }
                return arg;
            },
            toBeObject: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'object') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
                }
                return arg;
            },
            toBeString: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'string') {
                    var message_4 = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
                    throw new Error(message_4);
                }
                return arg;
            },
            toBeUndefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'undefined') {
                    var message_5 = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
                    throw new Error(message_5);
                }
                return arg;
            },
            toNotBeNull: function () {
                if (value === null) {
                    var message_6 = "Expecting argument " + name + " to not be null.";
                    throw new Error(message_6);
                } else {
                    return arg;
                }
            },
            get value() {
                return value;
            }
        };
        return arg;
    }
    exports_1("default", expectArg);
    var isUndefined_1, mustBeNumber_1;
    return {
        setters: [function (isUndefined_1_1) {
            isUndefined_1 = isUndefined_1_1;
        }, function (mustBeNumber_1_1) {
            mustBeNumber_1 = mustBeNumber_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/AbstractMatrix.js", ["../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/expectArg"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var mustBeDefined_1, mustBeInteger_1, expectArg_1, AbstractMatrix;
    return {
        setters: [function (mustBeDefined_1_1) {
            mustBeDefined_1 = mustBeDefined_1_1;
        }, function (mustBeInteger_1_1) {
            mustBeInteger_1 = mustBeInteger_1_1;
        }, function (expectArg_1_1) {
            expectArg_1 = expectArg_1_1;
        }],
        execute: function () {
            AbstractMatrix = function () {
                function AbstractMatrix(elements, dimensions) {
                    this._elements = mustBeDefined_1.default('elements', elements);
                    this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
                    this._length = dimensions * dimensions;
                    expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
                    this.modified = false;
                }
                Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
                    get: function () {
                        return this._dimensions;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AbstractMatrix.prototype, "elements", {
                    get: function () {
                        return this._elements;
                    },
                    set: function (elements) {
                        expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
                        this._elements = elements;
                    },
                    enumerable: true,
                    configurable: true
                });
                AbstractMatrix.prototype.copy = function (source) {
                    var N = this.dimensions;
                    for (var i = 0; i < N; i++) {
                        for (var j = 0; j < N; j++) {
                            var value = source.getElement(i, j);
                            this.setElement(i, j, value);
                        }
                    }
                    return this;
                };
                AbstractMatrix.prototype.getElement = function (row, column) {
                    return this.elements[row + column * this._dimensions];
                };
                AbstractMatrix.prototype.isOne = function () {
                    for (var i = 0; i < this._dimensions; i++) {
                        for (var j = 0; j < this._dimensions; j++) {
                            var value = this.getElement(i, j);
                            if (i === j) {
                                if (value !== 1) {
                                    return false;
                                }
                            } else {
                                if (value !== 0) {
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                };
                AbstractMatrix.prototype.setElement = function (row, column, value) {
                    this.elements[row + column * this._dimensions] = value;
                };
                return AbstractMatrix;
            }();
            exports_1("default", AbstractMatrix);
        }
    };
});
System.register("davinci-newton/math/det3x3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function default_1(m) {
        var m00 = m[0x0],
            m01 = m[0x3],
            m02 = m[0x6];
        var m10 = m[0x1],
            m11 = m[0x4],
            m12 = m[0x7];
        var m20 = m[0x2],
            m21 = m[0x5],
            m22 = m[0x8];
        return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
    }
    exports_1("default", default_1);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/inv3x3.js", ["../math/det3x3"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function inv3x3(m, te) {
        var det = det3x3_1.default(m);
        var m11 = m[0x0],
            m12 = m[0x3],
            m13 = m[0x6];
        var m21 = m[0x1],
            m22 = m[0x4],
            m23 = m[0x7];
        var m31 = m[0x2],
            m32 = m[0x5],
            m33 = m[0x8];
        var o11 = m22 * m33 - m23 * m32;
        var o12 = m13 * m32 - m12 * m33;
        var o13 = m12 * m23 - m13 * m22;
        var o21 = m23 * m31 - m21 * m33;
        var o22 = m11 * m33 - m13 * m31;
        var o23 = m13 * m21 - m11 * m23;
        var o31 = m21 * m32 - m22 * m31;
        var o32 = m12 * m31 - m11 * m32;
        var o33 = m11 * m22 - m12 * m21;
        var α = 1 / det;
        te[0x0] = o11 * α;
        te[0x3] = o12 * α;
        te[0x6] = o13 * α;
        te[0x1] = o21 * α;
        te[0x4] = o22 * α;
        te[0x7] = o23 * α;
        te[0x2] = o31 * α;
        te[0x5] = o32 * α;
        te[0x8] = o33 * α;
    }
    exports_1("default", inv3x3);
    var det3x3_1;
    return {
        setters: [function (det3x3_1_1) {
            det3x3_1 = det3x3_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/mul3x3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function mul3x3(a, b, c) {
        var a11 = a[0x0],
            a12 = a[0x3],
            a13 = a[0x6];
        var a21 = a[0x1],
            a22 = a[0x4],
            a23 = a[0x7];
        var a31 = a[0x2],
            a32 = a[0x5],
            a33 = a[0x8];
        var b11 = b[0x0],
            b12 = b[0x3],
            b13 = b[0x6];
        var b21 = b[0x1],
            b22 = b[0x4],
            b23 = b[0x7];
        var b31 = b[0x2],
            b32 = b[0x5],
            b33 = b[0x8];
        c[0x0] = a11 * b11 + a12 * b21 + a13 * b31;
        c[0x3] = a11 * b12 + a12 * b22 + a13 * b32;
        c[0x6] = a11 * b13 + a12 * b23 + a13 * b33;
        c[0x1] = a21 * b11 + a22 * b21 + a23 * b31;
        c[0x4] = a21 * b12 + a22 * b22 + a23 * b32;
        c[0x7] = a21 * b13 + a22 * b23 + a23 * b33;
        c[0x2] = a31 * b11 + a32 * b21 + a33 * b31;
        c[0x5] = a31 * b12 + a32 * b22 + a33 * b32;
        c[0x8] = a31 * b13 + a32 * b23 + a33 * b33;
        return c;
    }
    exports_1("default", mul3x3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/Matrix3.js", ["./AbstractMatrix", "./inv3x3", "./mul3x3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractMatrix_1, inv3x3_1, mul3x3_1, Matrix3;
    return {
        setters: [function (AbstractMatrix_1_1) {
            AbstractMatrix_1 = AbstractMatrix_1_1;
        }, function (inv3x3_1_1) {
            inv3x3_1 = inv3x3_1_1;
        }, function (mul3x3_1_1) {
            mul3x3_1 = mul3x3_1_1;
        }],
        execute: function () {
            Matrix3 = function (_super) {
                __extends(Matrix3, _super);
                function Matrix3(elements) {
                    if (elements === void 0) {
                        elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
                    }
                    return _super.call(this, elements, 3) || this;
                }
                Matrix3.prototype.inv = function () {
                    inv3x3_1.default(this.elements, this.elements);
                    return this;
                };
                Matrix3.prototype.mul = function (rhs) {
                    return this.mul2(this, rhs);
                };
                Matrix3.prototype.rmul = function (lhs) {
                    mul3x3_1.default(lhs.elements, this.elements, this.elements);
                    return this;
                };
                Matrix3.prototype.mul2 = function (a, b) {
                    mul3x3_1.default(a.elements, b.elements, this.elements);
                    return this;
                };
                Matrix3.prototype.rotation = function (spinor) {
                    var x = -spinor.yz;
                    var y = -spinor.zx;
                    var z = -spinor.xy;
                    var α = spinor.a;
                    var x2 = x + x;
                    var y2 = y + y;
                    var z2 = z + z;
                    var xx = x * x2;
                    var xy = x * y2;
                    var xz = x * z2;
                    var yy = y * y2;
                    var yz = y * z2;
                    var zz = z * z2;
                    var wx = α * x2;
                    var wy = α * y2;
                    var wz = α * z2;
                    this.set(1 - yy - zz, xy - wz, xz + wy, xy + wz, 1 - xx - zz, yz - wx, xz - wy, yz + wx, 1 - xx - yy);
                    return this;
                };
                Matrix3.prototype.row = function (i) {
                    var te = this.elements;
                    return [te[0 + i], te[3 + i], te[6 + i]];
                };
                Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
                    var te = this.elements;
                    te[0] = n11;
                    te[3] = n12;
                    te[6] = n13;
                    te[1] = n21;
                    te[4] = n22;
                    te[7] = n23;
                    te[2] = n31;
                    te[5] = n32;
                    te[8] = n33;
                    return this;
                };
                Matrix3.prototype.toString = function (radix) {
                    var text = [];
                    for (var i = 0; i < this.dimensions; i++) {
                        text.push(this.row(i).map(function (element, index) {
                            return element.toString(radix);
                        }).join(' '));
                    }
                    return text.join('\n');
                };
                Matrix3.prototype.transpose = function () {
                    var tmp;
                    var m = this.elements;
                    tmp = m[1];
                    m[1] = m[3];
                    m[3] = tmp;
                    tmp = m[2];
                    m[2] = m[6];
                    m[6] = tmp;
                    tmp = m[5];
                    m[5] = m[7];
                    m[7] = tmp;
                    return this;
                };
                Matrix3.one = function () {
                    return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
                };
                Matrix3.zero = function () {
                    return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
                };
                return Matrix3;
            }(AbstractMatrix_1.default);
            exports_1("Matrix3", Matrix3);
            exports_1("default", Matrix3);
        }
    };
});
System.register("davinci-newton/checks/isFunction.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isFunction(x) {
        return typeof x === 'function';
    }
    exports_1("default", isFunction);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustBeFunction.js", ["../checks/mustSatisfy", "../checks/isFunction"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function beFunction() {
        return "be a function";
    }
    function mustBeFunction(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isFunction_1.default(value), beFunction, contextBuilder);
        return value;
    }
    exports_1("default", mustBeFunction);
    var mustSatisfy_1, isFunction_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isFunction_1_1) {
            isFunction_1 = isFunction_1_1;
        }],
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
System.register("davinci-newton/checks/mustBeNumber.js", ["../checks/mustSatisfy", "../checks/isNumber"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function beANumber() {
        return "be a `number`";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
        return value;
    }
    exports_1("default", default_1);
    var mustSatisfy_1, isNumber_1;
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/rotate.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function rotateX(x, y, z, spinor) {
        var a = spinor.xy;
        var b = spinor.yz;
        var c = spinor.zx;
        var w = spinor.a;
        var ix = w * x - c * z + a * y;
        var iy = w * y - a * x + b * z;
        var iz = w * z - b * y + c * x;
        var iw = b * x + c * y + a * z;
        return ix * w + iw * b + iy * a - iz * c;
    }
    exports_1("rotateX", rotateX);
    function rotateY(x, y, z, spinor) {
        var a = spinor.xy;
        var b = spinor.yz;
        var c = spinor.zx;
        var w = spinor.a;
        var ix = w * x - c * z + a * y;
        var iy = w * y - a * x + b * z;
        var iz = w * z - b * y + c * x;
        var iw = b * x + c * y + a * z;
        return iy * w + iw * c + iz * b - ix * a;
    }
    exports_1("rotateY", rotateY);
    function rotateZ(x, y, z, spinor) {
        var a = spinor.xy;
        var b = spinor.yz;
        var c = spinor.zx;
        var w = spinor.a;
        var ix = w * x - c * z + a * y;
        var iy = w * y - a * x + b * z;
        var iz = w * z - b * y + c * x;
        var iw = b * x + c * y + a * z;
        return iz * w + iw * a + ix * c - iy * b;
    }
    exports_1("rotateZ", rotateZ);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/Spinor3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Spinor3;
    return {
        setters: [],
        execute: function () {
            Spinor3 = function () {
                function Spinor3(a, xy, yz, zx) {
                    if (a === void 0) {
                        a = 1;
                    }
                    if (xy === void 0) {
                        xy = 0;
                    }
                    if (yz === void 0) {
                        yz = 0;
                    }
                    if (zx === void 0) {
                        zx = 0;
                    }
                    this.a = a;
                    this.xy = xy;
                    this.yz = yz;
                    this.zx = zx;
                }
                Spinor3.prototype.copy = function (spinor) {
                    this.a = spinor.a;
                    this.xy = spinor.xy;
                    this.yz = spinor.yz;
                    this.zx = spinor.zx;
                    return this;
                };
                Spinor3.prototype.divByScalar = function (alpha) {
                    if (alpha !== 1) {
                        this.a /= alpha;
                        this.xy /= alpha;
                        this.yz /= alpha;
                        this.zx /= alpha;
                    }
                    return this;
                };
                Spinor3.prototype.isOne = function () {
                    return this.a === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0;
                };
                Spinor3.prototype.magnitude = function () {
                    return Math.sqrt(this.quadrance());
                };
                Spinor3.prototype.normalize = function () {
                    var m = this.magnitude();
                    if (m !== 1) {
                        return this.divByScalar(m);
                    } else {
                        return this;
                    }
                };
                Spinor3.prototype.one = function () {
                    this.a = 1;
                    this.xy = 0;
                    this.yz = 0;
                    this.zx = 0;
                    return this;
                };
                Spinor3.prototype.quadrance = function () {
                    var a = this.a;
                    var x = this.yz;
                    var y = this.zx;
                    var z = this.xy;
                    return a * a + x * x + y * y + z * z;
                };
                return Spinor3;
            }();
            exports_1("Spinor3", Spinor3);
            exports_1("default", Spinor3);
        }
    };
});
System.register("davinci-newton/engine3D/RigidBody3.js", ["../objects/AbstractSimObject", "../math/Bivector3", "../math/Mat3", "../math/Matrix3", "../checks/mustBeFunction", "../checks/mustBeNonNullObject", "../checks/mustBeNumber", "../math/rotate", "../math/Spinor3", "../math/Vec3", "../math/Vector3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, Bivector3_1, Mat3_1, Matrix3_1, mustBeFunction_1, mustBeNonNullObject_1, mustBeNumber_1, rotate_1, Spinor3_1, Vec3_1, Vector3_1, RigidBody3;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Bivector3_1_1) {
            Bivector3_1 = Bivector3_1_1;
        }, function (Mat3_1_1) {
            Mat3_1 = Mat3_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (mustBeFunction_1_1) {
            mustBeFunction_1 = mustBeFunction_1_1;
        }, function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }, function (mustBeNumber_1_1) {
            mustBeNumber_1 = mustBeNumber_1_1;
        }, function (rotate_1_1) {
            rotate_1 = rotate_1_1;
        }, function (Spinor3_1_1) {
            Spinor3_1 = Spinor3_1_1;
        }, function (Vec3_1_1) {
            Vec3_1 = Vec3_1_1;
        }, function (Vector3_1_1) {
            Vector3_1 = Vector3_1_1;
        }],
        execute: function () {
            RigidBody3 = function (_super) {
                __extends(RigidBody3, _super);
                function RigidBody3() {
                    var _this = _super.call(this) || this;
                    _this.M_ = 1;
                    _this.inertiaTensorInverse_ = new Mat3_1.default(Matrix3_1.default.one());
                    _this.varsIndex_ = -1;
                    _this.position_ = new Vector3_1.default();
                    _this.attitude_ = new Spinor3_1.default();
                    _this.linearMomentum_ = new Vector3_1.default();
                    _this.angularMomentum_ = new Bivector3_1.default();
                    _this.Ω = new Bivector3_1.default();
                    _this.centerOfMassLocal_ = Vec3_1.default.ORIGIN;
                    return _this;
                }
                Object.defineProperty(RigidBody3.prototype, "centerOfMassLocal", {
                    get: function () {
                        return this.centerOfMassLocal_;
                    },
                    set: function (centerOfMassLocal) {
                        this.centerOfMassLocal_ = Vec3_1.default.fromVector(centerOfMassLocal);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "M", {
                    get: function () {
                        return this.M_;
                    },
                    set: function (M) {
                        if (this.M_ !== M) {
                            this.M_ = mustBeNumber_1.default('M', M);
                            this.updateInertiaTensor();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                RigidBody3.prototype.updateInertiaTensor = function () {};
                Object.defineProperty(RigidBody3.prototype, "I", {
                    get: function () {
                        var I = Matrix3_1.default.zero().copy(this.inertiaTensorInverse_).inv();
                        return new Mat3_1.default(I);
                    },
                    set: function (I) {
                        var Iinv = Matrix3_1.default.zero().copy(I).inv();
                        this.inertiaTensorInverse_ = new Mat3_1.default(Iinv);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "Iinv", {
                    get: function () {
                        return this.inertiaTensorInverse_;
                    },
                    set: function (source) {
                        mustBeNonNullObject_1.default('Iinv', source);
                        mustBeNumber_1.default('dimensions', source.dimensions);
                        mustBeFunction_1.default('getElement', source.getElement);
                        this.inertiaTensorInverse_ = new Mat3_1.default(source);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "X", {
                    get: function () {
                        return this.position_;
                    },
                    set: function (position) {
                        this.position_.copy(position);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "R", {
                    get: function () {
                        return this.attitude_;
                    },
                    set: function (attitude) {
                        this.attitude_.copy(attitude);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "P", {
                    get: function () {
                        return this.linearMomentum_;
                    },
                    set: function (momentum) {
                        this.linearMomentum_.copy(momentum);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "L", {
                    get: function () {
                        return this.angularMomentum_;
                    },
                    set: function (angularMomentum) {
                        this.angularMomentum_.copy(angularMomentum);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "expireTime", {
                    get: function () {
                        return Number.POSITIVE_INFINITY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody3.prototype, "varsIndex", {
                    get: function () {
                        return this.varsIndex_;
                    },
                    set: function (index) {
                        this.varsIndex_ = index;
                    },
                    enumerable: true,
                    configurable: true
                });
                RigidBody3.prototype.rotationalEnergy = function () {
                    var Ω = this.Ω;
                    var L = this.L;
                    var ω = Vector3_1.default.dual(Ω).neg();
                    var J = Vector3_1.default.dual(L).neg();
                    return 0.5 * ω.dot(J);
                };
                RigidBody3.prototype.translationalEnergy = function () {
                    return 0.5 * this.P.quaditude() / this.M;
                };
                RigidBody3.prototype.localPointToWorldPoint = function (localPoint, worldPoint) {
                    var comLocal = this.centerOfMassLocal_;
                    var x = localPoint.x - comLocal.x;
                    var y = localPoint.y - comLocal.y;
                    var z = localPoint.z - comLocal.z;
                    var X = this.position_;
                    var R = this.attitude_;
                    worldPoint.x = rotate_1.rotateX(x, y, z, R) + X.x;
                    worldPoint.y = rotate_1.rotateY(x, y, z, R) + X.y;
                    worldPoint.z = rotate_1.rotateZ(x, y, z, R) + X.z;
                };
                return RigidBody3;
            }(AbstractSimObject_1.default);
            exports_1("RigidBody3", RigidBody3);
            exports_1("default", RigidBody3);
        }
    };
});
System.register("davinci-newton/engine3D/Sphere3.js", ["../math/Matrix3", "./RigidBody3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var Matrix3_1, RigidBody3_1, Sphere3;
    return {
        setters: [function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (RigidBody3_1_1) {
            RigidBody3_1 = RigidBody3_1_1;
        }],
        execute: function () {
            Sphere3 = function (_super) {
                __extends(Sphere3, _super);
                function Sphere3(radius) {
                    if (radius === void 0) {
                        radius = 1;
                    }
                    var _this = _super.call(this) || this;
                    _this.radius_ = 1;
                    _this.radius_ = radius;
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Sphere3.prototype, "radius", {
                    get: function () {
                        return this.radius_;
                    },
                    set: function (radius) {
                        if (this.radius !== radius) {
                            this.radius_ = radius;
                            this.updateInertiaTensor();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Sphere3.prototype.updateInertiaTensor = function () {
                    var r = this.radius_;
                    var rr = r * r;
                    var s = 2 * this.M * rr / 5;
                    var I = Matrix3_1.default.zero();
                    I.setElement(0, 0, s);
                    I.setElement(1, 1, s);
                    I.setElement(2, 2, s);
                    this.I = I;
                };
                return Sphere3;
            }(RigidBody3_1.default);
            exports_1("Sphere3", Sphere3);
            exports_1("default", Sphere3);
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
                function AbstractSimObject() {
                    this.expireTime_ = Number.POSITIVE_INFINITY;
                }
                Object.defineProperty(AbstractSimObject.prototype, "expireTime", {
                    get: function () {
                        return this.expireTime_;
                    },
                    set: function (expireTime) {
                        this.expireTime_ = expireTime;
                    },
                    enumerable: true,
                    configurable: true
                });
                return AbstractSimObject;
            }();
            exports_1("AbstractSimObject", AbstractSimObject);
            exports_1("default", AbstractSimObject);
        }
    };
});
System.register("davinci-newton/math/wedge.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function wedgeYZ(a, b) {
        return a.y * b.z - a.z * b.y;
    }
    exports_1("wedgeYZ", wedgeYZ);
    function wedgeZX(a, b) {
        return a.z * b.x - a.x * b.z;
    }
    exports_1("wedgeZX", wedgeZX);
    function wedgeXY(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    exports_1("wedgeXY", wedgeXY);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/Bivector3.js", ["./wedge"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var wedge_1, Bivector3;
    return {
        setters: [function (wedge_1_1) {
            wedge_1 = wedge_1_1;
        }],
        execute: function () {
            Bivector3 = function () {
                function Bivector3() {
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                }
                Bivector3.prototype.applyMatrix = function (σ) {
                    var x = this.yz;
                    var y = this.zx;
                    var z = this.xy;
                    var n11 = σ.getElement(0, 0),
                        n12 = σ.getElement(0, 1),
                        n13 = σ.getElement(0, 2);
                    var n21 = σ.getElement(1, 0),
                        n22 = σ.getElement(1, 1),
                        n23 = σ.getElement(1, 2);
                    var n31 = σ.getElement(2, 0),
                        n32 = σ.getElement(2, 1),
                        n33 = σ.getElement(2, 2);
                    this.yz = n11 * x + n12 * y + n13 * z;
                    this.zx = n21 * x + n22 * y + n23 * z;
                    this.xy = n31 * x + n32 * y + n33 * z;
                    return this;
                };
                Bivector3.prototype.copy = function (B) {
                    this.yz = B.yz;
                    this.zx = B.zx;
                    this.xy = B.xy;
                    return this;
                };
                Bivector3.prototype.dual = function (v) {
                    this.yz = v.x;
                    this.zx = v.y;
                    this.xy = v.z;
                    return this;
                };
                Bivector3.prototype.isZero = function () {
                    return this.xy === 0 && this.yz === 0 && this.zx === 0;
                };
                Bivector3.prototype.toString = function (radix) {
                    return "new Bivector3(yz: " + this.yz.toString(radix) + ", zx: " + this.zx.toString(radix) + ", xy: " + this.xy.toString(radix) + ")";
                };
                Bivector3.prototype.wedge = function (a, b) {
                    this.yz = wedge_1.wedgeYZ(a, b);
                    this.zx = wedge_1.wedgeZX(a, b);
                    this.xy = wedge_1.wedgeXY(a, b);
                    return this;
                };
                Bivector3.prototype.write = function (B) {
                    B.xy = this.xy;
                    B.yz = this.yz;
                    B.zx = this.zx;
                    return this;
                };
                Bivector3.prototype.zero = function () {
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    return this;
                };
                return Bivector3;
            }();
            exports_1("Bivector3", Bivector3);
            exports_1("default", Bivector3);
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
System.register("davinci-newton/engine3D/Force3.js", ["../objects/AbstractSimObject", "../math/Bivector3", "../model/CoordType", "../math/Vec3", "../math/Vector3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, Bivector3_1, CoordType_1, Vec3_1, Vector3_1, Force3;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Bivector3_1_1) {
            Bivector3_1 = Bivector3_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (Vec3_1_1) {
            Vec3_1 = Vec3_1_1;
        }, function (Vector3_1_1) {
            Vector3_1 = Vector3_1_1;
        }],
        execute: function () {
            Force3 = function (_super) {
                __extends(Force3, _super);
                function Force3(body_) {
                    var _this = _super.call(this) || this;
                    _this.body_ = body_;
                    _this.location = new Vector3_1.default();
                    _this.vector = new Vector3_1.default();
                    _this.position_ = new Vector3_1.default();
                    _this.force_ = new Vector3_1.default();
                    _this.torque_ = new Bivector3_1.default();
                    return _this;
                }
                Force3.prototype.getBody = function () {
                    return this.body_;
                };
                Force3.prototype.computeForce = function (force) {
                    switch (this.vectorCoordType) {
                        case CoordType_1.default.BODY:
                            {
                                this.force_.copy(this.vector);
                                this.force_.rotate(this.body_.R);
                                this.force_.write(force);
                                break;
                            }
                        case CoordType_1.default.WORLD:
                            {
                                this.force_.copy(this.vector);
                                this.force_.write(force);
                                break;
                            }
                    }
                };
                Object.defineProperty(Force3.prototype, "F", {
                    get: function () {
                        this.computeForce(this.force_);
                        return Vec3_1.default.fromVector(this.force_);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Force3.prototype, "x", {
                    get: function () {
                        this.computePosition(this.position_);
                        return Vec3_1.default.fromVector(this.position_);
                    },
                    enumerable: true,
                    configurable: true
                });
                Force3.prototype.computePosition = function (position) {
                    switch (this.locationCoordType) {
                        case CoordType_1.default.BODY:
                            {
                                this.position_.copy(this.location);
                                this.position_.rotate(this.body_.R);
                                this.position_.add(this.body_.X);
                                this.position_.write(position);
                                break;
                            }
                        case CoordType_1.default.WORLD:
                            {
                                this.position_.copy(this.location);
                                this.position_.write(position);
                                break;
                            }
                    }
                };
                Force3.prototype.computeTorque = function (torque) {
                    this.computePosition(this.position_);
                    this.computeForce(this.force_);
                    this.torque_.wedge(this.position_.subtract(this.body_.X), this.force_);
                    this.torque_.write(torque);
                };
                return Force3;
            }(AbstractSimObject_1.default);
            exports_1("Force3", Force3);
            exports_1("default", Force3);
        }
    };
});
System.register("davinci-newton/engine3D/Spring3.js", ["../objects/AbstractSimObject", "../model/CoordType", "../engine3D/Force3", "../math/Vec3", "../math/Vector3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, CoordType_1, Force3_1, Vec3_1, Vector3_1, Spring3;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (Force3_1_1) {
            Force3_1 = Force3_1_1;
        }, function (Vec3_1_1) {
            Vec3_1 = Vec3_1_1;
        }, function (Vector3_1_1) {
            Vector3_1 = Vector3_1_1;
        }],
        execute: function () {
            Spring3 = function (_super) {
                __extends(Spring3, _super);
                function Spring3(body1_, body2_) {
                    var _this = _super.call(this) || this;
                    _this.body1_ = body1_;
                    _this.body2_ = body2_;
                    _this.restLength_ = 1;
                    _this.stiffness_ = 1;
                    _this.attach1_ = Vec3_1.default.ORIGIN;
                    _this.attach2_ = Vec3_1.default.ORIGIN;
                    _this.forces = [];
                    _this.end1_ = new Vector3_1.default();
                    _this.end2_ = new Vector3_1.default();
                    _this.F1 = new Force3_1.default(_this.body1_);
                    _this.F1.locationCoordType = CoordType_1.default.WORLD;
                    _this.F1.vectorCoordType = CoordType_1.default.WORLD;
                    _this.F2 = new Force3_1.default(_this.body2_);
                    _this.F2.locationCoordType = CoordType_1.default.WORLD;
                    _this.F2.vectorCoordType = CoordType_1.default.WORLD;
                    _this.forces = [_this.F1, _this.F2];
                    return _this;
                }
                Spring3.prototype.computeBody1AttachPointInWorldCoords = function (x) {
                    if (this.attach1_ == null || this.body1_ == null) {
                        throw new Error();
                    }
                    this.body1_.localPointToWorldPoint(this.attach1_, x);
                };
                Spring3.prototype.computeBody2AttachPointInWorldCoords = function (x) {
                    if (this.attach2_ == null || this.body2_ == null) {
                        throw new Error();
                    }
                    this.body2_.localPointToWorldPoint(this.attach2_, x);
                };
                Object.defineProperty(Spring3.prototype, "attach1", {
                    get: function () {
                        return this.attach1_;
                    },
                    set: function (attach1) {
                        this.attach1_ = Vec3_1.default.fromVector(attach1);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Spring3.prototype, "attach2", {
                    get: function () {
                        return this.attach2_;
                    },
                    set: function (attach2) {
                        this.attach2_ = Vec3_1.default.fromVector(attach2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Spring3.prototype, "end1", {
                    get: function () {
                        this.computeBody1AttachPointInWorldCoords(this.end1_);
                        return Vec3_1.default.fromVector(this.end1_);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Spring3.prototype, "end2", {
                    get: function () {
                        this.computeBody2AttachPointInWorldCoords(this.end2_);
                        return Vec3_1.default.fromVector(this.end2_);
                    },
                    enumerable: true,
                    configurable: true
                });
                Spring3.prototype.updateForces = function () {
                    this.computeBody1AttachPointInWorldCoords(this.F1.location);
                    this.computeBody2AttachPointInWorldCoords(this.F2.location);
                    var length = this.F1.location.distanceTo(this.F2.location);
                    var sf = this.stiffness_ * (length - this.restLength_) / length;
                    this.F1.vector.copy(this.F2.location).subtract(this.F1.location).mulByScalar(sf);
                    this.F2.vector.copy(this.F1.vector).neg();
                    return this.forces;
                };
                Spring3.prototype.disconnect = function () {};
                Spring3.prototype.potentialEnergy = function () {
                    this.computeBody1AttachPointInWorldCoords(this.F1.location);
                    this.computeBody2AttachPointInWorldCoords(this.F2.location);
                    var stretch = this.F2.location.distanceTo(this.F1.location) - this.restLength_;
                    return 0.5 * this.stiffness_ * stretch * stretch;
                };
                return Spring3;
            }(AbstractSimObject_1.default);
            exports_1("Spring3", Spring3);
            exports_1("default", Spring3);
        }
    };
});
System.register("davinci-newton/util/contains.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function contains(xs, x) {
        var N = xs.length;
        for (var i = 0; i < N; i++) {
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
System.register("davinci-newton/util/ParameterBoolean.js", ["./toName", "./validName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var toName_1, validName_1, ParameterBoolean;
    return {
        setters: [function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            ParameterBoolean = function () {
                function ParameterBoolean(subject, name, getter, setter, choices, values) {
                    this.subject_ = subject;
                    this.name_ = validName_1.default(toName_1.default(name));
                    this.getter_ = getter;
                    this.setter_ = setter;
                    this.isComputed_ = false;
                    this.choices_ = [];
                    this.values_ = [];
                }
                Object.defineProperty(ParameterBoolean.prototype, "name", {
                    get: function () {
                        return this.name_;
                    },
                    enumerable: true,
                    configurable: true
                });
                ParameterBoolean.prototype.getSubject = function () {
                    return this.subject_;
                };
                ParameterBoolean.prototype.nameEquals = function (name) {
                    return this.name_ === toName_1.default(name);
                };
                ParameterBoolean.prototype.setComputed = function (value) {
                    this.isComputed_ = value;
                };
                return ParameterBoolean;
            }();
            exports_1("ParameterBoolean", ParameterBoolean);
            exports_1("default", ParameterBoolean);
        }
    };
});
System.register("davinci-newton/util/ParameterNumber.js", ["./toName", "./validName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var toName_1, validName_1, ParameterNumber;
    return {
        setters: [function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            ParameterNumber = function () {
                function ParameterNumber(subject, name, getter, setter, choices, values) {
                    this.subject_ = subject;
                    this.name_ = validName_1.default(toName_1.default(name));
                    this.getter_ = getter;
                    this.setter_ = setter;
                    this.isComputed_ = false;
                    this.signifDigits_ = 3;
                    this.decimalPlaces_ = -1;
                    this.lowerLimit_ = 0;
                    this.upperLimit_ = Number.POSITIVE_INFINITY;
                    this.choices_ = [];
                    this.values_ = [];
                }
                Object.defineProperty(ParameterNumber.prototype, "name", {
                    get: function () {
                        return this.name_;
                    },
                    enumerable: true,
                    configurable: true
                });
                ParameterNumber.prototype.getSubject = function () {
                    return this.subject_;
                };
                ParameterNumber.prototype.getValue = function () {
                    return this.getter_();
                };
                ParameterNumber.prototype.nameEquals = function (name) {
                    return this.name_ === toName_1.default(name);
                };
                ParameterNumber.prototype.setComputed = function (value) {
                    this.isComputed_ = value;
                };
                ParameterNumber.prototype.setLowerLimit = function (lowerLimit) {
                    if (lowerLimit > this.getValue() || lowerLimit > this.upperLimit_) throw new Error('out of range');
                    this.lowerLimit_ = lowerLimit;
                    return this;
                };
                ParameterNumber.prototype.setSignifDigits = function (signifDigits) {
                    this.signifDigits_ = signifDigits;
                    return this;
                };
                return ParameterNumber;
            }();
            exports_1("ParameterNumber", ParameterNumber);
            exports_1("default", ParameterNumber);
        }
    };
});
System.register("davinci-newton/util/ParameterString.js", ["./toName", "./validName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var toName_1, validName_1, ParameterString;
    return {
        setters: [function (toName_1_1) {
            toName_1 = toName_1_1;
        }, function (validName_1_1) {
            validName_1 = validName_1_1;
        }],
        execute: function () {
            ParameterString = function () {
                function ParameterString(subject, name, getter, setter, choices, values) {
                    this.subject_ = subject;
                    this.name_ = validName_1.default(toName_1.default(name));
                    this.getter_ = getter;
                    this.setter_ = setter;
                    this.isComputed_ = false;
                    this.suggestedLength_ = 20;
                    this.maxLength_ = Number.POSITIVE_INFINITY;
                    this.choices_ = [];
                    this.values_ = [];
                    this.inputFunction_ = null;
                }
                Object.defineProperty(ParameterString.prototype, "name", {
                    get: function () {
                        return this.name_;
                    },
                    enumerable: true,
                    configurable: true
                });
                ParameterString.prototype.getSubject = function () {
                    return this.subject_;
                };
                ParameterString.prototype.getValue = function () {
                    return this.getter_();
                };
                ParameterString.prototype.nameEquals = function (name) {
                    return this.name_ === toName_1.default(name);
                };
                ParameterString.prototype.setComputed = function (value) {
                    this.isComputed_ = value;
                };
                return ParameterString;
            }();
            exports_1("ParameterString", ParameterString);
            exports_1("default", ParameterString);
        }
    };
});
System.register("davinci-newton/util/removeAt.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function removeAt(xs, index) {
        return Array.prototype.splice.call(xs, index, 1).length === 1;
    }
    exports_1("default", removeAt);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/util/remove.js", ["./removeAt"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function remove(xs, x) {
        var i = xs.indexOf(x);
        var rv;
        if (rv = i >= 0) {
            removeAt_1.default(xs, i);
        }
        return rv;
    }
    exports_1("default", remove);
    var removeAt_1;
    return {
        setters: [function (removeAt_1_1) {
            removeAt_1 = removeAt_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/util/AbstractSubject.js", ["./clone", "./contains", "./find", "./ParameterBoolean", "./ParameterNumber", "./ParameterString", "./remove", "../util/toName"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var clone_1, contains_1, find_1, ParameterBoolean_1, ParameterNumber_1, ParameterString_1, remove_1, toName_1, AbstractSubject;
    return {
        setters: [function (clone_1_1) {
            clone_1 = clone_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (find_1_1) {
            find_1 = find_1_1;
        }, function (ParameterBoolean_1_1) {
            ParameterBoolean_1 = ParameterBoolean_1_1;
        }, function (ParameterNumber_1_1) {
            ParameterNumber_1 = ParameterNumber_1_1;
        }, function (ParameterString_1_1) {
            ParameterString_1 = ParameterString_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }, function (toName_1_1) {
            toName_1 = toName_1_1;
        }],
        execute: function () {
            AbstractSubject = function () {
                function AbstractSubject() {
                    this.doBroadcast_ = true;
                    this.observers_ = [];
                    this.paramList_ = [];
                }
                AbstractSubject.prototype.addObserver = function (observer) {
                    if (!contains_1.default(this.observers_, observer)) {
                        this.observers_.push(observer);
                    }
                };
                AbstractSubject.prototype.removeObserver = function (observer) {
                    remove_1.default(this.observers_, observer);
                };
                AbstractSubject.prototype.addParameter = function (parameter) {
                    var name = parameter.name;
                    var p = this.getParam(name);
                    if (p != null) {
                        throw new Error('parameter ' + name + ' already exists: ' + p);
                    }
                    this.paramList_.push(parameter);
                };
                AbstractSubject.prototype.getParam = function (name) {
                    name = toName_1.default(name);
                    return find_1.default(this.paramList_, function (p) {
                        return p.name === name;
                    });
                };
                AbstractSubject.prototype.getParameter = function (name) {
                    var p = this.getParam(name);
                    if (p != null) {
                        return p;
                    }
                    throw new Error('Parameter not found ' + name);
                };
                AbstractSubject.prototype.getParameterBoolean = function (name) {
                    var p = this.getParam(name);
                    if (p instanceof ParameterBoolean_1.default) {
                        return p;
                    }
                    throw new Error('ParameterBoolean not found ' + name);
                };
                AbstractSubject.prototype.getParameterNumber = function (name) {
                    var p = this.getParam(name);
                    if (p instanceof ParameterNumber_1.default) {
                        return p;
                    }
                    throw new Error('ParameterNumber not found ' + name);
                };
                AbstractSubject.prototype.getParameterString = function (name) {
                    var p = this.getParam(name);
                    if (p instanceof ParameterString_1.default) {
                        return p;
                    }
                    throw new Error('ParameterString not found ' + name);
                };
                AbstractSubject.prototype.getParameters = function () {
                    return clone_1.default(this.paramList_);
                };
                AbstractSubject.prototype.broadcast = function (event) {
                    if (this.doBroadcast_) {
                        var len = this.observers_.length;
                        for (var i = 0; i < len; i++) {
                            this.observers_[i].observe(event);
                        }
                    }
                };
                AbstractSubject.prototype.broadcastParameter = function (name) {
                    var p = this.getParam(name);
                    if (p === null) {
                        throw new Error('unknown Parameter ' + name);
                    }
                    this.broadcast(p);
                };
                AbstractSubject.prototype.getBroadcast = function () {
                    return this.doBroadcast_;
                };
                AbstractSubject.prototype.getObservers = function () {
                    return clone_1.default(this.observers_);
                };
                return AbstractSubject;
            }();
            exports_1("AbstractSubject", AbstractSubject);
            exports_1("default", AbstractSubject);
        }
    };
});
System.register("davinci-newton/util/clone.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function clone(xs) {
        throw new Error("TODO: clone");
    }
    exports_1("default", clone);
    return {
        setters: [],
        execute: function () {}
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
                function ConcreteVariable(varsList_, name) {
                    this.varsList_ = varsList_;
                    this.value_ = 0;
                    this.seq_ = 0;
                    this.isComputed_ = false;
                    this.doesBroadcast_ = false;
                    this.name_ = validName_1.default(toName_1.default(name));
                }
                ConcreteVariable.prototype.getBroadcast = function () {
                    return this.doesBroadcast_;
                };
                Object.defineProperty(ConcreteVariable.prototype, "name", {
                    get: function () {
                        return this.name_;
                    },
                    enumerable: true,
                    configurable: true
                });
                ConcreteVariable.prototype.getSequence = function () {
                    return this.seq_;
                };
                ConcreteVariable.prototype.getSubject = function () {
                    return this.varsList_;
                };
                ConcreteVariable.prototype.getValue = function () {
                    return this.value_;
                };
                ConcreteVariable.prototype.nameEquals = function (name) {
                    return this.name_ === toName_1.default(name);
                };
                ConcreteVariable.prototype.setBroadcast = function (value) {
                    this.doesBroadcast_ = value;
                };
                ConcreteVariable.prototype.setComputed = function (value) {
                    this.isComputed_ = value;
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
System.register("davinci-newton/util/find.js", ["./findIndex"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function find(xs, test) {
        var i = findIndex_1.default(xs, test);
        return i < 0 ? null : xs[i];
    }
    exports_1("default", find);
    var findIndex_1;
    return {
        setters: [function (findIndex_1_1) {
            findIndex_1 = findIndex_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/util/findIndex.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function findIndex(xs, test) {
        var N = xs.length;
        for (var i = 0; i < N; i++) {
            var x = xs[i];
            if (test(x, i)) {
                return i;
            }
        }
        return -1;
    }
    exports_1("default", findIndex);
    return {
        setters: [],
        execute: function () {}
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
                Object.defineProperty(GenericEvent.prototype, "name", {
                    get: function () {
                        return this.name_;
                    },
                    enumerable: true,
                    configurable: true
                });
                GenericEvent.prototype.getSubject = function () {
                    return this.subject_;
                };
                GenericEvent.prototype.nameEquals = function (name) {
                    return this.name_ === toName_1.default(name);
                };
                return GenericEvent;
            }();
            exports_1("GenericEvent", GenericEvent);
            exports_1("default", GenericEvent);
        }
    };
});
System.register("davinci-newton/checks/isNumber.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isNumber(x) {
        return typeof x === 'number';
    }
    exports_1("default", isNumber);
    return {
        setters: [],
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
System.register("davinci-newton/core/VarsList.js", ["../util/AbstractSubject", "../util/clone", "../model/ConcreteVariable", "../util/extendArray", "../util/find", "../util/findIndex", "../util/GenericEvent", "../checks/isNumber", "../checks/isString", "../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSubject_1, clone_1, ConcreteVariable_1, extendArray_1, find_1, findIndex_1, GenericEvent_1, isNumber_1, isString_1, toName_1, validName_1, VarsList;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (clone_1_1) {
            clone_1 = clone_1_1;
        }, function (ConcreteVariable_1_1) {
            ConcreteVariable_1 = ConcreteVariable_1_1;
        }, function (extendArray_1_1) {
            extendArray_1 = extendArray_1_1;
        }, function (find_1_1) {
            find_1 = find_1_1;
        }, function (findIndex_1_1) {
            findIndex_1 = findIndex_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
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
                function VarsList(names) {
                    var _this = _super.call(this) || this;
                    _this.timeIdx_ = -1;
                    _this.varList_ = [];
                    _this.history_ = true;
                    _this.histArray_ = [];
                    var howMany = names.length;
                    if (howMany !== 0) {
                        _this.addVariables(names);
                    }
                    return _this;
                }
                VarsList.prototype.findOpenSlot_ = function (quantity) {
                    var found = 0;
                    var startIdx = -1;
                    for (var i = 0, n = this.varList_.length; i < n; i++) {
                        if (this.varList_[i].name === VarsList.DELETED) {
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
                        newVars.push(new ConcreteVariable_1.default(this, VarsList.DELETED));
                    }
                    extendArray_1.default(this.varList_, expand, newVars);
                    return startIdx;
                };
                VarsList.prototype.addVariables = function (names) {
                    var howMany = names.length;
                    if (howMany === 0) {
                        throw new Error();
                    }
                    var position = this.findOpenSlot_(howMany);
                    for (var i = 0; i < howMany; i++) {
                        var name_1 = validName_1.default(toName_1.default(names[i]));
                        if (name_1 === VarsList.DELETED) {
                            throw new Error("variable cannot be named '" + VarsList.DELETED + "'");
                        }
                        var idx = position + i;
                        this.varList_[idx] = new ConcreteVariable_1.default(this, name_1);
                        if (name_1 === VarsList.TIME) {
                            this.timeIdx_ = idx;
                        }
                    }
                    this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
                    return position;
                };
                VarsList.prototype.deleteVariables = function (index, howMany) {
                    if (howMany === 0) {
                        return;
                    }
                    if (howMany < 0 || index < 0 || index + howMany > this.varList_.length) {
                        throw new Error('deleteVariables');
                    }
                    for (var i = index; i < index + howMany; i++) {
                        this.varList_[i] = new ConcreteVariable_1.default(this, VarsList.DELETED);
                    }
                    this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
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
                VarsList.prototype.getName = function (index) {
                    this.checkIndex_(index);
                    return this.varList_[index].name;
                };
                VarsList.prototype.getSequence = function (index) {
                    this.checkIndex_(index);
                    return this.varList_[index].getSequence();
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
                        throw new Error('cannot set variable ' + variable.name + ' to NaN');
                    }
                    if (continuous) {
                        variable.setValueSmooth(value);
                    } else {
                        variable.setValue(value);
                    }
                };
                VarsList.prototype.checkIndex_ = function (index) {
                    if (index < 0 || index >= this.varList_.length) {
                        throw new Error('bad variable index=' + index + '; numVars=' + this.varList_.length);
                    }
                };
                VarsList.prototype.addVariable = function (variable) {
                    var name = variable.name;
                    if (name === VarsList.DELETED) {
                        throw new Error("variable cannot be named '" + VarsList.DELETED + "'");
                    }
                    var position = this.findOpenSlot_(1);
                    this.varList_[position] = variable;
                    if (name === VarsList.TIME) {
                        this.timeIdx_ = position;
                    }
                    this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
                    return position;
                };
                VarsList.prototype.getHistory = function () {
                    return this.history_;
                };
                VarsList.prototype.getParameter = function (name) {
                    name = toName_1.default(name);
                    var p = find_1.default(this.varList_, function (p) {
                        return p.name === name;
                    });
                    if (p != null) {
                        return p;
                    }
                    throw new Error('Parameter not found ' + name);
                };
                VarsList.prototype.getParameters = function () {
                    return clone_1.default(this.varList_);
                };
                VarsList.prototype.getTime = function () {
                    if (this.timeIdx_ < 0) {
                        throw new Error('no time variable');
                    }
                    return this.getValue(this.timeIdx_);
                };
                VarsList.prototype.getVariable = function (id) {
                    var index;
                    if (isNumber_1.default(id)) {
                        index = id;
                    } else if (isString_1.default(id)) {
                        id = toName_1.default(id);
                        index = findIndex_1.default(this.varList_, function (v) {
                            return v.name === id;
                        });
                        if (index < 0) {
                            throw new Error('unknown variable name ' + id);
                        }
                    } else {
                        throw new Error();
                    }
                    this.checkIndex_(index);
                    return this.varList_[index];
                };
                VarsList.prototype.numVariables = function () {
                    return this.varList_.length;
                };
                VarsList.prototype.saveHistory = function () {
                    if (this.history_) {
                        var v = this.getValues();
                        v.push(this.getTime());
                        this.histArray_.push(v);
                        if (this.histArray_.length > 20) {
                            this.histArray_.shift();
                        }
                    }
                };
                VarsList.prototype.setComputed = function () {
                    var indexes = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        indexes[_i] = arguments[_i];
                    }
                    for (var i = 0, n = arguments.length; i < n; i++) {
                        var idx = arguments[i];
                        this.checkIndex_(idx);
                        this.varList_[idx].setComputed(true);
                    }
                };
                VarsList.prototype.setHistory = function (value) {
                    this.history_ = value;
                };
                VarsList.prototype.setTime = function (time) {
                    this.setValue(this.timeIdx_, time);
                };
                VarsList.prototype.timeIndex = function () {
                    return this.timeIdx_;
                };
                VarsList.prototype.toArray = function () {
                    return clone_1.default(this.varList_);
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
System.register("davinci-newton/math/Vec3.js", ["../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var veryDifferent_1, Vec3;
    return {
        setters: [function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }],
        execute: function () {
            Vec3 = function () {
                function Vec3(x_, y_, z_) {
                    this.x_ = x_;
                    this.y_ = y_;
                    this.z_ = z_;
                }
                Object.defineProperty(Vec3.prototype, "x", {
                    get: function () {
                        return this.x_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vec3.prototype, "y", {
                    get: function () {
                        return this.y_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vec3.prototype, "z", {
                    get: function () {
                        return this.z_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vec3.prototype.add = function (rhs) {
                    return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
                };
                Vec3.prototype.divByScalar = function (alpha) {
                    return new Vec3(this.x / alpha, this.y / alpha, this.z / alpha);
                };
                Vec3.prototype.lco = function (B) {
                    var ax = B.yz;
                    var ay = B.zx;
                    var az = B.xy;
                    var bx = this.x;
                    var by = this.y;
                    var bz = this.z;
                    var x = ay * bz - az * by;
                    var y = az * bx - ax * bz;
                    var z = ax * by - ay * bx;
                    return new Vec3(x, y, z);
                };
                Vec3.prototype.subtract = function (rhs) {
                    return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
                };
                Vec3.prototype.mulByScalar = function (alpha) {
                    return new Vec3(alpha * this.x, alpha * this.y, alpha * this.z);
                };
                Vec3.prototype.cross = function (rhs) {
                    var ax = this.x;
                    var ay = this.y;
                    var az = this.z;
                    var bx = rhs.x;
                    var by = rhs.y;
                    var bz = rhs.z;
                    var x = ay * bz - az * by;
                    var y = az * bx - ax * bz;
                    var z = ax * by - ay * bx;
                    return new Vec3(x, y, z);
                };
                Vec3.prototype.distanceTo = function (point) {
                    var Δx = this.x - point.x;
                    var Δy = this.y - point.y;
                    var Δz = this.z - point.z;
                    return Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
                };
                Vec3.prototype.magnitude = function () {
                    var x = this.x;
                    var y = this.y;
                    var z = this.z;
                    return Math.sqrt(x * x + y * y + z * z);
                };
                Vec3.prototype.nearEqual = function (v, tolerance) {
                    if (veryDifferent_1.default(this.x_, v.x, tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.y_, v.y, tolerance)) {
                        return false;
                    }
                    if (veryDifferent_1.default(this.z_, v.z, tolerance)) {
                        return false;
                    }
                    return true;
                };
                Vec3.prototype.direction = function () {
                    var magnitude = this.magnitude();
                    if (magnitude !== 1) {
                        if (magnitude === 0) {
                            throw new Error("direction is undefined.");
                        } else {
                            return this.divByScalar(magnitude);
                        }
                    } else {
                        return this;
                    }
                };
                Vec3.prototype.rotate = function (spinor) {
                    if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
                        return this;
                    } else {
                        var x = this.x;
                        var y = this.y;
                        var z = this.z;
                        var a = spinor.xy;
                        var b = spinor.yz;
                        var c = spinor.zx;
                        var w = spinor.a;
                        var ix = w * x - c * z + a * y;
                        var iy = w * y - a * x + b * z;
                        var iz = w * z - b * y + c * x;
                        var iw = b * x + c * y + a * z;
                        var xPrimed = ix * w + iw * b + iy * a - iz * c;
                        var yPrimed = iy * w + iw * c + iz * b - ix * a;
                        var zPrimed = iz * w + iw * a + ix * c - iy * b;
                        return new Vec3(xPrimed, yPrimed, zPrimed);
                    }
                };
                Vec3.prototype.toString = function (radix) {
                    return "new Vec3(" + this.x_.toString(radix) + ", " + this.y_.toString(radix) + ", " + this.z_.toString(radix) + ")";
                };
                Vec3.prototype.__add__ = function (rhs) {
                    return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
                };
                Vec3.prototype.__sub__ = function (rhs) {
                    return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
                };
                Vec3.prototype.__mul__ = function (rhs) {
                    return new Vec3(this.x * rhs, this.y * rhs, this.z * rhs);
                };
                Vec3.prototype.__div__ = function (rhs) {
                    return new Vec3(this.x / rhs, this.y / rhs, this.z / rhs);
                };
                Vec3.dual = function (B) {
                    return new Vec3(-B.yz, -B.zx, -B.xy);
                };
                Vec3.fromVector = function (v) {
                    return new Vec3(v.x, v.y, v.z);
                };
                return Vec3;
            }();
            Vec3.ORIGIN = new Vec3(0, 0, 0);
            exports_1("Vec3", Vec3);
            exports_1("default", Vec3);
        }
    };
});
System.register("davinci-newton/math/Vector3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Vector3;
    return {
        setters: [],
        execute: function () {
            Vector3 = function () {
                function Vector3(x, y, z) {
                    if (x === void 0) {
                        x = 0;
                    }
                    if (y === void 0) {
                        y = 0;
                    }
                    if (z === void 0) {
                        z = 0;
                    }
                    this.x = x;
                    this.y = y;
                    this.z = z;
                }
                Vector3.prototype.add = function (rhs) {
                    this.x += rhs.x;
                    this.y += rhs.y;
                    this.z += rhs.z;
                    return this;
                };
                Vector3.prototype.applyMatrix = function (σ) {
                    var x = this.x;
                    var y = this.y;
                    var z = this.z;
                    var n11 = σ.getElement(0, 0),
                        n12 = σ.getElement(0, 1),
                        n13 = σ.getElement(0, 2);
                    var n21 = σ.getElement(1, 0),
                        n22 = σ.getElement(1, 1),
                        n23 = σ.getElement(1, 2);
                    var n31 = σ.getElement(2, 0),
                        n32 = σ.getElement(2, 1),
                        n33 = σ.getElement(2, 2);
                    this.x = n11 * x + n12 * y + n13 * z;
                    this.y = n21 * x + n22 * y + n23 * z;
                    this.z = n31 * x + n32 * y + n33 * z;
                    return this;
                };
                Vector3.prototype.copy = function (source) {
                    this.x = source.x;
                    this.y = source.y;
                    this.z = source.z;
                    return this;
                };
                Vector3.prototype.distanceTo = function (point) {
                    return Math.sqrt(this.quadranceTo(point));
                };
                Vector3.prototype.dot = function (v) {
                    return this.x * v.x + this.y * v.y + this.z * v.z;
                };
                Vector3.prototype.dual = function (B) {
                    this.x = -B.yz;
                    this.y = -B.zx;
                    this.z = -B.xy;
                    return this;
                };
                Vector3.prototype.direction = function () {
                    var m = this.magnitude();
                    return this.divByScalar(m);
                };
                Vector3.prototype.divByScalar = function (alpha) {
                    this.x /= alpha;
                    this.y /= alpha;
                    this.z /= alpha;
                    return this;
                };
                Vector3.prototype.isZero = function () {
                    return this.x === 0 && this.y === 0 && this.z === 0;
                };
                Vector3.prototype.magnitude = function () {
                    return Math.sqrt(this.quaditude());
                };
                Vector3.prototype.mulByScalar = function (alpha) {
                    this.x *= alpha;
                    this.y *= alpha;
                    this.z *= alpha;
                    return this;
                };
                Vector3.prototype.neg = function () {
                    return this.mulByScalar(-1);
                };
                Vector3.prototype.write = function (destination) {
                    destination.x = this.x;
                    destination.y = this.y;
                    destination.z = this.z;
                    return this;
                };
                Vector3.prototype.zero = function () {
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    return this;
                };
                Vector3.prototype.quaditude = function () {
                    var x = this.x;
                    var y = this.y;
                    var z = this.z;
                    return x * x + y * y + z * z;
                };
                Vector3.prototype.quadranceTo = function (point) {
                    var Δx = this.x - point.x;
                    var Δy = this.y - point.y;
                    var Δz = this.z - point.z;
                    return Δx * Δx + Δy * Δy + Δz * Δz;
                };
                Vector3.prototype.rotate = function (spinor) {
                    if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
                        return this;
                    } else {
                        var x = this.x;
                        var y = this.y;
                        var z = this.z;
                        var a = spinor.xy;
                        var b = spinor.yz;
                        var c = spinor.zx;
                        var w = spinor.a;
                        var ix = w * x - c * z + a * y;
                        var iy = w * y - a * x + b * z;
                        var iz = w * z - b * y + c * x;
                        var iw = b * x + c * y + a * z;
                        this.x = ix * w + iw * b + iy * a - iz * c;
                        this.y = iy * w + iw * c + iz * b - ix * a;
                        this.z = iz * w + iw * a + ix * c - iy * b;
                        return this;
                    }
                };
                Vector3.prototype.subtract = function (rhs) {
                    this.x -= rhs.x;
                    this.y -= rhs.y;
                    this.z -= rhs.z;
                    return this;
                };
                Vector3.prototype.toString = function (radix) {
                    return "new Vector3(" + this.x.toString(radix) + ", " + this.y.toString(radix) + ", " + this.z.toString(radix) + ")";
                };
                Vector3.prototype.__add__ = function (rhs) {
                    return new Vector3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
                };
                Vector3.prototype.__div__ = function (rhs) {
                    return new Vector3(this.x / rhs, this.y / rhs, this.z / rhs);
                };
                Vector3.prototype.__mul__ = function (rhs) {
                    return new Vector3(this.x * rhs, this.y * rhs, this.z * rhs);
                };
                Vector3.prototype.__neg__ = function () {
                    return new Vector3(-this.x, -this.y, -this.z);
                };
                Vector3.dual = function (B) {
                    return new Vector3().dual(B);
                };
                return Vector3;
            }();
            exports_1("Vector3", Vector3);
            exports_1("default", Vector3);
        }
    };
});
System.register("davinci-newton.js", ["./davinci-newton/solvers/AdaptiveStepSolver", "./davinci-newton/view/AlignH", "./davinci-newton/view/AlignV", "./davinci-newton/graph/AxisChoice", "./davinci-newton/engine3D/Block3", "./davinci-newton/util/CircularList", "./davinci-newton/config", "./davinci-newton/engine3D/ConstantForceLaw3", "./davinci-newton/model/CoordType", "./davinci-newton/engine3D/Cylinder3", "./davinci-newton/strategy/DefaultAdvanceStrategy", "./davinci-newton/graph/DisplayGraph", "./davinci-newton/view/DrawingMode", "./davinci-newton/solvers/EulerMethod", "./davinci-newton/engine3D/Force3", "./davinci-newton/graph/Graph", "./davinci-newton/graph/GraphLine", "./davinci-newton/engine3D/GravitationLaw3", "./davinci-newton/view/LabCanvas", "./davinci-newton/math/Matrix3", "./davinci-newton/solvers/ModifiedEuler", "./davinci-newton/engine3D/RigidBody3", "./davinci-newton/engine3D/Physics3", "./davinci-newton/solvers/RungeKutta", "./davinci-newton/runner/SimRunner", "./davinci-newton/view/SimView", "./davinci-newton/engine3D/Sphere3", "./davinci-newton/engine3D/Spring3", "./davinci-newton/core/VarsList", "./davinci-newton/math/Vec3", "./davinci-newton/math/Vector3"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AdaptiveStepSolver_1, AlignH_1, AlignV_1, AxisChoice_1, Block3_1, CircularList_1, config_1, ConstantForceLaw3_1, CoordType_1, Cylinder3_1, DefaultAdvanceStrategy_1, DisplayGraph_1, DrawingMode_1, EulerMethod_1, Force3_1, Graph_1, GraphLine_1, GravitationLaw3_1, LabCanvas_1, Matrix3_1, ModifiedEuler_1, RigidBody3_1, Physics3_1, RungeKutta_1, SimRunner_1, SimView_1, Sphere3_1, Spring3_1, VarsList_1, Vec3_1, Vector3_1, newton;
    return {
        setters: [function (AdaptiveStepSolver_1_1) {
            AdaptiveStepSolver_1 = AdaptiveStepSolver_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (AxisChoice_1_1) {
            AxisChoice_1 = AxisChoice_1_1;
        }, function (Block3_1_1) {
            Block3_1 = Block3_1_1;
        }, function (CircularList_1_1) {
            CircularList_1 = CircularList_1_1;
        }, function (config_1_1) {
            config_1 = config_1_1;
        }, function (ConstantForceLaw3_1_1) {
            ConstantForceLaw3_1 = ConstantForceLaw3_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (Cylinder3_1_1) {
            Cylinder3_1 = Cylinder3_1_1;
        }, function (DefaultAdvanceStrategy_1_1) {
            DefaultAdvanceStrategy_1 = DefaultAdvanceStrategy_1_1;
        }, function (DisplayGraph_1_1) {
            DisplayGraph_1 = DisplayGraph_1_1;
        }, function (DrawingMode_1_1) {
            DrawingMode_1 = DrawingMode_1_1;
        }, function (EulerMethod_1_1) {
            EulerMethod_1 = EulerMethod_1_1;
        }, function (Force3_1_1) {
            Force3_1 = Force3_1_1;
        }, function (Graph_1_1) {
            Graph_1 = Graph_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
        }, function (GravitationLaw3_1_1) {
            GravitationLaw3_1 = GravitationLaw3_1_1;
        }, function (LabCanvas_1_1) {
            LabCanvas_1 = LabCanvas_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (ModifiedEuler_1_1) {
            ModifiedEuler_1 = ModifiedEuler_1_1;
        }, function (RigidBody3_1_1) {
            RigidBody3_1 = RigidBody3_1_1;
        }, function (Physics3_1_1) {
            Physics3_1 = Physics3_1_1;
        }, function (RungeKutta_1_1) {
            RungeKutta_1 = RungeKutta_1_1;
        }, function (SimRunner_1_1) {
            SimRunner_1 = SimRunner_1_1;
        }, function (SimView_1_1) {
            SimView_1 = SimView_1_1;
        }, function (Sphere3_1_1) {
            Sphere3_1 = Sphere3_1_1;
        }, function (Spring3_1_1) {
            Spring3_1 = Spring3_1_1;
        }, function (VarsList_1_1) {
            VarsList_1 = VarsList_1_1;
        }, function (Vec3_1_1) {
            Vec3_1 = Vec3_1_1;
        }, function (Vector3_1_1) {
            Vector3_1 = Vector3_1_1;
        }],
        execute: function () {
            newton = {
                get LAST_MODIFIED() {
                    return config_1.default.LAST_MODIFIED;
                },
                get VERSION() {
                    return config_1.default.VERSION;
                },
                get AdaptiveStepSolver() {
                    return AdaptiveStepSolver_1.default;
                },
                get AlignH() {
                    return AlignH_1.default;
                },
                get AlignV() {
                    return AlignV_1.default;
                },
                get AxisChoice() {
                    return AxisChoice_1.default;
                },
                get Block3() {
                    return Block3_1.default;
                },
                get CircularList() {
                    return CircularList_1.default;
                },
                get ConstantForceLaw3() {
                    return ConstantForceLaw3_1.default;
                },
                get CoordType() {
                    return CoordType_1.default;
                },
                get Cylinder3() {
                    return Cylinder3_1.default;
                },
                get DefaultAdvanceStrategy() {
                    return DefaultAdvanceStrategy_1.default;
                },
                get DisplayGraph() {
                    return DisplayGraph_1.default;
                },
                get DrawingMode() {
                    return DrawingMode_1.default;
                },
                get EulerMethod() {
                    return EulerMethod_1.default;
                },
                get Force3() {
                    return Force3_1.default;
                },
                get Graph() {
                    return Graph_1.default;
                },
                get GraphLine() {
                    return GraphLine_1.default;
                },
                get GravitationLaw3() {
                    return GravitationLaw3_1.default;
                },
                get LabCanvas() {
                    return LabCanvas_1.default;
                },
                get Matrix3() {
                    return Matrix3_1.default;
                },
                get ModifiedEuler() {
                    return ModifiedEuler_1.default;
                },
                get Physics3() {
                    return Physics3_1.default;
                },
                get RigidBody3() {
                    return RigidBody3_1.default;
                },
                get RungeKutta() {
                    return RungeKutta_1.default;
                },
                get SimRunner() {
                    return SimRunner_1.default;
                },
                get SimView() {
                    return SimView_1.default;
                },
                get Sphere3() {
                    return Sphere3_1.default;
                },
                get Spring3() {
                    return Spring3_1.default;
                },
                get VarsList() {
                    return VarsList_1.default;
                },
                get Vec3() {
                    return Vec3_1.default;
                },
                get Vector3() {
                    return Vector3_1.default;
                }
            };
            exports_1("default", newton);
        }
    };
});
//# sourceMappingURL=davinci-newton-system-es5.js.map