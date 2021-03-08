System.register('davinci-newton/config.js', [], function (exports_1, context_1) {
    "use strict";

    var Newton, config;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Newton = function () {
                function Newton() {
                    this.GITHUB = 'https://github.com/geometryzen/davinci-newton';
                    this.LAST_MODIFIED = '2021-03-05';
                    this.NAMESPACE = 'NEWTON';
                    this.VERSION = '1.0.18';
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
            exports_1("config", config = new Newton());
        }
    };
});
System.register("davinci-newton/core/CoulombLaw.js", ["../model/CoordType", "../objects/AbstractSimObject", "./Force"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var CoordType_1, AbstractSimObject_1, Force_1, CoulombLaw;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Force_1_1) {
            Force_1 = Force_1_1;
        }],
        execute: function () {
            CoulombLaw = function (_super) {
                __extends(CoulombLaw, _super);
                function CoulombLaw(body1_, body2_, k) {
                    var _this = _super.call(this) || this;
                    _this.body1_ = body1_;
                    _this.body2_ = body2_;
                    _this.forces = [];
                    _this.metric = body1_.metric;
                    var metric = _this.metric;
                    _this.F1 = new Force_1.Force(_this.body1_, metric);
                    _this.F1.locationCoordType = CoordType_1.WORLD;
                    _this.F1.vectorCoordType = CoordType_1.WORLD;
                    _this.F2 = new Force_1.Force(_this.body2_, metric);
                    _this.F2.locationCoordType = CoordType_1.WORLD;
                    _this.F2.vectorCoordType = CoordType_1.WORLD;
                    _this.k = k;
                    _this.forces = [_this.F1, _this.F2];
                    _this.potentialEnergy_ = metric.zero();
                    _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
                    return _this;
                }
                CoulombLaw.prototype.updateForces = function () {
                    var numer = this.F1.location;
                    var denom = this.F2.location;
                    var metric = this.metric;
                    metric.copyVector(this.body1_.X, numer);
                    metric.subVector(numer, this.body2_.X);
                    metric.copyVector(numer, denom);
                    metric.quaditude(denom, true);
                    metric.direction(numer, true);
                    metric.mulByScalar(numer, metric.a(this.k), metric.uom(this.k));
                    metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
                    metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));
                    metric.copyVector(numer, this.F1.vector);
                    metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));
                    metric.copyVector(this.F1.vector, this.F2.vector);
                    metric.neg(this.F2.vector);
                    metric.copyVector(this.body1_.X, this.F1.location);
                    metric.copyVector(this.body2_.X, this.F2.location);
                    return this.forces;
                };
                CoulombLaw.prototype.disconnect = function () {};
                CoulombLaw.prototype.potentialEnergy = function () {
                    var metric = this.metric;
                    metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
                    var numer = this.F1.location;
                    var denom = this.F2.location;
                    metric.copyScalar(metric.a(this.k), metric.uom(this.k), numer);
                    metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
                    metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));
                    metric.copyVector(this.body1_.X, denom);
                    metric.subVector(denom, this.body2_.X);
                    metric.magnitude(denom, true);
                    metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
                    metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));
                    metric.copyVector(this.body1_.X, this.F1.location);
                    metric.copyVector(this.body2_.X, this.F2.location);
                    this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
                    return this.potentialEnergy_;
                };
                return CoulombLaw;
            }(AbstractSimObject_1.AbstractSimObject);
            exports_1("CoulombLaw", CoulombLaw);
        }
    };
});
System.register("davinci-newton/core/Particle.js", ["./RigidBody"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var RigidBody_1, Particle;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
        }],
        execute: function () {
            Particle = function (_super) {
                __extends(Particle, _super);
                function Particle(mass, charge, metric) {
                    var _this = _super.call(this, metric) || this;
                    _this.M = mass;
                    _this.Q = charge;
                    return _this;
                }
                Particle.prototype.updateAngularVelocity = function () {
                    throw new Error();
                };
                Particle.prototype.updateInertiaTensor = function () {};
                return Particle;
            }(RigidBody_1.RigidBody);
            exports_1("Particle", Particle);
        }
    };
});
System.register("davinci-newton/engine2D/Block2.js", ["../core/RigidBody", "../math/Geometric2", "../math/Mat1", "../math/Unit", "./Euclidean2"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var RigidBody_1, Geometric2_1, Mat1_1, Unit_1, Euclidean2_1, Block2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
        }, function (Geometric2_1_1) {
            Geometric2_1 = Geometric2_1_1;
        }, function (Mat1_1_1) {
            Mat1_1 = Mat1_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (Euclidean2_1_1) {
            Euclidean2_1 = Euclidean2_1_1;
        }],
        execute: function () {
            Block2 = function (_super) {
                __extends(Block2, _super);
                function Block2(width, height) {
                    if (width === void 0) {
                        width = Geometric2_1.Geometric2.one;
                    }
                    if (height === void 0) {
                        height = Geometric2_1.Geometric2.one;
                    }
                    var _this = _super.call(this, new Euclidean2_1.Euclidean2()) || this;
                    _this.width_ = Geometric2_1.Geometric2.copy(width);
                    _this.widthLock_ = _this.width_.lock();
                    _this.height_ = Geometric2_1.Geometric2.copy(height);
                    _this.heightLock_ = _this.height_.lock();
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Block2.prototype, "width", {
                    get: function () {
                        return this.width_;
                    },
                    set: function (width) {
                        this.width_.unlock(this.widthLock_);
                        this.width_.copy(width);
                        this.widthLock_ = this.width_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Block2.prototype, "height", {
                    get: function () {
                        return this.height_;
                    },
                    set: function (height) {
                        this.height_.unlock(this.heightLock_);
                        this.height_.copy(height);
                        this.heightLock_ = this.height_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Block2.prototype.updateAngularVelocity = function () {
                    var w = this.width_;
                    var h = this.height_;
                    var ww = w.a * w.a;
                    var hh = h.a * h.a;
                    var k = 12 / this.M.a;
                    this.Ω.xy = k * this.L.xy / (ww + hh);
                    this.Ω.uom = Unit_1.Unit.div(Unit_1.Unit.div(this.L.uom, this.M.uom), Unit_1.Unit.mul(w.uom, w.uom));
                };
                Block2.prototype.updateInertiaTensor = function () {
                    var w = this.width_;
                    var h = this.height_;
                    var ww = w.a * w.a;
                    var hh = h.a * h.a;
                    var s = this.M.a * (hh + ww) / 12;
                    var I = new Mat1_1.Mat1(s);
                    I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(w.uom, w.uom));
                    this.I = I;
                };
                return Block2;
            }(RigidBody_1.RigidBody);
            exports_1("Block2", Block2);
        }
    };
});
System.register("davinci-newton/engine2D/ConstantForceLaw2.js", ["../core/ConstantForceLaw", "../model/CoordType"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var ConstantForceLaw_1, CoordType_1, ConstantForceLaw2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (ConstantForceLaw_1_1) {
            ConstantForceLaw_1 = ConstantForceLaw_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }],
        execute: function () {
            ConstantForceLaw2 = function (_super) {
                __extends(ConstantForceLaw2, _super);
                function ConstantForceLaw2(body, vector, vectorCoordType) {
                    if (vectorCoordType === void 0) {
                        vectorCoordType = CoordType_1.WORLD;
                    }
                    return _super.call(this, body, vector, vectorCoordType) || this;
                }
                return ConstantForceLaw2;
            }(ConstantForceLaw_1.ConstantForceLaw);
            exports_1("ConstantForceLaw2", ConstantForceLaw2);
        }
    };
});
System.register("davinci-newton/engine2D/Disc2.js", ["../core/RigidBody", "../math/Geometric2", "../math/Mat1", "../math/Unit", "./Euclidean2"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var RigidBody_1, Geometric2_1, Mat1_1, Unit_1, Euclidean2_1, Disc2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
        }, function (Geometric2_1_1) {
            Geometric2_1 = Geometric2_1_1;
        }, function (Mat1_1_1) {
            Mat1_1 = Mat1_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (Euclidean2_1_1) {
            Euclidean2_1 = Euclidean2_1_1;
        }],
        execute: function () {
            Disc2 = function (_super) {
                __extends(Disc2, _super);
                function Disc2(radius) {
                    if (radius === void 0) {
                        radius = Geometric2_1.Geometric2.one;
                    }
                    var _this = _super.call(this, new Euclidean2_1.Euclidean2()) || this;
                    _this.radius_ = Geometric2_1.Geometric2.fromScalar(radius);
                    _this.radiusLock_ = _this.radius_.lock();
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Disc2.prototype, "radius", {
                    get: function () {
                        return this.radius_;
                    },
                    set: function (radius) {
                        this.radius_.unlock(this.radiusLock_);
                        this.radius_.copyScalar(radius.a, radius.uom);
                        this.radiusLock_ = this.radius_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Disc2.prototype.updateAngularVelocity = function () {
                    this.Ω.copyScalar(this.radius_.a, this.radius_.uom);
                    this.Ω.quaditude(true);
                    this.Ω.mulByScalar(this.M.a, this.M.uom);
                    this.Ω.mulByNumber(0.5);
                    this.Ω.inv();
                    this.Ω.mulByBivector(this.L);
                };
                Disc2.prototype.updateInertiaTensor = function () {
                    var r = this.radius_;
                    var s = 0.5 * this.M.a * r.a * r.a;
                    var I = new Mat1_1.Mat1(s);
                    I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(r.uom, r.uom));
                    this.I = I;
                };
                return Disc2;
            }(RigidBody_1.RigidBody);
            exports_1("Disc2", Disc2);
        }
    };
});
System.register("davinci-newton/engine2D/Force2.js", ["../core/Force"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var Force_1, Force2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Force_1_1) {
            Force_1 = Force_1_1;
        }],
        execute: function () {
            Force2 = function (_super) {
                __extends(Force2, _super);
                function Force2(body) {
                    return _super.call(this, body, body.metric) || this;
                }
                return Force2;
            }(Force_1.Force);
            exports_1("Force2", Force2);
        }
    };
});
System.register("davinci-newton/engine2D/GravitationForceLaw2.js", ["../core/GravitationLaw", "../math/Geometric2"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var GravitationLaw_1, Geometric2_1, GravitationForceLaw2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (GravitationLaw_1_1) {
            GravitationLaw_1 = GravitationLaw_1_1;
        }, function (Geometric2_1_1) {
            Geometric2_1 = Geometric2_1_1;
        }],
        execute: function () {
            GravitationForceLaw2 = function (_super) {
                __extends(GravitationForceLaw2, _super);
                function GravitationForceLaw2(body1, body2) {
                    return _super.call(this, body1, body2, Geometric2_1.Geometric2.one) || this;
                }
                return GravitationForceLaw2;
            }(GravitationLaw_1.GravitationLaw);
            exports_1("GravitationForceLaw2", GravitationForceLaw2);
        }
    };
});
System.register("davinci-newton/engine2D/Dynamics2.js", ["../core/Dynamics", "../core/VarsList"], function (exports_1, context_1) {
    "use strict";

    var Dynamics_1, VarsList_1, INDEX_TOTAL_LINEAR_MOMENTUM_X, INDEX_TOTAL_LINEAR_MOMENTUM_Y, INDEX_TOTAL_ANGULAR_MOMENTUM_XY, OFFSET_POSITION_X, OFFSET_POSITION_Y, OFFSET_ATTITUDE_A, OFFSET_ATTITUDE_XY, OFFSET_LINEAR_MOMENTUM_X, OFFSET_LINEAR_MOMENTUM_Y, OFFSET_ANGULAR_MOMENTUM_XY, varNames, DISCONTINUOUS_ENERGY_VARIABLES, Dynamics2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Dynamics_1_1) {
            Dynamics_1 = Dynamics_1_1;
        }, function (VarsList_1_1) {
            VarsList_1 = VarsList_1_1;
        }],
        execute: function () {
            exports_1("INDEX_TOTAL_LINEAR_MOMENTUM_X", INDEX_TOTAL_LINEAR_MOMENTUM_X = Dynamics_1.INDEX_RESERVED_LAST + 1);
            exports_1("INDEX_TOTAL_LINEAR_MOMENTUM_Y", INDEX_TOTAL_LINEAR_MOMENTUM_Y = Dynamics_1.INDEX_RESERVED_LAST + 2);
            exports_1("INDEX_TOTAL_ANGULAR_MOMENTUM_XY", INDEX_TOTAL_ANGULAR_MOMENTUM_XY = Dynamics_1.INDEX_RESERVED_LAST + 3);
            exports_1("OFFSET_POSITION_X", OFFSET_POSITION_X = 0);
            exports_1("OFFSET_POSITION_Y", OFFSET_POSITION_Y = 1);
            exports_1("OFFSET_ATTITUDE_A", OFFSET_ATTITUDE_A = 2);
            exports_1("OFFSET_ATTITUDE_XY", OFFSET_ATTITUDE_XY = 3);
            exports_1("OFFSET_LINEAR_MOMENTUM_X", OFFSET_LINEAR_MOMENTUM_X = 4);
            exports_1("OFFSET_LINEAR_MOMENTUM_Y", OFFSET_LINEAR_MOMENTUM_Y = 5);
            exports_1("OFFSET_ANGULAR_MOMENTUM_XY", OFFSET_ANGULAR_MOMENTUM_XY = 6);
            varNames = [VarsList_1.VarsList.TIME, "translational kinetic energy", "rotational kinetic energy", "potential energy", "total energy", "total linear momentum - x", "total linear momentum - y", "total angular momentum - xy"];
            DISCONTINUOUS_ENERGY_VARIABLES = [Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY, Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY, Dynamics_1.INDEX_POTENTIAL_ENERGY, Dynamics_1.INDEX_TOTAL_ENERGY, INDEX_TOTAL_LINEAR_MOMENTUM_X, INDEX_TOTAL_LINEAR_MOMENTUM_Y, INDEX_TOTAL_ANGULAR_MOMENTUM_XY];
            Dynamics2 = function () {
                function Dynamics2() {}
                Dynamics2.prototype.numVariablesPerBody = function () {
                    return 7;
                };
                Dynamics2.prototype.getVarNames = function () {
                    return varNames;
                };
                Dynamics2.prototype.getOffsetName = function (offset) {
                    switch (offset) {
                        case OFFSET_POSITION_X:
                            return "position x";
                        case OFFSET_POSITION_Y:
                            return "position y";
                        case OFFSET_ATTITUDE_A:
                            return "attitude a";
                        case OFFSET_ATTITUDE_XY:
                            return "attitude xy";
                        case OFFSET_LINEAR_MOMENTUM_X:
                            return "linear momentum x";
                        case OFFSET_LINEAR_MOMENTUM_Y:
                            return "linear momentum y";
                        case OFFSET_ANGULAR_MOMENTUM_XY:
                            return "angular momentum xy";
                    }
                    throw new Error("getVarName(" + offset + ")");
                };
                Dynamics2.prototype.discontinuousEnergyVariables = function () {
                    return DISCONTINUOUS_ENERGY_VARIABLES;
                };
                Dynamics2.prototype.epilog = function (bodies, forceLaws, potentialOffset, varsList) {
                    var pe = potentialOffset.a;
                    var re = 0;
                    var te = 0;
                    var Px = 0;
                    var Py = 0;
                    var Pz = 0;
                    var Lyz = 0;
                    var Lzx = 0;
                    var Lxy = 0;
                    var bs = bodies;
                    var Nb = bs.length;
                    for (var i = 0; i < Nb; i++) {
                        var b = bs[i];
                        if (isFinite(b.M.a)) {
                            re += b.rotationalEnergy().a;
                            te += b.translationalEnergy().a;
                            Px += b.P.x;
                            Py += b.P.y;
                            Lxy += b.X.x * b.P.y - b.X.y * b.P.x;
                            Lxy += b.L.xy;
                        }
                    }
                    var fs = forceLaws;
                    var Nf = fs.length;
                    for (var i = 0; i < Nf; i++) {
                        pe += fs[i].potentialEnergy().a;
                    }
                    varsList.setValue(Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
                    varsList.setValue(Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
                    varsList.setValue(Dynamics_1.INDEX_POTENTIAL_ENERGY, pe, true);
                    varsList.setValue(Dynamics_1.INDEX_TOTAL_ENERGY, te + re + pe, true);
                    varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
                    varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
                    varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
                };
                Dynamics2.prototype.updateVarsFromBody = function (body, idx, vars) {
                    vars.setValue(OFFSET_POSITION_X + idx, body.X.x);
                    vars.setValue(OFFSET_POSITION_Y + idx, body.X.y);
                    vars.setValue(OFFSET_ATTITUDE_A + idx, body.R.a);
                    vars.setValue(OFFSET_ATTITUDE_XY + idx, body.R.b);
                    vars.setValue(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
                    vars.setValue(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
                    vars.setValue(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.b);
                };
                Dynamics2.prototype.addForce = function (rateOfChange, idx, force) {
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] += force.x;
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] += force.y;
                };
                Dynamics2.prototype.addTorque = function (rateOfChange, idx, torque) {
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] += torque.b;
                };
                Dynamics2.prototype.updateBody = function (vars, idx, body) {
                    body.X.a = 0;
                    body.X.x = vars[idx + OFFSET_POSITION_X];
                    body.X.y = vars[idx + OFFSET_POSITION_Y];
                    body.X.b = 0;
                    body.R.a = vars[idx + OFFSET_ATTITUDE_A];
                    body.R.x = 0;
                    body.R.y = 0;
                    body.R.b = vars[idx + OFFSET_ATTITUDE_XY];
                    var R = body.R;
                    var magR = Math.sqrt(R.a * R.a + R.b * R.b);
                    body.R.a = body.R.a / magR;
                    body.R.b = body.R.b / magR;
                    body.P.a = 0;
                    body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
                    body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
                    body.P.b = 0;
                    body.L.a = 0;
                    body.L.x = 0;
                    body.L.y = 0;
                    body.L.b = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
                    body.updateAngularVelocity();
                };
                Dynamics2.prototype.setPositionRateOfChange = function (rateOfChange, idx, body) {
                    var P = body.P;
                    var mass = body.M.a;
                    rateOfChange[idx + OFFSET_POSITION_X] = P.x / mass;
                    rateOfChange[idx + OFFSET_POSITION_Y] = P.y / mass;
                };
                Dynamics2.prototype.setAttitudeRateOfChange = function (rateOfChange, idx, body) {
                    var R = body.R;
                    var Ω = body.Ω;
                    rateOfChange[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy);
                    rateOfChange[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a);
                };
                Dynamics2.prototype.zeroLinearMomentum = function (rateOfChange, idx) {
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
                };
                Dynamics2.prototype.zeroAngularMomentum = function (rateOfChange, idx) {
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
                };
                return Dynamics2;
            }();
            exports_1("Dynamics2", Dynamics2);
        }
    };
});
System.register("davinci-newton/math/Mat1.js", [], function (exports_1, context_1) {
    "use strict";

    var Mat1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Mat1 = function () {
                function Mat1(value) {
                    this.value = value;
                }
                Object.defineProperty(Mat1.prototype, "dimensions", {
                    get: function () {
                        return 1;
                    },
                    enumerable: false,
                    configurable: true
                });
                Mat1.prototype.getElement = function (row, column) {
                    if (row === 0 && column === 0) {
                        return this.value;
                    } else {
                        throw new Error('row and column must both b zero.');
                    }
                };
                return Mat1;
            }();
            exports_1("Mat1", Mat1);
        }
    };
});
System.register("davinci-newton/engine2D/Euclidean2.js", ["../math/Geometric2", "../math/Mat1"], function (exports_1, context_1) {
    "use strict";

    var Geometric2_1, Mat1_1, Euclidean2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Geometric2_1_1) {
            Geometric2_1 = Geometric2_1_1;
        }, function (Mat1_1_1) {
            Mat1_1 = Mat1_1_1;
        }],
        execute: function () {
            Euclidean2 = function () {
                function Euclidean2() {}
                Euclidean2.prototype.a = function (mv) {
                    return mv.a;
                };
                Euclidean2.prototype.add = function (lhs, rhs) {
                    return lhs.add(rhs);
                };
                Euclidean2.prototype.addVector = function (lhs, rhs) {
                    return lhs.addVector(rhs);
                };
                Euclidean2.prototype.applyMatrix = function (mv, matrix) {
                    throw new Error("applyMatrix(mv, matrix) method not implemented.");
                };
                Euclidean2.prototype.copy = function (source, target) {
                    return target.copy(source);
                };
                Euclidean2.prototype.copyBivector = function (source, target) {
                    return target.copyBivector(source);
                };
                Euclidean2.prototype.copyMatrix = function (m) {
                    if (m.dimensions !== 1) {
                        throw new Error("matrix dimensions must be 1.");
                    }
                    var value = m.getElement(0, 0);
                    return new Mat1_1.Mat1(value);
                };
                Euclidean2.prototype.copyVector = function (source, target) {
                    return target.copyVector(source);
                };
                Euclidean2.prototype.copyScalar = function (a, uom, target) {
                    return target.copyScalar(a, uom);
                };
                Euclidean2.prototype.direction = function (mv, mutate) {
                    return mv.direction(mutate);
                };
                Euclidean2.prototype.divByScalar = function (lhs, a, uom) {
                    return lhs.divByScalar(a, uom);
                };
                Euclidean2.prototype.identityMatrix = function () {
                    return new Mat1_1.Mat1(1);
                };
                Euclidean2.prototype.invertMatrix = function (m) {
                    if (m.dimensions !== 1) {
                        throw new Error("matrix dimensions must be 1.");
                    }
                    var value = m.getElement(0, 0);
                    return new Mat1_1.Mat1(1 / value);
                };
                Euclidean2.prototype.isZero = function (mv) {
                    return mv.isZero();
                };
                Euclidean2.prototype.lock = function (mv) {
                    return mv.lock();
                };
                Euclidean2.prototype.magnitude = function (mv, mutate) {
                    return mv.magnitude(mutate);
                };
                Euclidean2.prototype.mulByNumber = function (lhs, alpha) {
                    return lhs.mulByNumber(alpha);
                };
                Euclidean2.prototype.mulByScalar = function (lhs, a, uom) {
                    return lhs.mulByScalar(a, uom);
                };
                Euclidean2.prototype.mulByVector = function (lhs, rhs) {
                    return lhs.mulByVector(rhs);
                };
                Euclidean2.prototype.neg = function (mv) {
                    return mv.neg();
                };
                Euclidean2.prototype.quaditude = function (mv, mutate) {
                    return mv.quaditude(mutate);
                };
                Euclidean2.prototype.rev = function (mv) {
                    return mv.rev();
                };
                Euclidean2.prototype.rotate = function (mv, spinor) {
                    return mv.rotate(spinor);
                };
                Euclidean2.prototype.scalar = function (a, uom) {
                    return Geometric2_1.Geometric2.scalar(a, uom);
                };
                Euclidean2.prototype.scp = function (lhs, rhs) {
                    return lhs.scp(rhs);
                };
                Euclidean2.prototype.setUom = function (mv, uom) {
                    mv.uom = uom;
                };
                Euclidean2.prototype.sub = function (lhs, rhs) {
                    return lhs.sub(rhs);
                };
                Euclidean2.prototype.subScalar = function (lhs, rhs) {
                    return lhs.subScalar(rhs);
                };
                Euclidean2.prototype.subVector = function (lhs, rhs) {
                    return lhs.subVector(rhs);
                };
                Euclidean2.prototype.unlock = function (mv, token) {
                    mv.unlock(token);
                };
                Euclidean2.prototype.uom = function (mv) {
                    return mv.uom;
                };
                Euclidean2.prototype.ext = function (lhs, rhs) {
                    return lhs.ext(rhs);
                };
                Euclidean2.prototype.write = function (source, target) {
                    source.write(target);
                };
                Euclidean2.prototype.writeVector = function (source, target) {
                    source.writeVector(target);
                };
                Euclidean2.prototype.zero = function () {
                    return Geometric2_1.Geometric2.zero.clone();
                };
                return Euclidean2;
            }();
            exports_1("Euclidean2", Euclidean2);
        }
    };
});
System.register("davinci-newton/engine2D/Physics2.js", ["../core/State", "./Dynamics2", "./Euclidean2"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var State_1, Dynamics2_1, Euclidean2_1, Physics2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (State_1_1) {
            State_1 = State_1_1;
        }, function (Dynamics2_1_1) {
            Dynamics2_1 = Dynamics2_1_1;
        }, function (Euclidean2_1_1) {
            Euclidean2_1 = Euclidean2_1_1;
        }],
        execute: function () {
            Physics2 = function (_super) {
                __extends(Physics2, _super);
                function Physics2() {
                    return _super.call(this, new Euclidean2_1.Euclidean2(), new Dynamics2_1.Dynamics2()) || this;
                }
                return Physics2;
            }(State_1.State);
            exports_1("Physics2", Physics2);
        }
    };
});
System.register("davinci-newton/engine2D/Spring2.js", ["../core/Spring"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var Spring_1, Spring2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Spring_1_1) {
            Spring_1 = Spring_1_1;
        }],
        execute: function () {
            Spring2 = function (_super) {
                __extends(Spring2, _super);
                function Spring2(body1, body2) {
                    return _super.call(this, body1, body2) || this;
                }
                return Spring2;
            }(Spring_1.Spring);
            exports_1("Spring2", Spring2);
        }
    };
});
System.register("davinci-newton/engine3D/Block3.js", ["../math/Geometric3", "../math/Matrix3", "../math/Unit", "../core/RigidBody", "./Euclidean3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var Geometric3_1, Matrix3_1, Unit_1, RigidBody_1, Euclidean3_1, Block3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Geometric3_1_1) {
            Geometric3_1 = Geometric3_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
        }, function (Euclidean3_1_1) {
            Euclidean3_1 = Euclidean3_1_1;
        }],
        execute: function () {
            Block3 = function (_super) {
                __extends(Block3, _super);
                function Block3(width, height, depth) {
                    if (width === void 0) {
                        width = Geometric3_1.Geometric3.one;
                    }
                    if (height === void 0) {
                        height = Geometric3_1.Geometric3.one;
                    }
                    if (depth === void 0) {
                        depth = Geometric3_1.Geometric3.one;
                    }
                    var _this = _super.call(this, new Euclidean3_1.Euclidean3()) || this;
                    _this.width_ = Geometric3_1.Geometric3.copy(width);
                    _this.widthLock_ = _this.width_.lock();
                    _this.height_ = Geometric3_1.Geometric3.copy(height);
                    _this.heightLock_ = _this.height_.lock();
                    _this.depth_ = Geometric3_1.Geometric3.copy(depth);
                    _this.depthLock_ = _this.depth_.lock();
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Block3.prototype, "width", {
                    get: function () {
                        return this.width_;
                    },
                    set: function (width) {
                        this.width_.unlock(this.widthLock_);
                        this.width_.copy(width);
                        this.widthLock_ = this.width_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Block3.prototype, "height", {
                    get: function () {
                        return this.height_;
                    },
                    set: function (height) {
                        this.height_.unlock(this.heightLock_);
                        this.height_.copy(height);
                        this.heightLock_ = this.height_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Block3.prototype, "depth", {
                    get: function () {
                        return this.depth_;
                    },
                    set: function (depth) {
                        this.depth_.unlock(this.depthLock_);
                        this.depth_.copy(depth);
                        this.depthLock_ = this.depth_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Block3.prototype.updateAngularVelocity = function () {
                    var w = this.width_;
                    var h = this.height_;
                    var d = this.depth_;
                    var ww = w.a * w.a;
                    var hh = h.a * h.a;
                    var dd = d.a * d.a;
                    var k = 12 / this.M.a;
                    this.Ω.yz = k * this.L.yz / (hh + dd);
                    this.Ω.zx = k * this.L.zx / (ww + dd);
                    this.Ω.xy = k * this.L.xy / (ww + hh);
                    this.Ω.uom = Unit_1.Unit.div(Unit_1.Unit.div(this.L.uom, this.M.uom), Unit_1.Unit.mul(w.uom, w.uom));
                };
                Block3.prototype.updateInertiaTensor = function () {
                    var w = this.width_;
                    var h = this.height_;
                    var d = this.depth_;
                    var ww = w.a * w.a;
                    var hh = h.a * h.a;
                    var dd = d.a * d.a;
                    var s = this.M.a / 12;
                    var I = Matrix3_1.Matrix3.zero();
                    I.setElement(0, 0, s * (hh + dd));
                    I.setElement(1, 1, s * (dd + ww));
                    I.setElement(2, 2, s * (ww + hh));
                    I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(w.uom, w.uom));
                    this.I = I;
                };
                return Block3;
            }(RigidBody_1.RigidBody);
            exports_1("Block3", Block3);
        }
    };
});
System.register("davinci-newton/core/ConstantForceLaw.js", ["../model/CoordType", "../objects/AbstractSimObject", "./Force"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var CoordType_1, AbstractSimObject_1, Force_1, ConstantForceLaw;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Force_1_1) {
            Force_1 = Force_1_1;
        }],
        execute: function () {
            ConstantForceLaw = function (_super) {
                __extends(ConstantForceLaw, _super);
                function ConstantForceLaw($body, vector, vectorCoordType) {
                    if (vectorCoordType === void 0) {
                        vectorCoordType = CoordType_1.WORLD;
                    }
                    var _this = _super.call(this) || this;
                    _this.$body = $body;
                    _this.$forces = [];
                    var metric = _this.$body.metric;
                    _this.$force = new Force_1.Force(_this.$body, metric);
                    _this.$force.locationCoordType = CoordType_1.LOCAL;
                    metric.copyVector(vector, _this.$force.vector);
                    _this.$force.vectorCoordType = vectorCoordType;
                    _this.$forces = [_this.$force];
                    _this.$potentialEnergy = metric.zero();
                    _this.$potentialEnergyLock = metric.lock(_this.$potentialEnergy);
                    return _this;
                }
                Object.defineProperty(ConstantForceLaw.prototype, "location", {
                    get: function () {
                        return this.$force.location;
                    },
                    set: function (location) {
                        var metric = this.$body.metric;
                        metric.copyVector(location, this.$force.location);
                    },
                    enumerable: false,
                    configurable: true
                });
                ConstantForceLaw.prototype.updateForces = function () {
                    return this.$forces;
                };
                ConstantForceLaw.prototype.disconnect = function () {};
                ConstantForceLaw.prototype.potentialEnergy = function () {
                    var metric = this.$body.metric;
                    metric.unlock(this.$potentialEnergy, this.$potentialEnergyLock);
                    this.$potentialEnergyLock = metric.lock(this.$potentialEnergy);
                    return this.$potentialEnergy;
                };
                return ConstantForceLaw;
            }(AbstractSimObject_1.AbstractSimObject);
            exports_1("ConstantForceLaw", ConstantForceLaw);
        }
    };
});
System.register("davinci-newton/engine3D/ConstantForceLaw3.js", ["../core/ConstantForceLaw", "../model/CoordType"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var ConstantForceLaw_1, CoordType_1, ConstantForceLaw3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (ConstantForceLaw_1_1) {
            ConstantForceLaw_1 = ConstantForceLaw_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }],
        execute: function () {
            ConstantForceLaw3 = function (_super) {
                __extends(ConstantForceLaw3, _super);
                function ConstantForceLaw3(body, vector, vectorCoordType) {
                    if (vectorCoordType === void 0) {
                        vectorCoordType = CoordType_1.WORLD;
                    }
                    return _super.call(this, body, vector, vectorCoordType) || this;
                }
                return ConstantForceLaw3;
            }(ConstantForceLaw_1.ConstantForceLaw);
            exports_1("ConstantForceLaw3", ConstantForceLaw3);
        }
    };
});
System.register("davinci-newton/engine3D/Cylinder3.js", ["../core/RigidBody", "../math/Geometric3", "../math/Matrix3", "../math/Unit", "./Euclidean3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var RigidBody_1, Geometric3_1, Matrix3_1, Unit_1, Euclidean3_1, Cylinder3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
        }, function (Geometric3_1_1) {
            Geometric3_1 = Geometric3_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (Euclidean3_1_1) {
            Euclidean3_1 = Euclidean3_1_1;
        }],
        execute: function () {
            Cylinder3 = function (_super) {
                __extends(Cylinder3, _super);
                function Cylinder3(radius, height) {
                    if (radius === void 0) {
                        radius = Geometric3_1.Geometric3.one;
                    }
                    if (height === void 0) {
                        height = Geometric3_1.Geometric3.one;
                    }
                    var _this = _super.call(this, new Euclidean3_1.Euclidean3()) || this;
                    _this.radius_ = Geometric3_1.Geometric3.copy(radius);
                    _this.radiusLock_ = _this.radius_.lock();
                    _this.height_ = Geometric3_1.Geometric3.copy(height);
                    _this.heightLock_ = _this.height_.lock();
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Cylinder3.prototype, "radius", {
                    get: function () {
                        return this.radius_;
                    },
                    set: function (radius) {
                        this.radius_.unlock(this.radiusLock_);
                        this.radius_.copy(radius);
                        this.radiusLock_ = this.radius_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Cylinder3.prototype, "height", {
                    get: function () {
                        return this.height_;
                    },
                    set: function (height) {
                        this.height.unlock(this.heightLock_);
                        this.height_.copy(height);
                        this.heightLock_ = this.height_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Cylinder3.prototype.updateInertiaTensor = function () {
                    var r = this.radius_;
                    var h = this.height_;
                    var rr = r.a * r.a;
                    var hh = h.a * h.a;
                    var Irr = this.M.a * (3 * rr + hh) / 12;
                    var Ihh = this.M.a * rr / 2;
                    var I = Matrix3_1.Matrix3.zero();
                    I.setElement(0, 0, Irr);
                    I.setElement(1, 1, Ihh);
                    I.setElement(2, 2, Irr);
                    I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(r.uom, h.uom));
                    this.I = I;
                };
                return Cylinder3;
            }(RigidBody_1.RigidBody);
            exports_1("Cylinder3", Cylinder3);
        }
    };
});
System.register("davinci-newton/engine3D/Force3.js", ["../core/Force"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var Force_1, Force3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Force_1_1) {
            Force_1 = Force_1_1;
        }],
        execute: function () {
            Force3 = function (_super) {
                __extends(Force3, _super);
                function Force3(body) {
                    return _super.call(this, body, body.metric) || this;
                }
                return Force3;
            }(Force_1.Force);
            exports_1("Force3", Force3);
        }
    };
});
System.register("davinci-newton/core/GravitationLaw.js", ["../model/CoordType", "../objects/AbstractSimObject", "./Force"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var CoordType_1, AbstractSimObject_1, Force_1, GravitationLaw;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Force_1_1) {
            Force_1 = Force_1_1;
        }],
        execute: function () {
            GravitationLaw = function (_super) {
                __extends(GravitationLaw, _super);
                function GravitationLaw(body1_, body2_, G) {
                    var _this = _super.call(this) || this;
                    _this.body1_ = body1_;
                    _this.body2_ = body2_;
                    _this.forces = [];
                    _this.metric = body1_.metric;
                    var metric = _this.metric;
                    _this.F1 = new Force_1.Force(_this.body1_, metric);
                    _this.F1.locationCoordType = CoordType_1.WORLD;
                    _this.F1.vectorCoordType = CoordType_1.WORLD;
                    _this.F2 = new Force_1.Force(_this.body2_, metric);
                    _this.F2.locationCoordType = CoordType_1.WORLD;
                    _this.F2.vectorCoordType = CoordType_1.WORLD;
                    _this.G = G;
                    _this.forces = [_this.F1, _this.F2];
                    _this.potentialEnergy_ = metric.zero();
                    _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
                    return _this;
                }
                GravitationLaw.prototype.updateForces = function () {
                    var numer = this.F1.location;
                    var denom = this.F2.location;
                    var metric = this.metric;
                    metric.copyVector(this.body2_.X, numer);
                    metric.subVector(numer, this.body1_.X);
                    metric.copyVector(numer, denom);
                    metric.quaditude(denom, true);
                    metric.direction(numer, true);
                    metric.mulByScalar(numer, metric.a(this.G), metric.uom(this.G));
                    metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
                    metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));
                    metric.copyVector(numer, this.F1.vector);
                    metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));
                    metric.copyVector(this.F1.vector, this.F2.vector);
                    metric.neg(this.F2.vector);
                    metric.copyVector(this.body1_.X, this.F1.location);
                    metric.copyVector(this.body2_.X, this.F2.location);
                    return this.forces;
                };
                GravitationLaw.prototype.disconnect = function () {};
                GravitationLaw.prototype.potentialEnergy = function () {
                    var metric = this.metric;
                    metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
                    var numer = this.F1.location;
                    var denom = this.F2.location;
                    metric.copyScalar(metric.a(this.G), metric.uom(this.G), numer);
                    metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
                    metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));
                    metric.neg(numer);
                    metric.copyVector(this.body1_.X, denom);
                    metric.subVector(denom, this.body2_.X);
                    metric.magnitude(denom, true);
                    metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
                    metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));
                    metric.copyVector(this.body1_.X, this.F1.location);
                    metric.copyVector(this.body2_.X, this.F2.location);
                    this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
                    return this.potentialEnergy_;
                };
                return GravitationLaw;
            }(AbstractSimObject_1.AbstractSimObject);
            exports_1("GravitationLaw", GravitationLaw);
        }
    };
});
System.register("davinci-newton/engine3D/GravitationForceLaw3.js", ["../core/GravitationLaw", "../math/Geometric3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var GravitationLaw_1, Geometric3_1, GravitationForceLaw3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (GravitationLaw_1_1) {
            GravitationLaw_1 = GravitationLaw_1_1;
        }, function (Geometric3_1_1) {
            Geometric3_1 = Geometric3_1_1;
        }],
        execute: function () {
            GravitationForceLaw3 = function (_super) {
                __extends(GravitationForceLaw3, _super);
                function GravitationForceLaw3(body1, body2) {
                    return _super.call(this, body1, body2, Geometric3_1.Geometric3.one) || this;
                }
                return GravitationForceLaw3;
            }(GravitationLaw_1.GravitationLaw);
            exports_1("GravitationForceLaw3", GravitationForceLaw3);
        }
    };
});
System.register("davinci-newton/core/SimList.js", ["../checks/mustBeNonNullObject", "../util/AbstractSubject", "../util/contains", "../util/GenericEvent", "../util/remove"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var mustBeNonNullObject_1, AbstractSubject_1, contains_1, GenericEvent_1, remove_1, SimList;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }, function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
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
                    if (remove_1.default(this.elements_, simObject)) {
                        this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_REMOVED, simObject));
                    }
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
                SimList.OBJECT_ADDED = 'OBJECT_ADDED';
                SimList.OBJECT_REMOVED = 'OBJECT_REMOVED';
                return SimList;
            }(AbstractSubject_1.default);
            exports_1("SimList", SimList);
            exports_1("default", SimList);
        }
    };
});
System.register("davinci-newton/core/State.js", ["./SimList", "./VarsList", "../math/Unit", "../util/AbstractSubject", "../util/contains", "../util/remove"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var SimList_1, VarsList_1, Unit_1, AbstractSubject_1, contains_1, remove_1, State;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (SimList_1_1) {
            SimList_1 = SimList_1_1;
        }, function (VarsList_1_1) {
            VarsList_1 = VarsList_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }],
        execute: function () {
            State = function (_super) {
                __extends(State, _super);
                function State(metric, dynamics) {
                    var _this = _super.call(this) || this;
                    _this.metric = metric;
                    _this.dynamics = dynamics;
                    _this.simList_ = new SimList_1.default();
                    _this.bodies_ = [];
                    _this.forceLaws_ = [];
                    _this.showForces_ = false;
                    _this.varsList_ = new VarsList_1.VarsList(dynamics.getVarNames());
                    _this.potentialOffset_ = metric.zero();
                    _this.force_ = metric.zero();
                    _this.torque_ = metric.zero();
                    _this.totalEnergy_ = metric.zero();
                    _this.totalEnergyLock_ = metric.lock(_this.totalEnergy_);
                    _this.numVariablesPerBody = dynamics.numVariablesPerBody();
                    return _this;
                }
                Object.defineProperty(State.prototype, "showForces", {
                    get: function () {
                        return this.showForces_;
                    },
                    set: function (showForces) {
                        this.showForces_ = showForces;
                    },
                    enumerable: false,
                    configurable: true
                });
                State.prototype.addBody = function (body) {
                    if (!contains_1.default(this.bodies_, body)) {
                        var dynamics = this.dynamics;
                        var names = [];
                        for (var k = 0; k < this.numVariablesPerBody; k++) {
                            names.push(dynamics.getOffsetName(k));
                        }
                        body.varsIndex = this.varsList_.addVariables(names);
                        this.bodies_.push(body);
                        this.simList_.add(body);
                    }
                    this.updateFromBody(body);
                    this.discontinuosChangeToEnergy();
                };
                State.prototype.removeBody = function (body) {
                    if (contains_1.default(this.bodies_, body)) {
                        this.varsList_.deleteVariables(body.varsIndex, this.numVariablesPerBody);
                        remove_1.default(this.bodies_, body);
                        body.varsIndex = -1;
                    }
                    this.simList_.remove(body);
                    this.discontinuosChangeToEnergy();
                };
                State.prototype.addForceLaw = function (forceLaw) {
                    if (!contains_1.default(this.forceLaws_, forceLaw)) {
                        this.forceLaws_.push(forceLaw);
                    }
                    this.discontinuosChangeToEnergy();
                };
                State.prototype.removeForceLaw = function (forceLaw) {
                    forceLaw.disconnect();
                    this.discontinuosChangeToEnergy();
                    remove_1.default(this.forceLaws_, forceLaw);
                };
                State.prototype.discontinuosChangeToEnergy = function () {
                    var _a;
                    var dynamics = this.dynamics;
                    (_a = this.varsList_).incrSequence.apply(_a, dynamics.discontinuousEnergyVariables());
                };
                State.prototype.updateBodies = function (vars) {
                    var dynamics = this.dynamics;
                    var bodies = this.bodies_;
                    var N = bodies.length;
                    for (var i = 0; i < N; i++) {
                        var body = bodies[i];
                        var idx = body.varsIndex;
                        if (idx < 0) {
                            return;
                        }
                        dynamics.updateBody(vars, idx, body);
                    }
                };
                State.prototype.prolog = function () {
                    this.simList.removeTemporary(this.varsList.getTime());
                };
                State.prototype.getState = function () {
                    return this.varsList_.getValues();
                };
                State.prototype.setState = function (state) {
                    this.varsList.setValues(state, true);
                };
                State.prototype.evaluate = function (state, rateOfChange, Δt, uomTime) {
                    var metric = this.metric;
                    var dynamics = this.dynamics;
                    this.updateBodies(state);
                    var bodies = this.bodies_;
                    var Nb = bodies.length;
                    for (var bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
                        var body = bodies[bodyIndex];
                        var idx = body.varsIndex;
                        if (idx < 0) {
                            return;
                        }
                        var mass = metric.a(body.M);
                        if (mass === Number.POSITIVE_INFINITY) {
                            for (var k = 0; k < this.numVariablesPerBody; k++) {
                                rateOfChange[idx + k] = 0;
                            }
                        } else {
                            dynamics.setPositionRateOfChange(rateOfChange, idx, body);
                            dynamics.setAttitudeRateOfChange(rateOfChange, idx, body);
                            dynamics.zeroLinearMomentum(rateOfChange, idx);
                            dynamics.zeroAngularMomentum(rateOfChange, idx);
                        }
                    }
                    var forceLaws = this.forceLaws_;
                    var Nlaws = forceLaws.length;
                    for (var lawIndex = 0; lawIndex < Nlaws; lawIndex++) {
                        var forceLaw = forceLaws[lawIndex];
                        var forces = forceLaw.updateForces();
                        var Nforces = forces.length;
                        for (var forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                            this.applyForce(rateOfChange, forces[forceIndex], Δt, uomTime);
                        }
                    }
                    rateOfChange[this.varsList_.timeIndex()] = 1;
                    return null;
                };
                State.prototype.applyForce = function (rateOfChange, forceApp, Δt, uomTime) {
                    var body = forceApp.getBody();
                    if (!contains_1.default(this.bodies_, body)) {
                        return;
                    }
                    var idx = body.varsIndex;
                    if (idx < 0) {
                        return;
                    }
                    var metric = this.metric;
                    var dynamics = this.dynamics;
                    forceApp.computeForce(this.force_);
                    var F = this.force_;
                    if (Unit_1.Unit.isOne(metric.uom(body.P)) && metric.isZero(body.P)) {
                        metric.setUom(body.P, Unit_1.Unit.mul(metric.uom(F), uomTime));
                    }
                    dynamics.addForce(rateOfChange, idx, F);
                    forceApp.computeTorque(this.torque_);
                    var T = this.torque_;
                    if (Unit_1.Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
                        metric.setUom(body.L, Unit_1.Unit.mul(metric.uom(T), uomTime));
                    }
                    dynamics.addTorque(rateOfChange, idx, T);
                    if (this.showForces_) {
                        forceApp.expireTime = this.varsList_.getTime();
                        this.simList_.add(forceApp);
                    }
                };
                Object.defineProperty(State.prototype, "time", {
                    get: function () {
                        return this.varsList_.getTime();
                    },
                    enumerable: false,
                    configurable: true
                });
                State.prototype.updateFromBodies = function () {
                    var bodies = this.bodies_;
                    var N = bodies.length;
                    for (var i = 0; i < N; i++) {
                        this.updateFromBody(bodies[i]);
                    }
                    this.discontinuosChangeToEnergy();
                };
                State.prototype.updateFromBody = function (body) {
                    var idx = body.varsIndex;
                    if (idx > -1) {
                        this.dynamics.updateVarsFromBody(body, idx, this.varsList_);
                    }
                };
                State.prototype.epilog = function () {
                    var metric = this.metric;
                    var varsList = this.varsList_;
                    var vars = varsList.getValues();
                    this.updateBodies(vars);
                    var dynamics = this.dynamics;
                    dynamics.epilog(this.bodies_, this.forceLaws_, this.potentialOffset_, varsList);
                };
                Object.defineProperty(State.prototype, "bodies", {
                    get: function () {
                        return this.bodies_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(State.prototype, "simList", {
                    get: function () {
                        return this.simList_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(State.prototype, "varsList", {
                    get: function () {
                        return this.varsList_;
                    },
                    enumerable: false,
                    configurable: true
                });
                State.prototype.totalEnergy = function () {
                    var metric = this.metric;
                    metric.unlock(this.totalEnergy_, this.totalEnergyLock_);
                    metric.write(metric.zero(), this.totalEnergy_);
                    metric.add(this.totalEnergy_, this.potentialOffset_);
                    var bs = this.bodies_;
                    var Nb = bs.length;
                    for (var i = 0; i < Nb; i++) {
                        var body = bs[i];
                        if (isFinite(metric.a(body.M))) {
                            metric.add(this.totalEnergy_, body.rotationalEnergy());
                            metric.add(this.totalEnergy_, body.translationalEnergy());
                        }
                    }
                    var fs = this.forceLaws_;
                    var Nf = fs.length;
                    for (var i = 0; i < Nf; i++) {
                        metric.add(this.totalEnergy_, fs[i].potentialEnergy());
                    }
                    this.totalEnergyLock_ = metric.lock(this.totalEnergy_);
                    return this.totalEnergy_;
                };
                return State;
            }(AbstractSubject_1.default);
            exports_1("State", State);
        }
    };
});
System.register("davinci-newton/model/ConcreteVariable.js", ["../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var toName_1, validName_1, ConcreteVariable;
    var __moduleName = context_1 && context_1.id;
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
                    enumerable: false,
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
        }
    };
});
System.register("davinci-newton/util/extendArray.js", ["../checks/isArray"], function (exports_1, context_1) {
    "use strict";

    var isArray_1;
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
    return {
        setters: [function (isArray_1_1) {
            isArray_1 = isArray_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/core/VarsList.js", ["../checks/isNumber", "../checks/isString", "../model/ConcreteVariable", "../util/AbstractSubject", "../util/clone", "../util/extendArray", "../util/find", "../util/findIndex", "../util/GenericEvent", "../util/toName", "../util/validName"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var isNumber_1, isString_1, ConcreteVariable_1, AbstractSubject_1, clone_1, extendArray_1, find_1, findIndex_1, GenericEvent_1, toName_1, validName_1, VarsList;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }, function (isString_1_1) {
            isString_1 = isString_1_1;
        }, function (ConcreteVariable_1_1) {
            ConcreteVariable_1 = ConcreteVariable_1_1;
        }, function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (clone_1_1) {
            clone_1 = clone_1_1;
        }, function (extendArray_1_1) {
            extendArray_1 = extendArray_1_1;
        }, function (find_1_1) {
            find_1 = find_1_1;
        }, function (findIndex_1_1) {
            findIndex_1 = findIndex_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
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
                    for (var i = 0; i < expand; i++) {
                        newVars.push(new ConcreteVariable_1.ConcreteVariable(this, VarsList.DELETED));
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
                        this.varList_[idx] = new ConcreteVariable_1.ConcreteVariable(this, name_1);
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
                        this.varList_[i] = new ConcreteVariable_1.ConcreteVariable(this, VarsList.DELETED);
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
                VarsList.DELETED = 'DELETED';
                VarsList.TIME = 'TIME';
                VarsList.VARS_MODIFIED = 'VARS_MODIFIED';
                return VarsList;
            }(AbstractSubject_1.default);
            exports_1("VarsList", VarsList);
        }
    };
});
System.register("davinci-newton/math/wedge3.js", [], function (exports_1, context_1) {
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
System.register("davinci-newton/engine3D/Dynamics3.js", ["../core/Dynamics", "../core/VarsList", "../math/wedge3"], function (exports_1, context_1) {
    "use strict";

    var Dynamics_1, VarsList_1, wedge3_1, INDEX_TOTAL_LINEAR_MOMENTUM_X, INDEX_TOTAL_LINEAR_MOMENTUM_Y, INDEX_TOTAL_LINEAR_MOMENTUM_Z, INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, INDEX_TOTAL_ANGULAR_MOMENTUM_XY, OFFSET_POSITION_X, OFFSET_POSITION_Y, OFFSET_POSITION_Z, OFFSET_ATTITUDE_A, OFFSET_ATTITUDE_YZ, OFFSET_ATTITUDE_ZX, OFFSET_ATTITUDE_XY, OFFSET_LINEAR_MOMENTUM_X, OFFSET_LINEAR_MOMENTUM_Y, OFFSET_LINEAR_MOMENTUM_Z, OFFSET_ANGULAR_MOMENTUM_YZ, OFFSET_ANGULAR_MOMENTUM_ZX, OFFSET_ANGULAR_MOMENTUM_XY, varNames, DISCONTINUOUS_ENERGY_VARIABLES, Dynamics3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Dynamics_1_1) {
            Dynamics_1 = Dynamics_1_1;
        }, function (VarsList_1_1) {
            VarsList_1 = VarsList_1_1;
        }, function (wedge3_1_1) {
            wedge3_1 = wedge3_1_1;
        }],
        execute: function () {
            exports_1("INDEX_TOTAL_LINEAR_MOMENTUM_X", INDEX_TOTAL_LINEAR_MOMENTUM_X = Dynamics_1.INDEX_RESERVED_LAST + 1);
            exports_1("INDEX_TOTAL_LINEAR_MOMENTUM_Y", INDEX_TOTAL_LINEAR_MOMENTUM_Y = Dynamics_1.INDEX_RESERVED_LAST + 2);
            exports_1("INDEX_TOTAL_LINEAR_MOMENTUM_Z", INDEX_TOTAL_LINEAR_MOMENTUM_Z = Dynamics_1.INDEX_RESERVED_LAST + 3);
            exports_1("INDEX_TOTAL_ANGULAR_MOMENTUM_YZ", INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = Dynamics_1.INDEX_RESERVED_LAST + 4);
            exports_1("INDEX_TOTAL_ANGULAR_MOMENTUM_ZX", INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = Dynamics_1.INDEX_RESERVED_LAST + 5);
            exports_1("INDEX_TOTAL_ANGULAR_MOMENTUM_XY", INDEX_TOTAL_ANGULAR_MOMENTUM_XY = Dynamics_1.INDEX_RESERVED_LAST + 6);
            exports_1("OFFSET_POSITION_X", OFFSET_POSITION_X = 0);
            exports_1("OFFSET_POSITION_Y", OFFSET_POSITION_Y = 1);
            exports_1("OFFSET_POSITION_Z", OFFSET_POSITION_Z = 2);
            exports_1("OFFSET_ATTITUDE_A", OFFSET_ATTITUDE_A = 3);
            exports_1("OFFSET_ATTITUDE_YZ", OFFSET_ATTITUDE_YZ = 4);
            exports_1("OFFSET_ATTITUDE_ZX", OFFSET_ATTITUDE_ZX = 5);
            exports_1("OFFSET_ATTITUDE_XY", OFFSET_ATTITUDE_XY = 6);
            exports_1("OFFSET_LINEAR_MOMENTUM_X", OFFSET_LINEAR_MOMENTUM_X = 7);
            exports_1("OFFSET_LINEAR_MOMENTUM_Y", OFFSET_LINEAR_MOMENTUM_Y = 8);
            exports_1("OFFSET_LINEAR_MOMENTUM_Z", OFFSET_LINEAR_MOMENTUM_Z = 9);
            exports_1("OFFSET_ANGULAR_MOMENTUM_YZ", OFFSET_ANGULAR_MOMENTUM_YZ = 10);
            exports_1("OFFSET_ANGULAR_MOMENTUM_ZX", OFFSET_ANGULAR_MOMENTUM_ZX = 11);
            exports_1("OFFSET_ANGULAR_MOMENTUM_XY", OFFSET_ANGULAR_MOMENTUM_XY = 12);
            varNames = [VarsList_1.VarsList.TIME, "translational kinetic energy", "rotational kinetic energy", "potential energy", "total energy", "total linear momentum - x", "total linear momentum - y", "total linear momentum - z", "total angular momentum - yz", "total angular momentum - zx", "total angular momentum - xy"];
            DISCONTINUOUS_ENERGY_VARIABLES = [Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY, Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY, Dynamics_1.INDEX_POTENTIAL_ENERGY, Dynamics_1.INDEX_TOTAL_ENERGY, INDEX_TOTAL_LINEAR_MOMENTUM_X, INDEX_TOTAL_LINEAR_MOMENTUM_Y, INDEX_TOTAL_LINEAR_MOMENTUM_Z, INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, INDEX_TOTAL_ANGULAR_MOMENTUM_XY];
            Dynamics3 = function () {
                function Dynamics3() {}
                Dynamics3.prototype.numVariablesPerBody = function () {
                    return 13;
                };
                Dynamics3.prototype.getVarNames = function () {
                    return varNames;
                };
                Dynamics3.prototype.getOffsetName = function (offset) {
                    switch (offset) {
                        case OFFSET_POSITION_X:
                            return "position x";
                        case OFFSET_POSITION_Y:
                            return "position y";
                        case OFFSET_POSITION_Z:
                            return "position z";
                        case OFFSET_ATTITUDE_A:
                            return "attitude a";
                        case OFFSET_ATTITUDE_YZ:
                            return "attitude yz";
                        case OFFSET_ATTITUDE_ZX:
                            return "attitude zx";
                        case OFFSET_ATTITUDE_XY:
                            return "attitude xy";
                        case OFFSET_LINEAR_MOMENTUM_X:
                            return "linear momentum x";
                        case OFFSET_LINEAR_MOMENTUM_Y:
                            return "linear momentum y";
                        case OFFSET_LINEAR_MOMENTUM_Z:
                            return "linear momentum z";
                        case OFFSET_ANGULAR_MOMENTUM_YZ:
                            return "angular momentum yz";
                        case OFFSET_ANGULAR_MOMENTUM_ZX:
                            return "angular momentum zx";
                        case OFFSET_ANGULAR_MOMENTUM_XY:
                            return "angular momentum xy";
                    }
                    throw new Error("getVarName(" + offset + ")");
                };
                Dynamics3.prototype.discontinuousEnergyVariables = function () {
                    return DISCONTINUOUS_ENERGY_VARIABLES;
                };
                Dynamics3.prototype.epilog = function (bodies, forceLaws, potentialOffset, varsList) {
                    var pe = potentialOffset.a;
                    var re = 0;
                    var te = 0;
                    var Px = 0;
                    var Py = 0;
                    var Pz = 0;
                    var Lyz = 0;
                    var Lzx = 0;
                    var Lxy = 0;
                    var bs = bodies;
                    var Nb = bs.length;
                    for (var i = 0; i < Nb; i++) {
                        var b = bs[i];
                        if (isFinite(b.M.a)) {
                            re += b.rotationalEnergy().a;
                            te += b.translationalEnergy().a;
                            Px += b.P.x;
                            Py += b.P.y;
                            Pz += b.P.z;
                            Lyz += wedge3_1.wedgeYZ(b.X, b.P);
                            Lzx += wedge3_1.wedgeZX(b.X, b.P);
                            Lxy += wedge3_1.wedgeXY(b.X, b.P);
                            Lyz += b.L.yz;
                            Lzx += b.L.zx;
                            Lxy += b.L.xy;
                        }
                    }
                    var fs = forceLaws;
                    var Nf = fs.length;
                    for (var i = 0; i < Nf; i++) {
                        pe += fs[i].potentialEnergy().a;
                    }
                    varsList.setValue(Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
                    varsList.setValue(Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
                    varsList.setValue(Dynamics_1.INDEX_POTENTIAL_ENERGY, pe, true);
                    varsList.setValue(Dynamics_1.INDEX_TOTAL_ENERGY, te + re + pe, true);
                    varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
                    varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
                    varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz, true);
                    varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz, true);
                    varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx, true);
                    varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
                };
                Dynamics3.prototype.updateVarsFromBody = function (body, idx, vars) {
                    vars.setValue(OFFSET_POSITION_X + idx, body.X.x);
                    vars.setValue(OFFSET_POSITION_Y + idx, body.X.y);
                    vars.setValue(OFFSET_POSITION_Z + idx, body.X.z);
                    vars.setValue(OFFSET_ATTITUDE_A + idx, body.R.a);
                    vars.setValue(OFFSET_ATTITUDE_XY + idx, body.R.xy);
                    vars.setValue(OFFSET_ATTITUDE_YZ + idx, body.R.yz);
                    vars.setValue(OFFSET_ATTITUDE_ZX + idx, body.R.zx);
                    vars.setValue(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
                    vars.setValue(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
                    vars.setValue(OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);
                    vars.setValue(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
                    vars.setValue(OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
                    vars.setValue(OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
                };
                Dynamics3.prototype.addForce = function (rateOfChange, idx, force) {
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] += force.x;
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] += force.y;
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z] += force.z;
                };
                Dynamics3.prototype.addTorque = function (rateOfChange, idx, torque) {
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_YZ] += torque.yz;
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_ZX] += torque.zx;
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] += torque.xy;
                };
                Dynamics3.prototype.updateBody = function (vars, idx, body) {
                    body.X.x = vars[idx + OFFSET_POSITION_X];
                    body.X.y = vars[idx + OFFSET_POSITION_Y];
                    body.X.z = vars[idx + OFFSET_POSITION_Z];
                    body.R.a = vars[idx + OFFSET_ATTITUDE_A];
                    body.R.xy = vars[idx + OFFSET_ATTITUDE_XY];
                    body.R.yz = vars[idx + OFFSET_ATTITUDE_YZ];
                    body.R.zx = vars[idx + OFFSET_ATTITUDE_ZX];
                    var R = body.R;
                    var magR = Math.sqrt(R.a * R.a + R.xy * R.xy + R.yz * R.yz + R.zx * R.zx);
                    body.R.a = body.R.a / magR;
                    body.R.xy = body.R.xy / magR;
                    body.R.yz = body.R.yz / magR;
                    body.R.zx = body.R.zx / magR;
                    body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
                    body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
                    body.P.z = vars[idx + OFFSET_LINEAR_MOMENTUM_Z];
                    body.L.xy = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
                    body.L.yz = vars[idx + OFFSET_ANGULAR_MOMENTUM_YZ];
                    body.L.zx = vars[idx + OFFSET_ANGULAR_MOMENTUM_ZX];
                    body.updateAngularVelocity();
                };
                Dynamics3.prototype.setPositionRateOfChange = function (rateOfChange, idx, body) {
                    var P = body.P;
                    var mass = body.M.a;
                    rateOfChange[idx + OFFSET_POSITION_X] = P.x / mass;
                    rateOfChange[idx + OFFSET_POSITION_Y] = P.y / mass;
                    rateOfChange[idx + OFFSET_POSITION_Z] = P.z / mass;
                };
                Dynamics3.prototype.setAttitudeRateOfChange = function (rateOfChange, idx, body) {
                    var R = body.R;
                    var Ω = body.Ω;
                    rateOfChange[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
                    rateOfChange[idx + OFFSET_ATTITUDE_YZ] = -0.5 * (Ω.yz * R.a + Ω.xy * R.zx - Ω.zx * R.xy);
                    rateOfChange[idx + OFFSET_ATTITUDE_ZX] = -0.5 * (Ω.zx * R.a + Ω.yz * R.xy - Ω.xy * R.yz);
                    rateOfChange[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a + Ω.zx * R.yz - Ω.yz * R.zx);
                };
                Dynamics3.prototype.zeroLinearMomentum = function (rateOfChange, idx) {
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
                    rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z] = 0;
                };
                Dynamics3.prototype.zeroAngularMomentum = function (rateOfChange, idx) {
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
                    rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
                };
                return Dynamics3;
            }();
            exports_1("Dynamics3", Dynamics3);
        }
    };
});
System.register("davinci-newton/engine3D/Physics3.js", ["../core/State", "./Dynamics3", "./Euclidean3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var State_1, Dynamics3_1, Euclidean3_1, Physics3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (State_1_1) {
            State_1 = State_1_1;
        }, function (Dynamics3_1_1) {
            Dynamics3_1 = Dynamics3_1_1;
        }, function (Euclidean3_1_1) {
            Euclidean3_1 = Euclidean3_1_1;
        }],
        execute: function () {
            Physics3 = function (_super) {
                __extends(Physics3, _super);
                function Physics3() {
                    return _super.call(this, new Euclidean3_1.Euclidean3(), new Dynamics3_1.Dynamics3()) || this;
                }
                return Physics3;
            }(State_1.State);
            exports_1("Physics3", Physics3);
        }
    };
});
System.register("davinci-newton/checks/mustBeFunction.js", ["../checks/mustSatisfy", "../checks/isFunction"], function (exports_1, context_1) {
    "use strict";

    var mustSatisfy_1, isFunction_1;
    var __moduleName = context_1 && context_1.id;
    function beFunction() {
        return "be a function";
    }
    function mustBeFunction(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isFunction_1.default(value), beFunction, contextBuilder);
        return value;
    }
    exports_1("default", mustBeFunction);
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isFunction_1_1) {
            isFunction_1 = isFunction_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/core/RigidBody.js", ["../checks/mustBeFunction", "../checks/mustBeNonNullObject", "../checks/mustBeNumber", "../math/Unit", "../objects/AbstractSimObject", "./assertConsistentUnits", "./mustBeDimensionlessOrCorrectUnits"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var mustBeFunction_1, mustBeNonNullObject_1, mustBeNumber_1, Unit_1, AbstractSimObject_1, assertConsistentUnits_1, mustBeDimensionlessOrCorrectUnits_1, RigidBody;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (mustBeFunction_1_1) {
            mustBeFunction_1 = mustBeFunction_1_1;
        }, function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }, function (mustBeNumber_1_1) {
            mustBeNumber_1 = mustBeNumber_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (assertConsistentUnits_1_1) {
            assertConsistentUnits_1 = assertConsistentUnits_1_1;
        }, function (mustBeDimensionlessOrCorrectUnits_1_1) {
            mustBeDimensionlessOrCorrectUnits_1 = mustBeDimensionlessOrCorrectUnits_1_1;
        }],
        execute: function () {
            RigidBody = function (_super) {
                __extends(RigidBody, _super);
                function RigidBody(metric) {
                    var _this = _super.call(this) || this;
                    _this.metric = metric;
                    _this.varsIndex_ = -1;
                    _this.mass_ = metric.scalar(1);
                    _this.massLock_ = metric.lock(_this.mass_);
                    _this.charge_ = metric.zero();
                    _this.chargeLock_ = metric.lock(_this.charge_);
                    _this.position_ = metric.zero();
                    _this.attitude_ = metric.scalar(1);
                    _this.linearMomentum_ = metric.zero();
                    _this.angularMomentum_ = metric.zero();
                    _this.angularVelocity_ = metric.zero();
                    _this.rotationalEnergy_ = metric.zero();
                    _this.rotationalEnergyLock_ = metric.lock(_this.rotationalEnergy_);
                    _this.translationalEnergy_ = metric.zero();
                    _this.translationalEnergyLock_ = metric.lock(_this.translationalEnergy_);
                    _this.worldPoint_ = metric.zero();
                    _this.Ω_scratch = metric.zero();
                    _this.centerOfMassLocal_ = metric.zero();
                    _this.centerOfMassLocalLock_ = metric.lock(_this.centerOfMassLocal_);
                    _this.inertiaTensorInverse_ = metric.identityMatrix();
                    return _this;
                }
                Object.defineProperty(RigidBody.prototype, "centerOfMassLocal", {
                    get: function () {
                        return this.centerOfMassLocal_;
                    },
                    set: function (centerOfMassLocal) {
                        this.metric.unlock(this.centerOfMassLocal_, this.centerOfMassLocalLock_);
                        this.metric.copyVector(centerOfMassLocal, this.centerOfMassLocal_);
                        this.centerOfMassLocalLock_ = this.metric.lock(this.centerOfMassLocal_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "M", {
                    get: function () {
                        return this.mass_;
                    },
                    set: function (M) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('M', M, Unit_1.Unit.KILOGRAM, this.metric);
                        this.metric.unlock(this.mass_, this.massLock_);
                        this.metric.copy(M, this.mass_);
                        this.massLock_ = this.metric.lock(this.mass_);
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "Q", {
                    get: function () {
                        return this.charge_;
                    },
                    set: function (Q) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('Q', Q, Unit_1.Unit.COULOMB, this.metric);
                        this.metric.unlock(this.charge_, this.chargeLock_);
                        this.metric.copy(Q, this.charge_);
                        this.chargeLock_ = this.metric.lock(this.charge_);
                    },
                    enumerable: false,
                    configurable: true
                });
                RigidBody.prototype.updateAngularVelocity = function () {
                    this.metric.copy(this.L, this.Ω);
                    this.metric.rev(this.R);
                    this.metric.rotate(this.Ω, this.R);
                    this.metric.copy(this.Ω, this.Ω_scratch);
                    this.metric.applyMatrix(this.Ω_scratch, this.Iinv);
                    this.metric.copyBivector(this.Ω_scratch, this.Ω);
                    this.metric.rev(this.R);
                    this.metric.rotate(this.Ω, this.R);
                };
                RigidBody.prototype.updateInertiaTensor = function () {};
                Object.defineProperty(RigidBody.prototype, "I", {
                    get: function () {
                        return this.metric.invertMatrix(this.inertiaTensorInverse_);
                    },
                    set: function (I) {
                        this.inertiaTensorInverse_ = this.metric.invertMatrix(I);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "Iinv", {
                    get: function () {
                        return this.inertiaTensorInverse_;
                    },
                    set: function (source) {
                        mustBeNonNullObject_1.default('Iinv', source);
                        mustBeNumber_1.default('dimensions', source.dimensions);
                        mustBeFunction_1.default('getElement', source.getElement);
                        this.inertiaTensorInverse_ = this.metric.copyMatrix(source);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "X", {
                    get: function () {
                        return this.position_;
                    },
                    set: function (position) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('position', position, Unit_1.Unit.METER, this.metric);
                        this.metric.copy(position, this.position_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "R", {
                    get: function () {
                        return this.attitude_;
                    },
                    set: function (attitude) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('attitude', attitude, Unit_1.Unit.ONE, this.metric);
                        this.metric.copy(attitude, this.attitude_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "P", {
                    get: function () {
                        return this.linearMomentum_;
                    },
                    set: function (momentum) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('momentum', momentum, Unit_1.Unit.KILOGRAM_METER_PER_SECOND, this.metric);
                        this.metric.copy(momentum, this.linearMomentum_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "L", {
                    get: function () {
                        return this.angularMomentum_;
                    },
                    set: function (angularMomentum) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('angularMomentum', angularMomentum, Unit_1.Unit.JOULE_SECOND, this.metric);
                        this.metric.copy(angularMomentum, this.angularMomentum_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "\u03A9", {
                    get: function () {
                        return this.angularVelocity_;
                    },
                    set: function (angularVelocity) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('angularVelocity', angularVelocity, Unit_1.Unit.INV_SECOND, this.metric);
                        this.metric.copy(angularVelocity, this.angularVelocity_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "expireTime", {
                    get: function () {
                        return Number.POSITIVE_INFINITY;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "varsIndex", {
                    get: function () {
                        return this.varsIndex_;
                    },
                    set: function (index) {
                        this.varsIndex_ = index;
                    },
                    enumerable: false,
                    configurable: true
                });
                RigidBody.prototype.rotationalEnergy = function () {
                    assertConsistentUnits_1.assertConsistentUnits('Ω', this.Ω, 'L', this.L, this.metric);
                    this.metric.unlock(this.rotationalEnergy_, this.rotationalEnergyLock_);
                    this.metric.copyBivector(this.Ω, this.rotationalEnergy_);
                    this.metric.rev(this.rotationalEnergy_);
                    this.metric.scp(this.rotationalEnergy_, this.L);
                    this.metric.mulByNumber(this.rotationalEnergy_, 0.5);
                    this.rotationalEnergyLock_ = this.metric.lock(this.rotationalEnergy_);
                    return this.rotationalEnergy_;
                };
                RigidBody.prototype.translationalEnergy = function () {
                    assertConsistentUnits_1.assertConsistentUnits('M', this.M, 'P', this.P, this.metric);
                    this.metric.unlock(this.translationalEnergy_, this.translationalEnergyLock_);
                    this.metric.copyVector(this.P, this.translationalEnergy_);
                    this.metric.mulByVector(this.translationalEnergy_, this.P);
                    this.metric.divByScalar(this.translationalEnergy_, this.metric.a(this.M), this.metric.uom(this.M));
                    this.metric.mulByNumber(this.translationalEnergy_, 0.5);
                    this.translationalEnergyLock_ = this.metric.lock(this.translationalEnergy_);
                    return this.translationalEnergy_;
                };
                RigidBody.prototype.localPointToWorldPoint = function (localPoint, worldPoint) {
                    this.metric.copyVector(localPoint, this.worldPoint_);
                    this.metric.subVector(this.worldPoint_, this.centerOfMassLocal_);
                    this.metric.rotate(this.worldPoint_, this.attitude_);
                    this.metric.addVector(this.worldPoint_, this.position_);
                    this.metric.writeVector(this.worldPoint_, worldPoint);
                };
                return RigidBody;
            }(AbstractSimObject_1.AbstractSimObject);
            exports_1("RigidBody", RigidBody);
        }
    };
});
System.register("davinci-newton/math/Mat3.js", ["./Matrix3", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var Matrix3_1, Unit_1, Mat3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {
            Mat3 = function () {
                function Mat3(source) {
                    this.data = Matrix3_1.Matrix3.one();
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
                    this.uom = Unit_1.Unit.mustBeUnit('uom', source.uom);
                }
                Object.defineProperty(Mat3.prototype, "dimensions", {
                    get: function () {
                        return 3;
                    },
                    enumerable: false,
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
        }
    };
});
System.register("davinci-newton/engine3D/Euclidean3.js", ["../math/Geometric3", "../math/Mat3", "../math/Matrix3"], function (exports_1, context_1) {
    "use strict";

    var Geometric3_1, Mat3_1, Matrix3_1, Euclidean3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Geometric3_1_1) {
            Geometric3_1 = Geometric3_1_1;
        }, function (Mat3_1_1) {
            Mat3_1 = Mat3_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }],
        execute: function () {
            Euclidean3 = function () {
                function Euclidean3() {}
                Euclidean3.prototype.a = function (mv) {
                    return mv.a;
                };
                Euclidean3.prototype.add = function (lhs, rhs) {
                    return lhs.add(rhs);
                };
                Euclidean3.prototype.addVector = function (lhs, rhs) {
                    return lhs.addVector(rhs);
                };
                Euclidean3.prototype.applyMatrix = function (mv, matrix) {
                    throw new Error("applyMatrix(mv, matrix) method not implemented.");
                };
                Euclidean3.prototype.copy = function (source, target) {
                    return target.copy(source);
                };
                Euclidean3.prototype.copyBivector = function (source, target) {
                    return target.copyBivector(source);
                };
                Euclidean3.prototype.copyMatrix = function (m) {
                    return new Mat3_1.Mat3(m);
                };
                Euclidean3.prototype.copyVector = function (source, target) {
                    return target.copyVector(source);
                };
                Euclidean3.prototype.copyScalar = function (a, uom, target) {
                    return target.copyScalar(a, uom);
                };
                Euclidean3.prototype.direction = function (mv, mutate) {
                    return mv.direction(mutate);
                };
                Euclidean3.prototype.divByScalar = function (lhs, a, uom) {
                    return lhs.divByScalar(a, uom);
                };
                Euclidean3.prototype.identityMatrix = function () {
                    return new Mat3_1.Mat3(Matrix3_1.Matrix3.one());
                };
                Euclidean3.prototype.invertMatrix = function (m) {
                    var I = Matrix3_1.Matrix3.zero().copy(m).inv();
                    return new Mat3_1.Mat3(I);
                };
                Euclidean3.prototype.isZero = function (mv) {
                    return mv.isZero();
                };
                Euclidean3.prototype.lock = function (mv) {
                    return mv.lock();
                };
                Euclidean3.prototype.magnitude = function (mv, mutate) {
                    return mv.magnitude(mutate);
                };
                Euclidean3.prototype.mulByNumber = function (lhs, alpha) {
                    return lhs.mulByNumber(alpha);
                };
                Euclidean3.prototype.mulByScalar = function (lhs, a, uom) {
                    return lhs.mulByScalar(a, uom);
                };
                Euclidean3.prototype.mulByVector = function (lhs, rhs) {
                    return lhs.mulByVector(rhs);
                };
                Euclidean3.prototype.neg = function (mv) {
                    return mv.neg();
                };
                Euclidean3.prototype.quaditude = function (mv, mutate) {
                    return mv.quaditude(mutate);
                };
                Euclidean3.prototype.rev = function (mv) {
                    return mv.rev();
                };
                Euclidean3.prototype.rotate = function (mv, spinor) {
                    return mv.rotate(spinor);
                };
                Euclidean3.prototype.scalar = function (a, uom) {
                    return Geometric3_1.Geometric3.scalar(a, uom);
                };
                Euclidean3.prototype.scp = function (lhs, rhs) {
                    return lhs.scp(rhs);
                };
                Euclidean3.prototype.setUom = function (mv, uom) {
                    mv.uom = uom;
                };
                Euclidean3.prototype.sub = function (lhs, rhs) {
                    return lhs.sub(rhs);
                };
                Euclidean3.prototype.subScalar = function (lhs, rhs) {
                    return lhs.subScalar(rhs);
                };
                Euclidean3.prototype.subVector = function (lhs, rhs) {
                    return lhs.subVector(rhs);
                };
                Euclidean3.prototype.unlock = function (mv, token) {
                    mv.unlock(token);
                };
                Euclidean3.prototype.uom = function (mv) {
                    return mv.uom;
                };
                Euclidean3.prototype.ext = function (lhs, rhs) {
                    return lhs.ext(rhs);
                };
                Euclidean3.prototype.write = function (source, target) {
                    source.write(target);
                };
                Euclidean3.prototype.writeVector = function (source, target) {
                    source.writeVector(target);
                };
                Euclidean3.prototype.zero = function () {
                    return Geometric3_1.Geometric3.zero.clone();
                };
                return Euclidean3;
            }();
            exports_1("Euclidean3", Euclidean3);
        }
    };
});
System.register("davinci-newton/engine3D/Sphere3.js", ["../core/RigidBody", "../math/Geometric3", "../math/Matrix3", "../math/Unit", "./Euclidean3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var RigidBody_1, Geometric3_1, Matrix3_1, Unit_1, Euclidean3_1, Sphere3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
        }, function (Geometric3_1_1) {
            Geometric3_1 = Geometric3_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (Euclidean3_1_1) {
            Euclidean3_1 = Euclidean3_1_1;
        }],
        execute: function () {
            Sphere3 = function (_super) {
                __extends(Sphere3, _super);
                function Sphere3(radius) {
                    if (radius === void 0) {
                        radius = Geometric3_1.Geometric3.one;
                    }
                    var _this = _super.call(this, new Euclidean3_1.Euclidean3()) || this;
                    _this.radius_ = Geometric3_1.Geometric3.fromScalar(radius);
                    _this.radiusLock_ = _this.radius_.lock();
                    _this.updateInertiaTensor();
                    return _this;
                }
                Object.defineProperty(Sphere3.prototype, "radius", {
                    get: function () {
                        return this.radius_;
                    },
                    set: function (radius) {
                        this.radius_.unlock(this.radiusLock_);
                        this.radius_.copyScalar(radius.a, radius.uom);
                        this.radiusLock_ = this.radius_.lock();
                        this.updateInertiaTensor();
                    },
                    enumerable: false,
                    configurable: true
                });
                Sphere3.prototype.updateAngularVelocity = function () {
                    this.Ω.copyScalar(this.radius_.a, this.radius_.uom);
                    this.Ω.quaditude(true);
                    this.Ω.mulByScalar(this.M.a, this.M.uom);
                    this.Ω.mulByNumber(2 / 5);
                    this.Ω.inv();
                    this.Ω.mulByBivector(this.L);
                };
                Sphere3.prototype.updateInertiaTensor = function () {
                    var r = this.radius_;
                    var s = 2 * this.M.a * r.a * r.a / 5;
                    var I = Matrix3_1.Matrix3.zero();
                    I.setElement(0, 0, s);
                    I.setElement(1, 1, s);
                    I.setElement(2, 2, s);
                    I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(r.uom, r.uom));
                    this.I = I;
                };
                return Sphere3;
            }(RigidBody_1.RigidBody);
            exports_1("Sphere3", Sphere3);
        }
    };
});
System.register("davinci-newton/core/assertConsistentUnits.js", ["../math/Unit"], function (exports_1, context_1) {
    "use strict";

    var Unit_1;
    var __moduleName = context_1 && context_1.id;
    function assertConsistentUnits(aName, A, bName, B, metric) {
        if (!metric.isZero(A) && !metric.isZero(B)) {
            if (Unit_1.Unit.isOne(metric.uom(A))) {
                if (!Unit_1.Unit.isOne(metric.uom(B))) {
                    throw new Error(aName + " => " + A + " must have dimensions if " + bName + " => " + B + " has dimensions.");
                }
            } else {
                if (Unit_1.Unit.isOne(metric.uom(B))) {
                    throw new Error(bName + " => " + B + " must have dimensions if " + aName + " => " + A + " has dimensions.");
                }
            }
        }
    }
    exports_1("assertConsistentUnits", assertConsistentUnits);
    return {
        setters: [function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/objects/AbstractSimObject.js", [], function (exports_1, context_1) {
    "use strict";

    var AbstractSimObject;
    var __moduleName = context_1 && context_1.id;
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
                    enumerable: false,
                    configurable: true
                });
                return AbstractSimObject;
            }();
            exports_1("AbstractSimObject", AbstractSimObject);
        }
    };
});
System.register("davinci-newton/core/Force.js", ["../model/CoordType", "../objects/AbstractSimObject"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var CoordType_1, AbstractSimObject_1, Force;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }],
        execute: function () {
            Force = function (_super) {
                __extends(Force, _super);
                function Force(body_, metric) {
                    var _this = _super.call(this) || this;
                    _this.body_ = body_;
                    _this.metric = metric;
                    _this.location = metric.zero();
                    _this.vector = metric.zero();
                    _this.position_ = metric.zero();
                    _this.force_ = metric.zero();
                    _this.torque_ = metric.zero();
                    return _this;
                }
                Force.prototype.getBody = function () {
                    return this.body_;
                };
                Force.prototype.computeForce = function (force) {
                    switch (this.vectorCoordType) {
                        case CoordType_1.LOCAL:
                            {
                                this.metric.copyVector(this.vector, this.force_);
                                this.metric.rotate(this.force_, this.body_.R);
                                this.metric.writeVector(this.force_, force);
                                break;
                            }
                        case CoordType_1.WORLD:
                            {
                                this.metric.copyVector(this.vector, this.force_);
                                this.metric.writeVector(this.force_, force);
                                break;
                            }
                    }
                };
                Object.defineProperty(Force.prototype, "F", {
                    get: function () {
                        this.computeForce(this.force_);
                        return this.force_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Force.prototype, "x", {
                    get: function () {
                        this.computePosition(this.position_);
                        return this.position_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Force.prototype.computePosition = function (position) {
                    switch (this.locationCoordType) {
                        case CoordType_1.LOCAL:
                            {
                                this.metric.copyVector(this.location, this.position_);
                                this.metric.rotate(this.position_, this.body_.R);
                                this.metric.addVector(this.position_, this.body_.X);
                                this.metric.writeVector(this.position_, position);
                                break;
                            }
                        case CoordType_1.WORLD:
                            {
                                this.metric.copyVector(this.location, this.position_);
                                this.metric.writeVector(this.position_, position);
                                break;
                            }
                    }
                };
                Force.prototype.computeTorque = function (torque) {
                    this.computePosition(this.position_);
                    this.computeForce(this.force_);
                    this.metric.subVector(this.position_, this.body_.X);
                    this.metric.ext(this.position_, this.force_);
                    this.metric.write(this.position_, torque);
                };
                return Force;
            }(AbstractSimObject_1.AbstractSimObject);
            exports_1("Force", Force);
        }
    };
});
System.register("davinci-newton/core/mustBeDimensionlessOrCorrectUnits.js", ["../math/Unit"], function (exports_1, context_1) {
    "use strict";

    var Unit_1;
    var __moduleName = context_1 && context_1.id;
    function mustBeDimensionlessOrCorrectUnits(name, value, unit, metric) {
        if (!Unit_1.Unit.isOne(metric.uom(value)) && !Unit_1.Unit.isCompatible(metric.uom(value), unit)) {
            throw new Error(name + " unit of measure, " + metric.uom(value) + ", must be compatible with " + unit);
        } else {
            return value;
        }
    }
    exports_1("mustBeDimensionlessOrCorrectUnits", mustBeDimensionlessOrCorrectUnits);
    return {
        setters: [function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/core/Spring.js", ["../math/Unit", "../model/CoordType", "../objects/AbstractSimObject", "./assertConsistentUnits", "./Force", "./mustBeDimensionlessOrCorrectUnits"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var Unit_1, CoordType_1, AbstractSimObject_1, assertConsistentUnits_1, Force_1, mustBeDimensionlessOrCorrectUnits_1, Spring;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (assertConsistentUnits_1_1) {
            assertConsistentUnits_1 = assertConsistentUnits_1_1;
        }, function (Force_1_1) {
            Force_1 = Force_1_1;
        }, function (mustBeDimensionlessOrCorrectUnits_1_1) {
            mustBeDimensionlessOrCorrectUnits_1 = mustBeDimensionlessOrCorrectUnits_1_1;
        }],
        execute: function () {
            Spring = function (_super) {
                __extends(Spring, _super);
                function Spring(body1_, body2_) {
                    var _this = _super.call(this) || this;
                    _this.body1_ = body1_;
                    _this.body2_ = body2_;
                    _this.forces = [];
                    _this.metric = body1_.metric;
                    var metric = _this.metric;
                    _this.$restLength = metric.scalar(1);
                    _this.$restLengthLock = metric.lock(_this.$restLength);
                    _this.$stiffness = metric.scalar(1);
                    _this.$stiffnessLock = metric.lock(_this.$stiffness);
                    _this.attach1_ = metric.zero();
                    _this.attach1Lock = metric.lock(_this.attach1_);
                    _this.attach2_ = metric.zero();
                    _this.attach2Lock = metric.lock(_this.attach2_);
                    _this.end1_ = metric.zero();
                    _this.end1Lock_ = metric.lock(_this.end1_);
                    _this.end2_ = metric.zero();
                    _this.end2Lock_ = metric.lock(_this.end2_);
                    _this.F1 = new Force_1.Force(_this.body1_, metric);
                    _this.F1.locationCoordType = CoordType_1.WORLD;
                    _this.F1.vectorCoordType = CoordType_1.WORLD;
                    _this.F2 = new Force_1.Force(_this.body2_, metric);
                    _this.F2.locationCoordType = CoordType_1.WORLD;
                    _this.F2.vectorCoordType = CoordType_1.WORLD;
                    _this.potentialEnergy_ = metric.zero();
                    _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
                    _this.forces = [_this.F1, _this.F2];
                    return _this;
                }
                Object.defineProperty(Spring.prototype, "restLength", {
                    get: function () {
                        return this.$restLength;
                    },
                    set: function (restLength) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('restLength', restLength, Unit_1.Unit.METER, this.metric);
                        this.metric.unlock(this.$restLength, this.$restLengthLock);
                        this.metric.copy(restLength, this.$restLength);
                        this.$restLengthLock = this.metric.lock(this.$restLength);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Spring.prototype, "stiffness", {
                    get: function () {
                        return this.$stiffness;
                    },
                    set: function (stiffness) {
                        mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('stiffness', stiffness, Unit_1.Unit.STIFFNESS, this.metric);
                        this.metric.unlock(this.$stiffness, this.$stiffnessLock);
                        this.metric.copy(stiffness, this.$stiffness);
                        this.$stiffnessLock = this.metric.lock(this.$stiffness);
                    },
                    enumerable: false,
                    configurable: true
                });
                Spring.prototype.computeBody1AttachPointInWorldCoords = function (x) {
                    if (this.attach1_ == null || this.body1_ == null) {
                        throw new Error();
                    }
                    this.body1_.localPointToWorldPoint(this.attach1_, x);
                };
                Spring.prototype.computeBody2AttachPointInWorldCoords = function (x) {
                    if (this.attach2_ == null || this.body2_ == null) {
                        throw new Error();
                    }
                    this.body2_.localPointToWorldPoint(this.attach2_, x);
                };
                Object.defineProperty(Spring.prototype, "attach1", {
                    get: function () {
                        return this.attach1_;
                    },
                    set: function (attach1) {
                        this.metric.unlock(this.attach1_, this.attach1Lock);
                        this.metric.copyVector(attach1, this.attach1_);
                        this.attach1Lock = this.metric.lock(this.attach1_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Spring.prototype, "attach2", {
                    get: function () {
                        return this.attach2_;
                    },
                    set: function (attach2) {
                        this.metric.unlock(this.attach2_, this.attach2Lock);
                        this.metric.copyVector(attach2, this.attach2_);
                        this.attach2Lock = this.metric.lock(this.attach2_);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Spring.prototype, "end1", {
                    get: function () {
                        this.metric.unlock(this.end1_, this.end1Lock_);
                        this.computeBody1AttachPointInWorldCoords(this.end1_);
                        this.end1Lock_ = this.metric.lock(this.end1_);
                        return this.end1_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Spring.prototype, "end2", {
                    get: function () {
                        this.metric.unlock(this.end2_, this.end2Lock_);
                        this.computeBody2AttachPointInWorldCoords(this.end2_);
                        this.end2Lock_ = this.metric.lock(this.end2_);
                        return this.end2_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Spring.prototype.updateForces = function () {
                    this.computeBody1AttachPointInWorldCoords(this.F1.location);
                    this.computeBody2AttachPointInWorldCoords(this.F2.location);
                    var metric = this.metric;
                    metric.copyVector(this.F2.location, this.F2.vector);
                    metric.subVector(this.F2.vector, this.F1.location);
                    metric.direction(this.F2.vector, true);
                    metric.copyVector(this.F1.location, this.F1.vector);
                    metric.subVector(this.F1.vector, this.F2.location);
                    metric.magnitude(this.F1.vector, true);
                    metric.subScalar(this.F1.vector, this.restLength);
                    metric.mulByScalar(this.F1.vector, metric.a(this.stiffness), metric.uom(this.stiffness));
                    metric.mulByVector(this.F1.vector, this.F2.vector);
                    this.metric.copyVector(this.F1.vector, this.F2.vector);
                    this.metric.neg(this.F2.vector);
                    return this.forces;
                };
                Spring.prototype.disconnect = function () {};
                Spring.prototype.potentialEnergy = function () {
                    this.computeBody1AttachPointInWorldCoords(this.F1.location);
                    this.computeBody2AttachPointInWorldCoords(this.F2.location);
                    var metric = this.metric;
                    this.metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
                    this.potentialEnergyLock_ = -1;
                    assertConsistentUnits_1.assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location, this.metric);
                    metric.copyVector(this.F2.location, this.potentialEnergy_);
                    metric.subVector(this.potentialEnergy_, this.F1.location);
                    metric.magnitude(this.potentialEnergy_, true);
                    assertConsistentUnits_1.assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength, this.metric);
                    metric.sub(this.potentialEnergy_, this.restLength);
                    metric.quaditude(this.potentialEnergy_, true);
                    metric.mulByScalar(this.potentialEnergy_, metric.a(this.stiffness), metric.uom(this.stiffness));
                    metric.mulByNumber(this.potentialEnergy_, 0.5);
                    this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
                    return this.potentialEnergy_;
                };
                return Spring;
            }(AbstractSimObject_1.AbstractSimObject);
            exports_1("Spring", Spring);
        }
    };
});
System.register("davinci-newton/engine3D/Spring3.js", ["../core/Spring"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var Spring_1, Spring3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Spring_1_1) {
            Spring_1 = Spring_1_1;
        }],
        execute: function () {
            Spring3 = function (_super) {
                __extends(Spring3, _super);
                function Spring3(body1, body2) {
                    return _super.call(this, body1, body2) || this;
                }
                return Spring3;
            }(Spring_1.Spring);
            exports_1("Spring3", Spring3);
        }
    };
});
System.register("davinci-newton/core/Dynamics.js", [], function (exports_1, context_1) {
    "use strict";

    var INDEX_TIME, INDEX_TRANSLATIONAL_KINETIC_ENERGY, INDEX_ROTATIONAL_KINETIC_ENERGY, INDEX_POTENTIAL_ENERGY, INDEX_TOTAL_ENERGY, INDEX_RESERVED_LAST;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("INDEX_TIME", INDEX_TIME = 0);
            exports_1("INDEX_TRANSLATIONAL_KINETIC_ENERGY", INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1);
            exports_1("INDEX_ROTATIONAL_KINETIC_ENERGY", INDEX_ROTATIONAL_KINETIC_ENERGY = 2);
            exports_1("INDEX_POTENTIAL_ENERGY", INDEX_POTENTIAL_ENERGY = 3);
            exports_1("INDEX_TOTAL_ENERGY", INDEX_TOTAL_ENERGY = 4);
            exports_1("INDEX_RESERVED_LAST", INDEX_RESERVED_LAST = 4);
        }
    };
});
System.register("davinci-newton/graph/EnergyTimeGraph.js", ["../core/Dynamics", "../view/AlignH", "../view/AlignV", "./Graph"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var Dynamics_1, AlignH_1, AlignV_1, Graph_1, EnergyTimeGraph;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Dynamics_1_1) {
            Dynamics_1 = Dynamics_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (Graph_1_1) {
            Graph_1 = Graph_1_1;
        }],
        execute: function () {
            EnergyTimeGraph = function (_super) {
                __extends(EnergyTimeGraph, _super);
                function EnergyTimeGraph(canvasId, varsList) {
                    var _this = _super.call(this, canvasId, varsList) || this;
                    _this.translationalEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY, 'red');
                    _this.rotationalEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY, 'yellow');
                    _this.potentialEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_POTENTIAL_ENERGY, 'blue');
                    _this.totalEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_TOTAL_ENERGY, 'white');
                    _this.autoScale.timeWindow = 5;
                    _this.autoScale.addGraphLine(_this.translationalEnergyGraphLine);
                    _this.autoScale.addGraphLine(_this.rotationalEnergyGraphLine);
                    _this.autoScale.addGraphLine(_this.potentialEnergyGraphLine);
                    _this.autoScale.addGraphLine(_this.totalEnergyGraphLine);
                    _this.axes.hAxisAlign = AlignV_1.AlignV.BOTTOM;
                    _this.axes.vAxisAlign = AlignH_1.AlignH.LEFT;
                    _this.axes.hAxisLabel = 'time';
                    _this.axes.vAxisLabel = 'energy';
                    return _this;
                }
                return EnergyTimeGraph;
            }(Graph_1.Graph);
            exports_1("EnergyTimeGraph", EnergyTimeGraph);
        }
    };
});
System.register("davinci-newton/util/GenericObserver.js", [], function (exports_1, context_1) {
    "use strict";

    var GenericObserver;
    var __moduleName = context_1 && context_1.id;
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
System.register("davinci-newton/graph/AxisChoice.js", [], function (exports_1, context_1) {
    "use strict";

    var AxisChoice;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (AxisChoice) {
                AxisChoice[AxisChoice["HORIZONTAL"] = 1] = "HORIZONTAL";
                AxisChoice[AxisChoice["VERTICAL"] = 2] = "VERTICAL";
                AxisChoice[AxisChoice["BOTH"] = 3] = "BOTH";
            })(AxisChoice || (AxisChoice = {}));
            exports_1("AxisChoice", AxisChoice);
        }
    };
});
System.register("davinci-newton/graph/AutoScale.js", ["../util/AbstractSubject", "../util/contains", "../util/GenericEvent", "../util/ParameterNumber", "../util/removeAt", "../util/repeat", "../util/veryDifferent", "../view/DoubleRect", "../view/SimView", "./AxisChoice", "./GraphLine"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var AbstractSubject_1, contains_1, GenericEvent_1, ParameterNumber_1, removeAt_1, repeat_1, veryDifferent_1, DoubleRect_1, SimView_1, AxisChoice_1, GraphLine_1, AutoScale;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (ParameterNumber_1_1) {
            ParameterNumber_1 = ParameterNumber_1_1;
        }, function (removeAt_1_1) {
            removeAt_1 = removeAt_1_1;
        }, function (repeat_1_1) {
            repeat_1 = repeat_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (SimView_1_1) {
            SimView_1 = SimView_1_1;
        }, function (AxisChoice_1_1) {
            AxisChoice_1 = AxisChoice_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
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
                    _this.axisChoice_ = AxisChoice_1.AxisChoice.BOTH;
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
                    var choices = [AxisChoice_1.AxisChoice.VERTICAL, AxisChoice_1.AxisChoice.HORIZONTAL, AxisChoice_1.AxisChoice.BOTH];
                    _this.addParameter(new ParameterNumber_1.default(_this, AutoScale.AXIS, function () {
                        return _this.axisChoice;
                    }, function (axisChoice) {
                        return _this.axisChoice = axisChoice;
                    }, choiceNames, choices));
                    _this.setComputed(_this.isActive_);
                    return _this;
                }
                AutoScale.prototype.addGraphLine = function (graphLine) {
                    if (GraphLine_1.GraphLine.isDuckType(graphLine)) {
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
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutoScale.prototype, "axisChoice", {
                    get: function () {
                        return this.axisChoice_;
                    },
                    set: function (value) {
                        if (value === AxisChoice_1.AxisChoice.VERTICAL || value === AxisChoice_1.AxisChoice.HORIZONTAL || value === AxisChoice_1.AxisChoice.BOTH) {
                            this.axisChoice_ = value;
                            this.broadcastParameter(AutoScale.AXIS);
                        } else {
                            throw new Error('unknown ' + value);
                        }
                    },
                    enumerable: false,
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
                    enumerable: false,
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
                    enumerable: false,
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
                        if (event.nameEquals(SimView_1.SimView.SIM_RECT_CHANGED)) {
                            if (!this.ownEvent_) {
                                this.active = false;
                            }
                        }
                    } else if (contains_1.default(this.graphLines_, event.getSubject())) {
                        if (event.nameEquals(GraphLine_1.GraphLine.PARAM_NAME_X_VARIABLE) || event.nameEquals(GraphLine_1.GraphLine.PARAM_NAME_Y_VARIABLE)) {
                            this.reset();
                        } else if (event.nameEquals(GraphLine_1.GraphLine.RESET)) {
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
                    if (this.axisChoice_ === AxisChoice_1.AxisChoice.VERTICAL) {
                        nr = new DoubleRect_1.default(sr.getLeft(), nr.getBottom(), sr.getRight(), nr.getTop());
                    } else if (this.axisChoice_ === AxisChoice_1.AxisChoice.HORIZONTAL) {
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
                    if (GraphLine_1.GraphLine.isDuckType(graphLine)) {
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
                    var names = [SimView_1.SimView.PARAM_NAME_WIDTH, SimView_1.SimView.PARAM_NAME_HEIGHT, SimView_1.SimView.PARAM_NAME_CENTER_X, SimView_1.SimView.PARAM_NAME_CENTER_Y];
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
                AutoScale.AXIS = 'AXIS';
                AutoScale.TIME_WINDOW = 'TIME_WINDOW';
                AutoScale.ACTIVE = 'ACTIVE';
                AutoScale.AUTO_SCALE = 'AUTO_SCALE';
                AutoScale.ENABLED = 'ENABLED';
                return AutoScale;
            }(AbstractSubject_1.default);
            exports_1("default", AutoScale);
        }
    };
});
System.register("davinci-newton/graph/DisplayAxes.js", ["../checks/isDefined", "../math/Unit", "../view/AlignH", "../view/AlignV", "../view/DoubleRect"], function (exports_1, context_1) {
    "use strict";

    var isDefined_1, Unit_1, AlignH_1, AlignV_1, DoubleRect_1, DisplayAxes;
    var __moduleName = context_1 && context_1.id;
    function makeLabelScale(label, scale) {
        if (Unit_1.Unit.isOne(scale)) {
            return label;
        } else {
            return label + " / (" + scale + ")";
        }
    }
    return {
        setters: [function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
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
                    this.hAxisAlign_ = AlignV_1.AlignV.BOTTOM;
                    this.vAxisAlign_ = AlignH_1.AlignH.LEFT;
                    this.numDecimal_ = 0;
                    this.needRedraw_ = true;
                    this.hLabel_ = 'x';
                    this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
                    this.vLabel_ = 'y';
                    this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
                    this.zIndex_ = 100;
                }
                DisplayAxes.prototype.draw = function (context, map) {
                    context.save();
                    context.strokeStyle = this.drawColor_;
                    context.fillStyle = this.drawColor_;
                    context.font = this.numFont_;
                    context.textAlign = 'start';
                    context.textBaseline = 'alphabetic';
                    var x0;
                    var y0;
                    var r = this.simRect_;
                    var sim_x1 = r.getLeft();
                    var sim_x2 = r.getRight();
                    var sim_y1 = r.getBottom();
                    var sim_y2 = r.getTop();
                    switch (this.vAxisAlign_) {
                        case AlignH_1.AlignH.RIGHT:
                            x0 = map.simToScreenX(sim_x2 - 0.05 * (sim_x2 - sim_x1));
                            break;
                        case AlignH_1.AlignH.LEFT:
                            x0 = map.simToScreenX(sim_x1 + 0.05 * (sim_x2 - sim_x1));
                            break;
                        default:
                            x0 = map.simToScreenX(r.getCenterX());
                    }
                    switch (this.hAxisAlign_) {
                        case AlignV_1.AlignV.TOP:
                            y0 = map.simToScreenY(sim_y2) + (10 + this.fontDescent + this.fontAscent);
                            break;
                        case AlignV_1.AlignV.BOTTOM:
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
                    var hLabel = this.hLabelScaleCache_;
                    var w = context.measureText(hLabel).width;
                    context.fillText(hLabel, map.simToScreenX(sim_x2) - w - 5, y0 - 8);
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
                            if (this.vAxisAlign_ === AlignH_1.AlignH.RIGHT) {
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
                    var vLabel = this.vLabelScaleCache_;
                    var w = context.measureText(vLabel).width;
                    if (this.vAxisAlign_ === AlignH_1.AlignH.RIGHT) {
                        context.fillText(vLabel, x0 - (w + 6), map.simToScreenY(sim_y2) + 13);
                    } else {
                        context.fillText(vLabel, x0 + 6, map.simToScreenY(sim_y2) + 13);
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
                    enumerable: false,
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
                        this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
                        this.needRedraw_ = true;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(DisplayAxes.prototype, "hAxisScale", {
                    get: function () {
                        return this.hScale_;
                    },
                    set: function (hAxisScale) {
                        this.hScale_ = hAxisScale;
                        this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
                        this.needRedraw_ = true;
                    },
                    enumerable: false,
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
                        this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
                        this.needRedraw_ = true;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(DisplayAxes.prototype, "vAxisScale", {
                    get: function () {
                        return this.vScale_;
                    },
                    set: function (vAxisScale) {
                        this.vScale_ = vAxisScale;
                        this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
                        this.needRedraw_ = true;
                    },
                    enumerable: false,
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
                    enumerable: false,
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
                    enumerable: false,
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
System.register("davinci-newton/graph/DisplayGraph.js", ["../checks/isDefined", "../util/contains", "../util/removeAt", "../util/repeat", "../view/DrawingMode", "../view/ScreenRect", "./GraphLine"], function (exports_1, context_1) {
    "use strict";

    var isDefined_1, contains_1, removeAt_1, repeat_1, DrawingMode_1, ScreenRect_1, GraphLine_1, DisplayGraph;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (removeAt_1_1) {
            removeAt_1 = removeAt_1_1;
        }, function (repeat_1_1) {
            repeat_1 = repeat_1_1;
        }, function (DrawingMode_1_1) {
            DrawingMode_1 = DrawingMode_1_1;
        }, function (ScreenRect_1_1) {
            ScreenRect_1 = ScreenRect_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
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
                    var style = graphLine.getGraphStyle(iter.getIndex());
                    if (style.drawingMode === DrawingMode_1.DrawingMode.DOTS) {
                        var x = coordMap.simToScreenX(next.x);
                        var y = coordMap.simToScreenY(next.y);
                        var w = style.lineWidth;
                        context.fillStyle = style.color_;
                        context.fillRect(x, y, w, w);
                    }
                    while (iter.hasNext()) {
                        var last = next;
                        next = iter.nextValue();
                        if (next.x === last.x && next.y === last.y) {
                            continue;
                        }
                        var style_1 = graphLine.getGraphStyle(iter.getIndex());
                        var continuous = next.seqX === last.seqX && next.seqY === last.seqY;
                        if (style_1.drawingMode === DrawingMode_1.DrawingMode.DOTS || !continuous) {
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
                    if (GraphLine_1.GraphLine.isDuckType(graphLine)) {
                        if (!contains_1.default(this.graphLines_, graphLine)) {
                            this.graphLines_.push(graphLine);
                            this.memDraw_.push(-1);
                        }
                    } else {
                        throw new Error('not a GraphLine ' + graphLine);
                    }
                };
                DisplayGraph.prototype.removeGraphLine = function (graphLine) {
                    if (GraphLine_1.GraphLine.isDuckType(graphLine)) {
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
            exports_1("DisplayGraph", DisplayGraph);
        }
    };
});
System.register("davinci-newton/graph/Graph.js", ["../checks/mustBeNumber", "../checks/mustBeString", "../util/AbstractSubject", "../util/GenericObserver", "../view/AlignH", "../view/AlignV", "../view/DoubleRect", "../view/LabCanvas", "../view/SimView", "./AutoScale", "./DisplayAxes", "./DisplayGraph", "./GraphLine"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var mustBeNumber_1, mustBeString_1, AbstractSubject_1, GenericObserver_1, AlignH_1, AlignV_1, DoubleRect_1, LabCanvas_1, SimView_1, AutoScale_1, DisplayAxes_1, DisplayGraph_1, GraphLine_1, Graph;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (mustBeNumber_1_1) {
            mustBeNumber_1 = mustBeNumber_1_1;
        }, function (mustBeString_1_1) {
            mustBeString_1 = mustBeString_1_1;
        }, function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (GenericObserver_1_1) {
            GenericObserver_1 = GenericObserver_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (LabCanvas_1_1) {
            LabCanvas_1 = LabCanvas_1_1;
        }, function (SimView_1_1) {
            SimView_1 = SimView_1_1;
        }, function (AutoScale_1_1) {
            AutoScale_1 = AutoScale_1_1;
        }, function (DisplayAxes_1_1) {
            DisplayAxes_1 = DisplayAxes_1_1;
        }, function (DisplayGraph_1_1) {
            DisplayGraph_1 = DisplayGraph_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
        }],
        execute: function () {
            Graph = function (_super) {
                __extends(Graph, _super);
                function Graph(canvasId, varsList) {
                    var _this = _super.call(this) || this;
                    _this.varsList = varsList;
                    _this.view = new SimView_1.SimView(new DoubleRect_1.default(0, 0, 1, 1));
                    _this.autoScale = new AutoScale_1.default(_this.view);
                    var canvas = document.getElementById(canvasId);
                    _this.labCanvas = new LabCanvas_1.LabCanvas(canvas);
                    _this.view.hAxisAlign = AlignH_1.AlignH.FULL;
                    _this.view.vAxisAlign = AlignV_1.AlignV.FULL;
                    _this.labCanvas.addView(_this.view);
                    _this.displayGraph = new DisplayGraph_1.DisplayGraph();
                    _this.displayGraph.setScreenRect(_this.view.getScreenRect());
                    _this.view.getDisplayList().prepend(_this.displayGraph);
                    _this.timeIdx_ = varsList.timeIndex();
                    _this.axes = new DisplayAxes_1.default(_this.view.getSimRect());
                    _this.subscription = new GenericObserver_1.default(_this.view, function (event) {
                        if (event.nameEquals(SimView_1.SimView.COORD_MAP_CHANGED)) {
                            var simRect = _this.view.getCoordMap().screenToSimRect(_this.view.getScreenRect());
                            _this.axes.setSimRect(simRect);
                        }
                    });
                    _this.view.getDisplayList().add(_this.axes);
                    _this.autoScale.extraMargin = 0.05;
                    return _this;
                }
                Graph.prototype.destructor = function () {
                    if (this.subscription) {
                        this.subscription.disconnect();
                        this.subscription = void 0;
                    }
                };
                Graph.prototype.addGraphLine = function (hCoordIndex, vCoordIndex, color) {
                    if (color === void 0) {
                        color = 'black';
                    }
                    mustBeNumber_1.default('hCoordIndex', hCoordIndex);
                    mustBeNumber_1.default('vCoordIndex', vCoordIndex);
                    mustBeString_1.default('color', color);
                    var graphLine = new GraphLine_1.GraphLine(this.varsList);
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
        }
    };
});
System.register("davinci-newton/graph/GraphPoint.js", [], function (exports_1, context_1) {
    "use strict";

    var GraphPoint;
    var __moduleName = context_1 && context_1.id;
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

    var GraphStyle;
    var __moduleName = context_1 && context_1.id;
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
            exports_1("GraphStyle", GraphStyle);
        }
    };
});
System.register("davinci-newton/graph/GraphLine.js", ["../checks/isObject", "../util/AbstractSubject", "../util/CircularList", "../util/GenericEvent", "../util/ParameterNumber", "../util/ParameterString", "../util/veryDifferent", "../view/DrawingMode", "./GraphPoint", "./GraphStyle"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var isObject_1, AbstractSubject_1, CircularList_1, GenericEvent_1, ParameterNumber_1, ParameterString_1, veryDifferent_1, DrawingMode_1, GraphPoint_1, GraphStyle_1, GraphLine;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }, function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (CircularList_1_1) {
            CircularList_1 = CircularList_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (ParameterNumber_1_1) {
            ParameterNumber_1 = ParameterNumber_1_1;
        }, function (ParameterString_1_1) {
            ParameterString_1 = ParameterString_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }, function (DrawingMode_1_1) {
            DrawingMode_1 = DrawingMode_1_1;
        }, function (GraphPoint_1_1) {
            GraphPoint_1 = GraphPoint_1_1;
        }, function (GraphStyle_1_1) {
            GraphStyle_1 = GraphStyle_1_1;
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
                    _this.dataPoints_ = new CircularList_1.CircularList(capacity || 100000);
                    _this.drawColor_ = 'lime';
                    _this.drawingMode_ = DrawingMode_1.DrawingMode.LINES;
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
                    this.styles_.push(new GraphStyle_1.GraphStyle(this.dataPoints_.getEndIndex() + 1, this.drawingMode_, this.drawColor_, this.lineWidth_));
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
                    enumerable: false,
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
                    enumerable: false,
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
                        if (s.index_ > index) {
                            break;
                        }
                        last = s;
                    }
                    return last;
                };
                Object.defineProperty(GraphLine.prototype, "hotspotColor", {
                    get: function () {
                        return this.hotspotColor_;
                    },
                    set: function (color) {
                        this.hotspotColor_ = color;
                    },
                    enumerable: false,
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
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(GraphLine.prototype, "varsList", {
                    get: function () {
                        return this.varsList_;
                    },
                    enumerable: false,
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
                    enumerable: false,
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
                    enumerable: false,
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
                GraphLine.PARAM_NAME_X_VARIABLE = 'X variable';
                GraphLine.PARAM_NAME_Y_VARIABLE = 'Y variable';
                GraphLine.PARAM_NAME_LINE_WIDTH = 'line width';
                GraphLine.PARAM_NAME_COLOR = 'color';
                GraphLine.PARAM_NAME_DRAWING_MODE = 'drawing mode';
                GraphLine.RESET = 'RESET';
                return GraphLine;
            }(AbstractSubject_1.default);
            exports_1("GraphLine", GraphLine);
        }
    };
});
System.register("davinci-newton/i18n/notImplemented.js", ["../checks/mustBeString"], function (exports_1, context_1) {
    "use strict";

    var mustBeString_1;
    var __moduleName = context_1 && context_1.id;
    function notImplemented(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "'" + name + "' method is not yet implemented.";
            }
        };
        return message;
    }
    exports_1("notImplemented", notImplemented);
    return {
        setters: [function (mustBeString_1_1) {
            mustBeString_1 = mustBeString_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isVectorE2.js", ["../checks/isNull", "../checks/isNumber", "../checks/isObject"], function (exports_1, context_1) {
    "use strict";

    var isNull_1, isNumber_1, isObject_1;
    var __moduleName = context_1 && context_1.id;
    function isVectorE2(v) {
        if (isObject_1.default(v) && !isNull_1.default(v)) {
            return isNumber_1.default(v.x) && isNumber_1.default(v.y);
        } else {
            return false;
        }
    }
    exports_1("isVectorE2", isVectorE2);
    return {
        setters: [function (isNull_1_1) {
            isNull_1 = isNull_1_1;
        }, function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isZeroBivectorE2.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isZeroBivectorE2(m) {
        return m.xy === 0;
    }
    exports_1("isZeroBivectorE2", isZeroBivectorE2);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isZeroGeometricE2.js", ["./isZeroBivectorE2", "./isZeroVectorE2"], function (exports_1, context_1) {
    "use strict";

    var isZeroBivectorE2_1, isZeroVectorE2_1;
    var __moduleName = context_1 && context_1.id;
    function isZeroGeometricE2(m) {
        return isZeroVectorE2_1.isZeroVectorE2(m) && isZeroBivectorE2_1.isZeroBivectorE2(m) && m.a === 0 && m.b === 0;
    }
    exports_1("isZeroGeometricE2", isZeroGeometricE2);
    return {
        setters: [function (isZeroBivectorE2_1_1) {
            isZeroBivectorE2_1 = isZeroBivectorE2_1_1;
        }, function (isZeroVectorE2_1_1) {
            isZeroVectorE2_1 = isZeroVectorE2_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isZeroVectorE2.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isZeroVectorE2(v) {
        return v.x === 0 && v.y === 0;
    }
    exports_1("isZeroVectorE2", isZeroVectorE2);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/maskG2.js", ["../checks/isNumber", "../checks/isObject", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var isNumber_1, isObject_1, Unit_1, ONE, scratch;
    var __moduleName = context_1 && context_1.id;
    function maskG2(arg) {
        var duck = arg;
        if (isObject_1.default(arg) && 'grades' in arg) {
            var g = arg;
            if (duck.grades & 0x1) {
                scratch.a = g.a;
            } else {
                scratch.a = 0;
            }
            if (duck.grades & 0x2) {
                scratch.x = g.x;
                scratch.y = g.y;
            } else {
                scratch.x = 0;
                scratch.y = 0;
            }
            if (duck.grades & 0x4) {
                scratch.xy = g.xy;
            } else {
                scratch.xy = 0;
            }
            scratch.uom = Unit_1.Unit.mustBeUnit('g.uom', g.uom);
            return scratch;
        } else if (isNumber_1.default(arg)) {
            scratch.a = arg;
            scratch.x = 0;
            scratch.y = 0;
            scratch.xy = 0;
            scratch.b = 0;
            scratch.uom = ONE;
            return scratch;
        } else {
            return void 0;
        }
    }
    exports_1("maskG2", maskG2);
    return {
        setters: [function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {
            ONE = void 0;
            scratch = { a: 0, x: 0, y: 0, xy: 0, b: 0, uom: ONE };
        }
    };
});
System.register("davinci-newton/math/dotVectorE2.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function dotVectorE2(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    exports_1("dotVectorE2", dotVectorE2);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/quadVectorE2.js", ["./dotVectorE2", "../checks/isDefined", "../checks/isNumber"], function (exports_1, context_1) {
    "use strict";

    var dotVectorE2_1, isDefined_1, isNumber_1;
    var __moduleName = context_1 && context_1.id;
    function quadVectorE2(vector) {
        if (isDefined_1.default(vector)) {
            var x = vector.x;
            var y = vector.y;
            if (isNumber_1.default(x) && isNumber_1.default(y)) {
                return dotVectorE2_1.dotVectorE2(vector, vector);
            } else {
                return void 0;
            }
        } else {
            return void 0;
        }
    }
    exports_1("quadVectorE2", quadVectorE2);
    return {
        setters: [function (dotVectorE2_1_1) {
            dotVectorE2_1 = dotVectorE2_1_1;
        }, function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }, function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/rotorFromDirectionsE2.js", ["./dotVectorE2", "./quadVectorE2"], function (exports_1, context_1) {
    "use strict";

    var dotVectorE2_1, quadVectorE2_1, sqrt;
    var __moduleName = context_1 && context_1.id;
    function rotorFromDirectionsE2(a, b, m) {
        var quadA = quadVectorE2_1.quadVectorE2(a);
        var absA = sqrt(quadA);
        var quadB = quadVectorE2_1.quadVectorE2(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var dotBA = dotVectorE2_1.dotVectorE2(b, a);
        var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
        if (denom !== 0) {
            m = m.versor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
        } else {
            return void 0;
        }
    }
    exports_1("rotorFromDirectionsE2", rotorFromDirectionsE2);
    return {
        setters: [function (dotVectorE2_1_1) {
            dotVectorE2_1 = dotVectorE2_1_1;
        }, function (quadVectorE2_1_1) {
            quadVectorE2_1 = quadVectorE2_1_1;
        }],
        execute: function () {
            sqrt = Math.sqrt;
        }
    };
});
System.register("davinci-newton/math/Geometric2.js", ["../i18n/notImplemented", "../i18n/readOnly", "./approx", "./arraysEQ", "./gauss", "./isVectorE2", "./isZeroGeometricE2", "./isZeroVectorE2", "./maskG2", "./QQ", "./rotorFromDirectionsE2", "./stringFromCoordinates", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var notImplemented_1, readOnly_1, approx_1, arraysEQ_1, gauss_1, isVectorE2_1, isZeroGeometricE2_1, isZeroVectorE2_1, maskG2_1, QQ_1, rotorFromDirectionsE2_1, stringFromCoordinates_1, Unit_1, COORD_A, COORD_X, COORD_Y, COORD_B, BASIS_LABELS, zero, scalar, vector, bivector, pseudo, spinor, coordinates, UNLOCKED, Geometric2;
    var __moduleName = context_1 && context_1.id;
    function isScalar(m) {
        return m.x === 0 && m.y === 0 && m.b === 0;
    }
    function lock(m) {
        m.lock();
        return m;
    }
    return {
        setters: [function (notImplemented_1_1) {
            notImplemented_1 = notImplemented_1_1;
        }, function (readOnly_1_1) {
            readOnly_1 = readOnly_1_1;
        }, function (approx_1_1) {
            approx_1 = approx_1_1;
        }, function (arraysEQ_1_1) {
            arraysEQ_1 = arraysEQ_1_1;
        }, function (gauss_1_1) {
            gauss_1 = gauss_1_1;
        }, function (isVectorE2_1_1) {
            isVectorE2_1 = isVectorE2_1_1;
        }, function (isZeroGeometricE2_1_1) {
            isZeroGeometricE2_1 = isZeroGeometricE2_1_1;
        }, function (isZeroVectorE2_1_1) {
            isZeroVectorE2_1 = isZeroVectorE2_1_1;
        }, function (maskG2_1_1) {
            maskG2_1 = maskG2_1_1;
        }, function (QQ_1_1) {
            QQ_1 = QQ_1_1;
        }, function (rotorFromDirectionsE2_1_1) {
            rotorFromDirectionsE2_1 = rotorFromDirectionsE2_1_1;
        }, function (stringFromCoordinates_1_1) {
            stringFromCoordinates_1 = stringFromCoordinates_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {
            COORD_A = 0;
            COORD_X = 1;
            COORD_Y = 2;
            COORD_B = 3;
            BASIS_LABELS = ["1", "e1", "e2", "e12"];
            BASIS_LABELS[COORD_A] = '1';
            BASIS_LABELS[COORD_X] = 'e1';
            BASIS_LABELS[COORD_Y] = 'e2';
            BASIS_LABELS[COORD_B] = 'e12';
            zero = function zero() {
                return [0, 0, 0, 0];
            };
            scalar = function scalar(a) {
                var coords = zero();
                coords[COORD_A] = a;
                return coords;
            };
            vector = function vector(x, y) {
                var coords = zero();
                coords[COORD_X] = x;
                coords[COORD_Y] = y;
                return coords;
            };
            bivector = function bivector(b) {
                var coords = zero();
                coords[COORD_B] = b;
                return coords;
            };
            pseudo = function pseudo(b) {
                var coords = zero();
                coords[COORD_B] = b;
                return coords;
            };
            spinor = function spinor(a, b) {
                var coords = zero();
                coords[COORD_A] = a;
                coords[COORD_B] = b;
                return coords;
            };
            coordinates = function coordinates(m) {
                var coords = zero();
                coords[COORD_A] = m.a;
                coords[COORD_X] = m.x;
                coords[COORD_Y] = m.y;
                coords[COORD_B] = m.b;
                return coords;
            };
            UNLOCKED = -1 * Math.random();
            Geometric2 = function () {
                function Geometric2(coords, uom) {
                    if (coords === void 0) {
                        coords = zero();
                    }
                    this.lock_ = UNLOCKED;
                    if (coords.length !== 4) {
                        throw new Error("coords.length must be 4");
                    }
                    this.coords_ = coords;
                    this.uom_ = uom;
                    this.modified_ = false;
                }
                Geometric2.scalar = function (a, uom) {
                    return new Geometric2(scalar(a), uom);
                };
                Geometric2.bivector = function (b, uom) {
                    return Geometric2.spinor(0, b, uom);
                };
                Geometric2.spinor = function (a, b, uom) {
                    return new Geometric2(spinor(a, b), uom);
                };
                Geometric2.vector = function (x, y, uom) {
                    return new Geometric2(vector(x, y), uom);
                };
                Geometric2.copy = function (mv) {
                    return new Geometric2(coordinates(mv), mv.uom);
                };
                Geometric2.fromBivector = function (B) {
                    return new Geometric2(bivector(B.xy), B.uom);
                };
                Geometric2.fromScalar = function (alpha) {
                    return new Geometric2(scalar(alpha.a), alpha.uom);
                };
                Geometric2.fromSpinor = function (R) {
                    return new Geometric2(spinor(R.a, R.xy), R.uom);
                };
                Geometric2.fromVector = function (v) {
                    return new Geometric2(vector(v.x, v.y), v.uom);
                };
                Geometric2.rotorFromVectorToVector = function (a, b) {
                    return new Geometric2([0, 0, 0, 0]).rotorFromVectorToVector(a, b);
                };
                Geometric2.prototype.adj = function () {
                    throw new Error(notImplemented_1.notImplemented('adj').message);
                };
                Geometric2.prototype.isScalar = function () {
                    return isScalar(this);
                };
                Geometric2.prototype.quad = function () {
                    return new Geometric2([this.squaredNormSansUnits(), 0, 0, 0], Unit_1.Unit.mul(this.uom, this.uom));
                };
                Geometric2.prototype.scale = function (α) {
                    return new Geometric2([this.a * α, this.x * α, this.y * α, this.b * α], this.uom);
                };
                Geometric2.prototype.slerp = function (target, α) {
                    throw new Error(notImplemented_1.notImplemented('slerp').message);
                };
                Geometric2.prototype.stress = function (σ) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().stress(σ));
                    } else {
                        this.x *= σ.x;
                        this.y *= σ.y;
                        this.uom = Unit_1.Unit.mul(σ.uom, this.uom);
                        return this;
                    }
                };
                Geometric2.prototype.__div__ = function (rhs) {
                    if (rhs instanceof Geometric2) {
                        return lock(this.clone().div(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(this.clone().divByNumber(rhs));
                    } else {
                        var duckR = maskG2_1.maskG2(rhs);
                        if (duckR) {
                            return lock(this.clone().div(duckR));
                        } else {
                            return void 0;
                        }
                    }
                };
                Geometric2.prototype.__rdiv__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).div(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.scalar(lhs, void 0).div(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__vbar__ = function (rhs) {
                    if (rhs instanceof Geometric2) {
                        return lock(Geometric2.copy(this).scp(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric2.copy(this).scp(Geometric2.scalar(rhs)));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__rvbar__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).scp(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.scalar(lhs).scp(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__wedge__ = function (rhs) {
                    if (rhs instanceof Geometric2) {
                        return lock(Geometric2.copy(this).ext(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric2.copy(this).mulByNumber(rhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__rwedge__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).ext(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.copy(this).mulByNumber(lhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__lshift__ = function (rhs) {
                    if (rhs instanceof Geometric2) {
                        return lock(Geometric2.copy(this).lco(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric2.copy(this).lco(Geometric2.scalar(rhs)));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__rlshift__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).lco(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.scalar(lhs).lco(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__rshift__ = function (rhs) {
                    if (rhs instanceof Geometric2) {
                        return lock(Geometric2.copy(this).rco(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric2.copy(this).rco(Geometric2.scalar(rhs)));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__rrshift__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).rco(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.scalar(lhs).rco(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__bang__ = function () {
                    return lock(Geometric2.copy(this).inv());
                };
                Geometric2.prototype.__eq__ = function (rhs) {
                    if (rhs instanceof Geometric2) {
                        var a0 = this.a;
                        var a1 = this.x;
                        var a2 = this.y;
                        var a3 = this.b;
                        var b0 = rhs.a;
                        var b1 = rhs.x;
                        var b2 = rhs.y;
                        var b3 = rhs.b;
                        return a0 === b0 && a1 === b1 && a2 === b2 && a3 === b3 && Unit_1.Unit.isCompatible(this.uom, rhs.uom);
                    } else if (typeof rhs === 'number') {
                        return false;
                    } else {
                        return false;
                    }
                };
                Geometric2.prototype.__ne__ = function (rhs) {
                    throw new Error(notImplemented_1.notImplemented('__ne_').message);
                };
                Geometric2.prototype.__ge__ = function (rhs) {
                    throw new Error(notImplemented_1.notImplemented('__ge_').message);
                };
                Geometric2.prototype.__gt__ = function (rhs) {
                    throw new Error(notImplemented_1.notImplemented('__gt_').message);
                };
                Geometric2.prototype.__le__ = function (rhs) {
                    throw new Error(notImplemented_1.notImplemented('__le_').message);
                };
                Geometric2.prototype.__lt__ = function (rhs) {
                    throw new Error(notImplemented_1.notImplemented('__lt_').message);
                };
                Geometric2.prototype.__tilde__ = function () {
                    return lock(Geometric2.copy(this).rev());
                };
                Geometric2.prototype.__add__ = function (rhs) {
                    var duckR = maskG2_1.maskG2(rhs);
                    if (duckR) {
                        return lock(this.clone().add(duckR));
                    } else if (isVectorE2_1.isVectorE2(rhs)) {
                        return lock(this.clone().addVector(rhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__radd__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).add(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.scalar(lhs).add(this));
                    } else if (isVectorE2_1.isVectorE2(lhs)) {
                        return lock(Geometric2.fromVector(lhs).add(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__sub__ = function (rhs) {
                    var duckR = maskG2_1.maskG2(rhs);
                    if (duckR) {
                        return lock(this.clone().sub(duckR));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__rsub__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).sub(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.scalar(lhs).sub(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__pos__ = function () {
                    return lock(Geometric2.copy(this));
                };
                Geometric2.prototype.__neg__ = function () {
                    return lock(Geometric2.copy(this).neg());
                };
                Geometric2.prototype.__mul__ = function (rhs) {
                    var duckR = maskG2_1.maskG2(rhs);
                    if (duckR) {
                        return lock(this.clone().mul(duckR));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.__rmul__ = function (lhs) {
                    if (lhs instanceof Geometric2) {
                        return lock(Geometric2.copy(lhs).mul(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric2.copy(this).mulByNumber(lhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric2.prototype.add2 = function (a, b) {
                    if (isZeroGeometricE2_1.isZeroGeometricE2(a)) {
                        this.uom = b.uom;
                    } else if (isZeroGeometricE2_1.isZeroGeometricE2(b)) {
                        this.uom = a.uom;
                    } else {
                        this.uom = Unit_1.Unit.compatible(a.uom, b.uom);
                    }
                    this.a = a.a + b.a;
                    this.x = a.x + b.x;
                    this.y = a.y + b.y;
                    this.b = a.b + b.b;
                    return this;
                };
                Geometric2.prototype.addPseudo = function (β, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().addPseudo(β, uom));
                    } else {
                        if (this.isZero()) {
                            this.uom = uom;
                        } else if (β === 0) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, uom);
                        }
                        this.b += β;
                        return this;
                    }
                };
                Geometric2.prototype.addScalar = function (α, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().addScalar(α, uom));
                    } else {
                        if (this.isZero()) {
                            this.uom = uom;
                        } else if (α === 0) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, uom);
                        }
                        this.a += α;
                        return this;
                    }
                };
                Geometric2.prototype.angle = function () {
                    return this.log().grade(2);
                };
                Geometric2.prototype.approx = function (n) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().approx(n));
                    } else {
                        approx_1.approx(this.coords_, n);
                        return this;
                    }
                };
                Geometric2.prototype.conj = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().conj());
                    } else {
                        this.x = -this.x;
                        this.y = -this.y;
                        this.b = -this.b;
                        return this;
                    }
                };
                Geometric2.prototype.copySpinor = function (spinor) {
                    var a = spinor.a;
                    var b = spinor.xy;
                    this.setCoordinate(COORD_A, a, 'a');
                    this.setCoordinate(COORD_X, 0, 'x');
                    this.setCoordinate(COORD_Y, 0, 'y');
                    this.setCoordinate(COORD_B, b, 'b');
                    this.uom = spinor.uom;
                    return this;
                };
                Geometric2.prototype.div = function (rhs) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().div(rhs));
                    } else {
                        if (isScalar(rhs)) {
                            return this.divByScalar(rhs.a, rhs.uom);
                        } else {
                            return this.mul(Geometric2.copy(rhs).inv());
                        }
                    }
                };
                Geometric2.prototype.div2 = function (a, b) {
                    throw new Error(notImplemented_1.notImplemented('div2').message);
                };
                Geometric2.prototype.divByNumber = function (α) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().divByNumber(α));
                    } else {
                        this.a /= α;
                        this.x /= α;
                        this.y /= α;
                        this.b /= α;
                        return this;
                    }
                };
                Geometric2.prototype.divByVector = function (v) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().divByVector(v));
                    } else {
                        var x = v.x;
                        var y = v.y;
                        var uom2 = Unit_1.Unit.pow(v.uom, QQ_1.QQ.valueOf(2, 1));
                        var squaredNorm = x * x + y * y;
                        return this.mulByVector(v).divByScalar(squaredNorm, uom2);
                    }
                };
                Geometric2.prototype.dual = function (m) {
                    throw new Error(notImplemented_1.notImplemented('dual').message);
                };
                Geometric2.prototype.equals = function (other) {
                    if (other instanceof Geometric2) {
                        return arraysEQ_1.arraysEQ(this.coords_, other.coords_);
                    } else {
                        return false;
                    }
                };
                Geometric2.prototype.exp = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().exp());
                    } else {
                        Unit_1.Unit.assertDimensionless(this.uom);
                        var expW = Math.exp(this.a);
                        var xy = this.xy;
                        var φ = Math.sqrt(xy * xy);
                        var s = φ !== 0 ? Math.sin(φ) / φ : 1;
                        var cosφ = Math.cos(φ);
                        this.a = cosφ;
                        this.xy = xy * s;
                        return this.mulByNumber(expW);
                    }
                };
                Geometric2.prototype.ext2 = function (lhs, rhs) {
                    var a0 = lhs.a;
                    var a1 = lhs.x;
                    var a2 = lhs.y;
                    var a3 = lhs.b;
                    var b0 = rhs.a;
                    var b1 = rhs.x;
                    var b2 = rhs.y;
                    var b3 = rhs.b;
                    this.a = a0 * b0;
                    this.x = a0 * b1 + a1 * b0;
                    this.y = a0 * b2 + a2 * b0;
                    this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
                    this.uom = Unit_1.Unit.mul(this.uom, rhs.uom);
                    return this;
                };
                Geometric2.prototype.grade = function (n) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().grade(n));
                    } else {
                        switch (n) {
                            case 0:
                                {
                                    this.x = 0;
                                    this.y = 0;
                                    this.b = 0;
                                    break;
                                }
                            case 1:
                                {
                                    this.a = 0;
                                    this.b = 0;
                                    break;
                                }
                            case 2:
                                {
                                    this.a = 0;
                                    this.x = 0;
                                    this.y = 0;
                                    break;
                                }
                            default:
                                {
                                    this.a = 0;
                                    this.x = 0;
                                    this.y = 0;
                                    this.b = 0;
                                }
                        }
                        return this;
                    }
                };
                Geometric2.prototype.isOne = function () {
                    if (Unit_1.Unit.isOne(this.uom)) {
                        return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
                    } else {
                        return false;
                    }
                };
                Geometric2.prototype.isSpinor = function () {
                    return this.x === 0 && this.y === 0;
                };
                Geometric2.prototype.I = function () {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.b = 1;
                    this.uom = void 0;
                    return this;
                };
                Geometric2.prototype.lco = function (rhs) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().lco(rhs));
                    } else {
                        return this.lco2(this, rhs);
                    }
                };
                Geometric2.prototype.lco2 = function (lhs, rhs) {
                    var a0 = lhs.a;
                    var a1 = lhs.x;
                    var a2 = lhs.y;
                    var a3 = lhs.b;
                    var b0 = rhs.a;
                    var b1 = rhs.x;
                    var b2 = rhs.y;
                    var b3 = rhs.b;
                    this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
                    this.x = a0 * b1 - a2 * b3;
                    this.y = a0 * b2 + a1 * b3;
                    this.b = a0 * b3;
                    this.uom = Unit_1.Unit.mul(this.uom, rhs.uom);
                    return this;
                };
                Geometric2.prototype.lerp = function (target, α) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().lerp(target, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = target.uom;
                        } else if (isZeroGeometricE2_1.isZeroGeometricE2(target)) {} else {
                            this.uom = Unit_1.Unit.compatible(this.uom, target.uom);
                        }
                        this.a += (target.a - this.a) * α;
                        this.x += (target.x - this.x) * α;
                        this.y += (target.y - this.y) * α;
                        this.b += (target.b - this.b) * α;
                        return this;
                    }
                };
                Geometric2.prototype.lerp2 = function (a, b, α) {
                    this.copy(a).lerp(b, α);
                    return this;
                };
                Geometric2.prototype.log = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().log());
                    } else {
                        Unit_1.Unit.assertDimensionless(this.uom);
                        if (this.isSpinor()) {
                            var α = this.a;
                            var β = this.b;
                            this.a = Math.log(Math.sqrt(α * α + β * β));
                            this.b = Math.atan2(β, α);
                            return this;
                        } else {
                            throw new Error(notImplemented_1.notImplemented("log(" + this.toString() + ")").message);
                        }
                    }
                };
                Geometric2.prototype.norm = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().norm());
                    } else {
                        this.a = this.magnitudeSansUnits();
                        this.x = 0;
                        this.y = 0;
                        this.b = 0;
                        return this;
                    }
                };
                Geometric2.prototype.one = function () {
                    this.a = 1;
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                    this.uom = void 0;
                    return this;
                };
                Geometric2.prototype.rco = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().rco(m));
                    } else {
                        return this.rco2(this, m);
                    }
                };
                Geometric2.prototype.rco2 = function (lhs, rhs) {
                    var a0 = lhs.a;
                    var a1 = lhs.x;
                    var a2 = lhs.y;
                    var a3 = lhs.b;
                    var b0 = rhs.a;
                    var b1 = rhs.x;
                    var b2 = rhs.y;
                    var b3 = rhs.b;
                    this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
                    this.x = -a1 * b0 - a3 * b2;
                    this.y = -a2 * b0 + a3 * b1;
                    this.b = a3 * b0;
                    this.uom = Unit_1.Unit.mul(this.uom, rhs.uom);
                    return this;
                };
                Geometric2.prototype.reflect = function (n) {
                    throw new Error(notImplemented_1.notImplemented('reflect').message);
                };
                Geometric2.prototype.rotorFromDirections = function (a, b) {
                    rotorFromDirectionsE2_1.rotorFromDirectionsE2(a, b, this);
                    return this;
                };
                Geometric2.prototype.rotorFromFrameToFrame = function (es, fs) {
                    throw new Error(notImplemented_1.notImplemented('rotorFromFrameToFrame').message);
                };
                Geometric2.prototype.rotorFromGeneratorAngle = function (B, θ) {
                    throw new Error(notImplemented_1.notImplemented('rotorFromGeneratorAngle').message);
                };
                Geometric2.prototype.rotorFromVectorToVector = function (a, b) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().rotorFromVectorToVector(a, b));
                    } else {
                        var ax = a.x;
                        var ay = a.y;
                        var bx = b.x;
                        var by = b.y;
                        var s = Math.sqrt(bx * bx + by * by) * Math.sqrt(ax * ax + ay * ay);
                        var p = bx * ax + by * ay;
                        var q = bx * ay - by * ax;
                        var denom = Math.sqrt(2 * s * (s + p));
                        this.a = (s + p) / denom;
                        this.x = 0;
                        this.y = 0;
                        this.b = q / denom;
                        this.uom = void 0;
                        return this;
                    }
                };
                Geometric2.prototype.sqrt = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().sqrt());
                    } else {
                        this.a = Math.sqrt(this.a);
                        this.x = 0;
                        this.y = 0;
                        this.b = 0;
                        this.uom = Unit_1.Unit.sqrt(this.uom);
                        return this;
                    }
                };
                Geometric2.prototype.squaredNorm = function (mutate) {
                    return this.quaditude(mutate);
                };
                Geometric2.prototype.sub2 = function (a, b) {
                    if (isZeroGeometricE2_1.isZeroGeometricE2(a)) {
                        this.a = -b.a;
                        this.x = -b.x;
                        this.y = -b.y;
                        this.b = -b.b;
                        this.uom = b.uom;
                    } else if (isZeroGeometricE2_1.isZeroGeometricE2(b)) {
                        this.a = a.a;
                        this.x = a.x;
                        this.y = a.y;
                        this.b = a.b;
                        this.uom = a.uom;
                    } else {
                        this.a = a.a - b.a;
                        this.x = a.x - b.x;
                        this.y = a.y - b.y;
                        this.b = a.b - b.b;
                        this.uom = Unit_1.Unit.compatible(a.uom, b.uom);
                    }
                    return this;
                };
                Geometric2.prototype.versor = function (a, b) {
                    this.a = a.x * b.x + a.y * b.y;
                    this.x = 0;
                    this.y = 0;
                    this.b = a.x * b.y - a.y * b.x;
                    this.uom = Unit_1.Unit.mul(a.uom, b.uom);
                    return this;
                };
                Geometric2.prototype.isLocked = function () {
                    return this.lock_ !== UNLOCKED;
                };
                Geometric2.prototype.lock = function () {
                    if (this.lock_ !== UNLOCKED) {
                        throw new Error("already locked");
                    } else {
                        this.lock_ = Math.random();
                        return this.lock_;
                    }
                };
                Geometric2.prototype.unlock = function (token) {
                    if (this.lock_ === UNLOCKED) {
                        throw new Error("not locked");
                    } else if (this.lock_ === token) {
                        this.lock_ = UNLOCKED;
                    } else {
                        throw new Error("unlock denied");
                    }
                };
                Geometric2.prototype.setCoordinate = function (index, newValue, name) {
                    if (this.lock_ === UNLOCKED) {
                        var coords = this.coords_;
                        var previous = coords[index];
                        if (newValue !== previous) {
                            coords[index] = newValue;
                            this.modified_ = true;
                        }
                    } else {
                        throw new Error(readOnly_1.readOnly(name).message);
                    }
                };
                Object.defineProperty(Geometric2.prototype, "a", {
                    get: function () {
                        return this.coords_[COORD_A];
                    },
                    set: function (a) {
                        this.setCoordinate(COORD_A, a, 'a');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric2.prototype, "b", {
                    get: function () {
                        return this.coords_[COORD_B];
                    },
                    set: function (b) {
                        this.setCoordinate(COORD_B, b, 'b');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric2.prototype, "xy", {
                    get: function () {
                        return this.coords_[COORD_B];
                    },
                    set: function (xy) {
                        this.setCoordinate(COORD_B, xy, 'xy');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric2.prototype, "grades", {
                    get: function () {
                        var coords = this.coords_;
                        var α = coords[COORD_A];
                        var x = coords[COORD_X];
                        var y = coords[COORD_Y];
                        var β = coords[COORD_B];
                        var mask = 0x0;
                        if (α !== 0) {
                            mask += 0x1;
                        }
                        if (x !== 0 || y !== 0) {
                            mask += 0x2;
                        }
                        if (β !== 0) {
                            mask += 0x4;
                        }
                        return mask;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric2.prototype, "uom", {
                    get: function () {
                        return this.uom_;
                    },
                    set: function (uom) {
                        if (this.lock_ === UNLOCKED) {
                            this.uom_ = Unit_1.Unit.mustBeUnit('uom', uom);
                        } else {
                            throw new Error(readOnly_1.readOnly('uom').message);
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric2.prototype, "x", {
                    get: function () {
                        return this.coords_[COORD_X];
                    },
                    set: function (x) {
                        this.setCoordinate(COORD_X, x, 'x');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric2.prototype, "y", {
                    get: function () {
                        return this.coords_[COORD_Y];
                    },
                    set: function (y) {
                        this.setCoordinate(COORD_Y, y, 'y');
                    },
                    enumerable: false,
                    configurable: true
                });
                Geometric2.prototype.add = function (M, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().add(M, α));
                    } else {
                        if (this.isZero()) {
                            this.a = M.a * α;
                            this.x = M.x * α;
                            this.y = M.y * α;
                            this.b = M.b * α;
                            this.uom = M.uom;
                            return this;
                        } else if (isZeroGeometricE2_1.isZeroGeometricE2(M)) {
                            return this;
                        } else {
                            this.a += M.a * α;
                            this.x += M.x * α;
                            this.y += M.y * α;
                            this.b += M.b * α;
                            this.uom = Unit_1.Unit.compatible(this.uom, M.uom);
                            return this;
                        }
                    }
                };
                Geometric2.prototype.addVector = function (v, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().addVector(v, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = v.uom;
                        } else if (isZeroVectorE2_1.isZeroVectorE2(v)) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, v.uom);
                        }
                        this.x += v.x * α;
                        this.y += v.y * α;
                        return this;
                    }
                };
                Geometric2.prototype.clone = function () {
                    return Geometric2.copy(this);
                };
                Geometric2.prototype.copy = function (M) {
                    this.a = M.a;
                    this.x = M.x;
                    this.y = M.y;
                    this.b = M.b;
                    this.uom = M.uom;
                    return this;
                };
                Geometric2.prototype.copyBivector = function (B) {
                    var b = B.xy;
                    this.setCoordinate(COORD_A, 0, 'a');
                    this.setCoordinate(COORD_X, 0, 'x');
                    this.setCoordinate(COORD_Y, 0, 'y');
                    this.setCoordinate(COORD_B, b, 'b');
                    this.uom = B.uom;
                    return this;
                };
                Geometric2.prototype.copyScalar = function (α, uom) {
                    this.setCoordinate(COORD_A, α, 'a');
                    this.setCoordinate(COORD_X, 0, 'x');
                    this.setCoordinate(COORD_Y, 0, 'y');
                    this.setCoordinate(COORD_B, 0, 'b');
                    this.uom = uom;
                    return this;
                };
                Geometric2.prototype.copyVector = function (vector) {
                    var x = vector.x;
                    var y = vector.y;
                    this.setCoordinate(COORD_A, 0, 'a');
                    this.setCoordinate(COORD_X, x, 'x');
                    this.setCoordinate(COORD_Y, y, 'y');
                    this.setCoordinate(COORD_B, 0, 'b');
                    this.uom = vector.uom;
                    return this;
                };
                Geometric2.prototype.direction = function (mutate) {
                    if (this.lock_ !== UNLOCKED) {
                        if (!mutate) {
                            return lock(this.clone().direction(true));
                        } else {
                            throw new Error("Unable to mutate this locked Geometric2.");
                        }
                    } else {
                        if (mutate) {
                            var norm = this.magnitudeSansUnits();
                            if (norm !== 0) {
                                this.a = this.a / norm;
                                this.x = this.x / norm;
                                this.y = this.y / norm;
                                this.b = this.b / norm;
                            }
                            this.uom = void 0;
                            return this;
                        } else {
                            return lock(this.clone().direction(true));
                        }
                    }
                };
                Geometric2.prototype.divByScalar = function (α, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().divByScalar(α, uom));
                    } else {
                        this.uom = Unit_1.Unit.div(this.uom, uom);
                        this.a /= α;
                        this.x /= α;
                        this.y /= α;
                        this.b /= α;
                        return this;
                    }
                };
                Geometric2.prototype.ext = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().ext(m));
                    } else {
                        var a0 = this.a;
                        var a1 = this.x;
                        var a2 = this.y;
                        var a3 = this.b;
                        var b0 = m.a;
                        var b1 = m.x;
                        var b2 = m.y;
                        var b3 = m.b;
                        this.a = a0 * b0;
                        this.x = a0 * b1 + a1 * b0;
                        this.y = a0 * b2 + a2 * b0;
                        this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
                        this.uom = Unit_1.Unit.mul(this.uom, m.uom);
                        return this;
                    }
                };
                Geometric2.prototype.inv = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().inv());
                    } else {
                        var α = this.a;
                        var x = this.x;
                        var y = this.y;
                        var β = this.b;
                        var A = [[α, x, y, -β], [x, α, β, -y], [y, -β, α, x], [β, -y, x, α]];
                        var b = [1, 0, 0, 0];
                        var X = gauss_1.gauss(A, b);
                        this.a = X[0];
                        this.x = X[1];
                        this.y = X[2];
                        this.b = X[3];
                        this.uom = Unit_1.Unit.inv(this.uom);
                        return this;
                    }
                };
                Geometric2.prototype.isZero = function () {
                    return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
                };
                Geometric2.prototype.magnitude = function (mutate) {
                    if (this.lock_ !== UNLOCKED) {
                        if (!mutate) {
                            return lock(this.clone().magnitude(true));
                        } else {
                            throw new Error("Unable to mutate this locked Geometric3.");
                        }
                    } else {
                        if (mutate) {
                            this.a = Math.sqrt(this.squaredNormSansUnits());
                            this.x = 0;
                            this.y = 0;
                            this.b = 0;
                            return this;
                        } else {
                            return lock(this.clone().magnitude(true));
                        }
                    }
                };
                Geometric2.prototype.magnitudeSansUnits = function () {
                    return Math.sqrt(this.squaredNormSansUnits());
                };
                Geometric2.prototype.mul = function (rhs) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mul(rhs));
                    } else {
                        return this.mul2(this, rhs);
                    }
                };
                Geometric2.prototype.mul2 = function (lhs, rhs) {
                    var a0 = lhs.a;
                    var a1 = lhs.x;
                    var a2 = lhs.y;
                    var a3 = lhs.b;
                    var b0 = rhs.a;
                    var b1 = rhs.x;
                    var b2 = rhs.y;
                    var b3 = rhs.b;
                    this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
                    this.x = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
                    this.y = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
                    this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
                    this.uom = Unit_1.Unit.mul(this.uom, rhs.uom);
                    return this;
                };
                Geometric2.prototype.mulByBivector = function (B) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByBivector(B));
                    } else {
                        this.uom = Unit_1.Unit.mul(this.uom, B.uom);
                        var a = this.a;
                        var x = this.x;
                        var y = this.y;
                        var b = this.b;
                        var β = B.xy;
                        this.a = -b * β;
                        this.x = -y * β;
                        this.y = +x * β;
                        this.b = a * β;
                        return this;
                    }
                };
                Geometric2.prototype.mulByNumber = function (α) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByNumber(α));
                    } else {
                        this.a *= α;
                        this.x *= α;
                        this.y *= α;
                        this.b *= α;
                        return this;
                    }
                };
                Geometric2.prototype.mulByScalar = function (α, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByScalar(α, uom));
                    } else {
                        this.a *= α;
                        this.x *= α;
                        this.y *= α;
                        this.b *= α;
                        this.uom = Unit_1.Unit.mul(this.uom, uom);
                        return this;
                    }
                };
                Geometric2.prototype.mulByVector = function (v) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByVector(v));
                    } else {
                        this.uom = Unit_1.Unit.mul(this.uom, v.uom);
                        var a0 = this.a;
                        var a1 = this.x;
                        var a2 = this.y;
                        var a4 = this.xy;
                        var b1 = v.x;
                        var b2 = v.y;
                        this.a = a1 * b1 + a2 * b2;
                        this.x = a0 * b1 + a4 * b2;
                        this.y = a0 * b2 - a4 * b1;
                        this.b = a1 * b2 - a2 * b1;
                        return this;
                    }
                };
                Geometric2.prototype.neg = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().neg());
                    } else {
                        this.a = -this.a;
                        this.x = -this.x;
                        this.y = -this.y;
                        this.b = -this.b;
                        return this;
                    }
                };
                Geometric2.prototype.quaditude = function (mutate) {
                    if (this.lock_ !== UNLOCKED) {
                        if (!mutate) {
                            return lock(this.clone().quaditude(true));
                        } else {
                            throw new Error("Unable to mutate this locked Geometric3.");
                        }
                    } else {
                        if (mutate) {
                            this.a = this.squaredNormSansUnits();
                            this.x = 0;
                            this.y = 0;
                            this.b = 0;
                            this.uom = Unit_1.Unit.mul(this.uom, this.uom);
                            return this;
                        } else {
                            return lock(this.clone().quaditude(true));
                        }
                    }
                };
                Geometric2.prototype.rev = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().rev());
                    } else {
                        this.a = +this.a;
                        this.x = +this.x;
                        this.y = +this.y;
                        this.b = -this.b;
                        return this;
                    }
                };
                Geometric2.prototype.rotate = function (spinor) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().rotate(spinor));
                    } else {
                        Unit_1.Unit.assertDimensionless(spinor.uom);
                        var a = this.a;
                        var x = this.x;
                        var y = this.y;
                        var b = this.b;
                        var α = spinor.a;
                        var β = spinor.xy;
                        var α2 = α * α;
                        var β2 = β * β;
                        var p = α2 - β2;
                        var q = 2 * α * β;
                        var s = α2 + β2;
                        this.a = s * a;
                        this.x = p * x + q * y;
                        this.y = p * y - q * x;
                        this.b = s * b;
                        return this;
                    }
                };
                Geometric2.prototype.scp = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().scp(m));
                    } else {
                        return this.scp2(this, m);
                    }
                };
                Geometric2.prototype.scp2 = function (a, b) {
                    var a0 = a.a;
                    var a1 = a.x;
                    var a2 = a.y;
                    var a3 = a.b;
                    var b0 = b.a;
                    var b1 = b.x;
                    var b2 = b.y;
                    var b3 = b.b;
                    var s = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
                    this.a = s;
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                    this.uom = Unit_1.Unit.mul(a.uom, b.uom);
                    return this;
                };
                Geometric2.prototype.squaredNormSansUnits = function () {
                    return this.a * this.a + this.x * this.x + this.y * this.y + this.b * this.b;
                };
                Geometric2.prototype.sub = function (M, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().sub(M, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = M.uom;
                        } else if (isZeroGeometricE2_1.isZeroGeometricE2(M)) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, M.uom);
                        }
                        this.a -= M.a * α;
                        this.x -= M.x * α;
                        this.y -= M.y * α;
                        this.b -= M.b * α;
                        return this;
                    }
                };
                Geometric2.prototype.subScalar = function (M, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().subScalar(M, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = M.uom;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, M.uom);
                        }
                        this.a -= M.a * α;
                        return this;
                    }
                };
                Geometric2.prototype.subVector = function (v, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().subVector(v, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = v.uom;
                        } else if (isZeroVectorE2_1.isZeroVectorE2(v)) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, v.uom);
                        }
                        this.x -= v.x * α;
                        this.y -= v.y * α;
                        return this;
                    }
                };
                Geometric2.prototype.toExponential = function (fractionDigits) {
                    var coordToString = function (coord) {
                        return coord.toExponential(fractionDigits);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric2.prototype.toFixed = function (fractionDigits) {
                    var coordToString = function (coord) {
                        return coord.toFixed(fractionDigits);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric2.prototype.toPrecision = function (precision) {
                    var coordToString = function (coord) {
                        return coord.toPrecision(precision);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric2.prototype.toString = function (radix) {
                    var coordToString = function (coord) {
                        return coord.toString(radix);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric2.prototype.write = function (mv) {
                    mv.a = this.a;
                    mv.x = this.x;
                    mv.y = this.y;
                    mv.b = this.b;
                    mv.uom = this.uom;
                };
                Geometric2.prototype.writeVector = function (vector) {
                    vector.x = this.x;
                    vector.y = this.y;
                    vector.uom = this.uom;
                };
                Geometric2.prototype.zero = function () {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                    this.uom = void 0;
                    return this;
                };
                Geometric2.zero = lock(new Geometric2(zero(), void 0));
                Geometric2.one = lock(new Geometric2(scalar(1), void 0));
                Geometric2.e1 = lock(new Geometric2(vector(1, 0), void 0));
                Geometric2.e2 = lock(new Geometric2(vector(0, 1), void 0));
                Geometric2.I = lock(new Geometric2(pseudo(1), void 0));
                Geometric2.meter = lock(new Geometric2(scalar(1), Unit_1.Unit.METER));
                Geometric2.kilogram = lock(new Geometric2(scalar(1), Unit_1.Unit.KILOGRAM));
                Geometric2.second = lock(new Geometric2(scalar(1), Unit_1.Unit.SECOND));
                Geometric2.ampere = lock(new Geometric2(scalar(1), Unit_1.Unit.AMPERE));
                Geometric2.kelvin = lock(new Geometric2(scalar(1), Unit_1.Unit.KELVIN));
                Geometric2.mole = lock(new Geometric2(scalar(1), Unit_1.Unit.MOLE));
                Geometric2.candela = lock(new Geometric2(scalar(1), Unit_1.Unit.CANDELA));
                Geometric2.coulomb = lock(new Geometric2(scalar(1), Unit_1.Unit.COULOMB));
                Geometric2.newton = lock(new Geometric2(scalar(1), Unit_1.Unit.NEWTON));
                Geometric2.joule = lock(new Geometric2(scalar(1), Unit_1.Unit.JOULE));
                return Geometric2;
            }();
            exports_1("Geometric2", Geometric2);
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
System.register("davinci-newton/checks/mustBeString.js", ["../checks/mustSatisfy", "../checks/isString"], function (exports_1, context_1) {
    "use strict";

    var mustSatisfy_1, isString_1;
    var __moduleName = context_1 && context_1.id;
    function beAString() {
        return "be a string";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
        return value;
    }
    exports_1("default", default_1);
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isString_1_1) {
            isString_1 = isString_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/i18n/readOnly.js", ["../checks/mustBeString"], function (exports_1, context_1) {
    "use strict";

    var mustBeString_1;
    var __moduleName = context_1 && context_1.id;
    function readOnly(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Property `" + name + "` is readonly.";
            }
        };
        return message;
    }
    exports_1("readOnly", readOnly);
    return {
        setters: [function (mustBeString_1_1) {
            mustBeString_1 = mustBeString_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/approx.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function approx(coords, n) {
        var max = 0;
        var iLen = coords.length;
        for (var i = 0; i < iLen; i++) {
            max = Math.max(max, Math.abs(coords[i]));
        }
        var threshold = max * Math.pow(10, -n);
        for (var i = 0; i < iLen; i++) {
            if (Math.abs(coords[i]) < threshold) {
                coords[i] = 0;
            }
        }
    }
    exports_1("approx", approx);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/arraysEQ.js", ["../checks/isDefined", "../checks/isNull", "../checks/isUndefined"], function (exports_1, context_1) {
    "use strict";

    var isDefined_1, isNull_1, isUndefined_1;
    var __moduleName = context_1 && context_1.id;
    function arraysEQ(a, b) {
        if (isDefined_1.default(a)) {
            if (isDefined_1.default(b)) {
                if (!isNull_1.default(a)) {
                    if (!isNull_1.default(b)) {
                        var aLen = a.length;
                        var bLen = b.length;
                        if (aLen === bLen) {
                            for (var i = 0; i < aLen; i++) {
                                if (a[i] !== b[i]) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return isNull_1.default(b);
                }
            } else {
                return false;
            }
        } else {
            return isUndefined_1.default(b);
        }
    }
    exports_1("arraysEQ", arraysEQ);
    return {
        setters: [function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }, function (isNull_1_1) {
            isNull_1 = isNull_1_1;
        }, function (isUndefined_1_1) {
            isUndefined_1 = isUndefined_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/extE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~~index) {
            case 0:
                {
                    x = +(a0 * b0);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a2 * b0);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a3 * b0);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a1 * b2 - a2 * b1 + a4 * b0);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a2 * b3 - a3 * b2 + a5 * b0);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 - a1 * b3 + a3 * b1 + a6 * b0);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
                }
                break;
            default:
                {
                    throw new Error("index must be in the range [0..7]");
                }
        }
        return +x;
    }
    exports_1("default", extE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/extG3.js", ["./compG3Get", "./compG3Set", "./extE3", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var compG3Get_1, compG3Set_1, extE3_1, Unit_1;
    var __moduleName = context_1 && context_1.id;
    function extG3(a, b, out) {
        out.uom = Unit_1.Unit.mul(a.uom, b.uom);
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, extE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    exports_1("default", extG3);
    return {
        setters: [function (compG3Get_1_1) {
            compG3Get_1 = compG3Get_1_1;
        }, function (compG3Set_1_1) {
            compG3Set_1 = compG3Set_1_1;
        }, function (extE3_1_1) {
            extE3_1 = extE3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/gauss.js", [], function (exports_1, context_1) {
    "use strict";

    var abs;
    var __moduleName = context_1 && context_1.id;
    function makeColumnVector(n, v) {
        var a = [];
        for (var i = 0; i < n; i++) {
            a.push(v);
        }
        return a;
    }
    function rowWithMaximumInColumn(A, column, N) {
        var biggest = abs(A[column][column]);
        var maxRow = column;
        for (var row = column + 1; row < N; row++) {
            if (abs(A[row][column]) > biggest) {
                biggest = abs(A[row][column]);
                maxRow = row;
            }
        }
        return maxRow;
    }
    function swapRows(A, i, j, N) {
        var colLength = N + 1;
        for (var column = i; column < colLength; column++) {
            var temp = A[j][column];
            A[j][column] = A[i][column];
            A[i][column] = temp;
        }
    }
    function makeZeroBelow(A, i, N) {
        for (var row = i + 1; row < N; row++) {
            var c = -A[row][i] / A[i][i];
            for (var column = i; column < N + 1; column++) {
                if (i === column) {
                    A[row][column] = 0;
                } else {
                    A[row][column] += c * A[i][column];
                }
            }
        }
    }
    function solve(A, N) {
        var x = makeColumnVector(N, 0);
        for (var i = N - 1; i > -1; i--) {
            x[i] = A[i][N] / A[i][i];
            for (var k = i - 1; k > -1; k--) {
                A[k][N] -= A[k][i] * x[i];
            }
        }
        return x;
    }
    function gauss(A, b) {
        var N = A.length;
        for (var i = 0; i < N; i++) {
            var Ai = A[i];
            var bi = b[i];
            Ai.push(bi);
        }
        for (var j = 0; j < N; j++) {
            swapRows(A, j, rowWithMaximumInColumn(A, j, N), N);
            makeZeroBelow(A, j, N);
        }
        return solve(A, N);
    }
    exports_1("gauss", gauss);
    return {
        setters: [],
        execute: function () {
            abs = Math.abs;
        }
    };
});
System.register("davinci-newton/math/isScalarG3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isScalarG3(m) {
        return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
    }
    exports_1("default", isScalarG3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isVectorE3.js", ["../checks/isNull", "../checks/isNumber", "../checks/isObject"], function (exports_1, context_1) {
    "use strict";

    var isNull_1, isNumber_1, isObject_1;
    var __moduleName = context_1 && context_1.id;
    function isVectorE3(v) {
        if (isObject_1.default(v) && !isNull_1.default(v)) {
            return isNumber_1.default(v.x) && isNumber_1.default(v.y) && isNumber_1.default(v.z);
        } else {
            return false;
        }
    }
    exports_1("default", isVectorE3);
    return {
        setters: [function (isNull_1_1) {
            isNull_1 = isNull_1_1;
        }, function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isVectorG3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isVectorG3(m) {
        return m.a === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
    }
    exports_1("default", isVectorG3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isZeroBivectorE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isZeroBivectorE3(m) {
        return m.yz === 0 && m.zx === 0 && m.xy === 0;
    }
    exports_1("default", isZeroBivectorE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isZeroGeometricE3.js", ["./isZeroBivectorE3", "./isZeroVectorE3"], function (exports_1, context_1) {
    "use strict";

    var isZeroBivectorE3_1, isZeroVectorE3_1;
    var __moduleName = context_1 && context_1.id;
    function isZeroGeometricE3(m) {
        return isZeroVectorE3_1.default(m) && isZeroBivectorE3_1.default(m) && m.a === 0 && m.b === 0;
    }
    exports_1("default", isZeroGeometricE3);
    return {
        setters: [function (isZeroBivectorE3_1_1) {
            isZeroBivectorE3_1 = isZeroBivectorE3_1_1;
        }, function (isZeroVectorE3_1_1) {
            isZeroVectorE3_1 = isZeroVectorE3_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/isZeroVectorE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isZeroVectorE3(v) {
        return v.x === 0 && v.y === 0 && v.z === 0;
    }
    exports_1("default", isZeroVectorE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/lcoE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~~index) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 - a2 * b4 + a3 * b6 - a5 * b7);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b4 - a3 * b5 - a6 * b7);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 - a1 * b6 + a2 * b5 - a4 * b7);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a3 * b7);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a1 * b7);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 + a2 * b7);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7);
                }
                break;
            default:
                {
                    throw new Error("index must be in the range [0..7]");
                }
        }
        return +x;
    }
    exports_1("default", lcoE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/lcoG3.js", ["./compG3Get", "./compG3Set", "./lcoE3", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var compG3Get_1, compG3Set_1, lcoE3_1, Unit_1;
    var __moduleName = context_1 && context_1.id;
    function lcoG3(a, b, out) {
        out.uom = Unit_1.Unit.mul(a.uom, b.uom);
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, lcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    exports_1("default", lcoG3);
    return {
        setters: [function (compG3Get_1_1) {
            compG3Get_1 = compG3Get_1_1;
        }, function (compG3Set_1_1) {
            compG3Set_1 = compG3Set_1_1;
        }, function (lcoE3_1_1) {
            lcoE3_1 = lcoE3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/maskG3.js", ["../checks/isNumber", "../checks/isObject", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var isNumber_1, isObject_1, Unit_1, ONE, scratch;
    var __moduleName = context_1 && context_1.id;
    function maskG3(arg) {
        var duck = arg;
        if (isObject_1.default(arg) && 'grades' in arg) {
            var g = arg;
            if (duck.grades & 0x1) {
                scratch.a = g.a;
            } else {
                scratch.a = 0;
            }
            if (duck.grades & 0x2) {
                scratch.x = g.x;
                scratch.y = g.y;
                scratch.z = g.z;
            } else {
                scratch.x = 0;
                scratch.y = 0;
                scratch.z = 0;
            }
            if (duck.grades & 0x4) {
                scratch.yz = g.yz;
                scratch.zx = g.zx;
                scratch.xy = g.xy;
            } else {
                scratch.yz = 0;
                scratch.zx = 0;
                scratch.xy = 0;
            }
            if (duck.grades & 0x8) {
                scratch.b = g.b;
            } else {
                scratch.b = 0;
            }
            scratch.uom = Unit_1.Unit.mustBeUnit('g.uom', g.uom);
            return scratch;
        } else if (isNumber_1.default(arg)) {
            scratch.a = arg;
            scratch.x = 0;
            scratch.y = 0;
            scratch.z = 0;
            scratch.yz = 0;
            scratch.zx = 0;
            scratch.xy = 0;
            scratch.b = 0;
            scratch.uom = ONE;
            return scratch;
        } else {
            return void 0;
        }
    }
    exports_1("maskG3", maskG3);
    return {
        setters: [function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }, function (isObject_1_1) {
            isObject_1 = isObject_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {
            ONE = void 0;
            scratch = { a: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, b: 0, uom: ONE };
        }
    };
});
System.register("davinci-newton/math/randomRange.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function default_1(a, b) {
        return (b - a) * Math.random() + a;
    }
    exports_1("default", default_1);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/rcoE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~~index) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(+a1 * b0 + a4 * b2 - a6 * b3 - a7 * b5);
                }
                break;
            case 2:
                {
                    x = +(+a2 * b0 - a4 * b1 + a5 * b3 - a7 * b6);
                }
                break;
            case 3:
                {
                    x = +(+a3 * b0 - a5 * b2 + a6 * b1 - a7 * b4);
                }
                break;
            case 4:
                {
                    x = +(+a4 * b0 + a7 * b3);
                }
                break;
            case 5:
                {
                    x = +(+a5 * b0 + a7 * b1);
                }
                break;
            case 6:
                {
                    x = +(+a6 * b0 + a7 * b2);
                }
                break;
            case 7:
                {
                    x = +(+a7 * b0);
                }
                break;
            default:
                {
                    throw new Error("index must be in the range [0..7]");
                }
        }
        return +x;
    }
    exports_1("default", rcoE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/rcoG3.js", ["./compG3Get", "./compG3Set", "./rcoE3", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var compG3Get_1, compG3Set_1, rcoE3_1, Unit_1;
    var __moduleName = context_1 && context_1.id;
    function rcoG3(a, b, out) {
        out.uom = Unit_1.Unit.mul(a.uom, b.uom);
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, rcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    exports_1("default", rcoG3);
    return {
        setters: [function (compG3Get_1_1) {
            compG3Get_1 = compG3Get_1_1;
        }, function (compG3Set_1_1) {
            compG3Set_1 = compG3Set_1_1;
        }, function (rcoE3_1_1) {
            rcoE3_1 = rcoE3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/dotVectorE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function dotVectorE3(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    exports_1("default", dotVectorE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/quadVectorE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function quadVectorE3(vector) {
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        return x * x + y * y + z * z;
    }
    exports_1("default", quadVectorE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/rotorFromDirectionsE3.js", ["./dotVectorE3", "./quadVectorE3", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (exports_1, context_1) {
    "use strict";

    var dotVectorE3_1, quadVectorE3_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1, sqrt, cosPIdiv4, sinPIdiv4;
    var __moduleName = context_1 && context_1.id;
    function rotorFromDirectionsE3(a, b, B, m) {
        if (a.x === b.x && a.y === b.y && a.z === b.z) {
            m.one();
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = -sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === -1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === -1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = -sinPIdiv4;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (typeof B === 'undefined') {
            if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === -1 && a.z === 0 && b.x === 0 && b.y === +1 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 0 && b.z === -1) {
                m.zero();
                m.zx = -1;
                return;
            }
            if (a.x === 0 && a.y === 0 && a.z === -1 && b.x === 0 && b.y === 0 && b.z === +1) {
                m.zero();
                m.zx = -1;
                return;
            }
        }
        var quadA = quadVectorE3_1.default(a);
        var absA = sqrt(quadA);
        var quadB = quadVectorE3_1.default(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var dotBA = dotVectorE3_1.default(b, a);
        var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
        if (denom !== 0) {
            m = m.versor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
        } else {
            if (B) {
                m.rotorFromGeneratorAngle(B, Math.PI);
            } else {
                var rx = Math.random();
                var ry = Math.random();
                var rz = Math.random();
                m.zero();
                m.yz = wedgeYZ_1.default(rx, ry, rz, a.x, a.y, a.z);
                m.zx = wedgeZX_1.default(rx, ry, rz, a.x, a.y, a.z);
                m.xy = wedgeXY_1.default(rx, ry, rz, a.x, a.y, a.z);
                m.direction(true);
                m.rotorFromGeneratorAngle(m, Math.PI);
            }
        }
    }
    exports_1("default", rotorFromDirectionsE3);
    return {
        setters: [function (dotVectorE3_1_1) {
            dotVectorE3_1 = dotVectorE3_1_1;
        }, function (quadVectorE3_1_1) {
            quadVectorE3_1 = quadVectorE3_1_1;
        }, function (wedgeXY_1_1) {
            wedgeXY_1 = wedgeXY_1_1;
        }, function (wedgeYZ_1_1) {
            wedgeYZ_1 = wedgeYZ_1_1;
        }, function (wedgeZX_1_1) {
            wedgeZX_1 = wedgeZX_1_1;
        }],
        execute: function () {
            sqrt = Math.sqrt;
            cosPIdiv4 = Math.cos(Math.PI / 4);
            sinPIdiv4 = Math.sin(Math.PI / 4);
        }
    };
});
System.register("davinci-newton/math/compG3Get.js", [], function (exports_1, context_1) {
    "use strict";

    var COORD_W, COORD_X, COORD_Y, COORD_Z, COORD_XY, COORD_YZ, COORD_ZX, COORD_XYZ;
    var __moduleName = context_1 && context_1.id;
    function compG3Get(m, index) {
        switch (index) {
            case COORD_W:
                {
                    return m.a;
                }
            case COORD_X:
                {
                    return m.x;
                }
            case COORD_Y:
                {
                    return m.y;
                }
            case COORD_Z:
                {
                    return m.z;
                }
            case COORD_XY:
                {
                    return m.xy;
                }
            case COORD_YZ:
                {
                    return m.yz;
                }
            case COORD_ZX:
                {
                    return m.zx;
                }
            case COORD_XYZ:
                {
                    return m.b;
                }
            default:
                {
                    throw new Error("index => " + index);
                }
        }
    }
    exports_1("default", compG3Get);
    return {
        setters: [],
        execute: function () {
            COORD_W = 0;
            COORD_X = 1;
            COORD_Y = 2;
            COORD_Z = 3;
            COORD_XY = 4;
            COORD_YZ = 5;
            COORD_ZX = 6;
            COORD_XYZ = 7;
        }
    };
});
System.register("davinci-newton/math/compG3Set.js", [], function (exports_1, context_1) {
    "use strict";

    var COORD_W, COORD_X, COORD_Y, COORD_Z, COORD_XY, COORD_YZ, COORD_ZX, COORD_XYZ;
    var __moduleName = context_1 && context_1.id;
    function compG3Set(m, index, value) {
        switch (index) {
            case COORD_W:
                {
                    m.a = value;
                    break;
                }
            case COORD_X:
                {
                    m.x = value;
                    break;
                }
            case COORD_Y:
                {
                    m.y = value;
                    break;
                }
            case COORD_Z:
                {
                    m.z = value;
                    break;
                }
            case COORD_XY:
                {
                    m.xy = value;
                    break;
                }
            case COORD_YZ:
                {
                    m.yz = value;
                    break;
                }
            case COORD_ZX:
                {
                    m.zx = value;
                    break;
                }
            case COORD_XYZ:
                {
                    m.b = value;
                    break;
                }
            default:
                throw new Error("index => " + index);
        }
    }
    exports_1("default", compG3Set);
    return {
        setters: [],
        execute: function () {
            COORD_W = 0;
            COORD_X = 1;
            COORD_Y = 2;
            COORD_Z = 3;
            COORD_XY = 4;
            COORD_YZ = 5;
            COORD_ZX = 6;
            COORD_XYZ = 7;
        }
    };
});
System.register("davinci-newton/math/mulE3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        switch (index) {
            case 0:
                {
                    return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7;
                }
            case 1:
                {
                    return a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5;
                }
            case 2:
                {
                    return a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6;
                }
            case 3:
                {
                    return a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4;
                }
            case 4:
                {
                    return a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3;
                }
            case 5:
                {
                    return a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1;
                }
            case 6:
                {
                    return a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2;
                }
            case 7:
                {
                    return a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0;
                }
            default:
                {
                    throw new Error("index must be in the range [0..7]");
                }
        }
    }
    exports_1("default", mulE3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/scpG3.js", ["../math/compG3Get", "../math/compG3Set", "../math/mulE3", "../math/Unit"], function (exports_1, context_1) {
    "use strict";

    var compG3Get_1, compG3Set_1, mulE3_1, Unit_1;
    var __moduleName = context_1 && context_1.id;
    function scpG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        compG3Set_1.default(out, 0, mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
        compG3Set_1.default(out, 1, 0);
        compG3Set_1.default(out, 2, 0);
        compG3Set_1.default(out, 3, 0);
        compG3Set_1.default(out, 4, 0);
        compG3Set_1.default(out, 5, 0);
        compG3Set_1.default(out, 6, 0);
        compG3Set_1.default(out, 7, 0);
        out.uom = Unit_1.Unit.mul(a.uom, b.uom);
        return out;
    }
    exports_1("default", scpG3);
    return {
        setters: [function (compG3Get_1_1) {
            compG3Get_1 = compG3Get_1_1;
        }, function (compG3Set_1_1) {
            compG3Set_1 = compG3Set_1_1;
        }, function (mulE3_1_1) {
            mulE3_1 = mulE3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/squaredNormG3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function squaredNormG3(m) {
        var a = m.a;
        var x = m.x;
        var y = m.y;
        var z = m.z;
        var yz = m.yz;
        var zx = m.zx;
        var xy = m.xy;
        var b = m.b;
        return a * a + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + b * b;
    }
    exports_1("default", squaredNormG3);
    return {
        setters: [],
        execute: function () {}
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
System.register("davinci-newton/checks/mustBeArray.js", ["../checks/mustSatisfy", "../checks/isArray"], function (exports_1, context_1) {
    "use strict";

    var mustSatisfy_1, isArray_1;
    var __moduleName = context_1 && context_1.id;
    function beAnArray() {
        return "be an array";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
        return value;
    }
    exports_1("default", default_1);
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isArray_1_1) {
            isArray_1 = isArray_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/stringFromCoordinates.js", ["../checks/isDefined", "../checks/mustBeArray", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var isDefined_1, mustBeArray_1, Unit_1;
    var __moduleName = context_1 && context_1.id;
    function isLabelOne(label) {
        if (typeof label === 'string') {
            return label === "1";
        } else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                return isLabelOne(labels[0]) && isLabelOne(labels[1]);
            } else if (labels.length === 1) {
                return isLabelOne(labels[0]);
            } else {
                return false;
            }
        }
    }
    function appendLabel(coord, label, sb) {
        if (typeof label === 'string') {
            sb.push(label);
        } else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                sb.push(coord > 0 ? labels[1] : labels[0]);
            } else if (labels.length === 1) {
                sb.push(labels[0]);
            } else if (labels.length === 0) {} else {
                throw new Error("Unexpected basis label array length: " + labels.length);
            }
        }
    }
    function appendCoord(coord, numberToString, label, sb) {
        if (coord !== 0) {
            if (coord >= 0) {
                if (sb.length > 0) {
                    sb.push("+");
                }
            } else {
                if (typeof label === 'string') {
                    sb.push("-");
                } else {
                    var labels = mustBeArray_1.default('label', label);
                    if (labels.length === 2) {
                        if (labels[0] !== labels[1]) {
                            if (sb.length > 0) {
                                sb.push("+");
                            }
                        } else {
                            sb.push("-");
                        }
                    } else if (labels.length === 1) {
                        sb.push("-");
                    } else {
                        sb.push("-");
                    }
                }
            }
            var n = Math.abs(coord);
            if (n === 1) {
                appendLabel(coord, label, sb);
            } else {
                sb.push(numberToString(n));
                if (!isLabelOne(label)) {
                    sb.push("*");
                    appendLabel(coord, label, sb);
                } else {}
            }
        } else {}
    }
    function stringFromCoordinates(coordinates, numberToString, labels, uom) {
        var sb = [];
        for (var i = 0, iLength = coordinates.length; i < iLength; i++) {
            var coord = coordinates[i];
            if (isDefined_1.default(coord)) {
                appendCoord(coord, numberToString, labels[i], sb);
            } else {
                return void 0;
            }
        }
        if (Unit_1.Unit.isOne(uom)) {
            return sb.length > 0 ? sb.join("") : "0";
        } else {
            return sb.length > 0 ? sb.join("") + " " + uom.toString(10, true) : "0";
        }
    }
    exports_1("stringFromCoordinates", stringFromCoordinates);
    return {
        setters: [function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }, function (mustBeArray_1_1) {
            mustBeArray_1 = mustBeArray_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/wedgeXY.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function wedgeXY(ax, ay, az, bx, by, bz) {
        return ax * by - ay * bx;
    }
    exports_1("default", wedgeXY);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/wedgeYZ.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function wedgeYZ(ax, ay, az, bx, by, bz) {
        return ay * bz - az * by;
    }
    exports_1("default", wedgeYZ);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/wedgeZX.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function wedgeZX(ax, ay, az, bx, by, bz) {
        return az * bx - ax * bz;
    }
    return {
        setters: [],
        execute: function () {
            exports_1("default", wedgeZX);
        }
    };
});
System.register("davinci-newton/math/Geometric3.js", ["../checks/isDefined", "../i18n/readOnly", "./approx", "./arraysEQ", "./dotVectorE3", "./extG3", "./gauss", "./isScalarG3", "./isVectorE3", "./isVectorG3", "./isZeroGeometricE3", "./isZeroVectorE3", "./lcoG3", "./maskG3", "./mulE3", "./QQ", "./randomRange", "./rcoG3", "./rotorFromDirectionsE3", "./scpG3", "./squaredNormG3", "./stringFromCoordinates", "./Unit", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (exports_1, context_1) {
    "use strict";

    var isDefined_1, readOnly_1, approx_1, arraysEQ_1, dotVectorE3_1, extG3_1, gauss_1, isScalarG3_1, isVectorE3_1, isVectorG3_1, isZeroGeometricE3_1, isZeroVectorE3_1, lcoG3_1, maskG3_1, mulE3_1, QQ_1, randomRange_1, rcoG3_1, rotorFromDirectionsE3_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, Unit_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1, COORD_SCALAR, COORD_X, COORD_Y, COORD_Z, COORD_XY, COORD_YZ, COORD_ZX, COORD_PSEUDO, BASIS_LABELS, zero, scalar, vector, bivector, spinor, multivector, pseudo, coordinates, cosines, UNLOCKED, Geometric3;
    var __moduleName = context_1 && context_1.id;
    function cosVectorVector(a, b) {
        function scp(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        function norm(v) {
            return Math.sqrt(scp(v, v));
        }
        return scp(a, b) / (norm(a) * norm(b));
    }
    function lock(m) {
        m.lock();
        return m;
    }
    return {
        setters: [function (isDefined_1_1) {
            isDefined_1 = isDefined_1_1;
        }, function (readOnly_1_1) {
            readOnly_1 = readOnly_1_1;
        }, function (approx_1_1) {
            approx_1 = approx_1_1;
        }, function (arraysEQ_1_1) {
            arraysEQ_1 = arraysEQ_1_1;
        }, function (dotVectorE3_1_1) {
            dotVectorE3_1 = dotVectorE3_1_1;
        }, function (extG3_1_1) {
            extG3_1 = extG3_1_1;
        }, function (gauss_1_1) {
            gauss_1 = gauss_1_1;
        }, function (isScalarG3_1_1) {
            isScalarG3_1 = isScalarG3_1_1;
        }, function (isVectorE3_1_1) {
            isVectorE3_1 = isVectorE3_1_1;
        }, function (isVectorG3_1_1) {
            isVectorG3_1 = isVectorG3_1_1;
        }, function (isZeroGeometricE3_1_1) {
            isZeroGeometricE3_1 = isZeroGeometricE3_1_1;
        }, function (isZeroVectorE3_1_1) {
            isZeroVectorE3_1 = isZeroVectorE3_1_1;
        }, function (lcoG3_1_1) {
            lcoG3_1 = lcoG3_1_1;
        }, function (maskG3_1_1) {
            maskG3_1 = maskG3_1_1;
        }, function (mulE3_1_1) {
            mulE3_1 = mulE3_1_1;
        }, function (QQ_1_1) {
            QQ_1 = QQ_1_1;
        }, function (randomRange_1_1) {
            randomRange_1 = randomRange_1_1;
        }, function (rcoG3_1_1) {
            rcoG3_1 = rcoG3_1_1;
        }, function (rotorFromDirectionsE3_1_1) {
            rotorFromDirectionsE3_1 = rotorFromDirectionsE3_1_1;
        }, function (scpG3_1_1) {
            scpG3_1 = scpG3_1_1;
        }, function (squaredNormG3_1_1) {
            squaredNormG3_1 = squaredNormG3_1_1;
        }, function (stringFromCoordinates_1_1) {
            stringFromCoordinates_1 = stringFromCoordinates_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (wedgeXY_1_1) {
            wedgeXY_1 = wedgeXY_1_1;
        }, function (wedgeYZ_1_1) {
            wedgeYZ_1 = wedgeYZ_1_1;
        }, function (wedgeZX_1_1) {
            wedgeZX_1 = wedgeZX_1_1;
        }],
        execute: function () {
            COORD_SCALAR = 0;
            COORD_X = 1;
            COORD_Y = 2;
            COORD_Z = 3;
            COORD_XY = 4;
            COORD_YZ = 5;
            COORD_ZX = 6;
            COORD_PSEUDO = 7;
            BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
            BASIS_LABELS[COORD_SCALAR] = '1';
            BASIS_LABELS[COORD_X] = 'e1';
            BASIS_LABELS[COORD_Y] = 'e2';
            BASIS_LABELS[COORD_Z] = 'e3';
            zero = function zero() {
                return [0, 0, 0, 0, 0, 0, 0, 0];
            };
            scalar = function scalar(a) {
                var coords = zero();
                coords[COORD_SCALAR] = a;
                return coords;
            };
            vector = function vector(x, y, z) {
                var coords = zero();
                coords[COORD_X] = x;
                coords[COORD_Y] = y;
                coords[COORD_Z] = z;
                return coords;
            };
            bivector = function bivector(yz, zx, xy) {
                var coords = zero();
                coords[COORD_YZ] = yz;
                coords[COORD_ZX] = zx;
                coords[COORD_XY] = xy;
                return coords;
            };
            spinor = function spinor(a, yz, zx, xy) {
                var coords = zero();
                coords[COORD_SCALAR] = a;
                coords[COORD_YZ] = yz;
                coords[COORD_ZX] = zx;
                coords[COORD_XY] = xy;
                return coords;
            };
            multivector = function multivector(a, x, y, z, yz, zx, xy, b) {
                var coords = zero();
                coords[COORD_SCALAR] = a;
                coords[COORD_X] = x;
                coords[COORD_Y] = y;
                coords[COORD_Z] = z;
                coords[COORD_YZ] = yz;
                coords[COORD_ZX] = zx;
                coords[COORD_XY] = xy;
                coords[COORD_PSEUDO] = b;
                return coords;
            };
            pseudo = function pseudo(b) {
                var coords = zero();
                coords[COORD_PSEUDO] = b;
                return coords;
            };
            coordinates = function coordinates(m) {
                var coords = zero();
                coords[COORD_SCALAR] = m.a;
                coords[COORD_X] = m.x;
                coords[COORD_Y] = m.y;
                coords[COORD_Z] = m.z;
                coords[COORD_YZ] = m.yz;
                coords[COORD_ZX] = m.zx;
                coords[COORD_XY] = m.xy;
                coords[COORD_PSEUDO] = m.b;
                return coords;
            };
            cosines = [];
            UNLOCKED = -1 * Math.random();
            Geometric3 = function () {
                function Geometric3(coords, uom) {
                    if (coords === void 0) {
                        coords = zero();
                    }
                    this.lock_ = UNLOCKED;
                    if (coords.length !== 8) {
                        throw new Error("coords.length must be 8");
                    }
                    this.coords_ = coords;
                    this.uom_ = uom;
                    this.modified_ = false;
                }
                Geometric3.prototype.isLocked = function () {
                    return this.lock_ !== UNLOCKED;
                };
                Geometric3.prototype.lock = function () {
                    if (this.lock_ !== UNLOCKED) {
                        throw new Error("already locked");
                    } else {
                        this.lock_ = Math.random();
                        return this.lock_;
                    }
                };
                Geometric3.prototype.unlock = function (token) {
                    if (this.lock_ === UNLOCKED) {
                        throw new Error("not locked");
                    } else if (this.lock_ === token) {
                        this.lock_ = UNLOCKED;
                    } else {
                        throw new Error("unlock denied");
                    }
                };
                Geometric3.prototype.setCoordinate = function (index, newValue, name) {
                    if (this.lock_ === UNLOCKED) {
                        var coords = this.coords_;
                        var previous = coords[index];
                        if (newValue !== previous) {
                            coords[index] = newValue;
                            this.modified_ = true;
                        }
                    } else {
                        throw new Error(readOnly_1.readOnly(name).message);
                    }
                };
                Object.defineProperty(Geometric3.prototype, "a", {
                    get: function () {
                        return this.coords_[COORD_SCALAR];
                    },
                    set: function (a) {
                        this.setCoordinate(COORD_SCALAR, a, 'a');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "b", {
                    get: function () {
                        return this.coords_[COORD_PSEUDO];
                    },
                    set: function (b) {
                        this.setCoordinate(COORD_PSEUDO, b, 'b');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "grades", {
                    get: function () {
                        var coords = this.coords_;
                        var α = coords[COORD_SCALAR];
                        var x = coords[COORD_X];
                        var y = coords[COORD_Y];
                        var z = coords[COORD_Z];
                        var yz = coords[COORD_YZ];
                        var zx = coords[COORD_ZX];
                        var xy = coords[COORD_XY];
                        var β = coords[COORD_PSEUDO];
                        var mask = 0x0;
                        if (α !== 0) {
                            mask += 0x1;
                        }
                        if (x !== 0 || y !== 0 || z !== 0) {
                            mask += 0x2;
                        }
                        if (yz !== 0 || zx !== 0 || xy !== 0) {
                            mask += 0x4;
                        }
                        if (β !== 0) {
                            mask += 0x8;
                        }
                        return mask;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "uom", {
                    get: function () {
                        return this.uom_;
                    },
                    set: function (uom) {
                        if (this.lock_ === UNLOCKED) {
                            this.uom_ = Unit_1.Unit.mustBeUnit('uom', uom);
                        } else {
                            throw new Error(readOnly_1.readOnly('uom').message);
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "x", {
                    get: function () {
                        return this.coords_[COORD_X];
                    },
                    set: function (x) {
                        this.setCoordinate(COORD_X, x, 'x');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "y", {
                    get: function () {
                        return this.coords_[COORD_Y];
                    },
                    set: function (y) {
                        this.setCoordinate(COORD_Y, y, 'y');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "z", {
                    get: function () {
                        return this.coords_[COORD_Z];
                    },
                    set: function (z) {
                        this.setCoordinate(COORD_Z, z, 'z');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "yz", {
                    get: function () {
                        return this.coords_[COORD_YZ];
                    },
                    set: function (yz) {
                        this.setCoordinate(COORD_YZ, yz, 'yz');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "zx", {
                    get: function () {
                        return this.coords_[COORD_ZX];
                    },
                    set: function (zx) {
                        this.setCoordinate(COORD_ZX, zx, 'zx');
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Geometric3.prototype, "xy", {
                    get: function () {
                        return this.coords_[COORD_XY];
                    },
                    set: function (xy) {
                        this.setCoordinate(COORD_XY, xy, 'xy');
                    },
                    enumerable: false,
                    configurable: true
                });
                Geometric3.prototype.add = function (M, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().add(M, α));
                    } else {
                        if (this.isZero()) {
                            this.a = M.a * α;
                            this.x = M.x * α;
                            this.y = M.y * α;
                            this.z = M.z * α;
                            this.yz = M.yz * α;
                            this.zx = M.zx * α;
                            this.xy = M.xy * α;
                            this.b = M.b * α;
                            this.uom = M.uom;
                            return this;
                        } else if (isZeroGeometricE3_1.default(M)) {
                            return this;
                        } else {
                            this.a += M.a * α;
                            this.x += M.x * α;
                            this.y += M.y * α;
                            this.z += M.z * α;
                            this.yz += M.yz * α;
                            this.zx += M.zx * α;
                            this.xy += M.xy * α;
                            this.b += M.b * α;
                            this.uom = Unit_1.Unit.compatible(this.uom, M.uom);
                            return this;
                        }
                    }
                };
                Geometric3.prototype.add2 = function (a, b) {
                    if (isZeroGeometricE3_1.default(a)) {
                        this.uom = b.uom;
                    } else if (isZeroGeometricE3_1.default(b)) {
                        this.uom = a.uom;
                    } else {
                        this.uom = Unit_1.Unit.compatible(a.uom, b.uom);
                    }
                    this.a = a.a + b.a;
                    this.x = a.x + b.x;
                    this.y = a.y + b.y;
                    this.z = a.z + b.z;
                    this.yz = a.yz + b.yz;
                    this.zx = a.zx + b.zx;
                    this.xy = a.xy + b.xy;
                    this.b = a.b + b.b;
                    return this;
                };
                Geometric3.prototype.addPseudo = function (β, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().addPseudo(β, uom));
                    } else {
                        if (this.isZero()) {
                            this.uom = uom;
                        } else if (β === 0) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, uom);
                        }
                        this.b += β;
                        return this;
                    }
                };
                Geometric3.prototype.addScalar = function (α, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().addScalar(α, uom));
                    } else {
                        if (this.isZero()) {
                            this.uom = uom;
                        } else if (α === 0) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, uom);
                        }
                        this.a += α;
                        return this;
                    }
                };
                Geometric3.prototype.addVector = function (v, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().addVector(v, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = v.uom;
                        } else if (isZeroVectorE3_1.default(v)) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, v.uom);
                        }
                        this.x += v.x * α;
                        this.y += v.y * α;
                        this.z += v.z * α;
                        return this;
                    }
                };
                Geometric3.prototype.angle = function () {
                    return this.log().grade(2);
                };
                Geometric3.prototype.approx = function (n) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().approx(n));
                    } else {
                        approx_1.approx(this.coords_, n);
                        return this;
                    }
                };
                Geometric3.prototype.clone = function () {
                    return Geometric3.copy(this);
                };
                Geometric3.prototype.conj = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().conj());
                    } else {
                        this.x = -this.x;
                        this.y = -this.y;
                        this.z = -this.z;
                        this.yz = -this.yz;
                        this.zx = -this.zx;
                        this.xy = -this.xy;
                        return this;
                    }
                };
                Geometric3.prototype.copyCoordinates = function (coordinates) {
                    this.a = coordinates[COORD_SCALAR];
                    this.x = coordinates[COORD_X];
                    this.y = coordinates[COORD_Y];
                    this.z = coordinates[COORD_Z];
                    this.yz = coordinates[COORD_YZ];
                    this.zx = coordinates[COORD_ZX];
                    this.xy = coordinates[COORD_XY];
                    this.b = coordinates[COORD_PSEUDO];
                    return this;
                };
                Geometric3.prototype.copy = function (M) {
                    this.a = M.a;
                    this.x = M.x;
                    this.y = M.y;
                    this.z = M.z;
                    this.yz = M.yz;
                    this.zx = M.zx;
                    this.xy = M.xy;
                    this.b = M.b;
                    this.uom = M.uom;
                    return this;
                };
                Geometric3.prototype.copyBivector = function (B) {
                    this.setCoordinate(COORD_SCALAR, 0, 'a');
                    this.setCoordinate(COORD_X, 0, 'x');
                    this.setCoordinate(COORD_Y, 0, 'y');
                    this.setCoordinate(COORD_Z, 0, 'z');
                    this.setCoordinate(COORD_YZ, B.yz, 'yz');
                    this.setCoordinate(COORD_ZX, B.zx, 'zx');
                    this.setCoordinate(COORD_XY, B.xy, 'xy');
                    this.setCoordinate(COORD_PSEUDO, 0, 'b');
                    this.uom = B.uom;
                    return this;
                };
                Geometric3.prototype.copyScalar = function (α, uom) {
                    this.setCoordinate(COORD_SCALAR, α, 'a');
                    this.setCoordinate(COORD_X, 0, 'x');
                    this.setCoordinate(COORD_Y, 0, 'y');
                    this.setCoordinate(COORD_Z, 0, 'z');
                    this.setCoordinate(COORD_YZ, 0, 'yz');
                    this.setCoordinate(COORD_ZX, 0, 'zx');
                    this.setCoordinate(COORD_XY, 0, 'xy');
                    this.setCoordinate(COORD_PSEUDO, 0, 'b');
                    this.uom = uom;
                    return this;
                };
                Geometric3.prototype.copySpinor = function (spinor) {
                    this.setCoordinate(COORD_SCALAR, spinor.a, 'a');
                    this.setCoordinate(COORD_X, 0, 'x');
                    this.setCoordinate(COORD_Y, 0, 'y');
                    this.setCoordinate(COORD_Z, 0, 'z');
                    this.setCoordinate(COORD_YZ, spinor.yz, 'yz');
                    this.setCoordinate(COORD_ZX, spinor.zx, 'zx');
                    this.setCoordinate(COORD_XY, spinor.xy, 'xy');
                    this.setCoordinate(COORD_PSEUDO, 0, 'b');
                    this.uom = spinor.uom;
                    return this;
                };
                Geometric3.prototype.copyVector = function (vector) {
                    this.setCoordinate(COORD_SCALAR, 0, 'a');
                    this.setCoordinate(COORD_X, vector.x, 'x');
                    this.setCoordinate(COORD_Y, vector.y, 'y');
                    this.setCoordinate(COORD_Z, vector.z, 'z');
                    this.setCoordinate(COORD_YZ, 0, 'yz');
                    this.setCoordinate(COORD_ZX, 0, 'zx');
                    this.setCoordinate(COORD_XY, 0, 'xy');
                    this.setCoordinate(COORD_PSEUDO, 0, 'b');
                    this.uom = vector.uom;
                    return this;
                };
                Geometric3.prototype.cross = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().cross(m));
                    } else {
                        this.ext(m);
                        this.dual(this).neg();
                        return this;
                    }
                };
                Geometric3.prototype.direction = function (mutate) {
                    if (this.lock_ !== UNLOCKED) {
                        if (!mutate) {
                            return lock(this.clone().direction(true));
                        } else {
                            throw new Error("Unable to mutate this locked Geometric3.");
                        }
                    } else {
                        if (mutate) {
                            var norm = this.magnitudeSansUnits();
                            if (norm !== 0) {
                                this.a = this.a / norm;
                                this.x = this.x / norm;
                                this.y = this.y / norm;
                                this.z = this.z / norm;
                                this.yz = this.yz / norm;
                                this.zx = this.zx / norm;
                                this.xy = this.xy / norm;
                                this.b = this.b / norm;
                            }
                            this.uom = void 0;
                            return this;
                        } else {
                            return lock(this.clone().direction(true));
                        }
                    }
                };
                Geometric3.prototype.div = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().div(m));
                    } else {
                        if (isScalarG3_1.default(m)) {
                            this.divByScalar(m.a, m.uom);
                            return this;
                        } else if (isVectorG3_1.default(m)) {
                            return this.divByVector(m);
                        } else {
                            this.uom = Unit_1.Unit.div(this.uom, m.uom);
                            var α = m.a;
                            var x = m.x;
                            var y = m.y;
                            var z = m.z;
                            var xy = m.xy;
                            var yz = m.yz;
                            var zx = m.zx;
                            var β = m.b;
                            var A = [[α, x, y, z, -xy, -yz, -zx, -β], [x, α, xy, -zx, -y, -β, z, -yz], [y, -xy, α, yz, x, -z, -β, -zx], [z, zx, -yz, α, -β, y, -x, -xy], [xy, -y, x, β, α, zx, -yz, z], [yz, β, -z, y, -zx, α, xy, x], [zx, z, β, -x, yz, -xy, α, y], [β, yz, zx, xy, z, x, y, α]];
                            var b = [1, 0, 0, 0, 0, 0, 0, 0];
                            var X = gauss_1.gauss(A, b);
                            var a0 = this.a;
                            var a1 = this.x;
                            var a2 = this.y;
                            var a3 = this.z;
                            var a4 = this.xy;
                            var a5 = this.yz;
                            var a6 = this.zx;
                            var a7 = this.b;
                            var b0 = X[0];
                            var b1 = X[1];
                            var b2 = X[2];
                            var b3 = X[3];
                            var b4 = X[4];
                            var b5 = X[5];
                            var b6 = X[6];
                            var b7 = X[7];
                            var c0 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                            var c1 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                            var c2 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                            var c3 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                            var c4 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                            var c5 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                            var c6 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                            var c7 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
                            this.a = c0;
                            this.x = c1;
                            this.y = c2;
                            this.z = c3;
                            this.xy = c4;
                            this.yz = c5;
                            this.zx = c6;
                            this.b = c7;
                        }
                        return this;
                    }
                };
                Geometric3.prototype.divByNumber = function (α) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().divByNumber(α));
                    } else {
                        this.a /= α;
                        this.x /= α;
                        this.y /= α;
                        this.z /= α;
                        this.yz /= α;
                        this.zx /= α;
                        this.xy /= α;
                        this.b /= α;
                        return this;
                    }
                };
                Geometric3.prototype.divByScalar = function (α, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().divByScalar(α, uom));
                    } else {
                        this.uom = Unit_1.Unit.div(this.uom, uom);
                        this.a /= α;
                        this.x /= α;
                        this.y /= α;
                        this.z /= α;
                        this.yz /= α;
                        this.zx /= α;
                        this.xy /= α;
                        this.b /= α;
                        return this;
                    }
                };
                Geometric3.prototype.divByVector = function (v) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().divByVector(v));
                    } else {
                        var x = v.x;
                        var y = v.y;
                        var z = v.z;
                        var uom2 = Unit_1.Unit.pow(v.uom, QQ_1.QQ.valueOf(2, 1));
                        var squaredNorm = x * x + y * y + z * z;
                        return this.mulByVector(v).divByScalar(squaredNorm, uom2);
                    }
                };
                Geometric3.prototype.div2 = function (a, b) {
                    this.uom = Unit_1.Unit.div(a.uom, b.uom);
                    var a0 = a.a;
                    var a1 = a.yz;
                    var a2 = a.zx;
                    var a3 = a.xy;
                    var b0 = b.a;
                    var b1 = b.yz;
                    var b2 = b.zx;
                    var b3 = b.xy;
                    this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
                    this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
                    this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
                    this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
                    return this;
                };
                Geometric3.prototype.dual = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().dual(m));
                    } else {
                        if (isDefined_1.default(m)) {
                            var w = -m.b;
                            var x = -m.yz;
                            var y = -m.zx;
                            var z = -m.xy;
                            var yz = m.x;
                            var zx = m.y;
                            var xy = m.z;
                            var β = m.a;
                            this.a = w;
                            this.x = x;
                            this.y = y;
                            this.z = z;
                            this.yz = yz;
                            this.zx = zx;
                            this.xy = xy;
                            this.b = β;
                            this.uom = m.uom;
                            return this;
                        } else {
                            return this.dual(this);
                        }
                    }
                };
                Geometric3.prototype.equals = function (other) {
                    if (other instanceof Geometric3) {
                        return arraysEQ_1.arraysEQ(this.coords_, other.coords_);
                    } else {
                        return false;
                    }
                };
                Geometric3.prototype.exp = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().exp());
                    } else {
                        Unit_1.Unit.assertDimensionless(this.uom);
                        var expW = Math.exp(this.a);
                        var yz = this.yz;
                        var zx = this.zx;
                        var xy = this.xy;
                        var φ = Math.sqrt(yz * yz + zx * zx + xy * xy);
                        var s = φ !== 0 ? Math.sin(φ) / φ : 1;
                        var cosφ = Math.cos(φ);
                        this.a = cosφ;
                        this.yz = yz * s;
                        this.zx = zx * s;
                        this.xy = xy * s;
                        return this.mulByNumber(expW);
                    }
                };
                Geometric3.prototype.inv = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().inv());
                    } else {
                        var α = this.a;
                        var x = this.x;
                        var y = this.y;
                        var z = this.z;
                        var xy = this.xy;
                        var yz = this.yz;
                        var zx = this.zx;
                        var β = this.b;
                        var A = [[α, x, y, z, -xy, -yz, -zx, -β], [x, α, xy, -zx, -y, -β, z, -yz], [y, -xy, α, yz, x, -z, -β, -zx], [z, zx, -yz, α, -β, y, -x, -xy], [xy, -y, x, β, α, zx, -yz, z], [yz, β, -z, y, -zx, α, xy, x], [zx, z, β, -x, yz, -xy, α, y], [β, yz, zx, xy, z, x, y, α]];
                        var b = [1, 0, 0, 0, 0, 0, 0, 0];
                        var X = gauss_1.gauss(A, b);
                        this.a = X[0];
                        this.x = X[1];
                        this.y = X[2];
                        this.z = X[3];
                        this.xy = X[4];
                        this.yz = X[5];
                        this.zx = X[6];
                        this.b = X[7];
                        this.uom = Unit_1.Unit.inv(this.uom);
                        return this;
                    }
                };
                Geometric3.prototype.isOne = function () {
                    if (Unit_1.Unit.isOne(this.uom)) {
                        return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
                    } else {
                        return false;
                    }
                };
                Geometric3.prototype.isZero = function () {
                    return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
                };
                Geometric3.prototype.lco = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().lco(m));
                    } else {
                        return this.lco2(this, m);
                    }
                };
                Geometric3.prototype.lco2 = function (a, b) {
                    return lcoG3_1.default(a, b, this);
                };
                Geometric3.prototype.lerp = function (target, α) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().lerp(target, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = target.uom;
                        } else if (isZeroGeometricE3_1.default(target)) {} else {
                            this.uom = Unit_1.Unit.compatible(this.uom, target.uom);
                        }
                        this.a += (target.a - this.a) * α;
                        this.x += (target.x - this.x) * α;
                        this.y += (target.y - this.y) * α;
                        this.z += (target.z - this.z) * α;
                        this.yz += (target.yz - this.yz) * α;
                        this.zx += (target.zx - this.zx) * α;
                        this.xy += (target.xy - this.xy) * α;
                        this.b += (target.b - this.b) * α;
                        return this;
                    }
                };
                Geometric3.prototype.lerp2 = function (a, b, α) {
                    this.copy(a).lerp(b, α);
                    return this;
                };
                Geometric3.prototype.log = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().log());
                    } else {
                        Unit_1.Unit.assertDimensionless(this.uom);
                        var α = this.a;
                        var x = this.yz;
                        var y = this.zx;
                        var z = this.xy;
                        var BB = x * x + y * y + z * z;
                        var B = Math.sqrt(BB);
                        var f = Math.atan2(B, α) / B;
                        this.a = Math.log(Math.sqrt(α * α + BB));
                        this.yz = x * f;
                        this.zx = y * f;
                        this.xy = z * f;
                        return this;
                    }
                };
                Geometric3.prototype.magnitude = function (mutate) {
                    if (this.lock_ !== UNLOCKED) {
                        if (!mutate) {
                            return lock(this.clone().magnitude(true));
                        } else {
                            throw new Error("Unable to mutate this locked Geometric3.");
                        }
                    } else {
                        if (mutate) {
                            this.a = Math.sqrt(this.squaredNormSansUnits());
                            this.x = 0;
                            this.y = 0;
                            this.z = 0;
                            this.xy = 0;
                            this.yz = 0;
                            this.zx = 0;
                            this.b = 0;
                            return this;
                        } else {
                            return lock(this.clone().magnitude(true));
                        }
                    }
                };
                Geometric3.prototype.magnitudeSansUnits = function () {
                    return Math.sqrt(this.squaredNormSansUnits());
                };
                Geometric3.prototype.mul = function (rhs) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mul(rhs));
                    } else {
                        return this.mul2(this, rhs);
                    }
                };
                Geometric3.prototype.mulByBivector = function (B) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByBivector(B));
                    } else {
                        this.uom = Unit_1.Unit.mul(this.uom, B.uom);
                        var a0 = this.a;
                        var a1 = this.x;
                        var a2 = this.y;
                        var a3 = this.z;
                        var a4 = this.xy;
                        var a5 = this.yz;
                        var a6 = this.zx;
                        var a7 = this.b;
                        var b4 = B.xy;
                        var b5 = B.yz;
                        var b6 = B.zx;
                        this.a = -a4 * b4 - a5 * b5 - a6 * b6;
                        this.x = -a2 * b4 + a3 * b6 - a7 * b5;
                        this.y = +a1 * b4 - a3 * b5 - a7 * b6;
                        this.z = -a1 * b6 + a2 * b5 - a7 * b4;
                        this.xy = a0 * b4 - a5 * b6 + a6 * b5;
                        this.yz = a0 * b5 + a4 * b6 - a6 * b4;
                        this.zx = a0 * b6 - a4 * b5 + a5 * b4;
                        this.b = +a1 * b5 + a2 * b6 + a3 * b4;
                        return this;
                    }
                };
                Geometric3.prototype.mulByVector = function (v) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByVector(v));
                    } else {
                        this.uom = Unit_1.Unit.mul(this.uom, v.uom);
                        var a0 = this.a;
                        var a1 = this.x;
                        var a2 = this.y;
                        var a3 = this.z;
                        var a4 = this.xy;
                        var a5 = this.yz;
                        var a6 = this.zx;
                        var a7 = this.b;
                        var b1 = v.x;
                        var b2 = v.y;
                        var b3 = v.z;
                        this.a = a1 * b1 + a2 * b2 + a3 * b3;
                        this.x = a0 * b1 + a4 * b2 - a6 * b3;
                        this.y = a0 * b2 - a4 * b1 + a5 * b3;
                        this.z = a0 * b3 - a5 * b2 + a6 * b1;
                        this.xy = a1 * b2 - a2 * b1 + a7 * b3;
                        this.yz = a2 * b3 - a3 * b2 + a7 * b1;
                        this.zx = -a1 * b3 + a3 * b1 + a7 * b2;
                        this.b = a4 * b3 + a5 * b1 + a6 * b2;
                        return this;
                    }
                };
                Geometric3.prototype.mul2 = function (a, b) {
                    if (this.lock_ !== UNLOCKED) {
                        throw new Error("TODO");
                    }
                    var a0 = a.a;
                    var a1 = a.x;
                    var a2 = a.y;
                    var a3 = a.z;
                    var a4 = a.xy;
                    var a5 = a.yz;
                    var a6 = a.zx;
                    var a7 = a.b;
                    var b0 = b.a;
                    var b1 = b.x;
                    var b2 = b.y;
                    var b3 = b.z;
                    var b4 = b.xy;
                    var b5 = b.yz;
                    var b6 = b.zx;
                    var b7 = b.b;
                    this.a = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                    this.x = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                    this.y = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                    this.z = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                    this.xy = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                    this.yz = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                    this.zx = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                    this.b = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
                    this.uom = Unit_1.Unit.mul(a.uom, b.uom);
                    return this;
                };
                Geometric3.prototype.neg = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().neg());
                    } else {
                        this.a = -this.a;
                        this.x = -this.x;
                        this.y = -this.y;
                        this.z = -this.z;
                        this.yz = -this.yz;
                        this.zx = -this.zx;
                        this.xy = -this.xy;
                        this.b = -this.b;
                        return this;
                    }
                };
                Geometric3.prototype.norm = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().norm());
                    } else {
                        this.a = this.magnitudeSansUnits();
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                        return this;
                    }
                };
                Geometric3.prototype.one = function () {
                    this.a = 1;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
                    this.uom = void 0;
                    return this;
                };
                Geometric3.prototype.quaditude = function (mutate) {
                    if (this.lock_ !== UNLOCKED) {
                        if (!mutate) {
                            return lock(this.clone().quaditude(true));
                        } else {
                            throw new Error("Unable to mutate this locked Geometric3.");
                        }
                    } else {
                        if (mutate) {
                            this.a = this.squaredNormSansUnits();
                            this.x = 0;
                            this.y = 0;
                            this.z = 0;
                            this.yz = 0;
                            this.zx = 0;
                            this.xy = 0;
                            this.b = 0;
                            this.uom = Unit_1.Unit.mul(this.uom, this.uom);
                            return this;
                        } else {
                            return lock(this.clone().quaditude(true));
                        }
                    }
                };
                Geometric3.prototype.rco = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().rco(m));
                    } else {
                        return this.rco2(this, m);
                    }
                };
                Geometric3.prototype.rco2 = function (a, b) {
                    return rcoG3_1.default(a, b, this);
                };
                Geometric3.prototype.squaredNorm = function (mutate) {
                    return this.quaditude(mutate);
                };
                Geometric3.prototype.squaredNormSansUnits = function () {
                    return squaredNormG3_1.default(this);
                };
                Geometric3.prototype.reflect = function (n) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().reflect(n));
                    } else {
                        Unit_1.Unit.assertDimensionless(n.uom);
                        var n1 = n.x;
                        var n2 = n.y;
                        var n3 = n.z;
                        var n11 = n1 * n1;
                        var n22 = n2 * n2;
                        var n33 = n3 * n3;
                        var nn = n11 + n22 + n33;
                        var f1 = 2 * n2 * n3;
                        var f2 = 2 * n3 * n1;
                        var f3 = 2 * n1 * n2;
                        var t1 = n22 + n33 - n11;
                        var t2 = n33 + n11 - n22;
                        var t3 = n11 + n22 - n33;
                        var cs = this.coords_;
                        var a = cs[COORD_SCALAR];
                        var x1 = cs[COORD_X];
                        var x2 = cs[COORD_Y];
                        var x3 = cs[COORD_Z];
                        var B3 = cs[COORD_XY];
                        var B1 = cs[COORD_YZ];
                        var B2 = cs[COORD_ZX];
                        var b = cs[COORD_PSEUDO];
                        this.setCoordinate(COORD_SCALAR, -nn * a, 'a');
                        this.setCoordinate(COORD_X, x1 * t1 - x2 * f3 - x3 * f2, 'x');
                        this.setCoordinate(COORD_Y, x2 * t2 - x3 * f1 - x1 * f3, 'y');
                        this.setCoordinate(COORD_Z, x3 * t3 - x1 * f2 - x2 * f1, 'z');
                        this.setCoordinate(COORD_XY, B3 * t3 - B1 * f2 - B2 * f1, 'xy');
                        this.setCoordinate(COORD_YZ, B1 * t1 - B2 * f3 - B3 * f2, 'yz');
                        this.setCoordinate(COORD_ZX, B2 * t2 - B3 * f1 - B1 * f3, 'zx');
                        this.setCoordinate(COORD_PSEUDO, -nn * b, 'b');
                        return this;
                    }
                };
                Geometric3.prototype.rev = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().rev());
                    } else {
                        this.a = +this.a;
                        this.x = +this.x;
                        this.y = +this.y;
                        this.z = +this.z;
                        this.yz = -this.yz;
                        this.zx = -this.zx;
                        this.xy = -this.xy;
                        this.b = -this.b;
                        return this;
                    }
                };
                Geometric3.prototype.rotate = function (R) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().rotate(R));
                    } else {
                        Unit_1.Unit.assertDimensionless(R.uom);
                        var x = this.x;
                        var y = this.y;
                        var z = this.z;
                        var a = R.xy;
                        var b = R.yz;
                        var c = R.zx;
                        var α = R.a;
                        var ix = α * x - c * z + a * y;
                        var iy = α * y - a * x + b * z;
                        var iz = α * z - b * y + c * x;
                        var iα = b * x + c * y + a * z;
                        this.x = ix * α + iα * b + iy * a - iz * c;
                        this.y = iy * α + iα * c + iz * b - ix * a;
                        this.z = iz * α + iα * a + ix * c - iy * b;
                        return this;
                    }
                };
                Geometric3.prototype.rotorFromAxisAngle = function (axis, θ) {
                    Unit_1.Unit.assertDimensionless(axis.uom);
                    var x = axis.x;
                    var y = axis.y;
                    var z = axis.z;
                    var squaredNorm = x * x + y * y + z * z;
                    if (squaredNorm === 1) {
                        return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z, uom: void 0 }, θ);
                    } else {
                        var norm = Math.sqrt(squaredNorm);
                        var yz = x / norm;
                        var zx = y / norm;
                        var xy = z / norm;
                        return this.rotorFromGeneratorAngle({ yz: yz, zx: zx, xy: xy, uom: void 0 }, θ);
                    }
                };
                Geometric3.prototype.rotorFromDirections = function (a, b) {
                    var B = void 0;
                    return this.rotorFromVectorToVector(a, b, B);
                };
                Geometric3.prototype.rotorFromTwoVectors = function (e1, f1, e2, f2) {
                    var R1 = Geometric3.rotorFromDirections(e1, f1);
                    var f = Geometric3.fromVector(e2).rotate(R1);
                    var B = Geometric3.dualOfVector(f1);
                    var R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
                    return this.mul2(R2, R1);
                };
                Geometric3.prototype.rotorFromFrameToFrame = function (es, fs) {
                    var biggestValue = -1;
                    var firstVector;
                    for (var i = 0; i < 3; i++) {
                        cosines[i] = cosVectorVector(es[i], fs[i]);
                        if (cosines[i] > biggestValue) {
                            firstVector = i;
                            biggestValue = cosines[i];
                        }
                    }
                    var secondVector = (firstVector + 1) % 3;
                    return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
                };
                Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
                    Unit_1.Unit.assertDimensionless(B.uom);
                    var φ = θ / 2;
                    var yz = B.yz;
                    var zx = B.zx;
                    var xy = B.xy;
                    var absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
                    var mφ = absB * φ;
                    var sinDivAbsB = Math.sin(mφ) / absB;
                    this.a = Math.cos(mφ);
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = -yz * sinDivAbsB;
                    this.zx = -zx * sinDivAbsB;
                    this.xy = -xy * sinDivAbsB;
                    this.b = 0;
                    return this;
                };
                Geometric3.prototype.rotorFromVectorToVector = function (a, b, B) {
                    rotorFromDirectionsE3_1.default(a, b, B, this);
                    return this;
                };
                Geometric3.prototype.scp = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().scp(m));
                    } else {
                        return this.scp2(this, m);
                    }
                };
                Geometric3.prototype.scp2 = function (a, b) {
                    return scpG3_1.default(a, b, this);
                };
                Geometric3.prototype.sqrt = function () {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().sqrt());
                    } else {
                        this.a = Math.sqrt(this.a);
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                        this.uom = Unit_1.Unit.sqrt(this.uom);
                        return this;
                    }
                };
                Geometric3.prototype.mulByNumber = function (α) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByNumber(α));
                    } else {
                        this.a *= α;
                        this.x *= α;
                        this.y *= α;
                        this.z *= α;
                        this.yz *= α;
                        this.zx *= α;
                        this.xy *= α;
                        this.b *= α;
                        return this;
                    }
                };
                Geometric3.prototype.mulByScalar = function (α, uom) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().mulByScalar(α, uom));
                    } else {
                        this.a *= α;
                        this.x *= α;
                        this.y *= α;
                        this.z *= α;
                        this.yz *= α;
                        this.zx *= α;
                        this.xy *= α;
                        this.b *= α;
                        this.uom = Unit_1.Unit.mul(this.uom, uom);
                        return this;
                    }
                };
                Geometric3.prototype.stress = function (σ) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().stress(σ));
                    } else {
                        this.x *= σ.x;
                        this.y *= σ.y;
                        this.z *= σ.z;
                        this.uom = Unit_1.Unit.mul(σ.uom, this.uom);
                        return this;
                    }
                };
                Geometric3.prototype.versor = function (a, b) {
                    this.uom = Unit_1.Unit.mul(a.uom, b.uom);
                    var ax = a.x;
                    var ay = a.y;
                    var az = a.z;
                    var bx = b.x;
                    var by = b.y;
                    var bz = b.z;
                    this.zero();
                    this.a = dotVectorE3_1.default(a, b);
                    this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
                    this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
                    this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
                    return this;
                };
                Geometric3.prototype.write = function (mv) {
                    mv.a = this.a;
                    mv.x = this.x;
                    mv.y = this.y;
                    mv.z = this.z;
                    mv.xy = this.xy;
                    mv.yz = this.yz;
                    mv.zx = this.zx;
                    mv.b = this.b;
                    mv.uom = this.uom;
                };
                Geometric3.prototype.writeVector = function (vector) {
                    vector.x = this.x;
                    vector.y = this.y;
                    vector.z = this.z;
                    vector.uom = this.uom;
                };
                Geometric3.prototype.sub = function (M, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().sub(M, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = M.uom;
                        } else if (isZeroGeometricE3_1.default(M)) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, M.uom);
                        }
                        this.a -= M.a * α;
                        this.x -= M.x * α;
                        this.y -= M.y * α;
                        this.z -= M.z * α;
                        this.yz -= M.yz * α;
                        this.zx -= M.zx * α;
                        this.xy -= M.xy * α;
                        this.b -= M.b * α;
                        return this;
                    }
                };
                Geometric3.prototype.subScalar = function (M, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().subScalar(M, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = M.uom;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, M.uom);
                        }
                        this.a -= M.a * α;
                        return this;
                    }
                };
                Geometric3.prototype.subVector = function (v, α) {
                    if (α === void 0) {
                        α = 1;
                    }
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().subVector(v, α));
                    } else {
                        if (this.isZero()) {
                            this.uom = v.uom;
                        } else if (isZeroVectorE3_1.default(v)) {
                            return this;
                        } else {
                            this.uom = Unit_1.Unit.compatible(this.uom, v.uom);
                        }
                        this.x -= v.x * α;
                        this.y -= v.y * α;
                        this.z -= v.z * α;
                        return this;
                    }
                };
                Geometric3.prototype.sub2 = function (a, b) {
                    if (isZeroGeometricE3_1.default(a)) {
                        this.a = -b.a;
                        this.x = -b.x;
                        this.y = -b.y;
                        this.z = -b.z;
                        this.yz = -b.yz;
                        this.zx = -b.zx;
                        this.xy = -b.xy;
                        this.b = -b.b;
                        this.uom = b.uom;
                    } else if (isZeroGeometricE3_1.default(b)) {
                        this.a = a.a;
                        this.x = a.x;
                        this.y = a.y;
                        this.z = a.z;
                        this.yz = a.yz;
                        this.zx = a.zx;
                        this.xy = a.xy;
                        this.b = a.b;
                        this.uom = a.uom;
                    } else {
                        this.a = a.a - b.a;
                        this.x = a.x - b.x;
                        this.y = a.y - b.y;
                        this.z = a.z - b.z;
                        this.yz = a.yz - b.yz;
                        this.zx = a.zx - b.zx;
                        this.xy = a.xy - b.xy;
                        this.b = a.b - b.b;
                        this.uom = Unit_1.Unit.compatible(a.uom, b.uom);
                    }
                    return this;
                };
                Geometric3.prototype.toExponential = function (fractionDigits) {
                    var coordToString = function (coord) {
                        return coord.toExponential(fractionDigits);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric3.prototype.toFixed = function (fractionDigits) {
                    var coordToString = function (coord) {
                        return coord.toFixed(fractionDigits);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric3.prototype.toPrecision = function (precision) {
                    var coordToString = function (coord) {
                        return coord.toPrecision(precision);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric3.prototype.toString = function (radix) {
                    var coordToString = function (coord) {
                        return coord.toString(radix);
                    };
                    return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
                };
                Geometric3.prototype.grade = function (n) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().grade(n));
                    } else {
                        switch (n) {
                            case 0:
                                {
                                    this.x = 0;
                                    this.y = 0;
                                    this.z = 0;
                                    this.yz = 0;
                                    this.zx = 0;
                                    this.xy = 0;
                                    this.b = 0;
                                    break;
                                }
                            case 1:
                                {
                                    this.a = 0;
                                    this.yz = 0;
                                    this.zx = 0;
                                    this.xy = 0;
                                    this.b = 0;
                                    break;
                                }
                            case 2:
                                {
                                    this.a = 0;
                                    this.x = 0;
                                    this.y = 0;
                                    this.z = 0;
                                    this.b = 0;
                                    break;
                                }
                            case 3:
                                {
                                    this.a = 0;
                                    this.x = 0;
                                    this.y = 0;
                                    this.z = 0;
                                    this.yz = 0;
                                    this.zx = 0;
                                    this.xy = 0;
                                    break;
                                }
                            default:
                                {
                                    this.a = 0;
                                    this.x = 0;
                                    this.y = 0;
                                    this.z = 0;
                                    this.yz = 0;
                                    this.zx = 0;
                                    this.xy = 0;
                                    this.b = 0;
                                }
                        }
                        return this;
                    }
                };
                Geometric3.prototype.ext = function (m) {
                    if (this.lock_ !== UNLOCKED) {
                        return lock(this.clone().ext(m));
                    } else {
                        return this.ext2(this, m);
                    }
                };
                Geometric3.prototype.ext2 = function (a, b) {
                    return extG3_1.default(a, b, this);
                };
                Geometric3.prototype.zero = function () {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
                    return this;
                };
                Geometric3.prototype.__add__ = function (rhs) {
                    var duckR = maskG3_1.maskG3(rhs);
                    if (duckR) {
                        return lock(this.clone().add(duckR));
                    } else if (isVectorE3_1.default(rhs)) {
                        return lock(this.clone().addVector(rhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__div__ = function (rhs) {
                    var duckR = maskG3_1.maskG3(rhs);
                    if (duckR) {
                        return lock(this.clone().div(duckR));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rdiv__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).div(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.scalar(lhs, void 0).div(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__mul__ = function (rhs) {
                    var duckR = maskG3_1.maskG3(rhs);
                    if (duckR) {
                        return lock(this.clone().mul(duckR));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rmul__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).mul(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.copy(this).mulByNumber(lhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__radd__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).add(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.scalar(lhs).add(this));
                    } else if (isVectorE3_1.default(lhs)) {
                        return lock(Geometric3.fromVector(lhs).add(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__sub__ = function (rhs) {
                    var duckR = maskG3_1.maskG3(rhs);
                    if (duckR) {
                        return lock(this.clone().sub(duckR));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rsub__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).sub(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.scalar(lhs).sub(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__tilde__ = function () {
                    return lock(Geometric3.copy(this).rev());
                };
                Geometric3.prototype.__wedge__ = function (rhs) {
                    if (rhs instanceof Geometric3) {
                        return lock(Geometric3.copy(this).ext(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric3.copy(this).mulByNumber(rhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rwedge__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).ext(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.copy(this).mulByNumber(lhs));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__lshift__ = function (rhs) {
                    if (rhs instanceof Geometric3) {
                        return lock(Geometric3.copy(this).lco(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rlshift__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).lco(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.scalar(lhs).lco(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rshift__ = function (rhs) {
                    if (rhs instanceof Geometric3) {
                        return lock(Geometric3.copy(this).rco(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rrshift__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).rco(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.scalar(lhs).rco(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__vbar__ = function (rhs) {
                    if (rhs instanceof Geometric3) {
                        return lock(Geometric3.copy(this).scp(rhs));
                    } else if (typeof rhs === 'number') {
                        return lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__rvbar__ = function (lhs) {
                    if (lhs instanceof Geometric3) {
                        return lock(Geometric3.copy(lhs).scp(this));
                    } else if (typeof lhs === 'number') {
                        return lock(Geometric3.scalar(lhs).scp(this));
                    } else {
                        return void 0;
                    }
                };
                Geometric3.prototype.__bang__ = function () {
                    return lock(Geometric3.copy(this).inv());
                };
                Geometric3.prototype.__pos__ = function () {
                    return lock(Geometric3.copy(this));
                };
                Geometric3.prototype.__neg__ = function () {
                    return lock(Geometric3.copy(this).neg());
                };
                Geometric3.bivector = function (yz, zx, xy, uom) {
                    return Geometric3.spinor(0, yz, zx, xy, uom);
                };
                Geometric3.copy = function (mv) {
                    return new Geometric3(coordinates(mv), mv.uom);
                };
                Geometric3.dual = function (m) {
                    return new Geometric3(zero(), m.uom).dual(m);
                };
                Geometric3.dualOfBivector = function (B) {
                    return new Geometric3(vector(-B.yz, -B.zx, -B.xy), B.uom);
                };
                Geometric3.dualOfVector = function (v) {
                    return new Geometric3(bivector(v.x, v.y, v.z), v.uom);
                };
                Geometric3.fromBivector = function (B) {
                    return new Geometric3(bivector(B.yz, B.zx, B.xy), B.uom);
                };
                Geometric3.fromScalar = function (alpha) {
                    return new Geometric3(scalar(alpha.a), alpha.uom);
                };
                Geometric3.fromSpinor = function (R) {
                    return new Geometric3(spinor(R.a, R.yz, R.zx, R.xy), R.uom);
                };
                Geometric3.fromVector = function (v) {
                    return new Geometric3(vector(v.x, v.y, v.z), v.uom);
                };
                Geometric3.lerp = function (A, B, α) {
                    return Geometric3.copy(A).lerp(B, α);
                };
                Geometric3.pseudo = function (b, uom) {
                    return new Geometric3(pseudo(b), uom);
                };
                Geometric3.random = function () {
                    var lowerBound = -1;
                    var upperBound = +1;
                    var a = randomRange_1.default(lowerBound, upperBound);
                    var x = randomRange_1.default(lowerBound, upperBound);
                    var y = randomRange_1.default(lowerBound, upperBound);
                    var z = randomRange_1.default(lowerBound, upperBound);
                    var yz = randomRange_1.default(lowerBound, upperBound);
                    var zx = randomRange_1.default(lowerBound, upperBound);
                    var xy = randomRange_1.default(lowerBound, upperBound);
                    var b = randomRange_1.default(lowerBound, upperBound);
                    return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b), void 0);
                };
                Geometric3.rotorFromDirections = function (a, b) {
                    return new Geometric3(zero(), void 0).rotorFromDirections(a, b);
                };
                Geometric3.rotorFromFrameToFrame = function (es, fs) {
                    return new Geometric3(zero(), void 0).rotorFromFrameToFrame(es, fs);
                };
                Geometric3.rotorFromVectorToVector = function (a, b, B) {
                    return new Geometric3(zero(), void 0).rotorFromVectorToVector(a, b, B);
                };
                Geometric3.scalar = function (a, uom) {
                    return new Geometric3(scalar(a), uom);
                };
                Geometric3.spinor = function (a, yz, zx, xy, uom) {
                    return new Geometric3(spinor(a, yz, zx, xy), uom);
                };
                Geometric3.vector = function (x, y, z, uom) {
                    return new Geometric3(vector(x, y, z), uom);
                };
                Geometric3.wedge = function (a, b) {
                    var ax = a.x;
                    var ay = a.y;
                    var az = a.z;
                    var bx = b.x;
                    var by = b.y;
                    var bz = b.z;
                    var yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
                    var zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
                    var xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
                    return Geometric3.spinor(0, yz, zx, xy, Unit_1.Unit.mul(a.uom, b.uom));
                };
                Geometric3.zero = lock(new Geometric3(zero(), void 0));
                Geometric3.one = lock(new Geometric3(scalar(1), void 0));
                Geometric3.e1 = lock(new Geometric3(vector(1, 0, 0), void 0));
                Geometric3.e2 = lock(new Geometric3(vector(0, 1, 0), void 0));
                Geometric3.e3 = lock(new Geometric3(vector(0, 0, 1), void 0));
                Geometric3.I = lock(new Geometric3(pseudo(1), void 0));
                Geometric3.meter = lock(new Geometric3(scalar(1), Unit_1.Unit.METER));
                Geometric3.kilogram = lock(new Geometric3(scalar(1), Unit_1.Unit.KILOGRAM));
                Geometric3.second = lock(new Geometric3(scalar(1), Unit_1.Unit.SECOND));
                Geometric3.ampere = lock(new Geometric3(scalar(1), Unit_1.Unit.AMPERE));
                Geometric3.kelvin = lock(new Geometric3(scalar(1), Unit_1.Unit.KELVIN));
                Geometric3.mole = lock(new Geometric3(scalar(1), Unit_1.Unit.MOLE));
                Geometric3.candela = lock(new Geometric3(scalar(1), Unit_1.Unit.CANDELA));
                Geometric3.coulomb = lock(new Geometric3(scalar(1), Unit_1.Unit.COULOMB));
                Geometric3.newton = lock(new Geometric3(scalar(1), Unit_1.Unit.NEWTON));
                Geometric3.joule = lock(new Geometric3(scalar(1), Unit_1.Unit.JOULE));
                return Geometric3;
            }();
            exports_1("Geometric3", Geometric3);
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

    var mustSatisfy_1, isDefined_1;
    var __moduleName = context_1 && context_1.id;
    function beDefined() {
        return "not be 'undefined'";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
        return value;
    }
    exports_1("default", mustBeDefined);
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

    var isNumber_1;
    var __moduleName = context_1 && context_1.id;
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    exports_1("default", isInteger);
    return {
        setters: [function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/checks/mustBeInteger.js", ["../checks/mustSatisfy", "../checks/isInteger"], function (exports_1, context_1) {
    "use strict";

    var mustSatisfy_1, isInteger_1;
    var __moduleName = context_1 && context_1.id;
    function beAnInteger() {
        return "be an integer";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
        return value;
    }
    exports_1("default", mustBeInteger);
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isInteger_1_1) {
            isInteger_1 = isInteger_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/AbstractMatrix.js", ["../checks/mustBeDefined", "../checks/mustBeInteger", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var mustBeDefined_1, mustBeInteger_1, Unit_1, AbstractMatrix;
    var __moduleName = context_1 && context_1.id;
    function checkElementsLength(elements, length) {
        if (elements.length !== length) {
            throw new Error("elements must have length " + length);
        }
    }
    return {
        setters: [function (mustBeDefined_1_1) {
            mustBeDefined_1 = mustBeDefined_1_1;
        }, function (mustBeInteger_1_1) {
            mustBeInteger_1 = mustBeInteger_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {
            AbstractMatrix = function () {
                function AbstractMatrix(elements, dimensions, uom) {
                    this._elements = mustBeDefined_1.default('elements', elements);
                    this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
                    this._length = dimensions * dimensions;
                    checkElementsLength(elements, this._length);
                    this.modified = false;
                    this.uom = Unit_1.Unit.mustBeUnit('uom', uom);
                }
                Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
                    get: function () {
                        return this._dimensions;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AbstractMatrix.prototype, "elements", {
                    get: function () {
                        return this._elements;
                    },
                    set: function (elements) {
                        checkElementsLength(elements, this._length);
                        this._elements = elements;
                    },
                    enumerable: false,
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
                    this.uom = source.uom;
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
    function det3x3(m) {
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
    exports_1("default", det3x3);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("davinci-newton/math/inv3x3.js", ["../math/det3x3"], function (exports_1, context_1) {
    "use strict";

    var det3x3_1;
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

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var AbstractMatrix_1, inv3x3_1, mul3x3_1, Matrix3;
    var __moduleName = context_1 && context_1.id;
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
                function Matrix3(elements, uom) {
                    return _super.call(this, elements, 3, uom) || this;
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
        }
    };
});
System.register("davinci-newton/checks/mustBeNumber.js", ["../checks/mustSatisfy", "../checks/isNumber"], function (exports_1, context_1) {
    "use strict";

    var mustSatisfy_1, isNumber_1;
    var __moduleName = context_1 && context_1.id;
    function beANumber() {
        return "be a `number`";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
        return value;
    }
    exports_1("default", default_1);
    return {
        setters: [function (mustSatisfy_1_1) {
            mustSatisfy_1 = mustSatisfy_1_1;
        }, function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/Scalar3.js", [], function (exports_1, context_1) {
    "use strict";

    var Scalar3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Scalar3 = function () {
                function Scalar3(a, uom) {
                    this.a_ = a;
                    this.uom_ = uom;
                }
                Object.defineProperty(Scalar3.prototype, "a", {
                    get: function () {
                        return this.a_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Scalar3.prototype, "uom", {
                    get: function () {
                        return this.uom_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Scalar3.prototype.mulByNumber = function (alpha) {
                    return new Scalar3(alpha * this.a, this.uom);
                };
                return Scalar3;
            }();
            exports_1("Scalar3", Scalar3);
            exports_1("default", Scalar3);
        }
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
System.register("davinci-newton/math/QQ.js", [], function (exports_1, context_1) {
    "use strict";

    var QQ;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            QQ = function () {
                function QQ(n, d) {
                    var g;
                    var gcd = function (a, b) {
                        var temp;
                        if (a < 0) {
                            a = -a;
                        }
                        if (b < 0) {
                            b = -b;
                        }
                        if (b > a) {
                            temp = a;
                            a = b;
                            b = temp;
                        }
                        while (true) {
                            a %= b;
                            if (a === 0) {
                                return b;
                            }
                            b %= a;
                            if (b === 0) {
                                return a;
                            }
                        }
                    };
                    if (d === 0) {
                        throw new Error("denominator must not be zero");
                    }
                    if (n === 0) {
                        g = 1;
                    } else {
                        g = gcd(Math.abs(n), Math.abs(d));
                    }
                    if (d < 0) {
                        n = -n;
                        d = -d;
                    }
                    this.numer_ = n / g;
                    this.denom_ = d / g;
                }
                Object.defineProperty(QQ.prototype, "numer", {
                    get: function () {
                        return this.numer_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(QQ.prototype, "denom", {
                    get: function () {
                        return this.denom_;
                    },
                    enumerable: false,
                    configurable: true
                });
                QQ.prototype.add = function (rhs) {
                    return QQ.valueOf(this.numer_ * rhs.denom_ + this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
                };
                QQ.prototype.sub = function (rhs) {
                    return QQ.valueOf(this.numer_ * rhs.denom_ - this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
                };
                QQ.prototype.mul = function (rhs) {
                    return QQ.valueOf(this.numer_ * rhs.numer_, this.denom_ * rhs.denom_);
                };
                QQ.prototype.div = function (rhs) {
                    var numer = this.numer_ * rhs.denom_;
                    var denom = this.denom_ * rhs.numer_;
                    if (numer === 0) {
                        if (denom === 0) {
                            return QQ.valueOf(numer, denom);
                        } else {
                            return QQ.ZERO;
                        }
                    } else {
                        if (denom === 0) {
                            return QQ.valueOf(numer, denom);
                        } else {
                            return QQ.valueOf(numer, denom);
                        }
                    }
                };
                QQ.prototype.isOne = function () {
                    return this.numer_ === 1 && this.denom_ === 1;
                };
                QQ.prototype.isZero = function () {
                    return this.numer_ === 0 && this.denom_ === 1;
                };
                QQ.prototype.hashCode = function () {
                    return 37 * this.numer_ + 13 * this.denom_;
                };
                QQ.prototype.inv = function () {
                    return QQ.valueOf(this.denom_, this.numer_);
                };
                QQ.prototype.neg = function () {
                    return QQ.valueOf(-this.numer_, this.denom_);
                };
                QQ.prototype.equals = function (other) {
                    if (this === other) {
                        return true;
                    } else if (other instanceof QQ) {
                        return this.numer_ * other.denom_ === this.denom_ * other.numer_;
                    } else {
                        return false;
                    }
                };
                QQ.prototype.toString = function (radix) {
                    return "" + this.numer_.toString(radix) + "/" + this.denom_.toString(radix) + "";
                };
                QQ.prototype.__add__ = function (rhs) {
                    if (rhs instanceof QQ) {
                        return this.add(rhs);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__radd__ = function (lhs) {
                    if (lhs instanceof QQ) {
                        return lhs.add(this);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__sub__ = function (rhs) {
                    if (rhs instanceof QQ) {
                        return this.sub(rhs);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__rsub__ = function (lhs) {
                    if (lhs instanceof QQ) {
                        return lhs.sub(this);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__mul__ = function (rhs) {
                    if (rhs instanceof QQ) {
                        return this.mul(rhs);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__rmul__ = function (lhs) {
                    if (lhs instanceof QQ) {
                        return lhs.mul(this);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__div__ = function (rhs) {
                    if (rhs instanceof QQ) {
                        return this.div(rhs);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__rdiv__ = function (lhs) {
                    if (lhs instanceof QQ) {
                        return lhs.div(this);
                    } else {
                        return void 0;
                    }
                };
                QQ.prototype.__pos__ = function () {
                    return this;
                };
                QQ.prototype.__neg__ = function () {
                    return this.neg();
                };
                QQ.valueOf = function (n, d) {
                    if (n === 0) {
                        if (d !== 0) {
                            return QQ.ZERO;
                        } else {}
                    } else if (d === 0) {} else if (n === d) {
                        return QQ.ONE;
                    } else if (n === 1) {
                        if (d === 2) {
                            return QQ.POS_01_02;
                        } else if (d === 3) {
                            return QQ.POS_01_03;
                        } else if (d === 4) {
                            return QQ.POS_01_04;
                        } else if (d === 5) {
                            return QQ.POS_01_05;
                        } else if (d === -3) {
                            return QQ.NEG_01_03;
                        }
                    } else if (n === -1) {
                        if (d === 1) {
                            return QQ.NEG_01_01;
                        } else if (d === 3) {
                            return QQ.NEG_01_03;
                        }
                    } else if (n === 2) {
                        if (d === 1) {
                            return QQ.POS_02_01;
                        } else if (d === 3) {
                            return QQ.POS_02_03;
                        }
                    } else if (n === -2) {
                        if (d === 1) {
                            return QQ.NEG_02_01;
                        }
                    } else if (n === 3) {
                        if (d === 1) {
                            return QQ.POS_03_01;
                        }
                    } else if (n === -3) {
                        if (d === 1) {
                            return QQ.NEG_03_01;
                        }
                    } else if (n === 4) {
                        if (d === 1) {
                            return QQ.POS_04_01;
                        }
                    } else if (n === 5) {
                        if (d === 1) {
                            return QQ.POS_05_01;
                        }
                    } else if (n === 6) {
                        if (d === 1) {
                            return QQ.POS_06_01;
                        }
                    } else if (n === 7) {
                        if (d === 1) {
                            return QQ.POS_07_01;
                        }
                    } else if (n === 8) {
                        if (d === 1) {
                            return QQ.POS_08_01;
                        }
                    }
                    return new QQ(n, d);
                };
                QQ.POS_08_01 = new QQ(8, 1);
                QQ.POS_07_01 = new QQ(7, 1);
                QQ.POS_06_01 = new QQ(6, 1);
                QQ.POS_05_01 = new QQ(5, 1);
                QQ.POS_04_01 = new QQ(4, 1);
                QQ.POS_03_01 = new QQ(3, 1);
                QQ.POS_02_01 = new QQ(2, 1);
                QQ.ONE = new QQ(1, 1);
                QQ.POS_01_02 = new QQ(1, 2);
                QQ.POS_01_03 = new QQ(1, 3);
                QQ.POS_01_04 = new QQ(1, 4);
                QQ.POS_01_05 = new QQ(1, 5);
                QQ.ZERO = new QQ(0, 1);
                QQ.NEG_01_03 = new QQ(-1, 3);
                QQ.NEG_01_01 = new QQ(-1, 1);
                QQ.NEG_02_01 = new QQ(-2, 1);
                QQ.NEG_03_01 = new QQ(-3, 1);
                QQ.POS_02_03 = new QQ(2, 3);
                return QQ;
            }();
            exports_1("QQ", QQ);
        }
    };
});
System.register("davinci-newton/math/detectDimensions.js", ["./DimensionsSummary"], function (exports_1, context_1) {
    "use strict";

    var DimensionsSummary_1;
    var __moduleName = context_1 && context_1.id;
    function detectDimensions(M, L, T, Q, temperature, amount, intensity) {
        if (M.numer === -1) {
            if (M.denom === 1) {
                if (L.numer === -2) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === -1) {
                    if (L.denom === 1) {
                        if (T.numer === 2) {
                            if (T.denom === 1) {
                                if (Q.numer === 2) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ELECTRIC_PERMITTIVITY_TIMES_AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INV_MASS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (M.numer === 0) {
            if (M.denom === 1) {
                if (L.numer === -1) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INV_LENGTH;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INV_TIME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (Q.numer === 1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ELECTRIC_CURRENT;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ONE;
                                                            }
                                                        } else if (intensity.numer === 1) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.LUMINOUS_INTENSITY;
                                                            }
                                                        }
                                                    }
                                                } else if (amount.numer === 1) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.AMOUNT_OF_SUBSTANCE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else if (temperature.numer === 1) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.THERMODYNAMIC_TEMPERATURE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (Q.numer === 1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ELECTRIC_CHARGE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === 1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.TIME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === 2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.TIME_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === 1) {
                    if (L.denom === 1) {
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.VELOCITY;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.LENGTH;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.VELOCITY_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === 3) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.VOLUME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (M.numer === 1) {
            if (M.denom === 1) {
                if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.STIFFNESS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MASS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === 1) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === -1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ELECTRIC_FIELD;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.FORCE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MOMENTUM;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ENERGY_OR_TORQUE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ANGULAR_MOMENTUM;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MOMENT_OF_INERTIA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (M.numer === 2) {
            if (M.denom === 1) {
                if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MOMENTUM_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return void 0;
    }
    exports_1("default", detectDimensions);
    return {
        setters: [function (DimensionsSummary_1_1) {
            DimensionsSummary_1 = DimensionsSummary_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/math/Dimensions.js", ["../math/QQ", "./detectDimensions", "./DimensionsSummary"], function (exports_1, context_1) {
    "use strict";

    var QQ_1, detectDimensions_1, DimensionsSummary_1, R0, R1, R2, R3, M1, M2, dimsChecking, Dimensions;
    var __moduleName = context_1 && context_1.id;
    function assertArgRational(name, arg) {
        if (arg instanceof QQ_1.QQ) {
            return arg;
        } else {
            throw new Error("Argument " + name + " => " + arg + " must be a QQ");
        }
    }
    function setDimensionsChecking(mode) {
        switch (mode) {
            case 'strict':
            case 'none':
                {
                    dimsChecking = mode;
                    break;
                }
            default:
                {
                    throw new Error("mode must be 'none' or 'strict'.");
                }
        }
    }
    exports_1("setDimensionsChecking", setDimensionsChecking);
    function getDimensionsChecking() {
        return dimsChecking;
    }
    exports_1("getDimensionsChecking", getDimensionsChecking);
    return {
        setters: [function (QQ_1_1) {
            QQ_1 = QQ_1_1;
        }, function (detectDimensions_1_1) {
            detectDimensions_1 = detectDimensions_1_1;
        }, function (DimensionsSummary_1_1) {
            DimensionsSummary_1 = DimensionsSummary_1_1;
        }],
        execute: function () {
            R0 = QQ_1.QQ.valueOf(0, 1);
            R1 = QQ_1.QQ.valueOf(1, 1);
            R2 = QQ_1.QQ.valueOf(2, 1);
            R3 = QQ_1.QQ.valueOf(3, 1);
            M1 = QQ_1.QQ.valueOf(-1, 1);
            M2 = QQ_1.QQ.valueOf(-2, 1);
            dimsChecking = 'strict';
            Dimensions = function () {
                function Dimensions(M, L, T, Q, temperature, amount, intensity, summary) {
                    this.M = assertArgRational('M', M);
                    this.L = assertArgRational('L', L);
                    this.T = assertArgRational('T', T);
                    this.Q = assertArgRational('Q', Q);
                    this.temperature = assertArgRational('temperature', temperature);
                    this.amount = assertArgRational('amount', amount);
                    this.intensity = assertArgRational('intensity', intensity);
                    this.summary_ = summary;
                }
                Object.defineProperty(Dimensions.prototype, "summary", {
                    get: function () {
                        return this.summary_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Dimensions.prototype.compatible = function (rhs) {
                    if (typeof this.summary_ === 'number' && this.summary_ === rhs.summary_) {
                        return this;
                    } else if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                        return this;
                    } else {
                        if (this.isOne()) {
                            if (rhs.isOne()) {
                                throw new Error();
                            } else {
                                var msg = "Dimensions must be equal (dimensionless, " + rhs + ")";
                                switch (dimsChecking) {
                                    case 'none':
                                        {
                                            return rhs;
                                        }
                                    default:
                                        {
                                            throw new Error(msg);
                                        }
                                }
                            }
                        } else {
                            if (rhs.isOne()) {
                                var msg = "Dimensions must be equal (" + this + ", dimensionless)";
                                switch (dimsChecking) {
                                    case 'none':
                                        {
                                            return this;
                                        }
                                    default:
                                        {
                                            throw new Error(msg);
                                        }
                                }
                            } else {
                                var msg = "Dimensions must be equal (" + this + ", " + rhs + ")";
                                switch (dimsChecking) {
                                    case 'none':
                                        {
                                            return this;
                                        }
                                    default:
                                        {
                                            throw new Error(msg);
                                        }
                                }
                            }
                        }
                    }
                };
                Dimensions.prototype.equals = function (rhs) {
                    if (this === rhs) {
                        return true;
                    } else {
                        return this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity);
                    }
                };
                Dimensions.prototype.mul = function (rhs) {
                    return Dimensions.valueOf(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
                };
                Dimensions.prototype.div = function (rhs) {
                    return Dimensions.valueOf(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
                };
                Dimensions.prototype.pow = function (exponent) {
                    return Dimensions.valueOf(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
                };
                Dimensions.prototype.sqrt = function () {
                    return Dimensions.valueOf(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
                };
                Dimensions.prototype.isOne = function () {
                    if (this === Dimensions.ONE) {
                        return true;
                    } else {
                        return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
                    }
                };
                Dimensions.prototype.inv = function () {
                    return Dimensions.valueOf(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
                };
                Dimensions.prototype.toString = function () {
                    var stringify = function (rational, label) {
                        if (rational.numer === 0) {
                            return null;
                        } else if (rational.denom === 1) {
                            if (rational.numer === 1) {
                                return "" + label;
                            } else {
                                return "" + label + " ** " + rational.numer;
                            }
                        }
                        return "" + label + " ** " + rational;
                    };
                    return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
                        return typeof x === 'string';
                    }).join(" * ");
                };
                Dimensions.prototype.__add__ = function (rhs) {
                    if (rhs instanceof Dimensions) {
                        return this.compatible(rhs);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__radd__ = function (lhs) {
                    if (lhs instanceof Dimensions) {
                        return lhs.compatible(this);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__sub__ = function (rhs) {
                    if (rhs instanceof Dimensions) {
                        return this.compatible(rhs);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__rsub__ = function (lhs) {
                    if (lhs instanceof Dimensions) {
                        return lhs.compatible(this);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__mul__ = function (rhs) {
                    if (rhs instanceof Dimensions) {
                        return this.mul(rhs);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__rmul__ = function (lhs) {
                    if (lhs instanceof Dimensions) {
                        return lhs.mul(this);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__div__ = function (rhs) {
                    if (rhs instanceof Dimensions) {
                        return this.div(rhs);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__rdiv__ = function (lhs) {
                    if (lhs instanceof Dimensions) {
                        return lhs.div(this);
                    } else {
                        return void 0;
                    }
                };
                Dimensions.prototype.__pos__ = function () {
                    return this;
                };
                Dimensions.prototype.__neg__ = function () {
                    return this;
                };
                Dimensions.valueOf = function (M, L, T, Q, temperature, amount, intensity) {
                    var summary = detectDimensions_1.default(M, L, T, Q, temperature, amount, intensity);
                    switch (summary) {
                        case DimensionsSummary_1.default.AMOUNT_OF_SUBSTANCE:
                            return Dimensions.AMOUNT_OF_SUBSTANCE;
                        case DimensionsSummary_1.default.ANGULAR_MOMENTUM:
                            return Dimensions.ANGULAR_MOMENTUM;
                        case DimensionsSummary_1.default.AREA:
                            return Dimensions.AREA;
                        case DimensionsSummary_1.default.ELECTRIC_CHARGE:
                            return Dimensions.ELECTRIC_CHARGE;
                        case DimensionsSummary_1.default.ELECTRIC_CURRENT:
                            return Dimensions.ELECTRIC_CURRENT;
                        case DimensionsSummary_1.default.ELECTRIC_FIELD:
                            return Dimensions.ELECTRIC_FIELD;
                        case DimensionsSummary_1.default.ELECTRIC_PERMITTIVITY_TIMES_AREA:
                            return Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA;
                        case DimensionsSummary_1.default.ENERGY_OR_TORQUE:
                            return Dimensions.ENERGY_OR_TORQUE;
                        case DimensionsSummary_1.default.FORCE:
                            return Dimensions.FORCE;
                        case DimensionsSummary_1.default.LUMINOUS_INTENSITY:
                            return Dimensions.LUMINOUS_INTENSITY;
                        case DimensionsSummary_1.default.INV_LENGTH:
                            return Dimensions.INV_LENGTH;
                        case DimensionsSummary_1.default.INV_MASS:
                            return Dimensions.INV_MASS;
                        case DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA:
                            return Dimensions.INV_MOMENT_OF_INERTIA;
                        case DimensionsSummary_1.default.INV_TIME:
                            return Dimensions.INV_TIME;
                        case DimensionsSummary_1.default.LENGTH:
                            return Dimensions.LENGTH;
                        case DimensionsSummary_1.default.MASS:
                            return Dimensions.MASS;
                        case DimensionsSummary_1.default.MOMENT_OF_INERTIA:
                            return Dimensions.MOMENT_OF_INERTIA;
                        case DimensionsSummary_1.default.MOMENTUM:
                            return Dimensions.MOMENTUM;
                        case DimensionsSummary_1.default.MOMENTUM_SQUARED:
                            return Dimensions.MOMENTUM_SQUARED;
                        case DimensionsSummary_1.default.ONE:
                            return Dimensions.ONE;
                        case DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA:
                            return Dimensions.RATE_OF_CHANGE_OF_AREA;
                        case DimensionsSummary_1.default.STIFFNESS:
                            return Dimensions.STIFFNESS;
                        case DimensionsSummary_1.default.THERMODYNAMIC_TEMPERATURE:
                            return Dimensions.THERMODYNAMIC_TEMPERATURE;
                        case DimensionsSummary_1.default.TIME:
                            return Dimensions.TIME;
                        case DimensionsSummary_1.default.TIME_SQUARED:
                            return Dimensions.TIME_SQUARED;
                        case DimensionsSummary_1.default.VELOCITY:
                            return Dimensions.VELOCITY;
                        case DimensionsSummary_1.default.VELOCITY_SQUARED:
                            return Dimensions.VELOCITY_SQUARED;
                        default:
                            {
                                return new Dimensions(M, L, T, Q, temperature, amount, intensity, summary);
                            }
                    }
                };
                Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0, DimensionsSummary_1.default.ONE);
                Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0, DimensionsSummary_1.default.MASS);
                Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0, DimensionsSummary_1.default.LENGTH);
                Dimensions.AREA = new Dimensions(R0, R2, R0, R0, R0, R0, R0, DimensionsSummary_1.default.AREA);
                Dimensions.VOLUME = new Dimensions(R0, R3, R0, R0, R0, R0, R0, DimensionsSummary_1.default.VOLUME);
                Dimensions.INV_LENGTH = new Dimensions(R0, M1, R0, R0, R0, R0, R0, DimensionsSummary_1.default.INV_LENGTH);
                Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0, DimensionsSummary_1.default.TIME);
                Dimensions.ELECTRIC_CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0, DimensionsSummary_1.default.ELECTRIC_CHARGE);
                Dimensions.ELECTRIC_CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0, DimensionsSummary_1.default.ELECTRIC_CURRENT);
                Dimensions.THERMODYNAMIC_TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0, DimensionsSummary_1.default.THERMODYNAMIC_TEMPERATURE);
                Dimensions.AMOUNT_OF_SUBSTANCE = new Dimensions(R0, R0, R0, R0, R0, R1, R0, DimensionsSummary_1.default.AMOUNT_OF_SUBSTANCE);
                Dimensions.LUMINOUS_INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1, DimensionsSummary_1.default.LUMINOUS_INTENSITY);
                Dimensions.ANGULAR_MOMENTUM = new Dimensions(R1, R2, M1, R0, R0, R0, R0, DimensionsSummary_1.default.ANGULAR_MOMENTUM);
                Dimensions.RATE_OF_CHANGE_OF_AREA = new Dimensions(R0, R2, M1, R0, R0, R0, R0, DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA);
                Dimensions.ELECTRIC_FIELD = new Dimensions(R1, R1, M2, M1, R0, R0, R0, DimensionsSummary_1.default.ELECTRIC_FIELD);
                Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA = new Dimensions(M1, M1, R2, R2, R0, R0, R0, DimensionsSummary_1.default.ELECTRIC_PERMITTIVITY_TIMES_AREA);
                Dimensions.ENERGY_OR_TORQUE = new Dimensions(R1, R2, M2, R0, R0, R0, R0, DimensionsSummary_1.default.ENERGY_OR_TORQUE);
                Dimensions.FORCE = new Dimensions(R1, R1, M2, R0, R0, R0, R0, DimensionsSummary_1.default.FORCE);
                Dimensions.INV_MASS = new Dimensions(M1, R0, R0, R0, R0, R0, R0, DimensionsSummary_1.default.INV_MASS);
                Dimensions.INV_MOMENT_OF_INERTIA = new Dimensions(M1, M2, R0, R0, R0, R0, R0, DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA);
                Dimensions.INV_TIME = new Dimensions(R0, R0, M1, R0, R0, R0, R0, DimensionsSummary_1.default.INV_TIME);
                Dimensions.MOMENT_OF_INERTIA = new Dimensions(R1, R2, R0, R0, R0, R0, R0, DimensionsSummary_1.default.MOMENT_OF_INERTIA);
                Dimensions.MOMENTUM = new Dimensions(R1, R1, M1, R0, R0, R0, R0, DimensionsSummary_1.default.MOMENTUM);
                Dimensions.MOMENTUM_SQUARED = new Dimensions(R2, R2, M2, R0, R0, R0, R0, DimensionsSummary_1.default.MOMENTUM_SQUARED);
                Dimensions.STIFFNESS = new Dimensions(R1, R0, M2, R0, R0, R0, R0, DimensionsSummary_1.default.STIFFNESS);
                Dimensions.TIME_SQUARED = new Dimensions(R0, R0, R2, R0, R0, R0, R0, DimensionsSummary_1.default.TIME_SQUARED);
                Dimensions.VELOCITY = new Dimensions(R0, R1, M1, R0, R0, R0, R0, DimensionsSummary_1.default.VELOCITY);
                Dimensions.VELOCITY_SQUARED = new Dimensions(R0, R2, M2, R0, R0, R0, R0, DimensionsSummary_1.default.VELOCITY_SQUARED);
                return Dimensions;
            }();
            exports_1("Dimensions", Dimensions);
        }
    };
});
System.register("davinci-newton/math/DimensionsSummary.js", [], function (exports_1, context_1) {
    "use strict";

    var DimensionsSummary;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (DimensionsSummary) {
                DimensionsSummary[DimensionsSummary["AMOUNT_OF_SUBSTANCE"] = 0] = "AMOUNT_OF_SUBSTANCE";
                DimensionsSummary[DimensionsSummary["ANGULAR_MOMENTUM"] = 1] = "ANGULAR_MOMENTUM";
                DimensionsSummary[DimensionsSummary["AREA"] = 2] = "AREA";
                DimensionsSummary[DimensionsSummary["ELECTRIC_CHARGE"] = 3] = "ELECTRIC_CHARGE";
                DimensionsSummary[DimensionsSummary["ELECTRIC_CURRENT"] = 4] = "ELECTRIC_CURRENT";
                DimensionsSummary[DimensionsSummary["ELECTRIC_FIELD"] = 5] = "ELECTRIC_FIELD";
                DimensionsSummary[DimensionsSummary["ELECTRIC_PERMITTIVITY_TIMES_AREA"] = 6] = "ELECTRIC_PERMITTIVITY_TIMES_AREA";
                DimensionsSummary[DimensionsSummary["ENERGY_OR_TORQUE"] = 7] = "ENERGY_OR_TORQUE";
                DimensionsSummary[DimensionsSummary["FORCE"] = 8] = "FORCE";
                DimensionsSummary[DimensionsSummary["LUMINOUS_INTENSITY"] = 9] = "LUMINOUS_INTENSITY";
                DimensionsSummary[DimensionsSummary["INV_LENGTH"] = 10] = "INV_LENGTH";
                DimensionsSummary[DimensionsSummary["INV_MOMENT_OF_INERTIA"] = 11] = "INV_MOMENT_OF_INERTIA";
                DimensionsSummary[DimensionsSummary["INV_MASS"] = 12] = "INV_MASS";
                DimensionsSummary[DimensionsSummary["INV_TIME"] = 13] = "INV_TIME";
                DimensionsSummary[DimensionsSummary["LENGTH"] = 14] = "LENGTH";
                DimensionsSummary[DimensionsSummary["MASS"] = 15] = "MASS";
                DimensionsSummary[DimensionsSummary["MOMENT_OF_INERTIA"] = 16] = "MOMENT_OF_INERTIA";
                DimensionsSummary[DimensionsSummary["MOMENTUM"] = 17] = "MOMENTUM";
                DimensionsSummary[DimensionsSummary["MOMENTUM_SQUARED"] = 18] = "MOMENTUM_SQUARED";
                DimensionsSummary[DimensionsSummary["ONE"] = 19] = "ONE";
                DimensionsSummary[DimensionsSummary["RATE_OF_CHANGE_OF_AREA"] = 20] = "RATE_OF_CHANGE_OF_AREA";
                DimensionsSummary[DimensionsSummary["STIFFNESS"] = 21] = "STIFFNESS";
                DimensionsSummary[DimensionsSummary["TIME"] = 22] = "TIME";
                DimensionsSummary[DimensionsSummary["TIME_SQUARED"] = 23] = "TIME_SQUARED";
                DimensionsSummary[DimensionsSummary["THERMODYNAMIC_TEMPERATURE"] = 24] = "THERMODYNAMIC_TEMPERATURE";
                DimensionsSummary[DimensionsSummary["VELOCITY"] = 25] = "VELOCITY";
                DimensionsSummary[DimensionsSummary["VELOCITY_SQUARED"] = 26] = "VELOCITY_SQUARED";
                DimensionsSummary[DimensionsSummary["VOLUME"] = 27] = "VOLUME";
            })(DimensionsSummary || (DimensionsSummary = {}));
            exports_1("DimensionsSummary", DimensionsSummary);
            exports_1("default", DimensionsSummary);
        }
    };
});
System.register("davinci-newton/math/Unit.js", ["../checks/isUndefined", "../math/Dimensions", "../math/DimensionsSummary"], function (exports_1, context_1) {
    "use strict";

    var isUndefined_1, Dimensions_1, DimensionsSummary_1, SYMBOLS_SI, patterns, decodes, dumbString, unitString, Unit;
    var __moduleName = context_1 && context_1.id;
    function add(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function sub(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function mul(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    function scale(α, unit) {
        return Unit.valueOf(α * unit.multiplier, unit.dimensions, unit.labels);
    }
    function div(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
    }
    return {
        setters: [function (isUndefined_1_1) {
            isUndefined_1 = isUndefined_1_1;
        }, function (Dimensions_1_1) {
            Dimensions_1 = Dimensions_1_1;
        }, function (DimensionsSummary_1_1) {
            DimensionsSummary_1 = DimensionsSummary_1_1;
        }],
        execute: function () {
            SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];
            patterns = [[-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, -1, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1], [-1, 1, +3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1], [+0, 1, -2, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1], [+0, 1, -1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1], [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1], [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1], [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1], [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 3, 1, -2, 1, -2, 1, 0, 1, 0, 1, 0, 1]];
            decodes = [["F/m or C**2/N·m**2"], ["S or A/V"], ["F or C/V"], ["C**2/N"], ["C/kg"], ["N·m·m/kg·kg"], ["C/m**3"], ["C/m**2"], ["C/m"], ["J/kg"], ["Hz"], ["A"], ["m/s**2"], ["m/s"], ["kg·m/s"], ["Pa or N/m**2 or J/m**3"], ["Pa·s"], ["W/m**2"], ["N/m"], ["T or Wb/m**2"], ["W/(m·K)"], ["V/m or N/C"], ["N"], ["H/m"], ["J/K"], ["J/(kg·K)"], ["J/(mol·K)"], ["J/mol"], ["J or N·m"], ["J·s"], ["W or J/s"], ["V or W/A"], ["Ω or V/A"], ["H or Wb/A"], ["Wb"], ["N·m**2/C**2"]];
            dumbString = function (multiplier, formatted, dimensions, labels, compact) {
                var stringify = function (rational, label) {
                    if (rational.numer === 0) {
                        return null;
                    } else if (rational.denom === 1) {
                        if (rational.numer === 1) {
                            if (compact) {
                                return label;
                            } else {
                                return label;
                            }
                        } else {
                            return label + "**" + rational.numer;
                        }
                    } else {
                        return label + "**" + rational;
                    }
                };
                var operatorStr = multiplier === 1 || dimensions.isOne() ? compact ? "" : " " : " ";
                var scaleString = multiplier === 1 ? compact ? "" : formatted : formatted;
                var unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
                    return typeof x === 'string';
                }).join(" ");
                return "" + scaleString + operatorStr + unitsString;
            };
            unitString = function (multiplier, formatted, dimensions, labels, compact) {
                var M = dimensions.M;
                var L = dimensions.L;
                var T = dimensions.T;
                var Q = dimensions.Q;
                var temperature = dimensions.temperature;
                var amount = dimensions.amount;
                var intensity = dimensions.intensity;
                for (var i = 0, len = patterns.length; i < len; i++) {
                    var pattern = patterns[i];
                    if (M.numer === pattern[0] && M.denom === pattern[1] && L.numer === pattern[2] && L.denom === pattern[3] && T.numer === pattern[4] && T.denom === pattern[5] && Q.numer === pattern[6] && Q.denom === pattern[7] && temperature.numer === pattern[8] && temperature.denom === pattern[9] && amount.numer === pattern[10] && amount.denom === pattern[11] && intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
                        if (!compact) {
                            return multiplier + " * " + decodes[i][0];
                        } else {
                            if (multiplier !== 1) {
                                return multiplier + " * " + decodes[i][0];
                            } else {
                                return decodes[i][0];
                            }
                        }
                    }
                }
                return dumbString(multiplier, formatted, dimensions, labels, compact);
            };
            Unit = function () {
                function Unit(multiplier, dimensions, labels) {
                    this.multiplier = multiplier;
                    this.dimensions = dimensions;
                    this.labels = labels;
                    if (labels.length !== 7) {
                        throw new Error("Expecting 7 elements in the labels array.");
                    }
                    this.multiplier = multiplier;
                    this.dimensions = dimensions;
                    this.labels = labels;
                }
                Unit.prototype.compatible = function (rhs) {
                    if (rhs instanceof Unit) {
                        this.dimensions.compatible(rhs.dimensions);
                        return this;
                    } else {
                        throw new Error("Illegal Argument for Unit.compatible: " + rhs);
                    }
                };
                Unit.prototype.isCompatible = function (rhs) {
                    if (rhs instanceof Unit) {
                        return this.dimensions.equals(rhs.dimensions);
                    } else {
                        throw new Error("Illegal Argument for Unit.compatible: " + rhs);
                    }
                };
                Unit.prototype.__add__ = function (rhs) {
                    if (rhs instanceof Unit) {
                        return add(this, rhs);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.__radd__ = function (lhs) {
                    if (lhs instanceof Unit) {
                        return add(lhs, this);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.__sub__ = function (rhs) {
                    if (rhs instanceof Unit) {
                        return sub(this, rhs);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.__rsub__ = function (lhs) {
                    if (lhs instanceof Unit) {
                        return sub(lhs, this);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.mul = function (rhs) {
                    return mul(this, rhs);
                };
                Unit.prototype.__mul__ = function (rhs) {
                    if (rhs instanceof Unit) {
                        return mul(this, rhs);
                    } else if (typeof rhs === 'number') {
                        return scale(rhs, this);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.__rmul__ = function (lhs) {
                    if (lhs instanceof Unit) {
                        return mul(lhs, this);
                    } else if (typeof lhs === 'number') {
                        return scale(lhs, this);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.div = function (rhs) {
                    return div(this, rhs);
                };
                Unit.prototype.__div__ = function (rhs) {
                    if (rhs instanceof Unit) {
                        return div(this, rhs);
                    } else if (typeof rhs === 'number') {
                        return Unit.valueOf(this.multiplier / rhs, this.dimensions, this.labels);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.__rdiv__ = function (lhs) {
                    if (lhs instanceof Unit) {
                        return div(lhs, this);
                    } else if (typeof lhs === 'number') {
                        return Unit.valueOf(lhs / this.multiplier, this.dimensions.inv(), this.labels);
                    } else {
                        return void 0;
                    }
                };
                Unit.prototype.pow = function (exponent) {
                    return Unit.valueOf(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
                };
                Unit.prototype.inv = function () {
                    return Unit.valueOf(1 / this.multiplier, this.dimensions.inv(), this.labels);
                };
                Unit.prototype.neg = function () {
                    return Unit.valueOf(-this.multiplier, this.dimensions, this.labels);
                };
                Unit.prototype.isOne = function () {
                    return this.dimensions.isOne() && this.multiplier === 1;
                };
                Unit.prototype.sqrt = function () {
                    return Unit.valueOf(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels);
                };
                Unit.prototype.toExponential = function (fractionDigits, compact) {
                    return unitString(this.multiplier, this.multiplier.toExponential(fractionDigits), this.dimensions, this.labels, compact);
                };
                Unit.prototype.toFixed = function (fractionDigits, compact) {
                    return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels, compact);
                };
                Unit.prototype.toPrecision = function (precision, compact) {
                    return unitString(this.multiplier, this.multiplier.toPrecision(precision), this.dimensions, this.labels, compact);
                };
                Unit.prototype.toString = function (radix, compact) {
                    return unitString(this.multiplier, this.multiplier.toString(radix), this.dimensions, this.labels, compact);
                };
                Unit.prototype.__pos__ = function () {
                    return this;
                };
                Unit.prototype.__neg__ = function () {
                    return this.neg();
                };
                Unit.isOne = function (uom) {
                    if (uom === void 0) {
                        return true;
                    } else if (uom instanceof Unit) {
                        return uom.isOne();
                    } else {
                        throw new Error("isOne argument must be a Unit or undefined.");
                    }
                };
                Unit.assertDimensionless = function (uom) {
                    if (!Unit.isOne(uom)) {
                        throw new Error("uom " + uom + " must be dimensionless.");
                    }
                };
                Unit.compatible = function (lhs, rhs) {
                    if (lhs) {
                        if (rhs) {
                            return lhs.compatible(rhs);
                        } else {
                            if (lhs.isOne()) {
                                return void 0;
                            } else {
                                throw new Error(lhs + " is incompatible with 1");
                            }
                        }
                    } else {
                        if (rhs) {
                            if (rhs.isOne()) {
                                return void 0;
                            } else {
                                throw new Error("1 is incompatible with " + rhs);
                            }
                        } else {
                            return void 0;
                        }
                    }
                };
                Unit.isCompatible = function (lhs, rhs) {
                    if (lhs) {
                        if (rhs) {
                            return lhs.isCompatible(rhs);
                        } else {
                            if (lhs.isOne()) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    } else {
                        if (rhs) {
                            if (rhs.isOne()) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    }
                };
                Unit.mul = function (lhs, rhs) {
                    if (lhs) {
                        if (rhs) {
                            return lhs.mul(rhs);
                        } else if (Unit.isOne(rhs)) {
                            return lhs;
                        } else {
                            return void 0;
                        }
                    } else if (Unit.isOne(lhs)) {
                        return rhs;
                    } else {
                        return void 0;
                    }
                };
                Unit.div = function (lhs, rhs) {
                    if (lhs) {
                        if (rhs) {
                            return lhs.div(rhs);
                        } else {
                            return lhs;
                        }
                    } else {
                        if (rhs) {
                            return rhs.inv();
                        } else {
                            return Unit.ONE;
                        }
                    }
                };
                Unit.inv = function (uom) {
                    if (uom instanceof Unit) {
                        if (uom.isOne()) {
                            return Unit.ONE;
                        } else {
                            return uom.inv();
                        }
                    } else {
                        return Unit.ONE;
                    }
                };
                Unit.mustBeUnit = function (name, uom) {
                    if (uom instanceof Unit) {
                        return uom;
                    } else if (isUndefined_1.default(uom)) {
                        return Unit.ONE;
                    } else {
                        throw new Error(name + " must be a Unit or undefined (meaning 1).");
                    }
                };
                Unit.pow = function (uom, exponent) {
                    if (uom instanceof Unit) {
                        if (uom.isOne()) {
                            return void 0;
                        } else {
                            if (exponent.isZero()) {
                                return void 0;
                            } else {
                                return uom.pow(exponent);
                            }
                        }
                    } else {
                        return void 0;
                    }
                };
                Unit.sqrt = function (uom) {
                    if (uom instanceof Unit) {
                        if (uom.isOne()) {
                            return void 0;
                        } else {
                            return uom.sqrt();
                        }
                    } else {
                        return void 0;
                    }
                };
                Unit.valueOf = function (multiplier, dimensions, labels) {
                    if (multiplier === 1) {
                        switch (dimensions.summary) {
                            case DimensionsSummary_1.default.AMOUNT_OF_SUBSTANCE:
                                return Unit.MOLE;
                            case DimensionsSummary_1.default.ANGULAR_MOMENTUM:
                                return Unit.JOULE_SECOND;
                            case DimensionsSummary_1.default.AREA:
                                return Unit.METER_SQUARED;
                            case DimensionsSummary_1.default.ELECTRIC_CHARGE:
                                return Unit.COULOMB;
                            case DimensionsSummary_1.default.ELECTRIC_CURRENT:
                                return Unit.AMPERE;
                            case DimensionsSummary_1.default.ELECTRIC_FIELD:
                                return Unit.ELECTRIC_FIELD;
                            case DimensionsSummary_1.default.ELECTRIC_PERMITTIVITY_TIMES_AREA:
                                return Unit.COULOMB_SQUARED_PER_NEWTON;
                            case DimensionsSummary_1.default.ENERGY_OR_TORQUE:
                                return Unit.JOULE;
                            case DimensionsSummary_1.default.FORCE:
                                return Unit.NEWTON;
                            case DimensionsSummary_1.default.LUMINOUS_INTENSITY:
                                return Unit.CANDELA;
                            case DimensionsSummary_1.default.INV_LENGTH:
                                return Unit.INV_METER;
                            case DimensionsSummary_1.default.INV_MASS:
                                return Unit.INV_KILOGRAM;
                            case DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA:
                                return Unit.INV_KILOGRAM_METER_SQUARED;
                            case DimensionsSummary_1.default.INV_TIME:
                                return Unit.INV_SECOND;
                            case DimensionsSummary_1.default.LENGTH:
                                return Unit.METER;
                            case DimensionsSummary_1.default.MASS:
                                return Unit.KILOGRAM;
                            case DimensionsSummary_1.default.MOMENT_OF_INERTIA:
                                return Unit.KILOGRAM_METER_SQUARED;
                            case DimensionsSummary_1.default.MOMENTUM:
                                return Unit.KILOGRAM_METER_PER_SECOND;
                            case DimensionsSummary_1.default.MOMENTUM_SQUARED:
                                return Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED;
                            case DimensionsSummary_1.default.ONE:
                                return Unit.ONE;
                            case DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA:
                                return Unit.METER_SQUARED_PER_SECOND;
                            case DimensionsSummary_1.default.STIFFNESS:
                                return Unit.STIFFNESS;
                            case DimensionsSummary_1.default.THERMODYNAMIC_TEMPERATURE:
                                return Unit.KELVIN;
                            case DimensionsSummary_1.default.TIME:
                                return Unit.SECOND;
                            case DimensionsSummary_1.default.TIME_SQUARED:
                                return Unit.SECOND_SQUARED;
                            case DimensionsSummary_1.default.VELOCITY:
                                return Unit.METER_PER_SECOND;
                            case DimensionsSummary_1.default.VELOCITY_SQUARED:
                                return Unit.METER_SQUARED_PER_SECOND_SQUARED;
                            case DimensionsSummary_1.default.VOLUME:
                                return Unit.METER_CUBED;
                            default:
                                {}
                        }
                    }
                    return new Unit(multiplier, dimensions, labels);
                };
                Unit.ONE = new Unit(1, Dimensions_1.Dimensions.ONE, SYMBOLS_SI);
                Unit.KILOGRAM = new Unit(1, Dimensions_1.Dimensions.MASS, SYMBOLS_SI);
                Unit.METER = new Unit(1, Dimensions_1.Dimensions.LENGTH, SYMBOLS_SI);
                Unit.SECOND = new Unit(1, Dimensions_1.Dimensions.TIME, SYMBOLS_SI);
                Unit.COULOMB = new Unit(1, Dimensions_1.Dimensions.ELECTRIC_CHARGE, SYMBOLS_SI);
                Unit.AMPERE = new Unit(1, Dimensions_1.Dimensions.ELECTRIC_CURRENT, SYMBOLS_SI);
                Unit.KELVIN = new Unit(1, Dimensions_1.Dimensions.THERMODYNAMIC_TEMPERATURE, SYMBOLS_SI);
                Unit.MOLE = new Unit(1, Dimensions_1.Dimensions.AMOUNT_OF_SUBSTANCE, SYMBOLS_SI);
                Unit.CANDELA = new Unit(1, Dimensions_1.Dimensions.LUMINOUS_INTENSITY, SYMBOLS_SI);
                Unit.COULOMB_SQUARED_PER_NEWTON = new Unit(1, Dimensions_1.Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA, SYMBOLS_SI);
                Unit.ELECTRIC_FIELD = new Unit(1, Dimensions_1.Dimensions.ELECTRIC_FIELD, SYMBOLS_SI);
                Unit.NEWTON = new Unit(1, Dimensions_1.Dimensions.FORCE, SYMBOLS_SI);
                Unit.JOULE = new Unit(1, Dimensions_1.Dimensions.ENERGY_OR_TORQUE, SYMBOLS_SI);
                Unit.JOULE_SECOND = new Unit(1, Dimensions_1.Dimensions.ANGULAR_MOMENTUM, SYMBOLS_SI);
                Unit.METER_SQUARED = new Unit(1, Dimensions_1.Dimensions.AREA, SYMBOLS_SI);
                Unit.METER_CUBED = new Unit(1, Dimensions_1.Dimensions.VOLUME, SYMBOLS_SI);
                Unit.SECOND_SQUARED = new Unit(1, Dimensions_1.Dimensions.TIME_SQUARED, SYMBOLS_SI);
                Unit.INV_KILOGRAM = new Unit(1, Dimensions_1.Dimensions.INV_MASS, SYMBOLS_SI);
                Unit.INV_METER = new Unit(1, Dimensions_1.Dimensions.INV_LENGTH, SYMBOLS_SI);
                Unit.INV_SECOND = new Unit(1, Dimensions_1.Dimensions.INV_TIME, SYMBOLS_SI);
                Unit.KILOGRAM_METER_SQUARED = new Unit(1, Dimensions_1.Dimensions.MOMENT_OF_INERTIA, SYMBOLS_SI);
                Unit.KILOGRAM_METER_PER_SECOND = new Unit(1, Dimensions_1.Dimensions.MOMENTUM, SYMBOLS_SI);
                Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions_1.Dimensions.MOMENTUM_SQUARED, SYMBOLS_SI);
                Unit.INV_KILOGRAM_METER_SQUARED = new Unit(1, Dimensions_1.Dimensions.INV_MOMENT_OF_INERTIA, SYMBOLS_SI);
                Unit.STIFFNESS = new Unit(1, Dimensions_1.Dimensions.STIFFNESS, SYMBOLS_SI);
                Unit.METER_PER_SECOND = new Unit(1, Dimensions_1.Dimensions.VELOCITY, SYMBOLS_SI);
                Unit.METER_SQUARED_PER_SECOND = new Unit(1, Dimensions_1.Dimensions.RATE_OF_CHANGE_OF_AREA, SYMBOLS_SI);
                Unit.METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions_1.Dimensions.VELOCITY_SQUARED, SYMBOLS_SI);
                return Unit;
            }();
            exports_1("Unit", Unit);
        }
    };
});
System.register("davinci-newton/math/Vec3.js", ["../checks/mustBeNumber", "../util/veryDifferent", "./Scalar3", "./Unit"], function (exports_1, context_1) {
    "use strict";

    var mustBeNumber_1, veryDifferent_1, Scalar3_1, Unit_1, Vec3;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (mustBeNumber_1_1) {
            mustBeNumber_1 = mustBeNumber_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }, function (Scalar3_1_1) {
            Scalar3_1 = Scalar3_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }],
        execute: function () {
            Vec3 = function () {
                function Vec3(x, y, z, uom) {
                    this.x_ = mustBeNumber_1.default('x', x);
                    this.y_ = mustBeNumber_1.default('y', y);
                    this.z_ = mustBeNumber_1.default('z', z);
                    this.uom_ = Unit_1.Unit.mustBeUnit('uom', uom);
                    if (this.uom_ && this.uom_.multiplier !== 1) {
                        var multiplier = this.uom_.multiplier;
                        this.x_ *= multiplier;
                        this.y_ *= multiplier;
                        this.z_ *= multiplier;
                        this.uom_ = Unit_1.Unit.valueOf(1, uom.dimensions, uom.labels);
                    }
                }
                Object.defineProperty(Vec3.prototype, "x", {
                    get: function () {
                        return this.x_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Vec3.prototype, "y", {
                    get: function () {
                        return this.y_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Vec3.prototype, "z", {
                    get: function () {
                        return this.z_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Vec3.prototype, "uom", {
                    get: function () {
                        return this.uom_;
                    },
                    enumerable: false,
                    configurable: true
                });
                Vec3.prototype.add = function (rhs) {
                    var uom = Unit_1.Unit.compatible(this.uom_, rhs.uom);
                    return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, uom);
                };
                Vec3.prototype.divByScalar = function (alpha) {
                    return new Vec3(this.x / alpha, this.y / alpha, this.z / alpha, this.uom_);
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
                    return new Vec3(x, y, z, Unit_1.Unit.mul(this.uom_, B.uom));
                };
                Vec3.prototype.subtract = function (rhs) {
                    var uom = Unit_1.Unit.compatible(this.uom_, rhs.uom);
                    return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, uom);
                };
                Vec3.prototype.mulByScalar = function (alpha) {
                    return new Vec3(alpha * this.x, alpha * this.y, alpha * this.z, this.uom_);
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
                    return new Vec3(x, y, z, Unit_1.Unit.mul(this.uom_, rhs.uom));
                };
                Vec3.prototype.distanceTo = function (point) {
                    var Δx = this.x - point.x;
                    var Δy = this.y - point.y;
                    var Δz = this.z - point.z;
                    var a = Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
                    var uom = Unit_1.Unit.compatible(this.uom_, point.uom);
                    return new Scalar3_1.default(a, uom);
                };
                Vec3.prototype.dot = function (v) {
                    var a = this.x * v.x + this.y * v.y + this.z * v.z;
                    var uom = Unit_1.Unit.mul(this.uom_, v.uom);
                    return new Scalar3_1.default(a, uom);
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
                Vec3.prototype.rotate = function (R) {
                    if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
                        return this;
                    } else {
                        var x = this.x;
                        var y = this.y;
                        var z = this.z;
                        var a = R.xy;
                        var b = R.yz;
                        var c = R.zx;
                        var w = R.a;
                        var ix = w * x - c * z + a * y;
                        var iy = w * y - a * x + b * z;
                        var iz = w * z - b * y + c * x;
                        var iw = b * x + c * y + a * z;
                        var xPrimed = ix * w + iw * b + iy * a - iz * c;
                        var yPrimed = iy * w + iw * c + iz * b - ix * a;
                        var zPrimed = iz * w + iw * a + ix * c - iy * b;
                        return new Vec3(xPrimed, yPrimed, zPrimed, this.uom_);
                    }
                };
                Vec3.prototype.toString = function (radix) {
                    return "new Vec3(" + this.x_.toString(radix) + ", " + this.y_.toString(radix) + ", " + this.z_.toString(radix) + ")";
                };
                Vec3.prototype.__add__ = function (rhs) {
                    return this.add(rhs);
                };
                Vec3.prototype.__div__ = function (rhs) {
                    return this.divByScalar(rhs);
                };
                Vec3.prototype.__mul__ = function (rhs) {
                    return this.mulByScalar(rhs);
                };
                Vec3.prototype.__rmul__ = function (lhs) {
                    return this.mulByScalar(lhs);
                };
                Vec3.prototype.__sub__ = function (rhs) {
                    return this.subtract(rhs);
                };
                Vec3.fromVector = function (v) {
                    return new Vec3(v.x, v.y, v.z, v.uom);
                };
                Vec3.e1 = new Vec3(1, 0, 0);
                Vec3.e2 = new Vec3(0, 1, 0);
                Vec3.e3 = new Vec3(0, 0, 1);
                Vec3.zero = new Vec3(0, 0, 0);
                return Vec3;
            }();
            exports_1("Vec3", Vec3);
        }
    };
});
System.register("davinci-newton/model/CoordType.js", [], function (exports_1, context_1) {
    "use strict";

    var LOCAL, WORLD;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("LOCAL", LOCAL = 0);
            exports_1("WORLD", WORLD = 1);
        }
    };
});
System.register("davinci-newton/solvers/AdaptiveStepSolver.js", [], function (exports_1, context_1) {
    "use strict";

    var AdaptiveStepSolver;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            AdaptiveStepSolver = function () {
                function AdaptiveStepSolver(diffEq, energySystem, diffEqSolver, metric) {
                    this.metric = metric;
                    this.stepUBound = 1;
                    this.stepLBound = 1E-5;
                    this.diffEq_ = diffEq;
                    this.energySystem_ = energySystem;
                    this.odeSolver_ = diffEqSolver;
                    this.totSteps_ = 0;
                    this.secondDiff_ = true;
                    this.tolerance_ = 1E-6;
                }
                AdaptiveStepSolver.prototype.step = function (stepSize, uomStep) {
                    var metric = this.metric;
                    this.savedState = this.diffEq_.getState();
                    var startTime = this.diffEq_.time;
                    var d_t = stepSize;
                    var steps = 0;
                    this.diffEq_.epilog();
                    var startEnergy = metric.a(this.energySystem_.totalEnergy());
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
                            this.odeSolver_.step(h, uomStep);
                            this.diffEq_.epilog();
                            t += h;
                        }
                        var finishEnergy = metric.a(this.energySystem_.totalEnergy());
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
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AdaptiveStepSolver.prototype, "tolerance", {
                    get: function () {
                        return this.tolerance_;
                    },
                    set: function (value) {
                        this.tolerance_ = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AdaptiveStepSolver;
            }();
            exports_1("AdaptiveStepSolver", AdaptiveStepSolver);
        }
    };
});
System.register("davinci-newton/solvers/ConstantEnergySolver.js", [], function (exports_1, context_1) {
    "use strict";

    var ConstantEnergySolver;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ConstantEnergySolver = function () {
                function ConstantEnergySolver(simulation, energySystem, solverMethod) {
                    this.stepUpperBound = 1;
                    this.stepLowerBound = 1E-5;
                    this.tolerance_ = 1E-6;
                    this.simulation_ = simulation;
                    this.energySystem_ = energySystem;
                    this.solverMethod_ = solverMethod;
                    this.totSteps_ = 0;
                }
                ConstantEnergySolver.prototype.step = function (Δt, uomTime) {
                    this.savedState = this.simulation_.getState();
                    var startTime = this.simulation_.time;
                    var adaptedStepSize = Δt;
                    var steps = 0;
                    this.simulation_.epilog();
                    var metric = this.energySystem_.metric;
                    var startEnergy = metric.a(this.energySystem_.totalEnergy());
                    var lastEnergyDiff = Number.POSITIVE_INFINITY;
                    var value = Number.POSITIVE_INFINITY;
                    var firstTime = true;
                    if (Δt < this.stepLowerBound) {
                        return;
                    }
                    do {
                        var t = startTime;
                        if (!firstTime) {
                            this.simulation_.setState(this.savedState);
                            this.simulation_.epilog();
                            adaptedStepSize = adaptedStepSize / 5;
                            if (adaptedStepSize < this.stepLowerBound) {
                                throw new Error("Unable to achieve tolerance " + this.tolerance + " with stepLowerBound " + this.stepLowerBound);
                            }
                        }
                        steps = 0;
                        while (t < startTime + Δt) {
                            var h = adaptedStepSize;
                            if (t + h > startTime + Δt - 1E-10) {
                                h = startTime + Δt - t;
                            }
                            steps++;
                            this.solverMethod_.step(h, uomTime);
                            this.simulation_.epilog();
                            t += h;
                        }
                        var finishEnergy = metric.a(this.energySystem_.totalEnergy());
                        var energyDiff = Math.abs(startEnergy - finishEnergy);
                        value = energyDiff;
                        lastEnergyDiff = energyDiff;
                        firstTime = false;
                    } while (value > this.tolerance_);
                    this.totSteps_ += steps;
                };
                Object.defineProperty(ConstantEnergySolver.prototype, "tolerance", {
                    get: function () {
                        return this.tolerance_;
                    },
                    set: function (value) {
                        this.tolerance_ = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return ConstantEnergySolver;
            }();
            exports_1("ConstantEnergySolver", ConstantEnergySolver);
        }
    };
});
System.register("davinci-newton/solvers/EulerMethod.js", ["../util/zeroArray"], function (exports_1, context_1) {
    "use strict";

    var zeroArray_1, EulerMethod;
    var __moduleName = context_1 && context_1.id;
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
                EulerMethod.prototype.step = function (stepSize, uomStep) {
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
                    this.sim_.evaluate(inp, k1, 0, uomStep);
                    for (var i = 0; i < N; i++) {
                        vars[i] += k1[i] * stepSize;
                    }
                    this.sim_.setState(vars);
                };
                return EulerMethod;
            }();
            exports_1("EulerMethod", EulerMethod);
        }
    };
});
System.register("davinci-newton/solvers/ModifiedEuler.js", ["../util/zeroArray"], function (exports_1, context_1) {
    "use strict";

    var zeroArray_1, ModifiedEuler;
    var __moduleName = context_1 && context_1.id;
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
                ModifiedEuler.prototype.step = function (stepSize, uomStep) {
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
                    this.sim_.evaluate(inp, k1, 0, uomStep);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k1[i] * stepSize;
                    }
                    zeroArray_1.default(k2);
                    this.sim_.evaluate(inp, k2, stepSize, uomStep);
                    for (var i = 0; i < N; i++) {
                        vars[i] += (k1[i] + k2[i]) * stepSize / 2;
                    }
                    this.sim_.setState(vars);
                };
                return ModifiedEuler;
            }();
            exports_1("ModifiedEuler", ModifiedEuler);
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

    var zeroArray_1, RungeKutta;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (zeroArray_1_1) {
            zeroArray_1 = zeroArray_1_1;
        }],
        execute: function () {
            RungeKutta = function () {
                function RungeKutta(simulation) {
                    this.inp_ = [];
                    this.k1_ = [];
                    this.k2_ = [];
                    this.k3_ = [];
                    this.k4_ = [];
                    this.sim_ = simulation;
                }
                RungeKutta.prototype.step = function (stepSize, uomStep) {
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
                    this.sim_.evaluate(inp, k1, 0, uomStep);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k1[i] * stepSize / 2;
                    }
                    zeroArray_1.default(k2);
                    this.sim_.evaluate(inp, k2, stepSize / 2, uomStep);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k2[i] * stepSize / 2;
                    }
                    zeroArray_1.default(k3);
                    this.sim_.evaluate(inp, k3, stepSize / 2, uomStep);
                    for (var i = 0; i < N; i++) {
                        inp[i] = vars[i] + k3[i] * stepSize;
                    }
                    zeroArray_1.default(k4);
                    this.sim_.evaluate(inp, k4, stepSize, uomStep);
                    for (var i = 0; i < N; i++) {
                        vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
                    }
                    this.sim_.setState(vars);
                };
                return RungeKutta;
            }();
            exports_1("RungeKutta", RungeKutta);
        }
    };
});
System.register("davinci-newton/strategy/DefaultAdvanceStrategy.js", ["../checks/mustBeNonNullObject"], function (exports_1, context_1) {
    "use strict";

    var mustBeNonNullObject_1, DefaultAdvanceStrategy;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }],
        execute: function () {
            DefaultAdvanceStrategy = function () {
                function DefaultAdvanceStrategy(simulation, solver) {
                    this.simulation_ = mustBeNonNullObject_1.default('simulation', simulation);
                    this.solver_ = mustBeNonNullObject_1.default('solver', solver);
                }
                DefaultAdvanceStrategy.prototype.advance = function (stepSize, uomStep) {
                    this.simulation_.prolog();
                    this.solver_.step(stepSize, uomStep);
                    this.simulation_.epilog();
                };
                return DefaultAdvanceStrategy;
            }();
            exports_1("DefaultAdvanceStrategy", DefaultAdvanceStrategy);
        }
    };
});
System.register("davinci-newton/util/UtilityCore.js", [], function (exports_1, context_1) {
    "use strict";

    var UtilityCore;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            UtilityCore = function () {
                function UtilityCore() {}
                UtilityCore.MAX_INTEGER = Math.pow(2, 53);
                return UtilityCore;
            }();
            exports_1("default", UtilityCore);
        }
    };
});
System.register("davinci-newton/util/CircularList.js", ["./UtilityCore"], function (exports_1, context_1) {
    "use strict";

    var UtilityCore_1, MAX_INDEX_ERROR, CircularList, CircularListIterator;
    var __moduleName = context_1 && context_1.id;
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
            exports_1("CircularList", CircularList);
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

    var DrawingMode;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (DrawingMode) {
                DrawingMode[DrawingMode["DOTS"] = 0] = "DOTS";
                DrawingMode[DrawingMode["LINES"] = 1] = "LINES";
            })(DrawingMode || (DrawingMode = {}));
            exports_1("DrawingMode", DrawingMode);
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
System.register("davinci-newton/checks/mustBeNonNullObject.js", ["../checks/mustSatisfy", "../checks/isNull", "../checks/isObject"], function (exports_1, context_1) {
    "use strict";

    var mustSatisfy_1, isNull_1, isObject_1;
    var __moduleName = context_1 && context_1.id;
    function beObject() {
        return "be a non-null `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value) && !isNull_1.default(value), beObject, contextBuilder);
        return value;
    }
    exports_1("default", mustBeObject);
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
System.register("davinci-newton/view/LabCanvas.js", ["../checks/isNumber", "../checks/mustBeNonNullObject", "../util/AbstractSubject", "../util/clone", "../util/contains", "../util/GenericEvent", "../util/isEmpty", "../util/remove", "../util/veryDifferent", "./ScreenRect"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var isNumber_1, mustBeNonNullObject_1, AbstractSubject_1, clone_1, contains_1, GenericEvent_1, isEmpty_1, remove_1, veryDifferent_1, ScreenRect_1, WIDTH, HEIGHT, ALPHA, BACKGROUND, LabCanvas;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (isNumber_1_1) {
            isNumber_1 = isNumber_1_1;
        }, function (mustBeNonNullObject_1_1) {
            mustBeNonNullObject_1 = mustBeNonNullObject_1_1;
        }, function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (clone_1_1) {
            clone_1 = clone_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (isEmpty_1_1) {
            isEmpty_1 = isEmpty_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }, function (ScreenRect_1_1) {
            ScreenRect_1 = ScreenRect_1_1;
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
                        var screenRect = new ScreenRect_1.default(0, 0, this.getWidth(), this.getHeight());
                        view.setScreenRect(screenRect);
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
                LabCanvas.prototype.setWidth = function (value) {
                    if (veryDifferent_1.default(value, this.canvas_.width)) {
                        this.canvas_.width = value;
                    }
                    this.notifySizeChanged();
                    this.broadcastParameter(WIDTH);
                };
                LabCanvas.FOCUS_VIEW_CHANGED = 'FOCUS_VIEW_CHANGED';
                LabCanvas.SIZE_CHANGED = 'SIZE_CHANGED';
                LabCanvas.VIEW_LIST_MODIFIED = 'VIEW_LIST_MODIFIED';
                LabCanvas.VIEW_ADDED = 'VIEW_ADDED';
                LabCanvas.VIEW_REMOVED = 'VIEW_REMOVED';
                return LabCanvas;
            }(AbstractSubject_1.default);
            exports_1("LabCanvas", LabCanvas);
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
System.register("davinci-newton/view/AffineTransform.js", ["./Point"], function (exports_1, context_1) {
    "use strict";

    var Point_1, AffineTransform;
    var __moduleName = context_1 && context_1.id;
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
                AffineTransform.IDENTITY = new AffineTransform(1, 0, 0, 1, 0, 0);
                return AffineTransform;
            }();
            exports_1("default", AffineTransform);
        }
    };
});
System.register("davinci-newton/view/AlignH.js", [], function (exports_1, context_1) {
    "use strict";

    var AlignH;
    var __moduleName = context_1 && context_1.id;
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
        }
    };
});
System.register("davinci-newton/view/AlignV.js", [], function (exports_1, context_1) {
    "use strict";

    var AlignV;
    var __moduleName = context_1 && context_1.id;
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
        }
    };
});
System.register("davinci-newton/view/CoordMap.js", ["../checks/mustBeFinite", "./AffineTransform", "./AlignH", "./AlignV", "./DoubleRect", "./Point", "./ScreenRect"], function (exports_1, context_1) {
    "use strict";

    var mustBeFinite_1, AffineTransform_1, AlignH_1, AlignV_1, DoubleRect_1, Point_1, ScreenRect_1, MIN_SIZE, CoordMap;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (mustBeFinite_1_1) {
            mustBeFinite_1 = mustBeFinite_1_1;
        }, function (AffineTransform_1_1) {
            AffineTransform_1 = AffineTransform_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
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
                        horizAlign = AlignH_1.AlignH.MIDDLE;
                    }
                    if (verticalAlign === void 0) {
                        verticalAlign = AlignV_1.AlignV.MIDDLE;
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
                    if (horizAlign === AlignH_1.AlignH.FULL) {
                        pixel_per_unit_x = screen_width / sim_width;
                        offset_x = 0;
                    }
                    if (verticalAlign === AlignV_1.AlignV.FULL) {
                        pixel_per_unit_y = screen_height / sim_height;
                        offset_y = 0;
                    }
                    if (horizAlign !== AlignH_1.AlignH.FULL || verticalAlign !== AlignV_1.AlignV.FULL) {
                        var horizFull = void 0;
                        if (horizAlign === AlignH_1.AlignH.FULL) {
                            pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                            horizFull = true;
                        } else if (verticalAlign === AlignV_1.AlignV.FULL) {
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
                                case AlignH_1.AlignH.LEFT:
                                    offset_x = 0;
                                    break;
                                case AlignH_1.AlignH.MIDDLE:
                                    offset_x = (screen_width - ideal_width) / 2;
                                    break;
                                case AlignH_1.AlignH.RIGHT:
                                    offset_x = screen_width - ideal_width;
                                    break;
                                default:
                                    throw new Error();
                            }
                        } else {
                            offset_x = 0;
                            var ideal_height = Math.floor(0.5 + sim_height * pixel_per_unit_y);
                            switch (verticalAlign) {
                                case AlignV_1.AlignV.BOTTOM:
                                    offset_y = 0;
                                    break;
                                case AlignV_1.AlignV.MIDDLE:
                                    offset_y = (screen_height - ideal_height) / 2;
                                    break;
                                case AlignV_1.AlignV.TOP:
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
System.register("davinci-newton/util/clone.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function clone(xs) {
        var length = xs.length;
        var rv = new Array(length);
        for (var i = 0; i < length; i++) {
            rv[i] = xs[i];
        }
        return rv;
    }
    exports_1("default", clone);
    return {
        setters: [],
        execute: function () {}
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
System.register("davinci-newton/util/find.js", ["./findIndex"], function (exports_1, context_1) {
    "use strict";

    var findIndex_1;
    var __moduleName = context_1 && context_1.id;
    function find(xs, test) {
        var i = findIndex_1.default(xs, test);
        return i < 0 ? null : xs[i];
    }
    exports_1("default", find);
    return {
        setters: [function (findIndex_1_1) {
            findIndex_1 = findIndex_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/util/ParameterBoolean.js", ["./toName", "./validName"], function (exports_1, context_1) {
    "use strict";

    var toName_1, validName_1, ParameterBoolean;
    var __moduleName = context_1 && context_1.id;
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
                    enumerable: false,
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

    var toName_1, validName_1, ParameterNumber;
    var __moduleName = context_1 && context_1.id;
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
                    enumerable: false,
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

    var toName_1, validName_1, ParameterString;
    var __moduleName = context_1 && context_1.id;
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
                    enumerable: false,
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

    var removeAt_1;
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
    return {
        setters: [function (removeAt_1_1) {
            removeAt_1 = removeAt_1_1;
        }],
        execute: function () {}
    };
});
System.register("davinci-newton/util/AbstractSubject.js", ["./clone", "./contains", "./find", "./ParameterBoolean", "./ParameterNumber", "./ParameterString", "./remove", "../util/toName"], function (exports_1, context_1) {
    "use strict";

    var clone_1, contains_1, find_1, ParameterBoolean_1, ParameterNumber_1, ParameterString_1, remove_1, toName_1, AbstractSubject;
    var __moduleName = context_1 && context_1.id;
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
System.register("davinci-newton/util/GenericEvent.js", ["./toName", "./validName"], function (exports_1, context_1) {
    "use strict";

    var toName_1, validName_1, GenericEvent;
    var __moduleName = context_1 && context_1.id;
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
                    enumerable: false,
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
System.register("davinci-newton/view/DisplayList.js", ["../util/AbstractSubject", "../util/GenericEvent", "../util/insertAt", "../checks/isObject"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var AbstractSubject_1, GenericEvent_1, insertAt_1, isObject_1, DisplayList;
    var __moduleName = context_1 && context_1.id;
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
                    var iLen = this.drawables_.length;
                    var i = 0;
                    for (i = 0; i < iLen; i++) {
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
                    var i = N;
                    for (i = N; i > 0; i--) {
                        var z = this.drawables_[i - 1].getZIndex();
                        if (zIndex > z) {
                            break;
                        }
                    }
                    insertAt_1.default(this.drawables_, dispObj, i);
                    this.broadcast(new GenericEvent_1.default(this, DisplayList.OBJECT_ADDED, dispObj));
                };
                DisplayList.prototype.sort = function () {};
                DisplayList.OBJECT_ADDED = 'OBJECT_ADDED';
                DisplayList.OBJECT_REMOVED = 'OBJECT_REMOVED';
                return DisplayList;
            }(AbstractSubject_1.default);
            exports_1("DisplayList", DisplayList);
            exports_1("default", DisplayList);
        }
    };
});
System.register("davinci-newton/view/Point.js", [], function (exports_1, context_1) {
    "use strict";

    var Point;
    var __moduleName = context_1 && context_1.id;
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
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Point.prototype, "y", {
                    get: function () {
                        return this.y_;
                    },
                    enumerable: false,
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

    var Point_1, veryDifferent_1, DoubleRect;
    var __moduleName = context_1 && context_1.id;
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
                DoubleRect.EMPTY_RECT = new DoubleRect(0, 0, 0, 0);
                return DoubleRect;
            }();
            exports_1("default", DoubleRect);
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
System.register("davinci-newton/view/ScreenRect.js", ["../checks/isFunction", "../util/veryDifferent"], function (exports_1, context_1) {
    "use strict";

    var isFunction_1, veryDifferent_1, ScreenRect;
    var __moduleName = context_1 && context_1.id;
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
                ScreenRect.EMPTY_RECT = new ScreenRect(0, 0, 0, 0);
                return ScreenRect;
            }();
            exports_1("default", ScreenRect);
        }
    };
});
System.register("davinci-newton/view/SimView.js", ["../util/AbstractSubject", "../util/clone", "../util/contains", "../util/GenericEvent", "../util/ParameterBoolean", "../util/ParameterNumber", "../util/remove", "../util/veryDifferent", "./AlignH", "./AlignV", "./CoordMap", "./DisplayList", "./DoubleRect", "./ScreenRect"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var AbstractSubject_1, clone_1, contains_1, GenericEvent_1, ParameterBoolean_1, ParameterNumber_1, remove_1, veryDifferent_1, AlignH_1, AlignV_1, CoordMap_1, DisplayList_1, DoubleRect_1, ScreenRect_1, SimView;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (AbstractSubject_1_1) {
            AbstractSubject_1 = AbstractSubject_1_1;
        }, function (clone_1_1) {
            clone_1 = clone_1_1;
        }, function (contains_1_1) {
            contains_1 = contains_1_1;
        }, function (GenericEvent_1_1) {
            GenericEvent_1 = GenericEvent_1_1;
        }, function (ParameterBoolean_1_1) {
            ParameterBoolean_1 = ParameterBoolean_1_1;
        }, function (ParameterNumber_1_1) {
            ParameterNumber_1 = ParameterNumber_1_1;
        }, function (remove_1_1) {
            remove_1 = remove_1_1;
        }, function (veryDifferent_1_1) {
            veryDifferent_1 = veryDifferent_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (CoordMap_1_1) {
            CoordMap_1 = CoordMap_1_1;
        }, function (DisplayList_1_1) {
            DisplayList_1 = DisplayList_1_1;
        }, function (DoubleRect_1_1) {
            DoubleRect_1 = DoubleRect_1_1;
        }, function (ScreenRect_1_1) {
            ScreenRect_1 = ScreenRect_1_1;
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
                    _this.horizAlign_ = AlignH_1.AlignH.MIDDLE;
                    _this.verticalAlign_ = AlignV_1.AlignV.MIDDLE;
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
                    enumerable: false,
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
                    enumerable: false,
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
                return SimView;
            }(AbstractSubject_1.default);
            exports_1("SimView", SimView);
        }
    };
});
System.register("davinci-newton.js", ["./davinci-newton/config", "./davinci-newton/core/ConstantForceLaw", "./davinci-newton/core/CoulombLaw", "./davinci-newton/core/Force", "./davinci-newton/core/GravitationLaw", "./davinci-newton/core/Particle", "./davinci-newton/core/RigidBody", "./davinci-newton/core/Spring", "./davinci-newton/core/State", "./davinci-newton/core/VarsList", "./davinci-newton/engine2D/Block2", "./davinci-newton/engine2D/ConstantForceLaw2", "./davinci-newton/engine2D/Disc2", "./davinci-newton/engine2D/Dynamics2", "./davinci-newton/engine2D/Euclidean2", "./davinci-newton/engine2D/Force2", "./davinci-newton/engine2D/GravitationForceLaw2", "./davinci-newton/engine2D/Physics2", "./davinci-newton/engine2D/Spring2", "./davinci-newton/engine3D/Block3", "./davinci-newton/engine3D/ConstantForceLaw3", "./davinci-newton/engine3D/Cylinder3", "./davinci-newton/engine3D/Dynamics3", "./davinci-newton/engine3D/Euclidean3", "./davinci-newton/engine3D/Force3", "./davinci-newton/engine3D/GravitationForceLaw3", "./davinci-newton/engine3D/Physics3", "./davinci-newton/engine3D/Sphere3", "./davinci-newton/engine3D/Spring3", "./davinci-newton/graph/AxisChoice", "./davinci-newton/graph/DisplayGraph", "./davinci-newton/graph/EnergyTimeGraph", "./davinci-newton/graph/Graph", "./davinci-newton/graph/GraphLine", "./davinci-newton/math/Dimensions", "./davinci-newton/math/Geometric2", "./davinci-newton/math/Geometric3", "./davinci-newton/math/Matrix3", "./davinci-newton/math/QQ", "./davinci-newton/math/Unit", "./davinci-newton/math/Vec3", "./davinci-newton/model/CoordType", "./davinci-newton/solvers/AdaptiveStepSolver", "./davinci-newton/solvers/ConstantEnergySolver", "./davinci-newton/solvers/EulerMethod", "./davinci-newton/solvers/ModifiedEuler", "./davinci-newton/solvers/RungeKutta", "./davinci-newton/strategy/DefaultAdvanceStrategy", "./davinci-newton/util/CircularList", "./davinci-newton/view/AlignH", "./davinci-newton/view/AlignV", "./davinci-newton/view/DrawingMode", "./davinci-newton/view/LabCanvas", "./davinci-newton/view/SimView"], function (exports_1, context_1) {
    "use strict";

    var config_1, ConstantForceLaw_1, CoulombLaw_1, Force_1, GravitationLaw_1, Particle_1, RigidBody_1, Spring_1, State_1, VarsList_1, Block2_1, ConstantForceLaw2_1, Disc2_1, Dynamics2_1, Euclidean2_1, Force2_1, GravitationForceLaw2_1, Physics2_1, Spring2_1, Block3_1, ConstantForceLaw3_1, Cylinder3_1, Dynamics3_1, Euclidean3_1, Force3_1, GravitationForceLaw3_1, Physics3_1, Sphere3_1, Spring3_1, AxisChoice_1, DisplayGraph_1, EnergyTimeGraph_1, Graph_1, GraphLine_1, Dimensions_1, Geometric2_1, Geometric3_1, Matrix3_1, QQ_1, Unit_1, Vec3_1, CoordType_1, AdaptiveStepSolver_1, ConstantEnergySolver_1, EulerMethod_1, ModifiedEuler_1, RungeKutta_1, DefaultAdvanceStrategy_1, CircularList_1, AlignH_1, AlignV_1, DrawingMode_1, LabCanvas_1, SimView_1, newton;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (config_1_1) {
            config_1 = config_1_1;
        }, function (ConstantForceLaw_1_1) {
            ConstantForceLaw_1 = ConstantForceLaw_1_1;
        }, function (CoulombLaw_1_1) {
            CoulombLaw_1 = CoulombLaw_1_1;
        }, function (Force_1_1) {
            Force_1 = Force_1_1;
        }, function (GravitationLaw_1_1) {
            GravitationLaw_1 = GravitationLaw_1_1;
        }, function (Particle_1_1) {
            Particle_1 = Particle_1_1;
        }, function (RigidBody_1_1) {
            RigidBody_1 = RigidBody_1_1;
        }, function (Spring_1_1) {
            Spring_1 = Spring_1_1;
        }, function (State_1_1) {
            State_1 = State_1_1;
        }, function (VarsList_1_1) {
            VarsList_1 = VarsList_1_1;
        }, function (Block2_1_1) {
            Block2_1 = Block2_1_1;
        }, function (ConstantForceLaw2_1_1) {
            ConstantForceLaw2_1 = ConstantForceLaw2_1_1;
        }, function (Disc2_1_1) {
            Disc2_1 = Disc2_1_1;
        }, function (Dynamics2_1_1) {
            Dynamics2_1 = Dynamics2_1_1;
        }, function (Euclidean2_1_1) {
            Euclidean2_1 = Euclidean2_1_1;
        }, function (Force2_1_1) {
            Force2_1 = Force2_1_1;
        }, function (GravitationForceLaw2_1_1) {
            GravitationForceLaw2_1 = GravitationForceLaw2_1_1;
        }, function (Physics2_1_1) {
            Physics2_1 = Physics2_1_1;
        }, function (Spring2_1_1) {
            Spring2_1 = Spring2_1_1;
        }, function (Block3_1_1) {
            Block3_1 = Block3_1_1;
        }, function (ConstantForceLaw3_1_1) {
            ConstantForceLaw3_1 = ConstantForceLaw3_1_1;
        }, function (Cylinder3_1_1) {
            Cylinder3_1 = Cylinder3_1_1;
        }, function (Dynamics3_1_1) {
            Dynamics3_1 = Dynamics3_1_1;
        }, function (Euclidean3_1_1) {
            Euclidean3_1 = Euclidean3_1_1;
        }, function (Force3_1_1) {
            Force3_1 = Force3_1_1;
        }, function (GravitationForceLaw3_1_1) {
            GravitationForceLaw3_1 = GravitationForceLaw3_1_1;
        }, function (Physics3_1_1) {
            Physics3_1 = Physics3_1_1;
        }, function (Sphere3_1_1) {
            Sphere3_1 = Sphere3_1_1;
        }, function (Spring3_1_1) {
            Spring3_1 = Spring3_1_1;
        }, function (AxisChoice_1_1) {
            AxisChoice_1 = AxisChoice_1_1;
        }, function (DisplayGraph_1_1) {
            DisplayGraph_1 = DisplayGraph_1_1;
        }, function (EnergyTimeGraph_1_1) {
            EnergyTimeGraph_1 = EnergyTimeGraph_1_1;
        }, function (Graph_1_1) {
            Graph_1 = Graph_1_1;
        }, function (GraphLine_1_1) {
            GraphLine_1 = GraphLine_1_1;
        }, function (Dimensions_1_1) {
            Dimensions_1 = Dimensions_1_1;
        }, function (Geometric2_1_1) {
            Geometric2_1 = Geometric2_1_1;
        }, function (Geometric3_1_1) {
            Geometric3_1 = Geometric3_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (QQ_1_1) {
            QQ_1 = QQ_1_1;
        }, function (Unit_1_1) {
            Unit_1 = Unit_1_1;
        }, function (Vec3_1_1) {
            Vec3_1 = Vec3_1_1;
        }, function (CoordType_1_1) {
            CoordType_1 = CoordType_1_1;
        }, function (AdaptiveStepSolver_1_1) {
            AdaptiveStepSolver_1 = AdaptiveStepSolver_1_1;
        }, function (ConstantEnergySolver_1_1) {
            ConstantEnergySolver_1 = ConstantEnergySolver_1_1;
        }, function (EulerMethod_1_1) {
            EulerMethod_1 = EulerMethod_1_1;
        }, function (ModifiedEuler_1_1) {
            ModifiedEuler_1 = ModifiedEuler_1_1;
        }, function (RungeKutta_1_1) {
            RungeKutta_1 = RungeKutta_1_1;
        }, function (DefaultAdvanceStrategy_1_1) {
            DefaultAdvanceStrategy_1 = DefaultAdvanceStrategy_1_1;
        }, function (CircularList_1_1) {
            CircularList_1 = CircularList_1_1;
        }, function (AlignH_1_1) {
            AlignH_1 = AlignH_1_1;
        }, function (AlignV_1_1) {
            AlignV_1 = AlignV_1_1;
        }, function (DrawingMode_1_1) {
            DrawingMode_1 = DrawingMode_1_1;
        }, function (LabCanvas_1_1) {
            LabCanvas_1 = LabCanvas_1_1;
        }, function (SimView_1_1) {
            SimView_1 = SimView_1_1;
        }],
        execute: function () {
            newton = {
                get LAST_MODIFIED() {
                    return config_1.config.LAST_MODIFIED;
                },
                get VERSION() {
                    return config_1.config.VERSION;
                },
                get AdaptiveStepSolver() {
                    return AdaptiveStepSolver_1.AdaptiveStepSolver;
                },
                get AlignH() {
                    return AlignH_1.AlignH;
                },
                get AlignV() {
                    return AlignV_1.AlignV;
                },
                get AxisChoice() {
                    return AxisChoice_1.AxisChoice;
                },
                get Block2() {
                    return Block2_1.Block2;
                },
                get Block3() {
                    return Block3_1.Block3;
                },
                get CircularList() {
                    return CircularList_1.CircularList;
                },
                get ConstantEnergySolver() {
                    return ConstantEnergySolver_1.ConstantEnergySolver;
                },
                get ConstantForceLaw() {
                    return ConstantForceLaw_1.ConstantForceLaw;
                },
                get ConstantForceLaw2() {
                    return ConstantForceLaw2_1.ConstantForceLaw2;
                },
                get ConstantForceLaw3() {
                    return ConstantForceLaw3_1.ConstantForceLaw3;
                },
                get LOCAL() {
                    return CoordType_1.LOCAL;
                },
                get WORLD() {
                    return CoordType_1.WORLD;
                },
                get CoulombLaw() {
                    return CoulombLaw_1.CoulombLaw;
                },
                get Disc2() {
                    return Disc2_1.Disc2;
                },
                get Cylinder3() {
                    return Cylinder3_1.Cylinder3;
                },
                get DefaultAdvanceStrategy() {
                    return DefaultAdvanceStrategy_1.DefaultAdvanceStrategy;
                },
                get Dimensions() {
                    return Dimensions_1.Dimensions;
                },
                get DisplayGraph() {
                    return DisplayGraph_1.DisplayGraph;
                },
                get DrawingMode() {
                    return DrawingMode_1.DrawingMode;
                },
                get Dynamic2() {
                    return Dynamics2_1.Dynamics2;
                },
                get Dynamic3() {
                    return Dynamics3_1.Dynamics3;
                },
                get EnergyTimeGraph() {
                    return EnergyTimeGraph_1.EnergyTimeGraph;
                },
                get EulerMethod() {
                    return EulerMethod_1.EulerMethod;
                },
                get Euclidean2() {
                    return Euclidean2_1.Euclidean2;
                },
                get Euclidean3() {
                    return Euclidean3_1.Euclidean3;
                },
                get Force() {
                    return Force_1.Force;
                },
                get Force2() {
                    return Force2_1.Force2;
                },
                get Force3() {
                    return Force3_1.Force3;
                },
                get Geometric2() {
                    return Geometric2_1.Geometric2;
                },
                get Geometric3() {
                    return Geometric3_1.Geometric3;
                },
                get Graph() {
                    return Graph_1.Graph;
                },
                get GraphLine() {
                    return GraphLine_1.GraphLine;
                },
                get GravitationLaw() {
                    return GravitationLaw_1.GravitationLaw;
                },
                get GravitationForceLaw2() {
                    return GravitationForceLaw2_1.GravitationForceLaw2;
                },
                get GravitationForceLaw3() {
                    return GravitationForceLaw3_1.GravitationForceLaw3;
                },
                get LabCanvas() {
                    return LabCanvas_1.LabCanvas;
                },
                get Matrix3() {
                    return Matrix3_1.Matrix3;
                },
                get ModifiedEuler() {
                    return ModifiedEuler_1.ModifiedEuler;
                },
                get QQ() {
                    return QQ_1.QQ;
                },
                get Particle() {
                    return Particle_1.Particle;
                },
                get Physics2() {
                    return Physics2_1.Physics2;
                },
                get Physics3() {
                    return Physics3_1.Physics3;
                },
                get State() {
                    return State_1.State;
                },
                get RigidBody() {
                    return RigidBody_1.RigidBody;
                },
                get RungeKutta() {
                    return RungeKutta_1.RungeKutta;
                },
                get SimView() {
                    return SimView_1.SimView;
                },
                get Sphere3() {
                    return Sphere3_1.Sphere3;
                },
                get Spring() {
                    return Spring_1.Spring;
                },
                get Spring2() {
                    return Spring2_1.Spring2;
                },
                get Spring3() {
                    return Spring3_1.Spring3;
                },
                get setDimensionsChecking() {
                    return Dimensions_1.setDimensionsChecking;
                },
                get Unit() {
                    return Unit_1.Unit;
                },
                get VarsList() {
                    return VarsList_1.VarsList;
                },
                get Vec3() {
                    return Vec3_1.Vec3;
                }
            };
            exports_1("default", newton);
        }
    };
});
//# sourceMappingURL=davinci-newton-system-es5.js.map