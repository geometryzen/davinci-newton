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
System.register("davinci-newton/math/Bivector3.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Bivector3;
    return {
        setters: [],
        execute: function () {
            Bivector3 = function () {
                function Bivector3() {
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                }
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
                AbstractMatrix.prototype.copy = function (m) {
                    this.elements.set(m.elements);
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
System.register("davinci-newton/math/Matrix3.js", ["./AbstractMatrix"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractMatrix_1, Matrix3;
    return {
        setters: [function (AbstractMatrix_1_1) {
            AbstractMatrix_1 = AbstractMatrix_1_1;
        }],
        execute: function () {
            Matrix3 = function (_super) {
                __extends(Matrix3, _super);
                function Matrix3(elements) {
                    return _super.call(this, elements, 3) || this;
                }
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
                Matrix3.one = function () {
                    return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
                };
                return Matrix3;
            }(AbstractMatrix_1.default);
            exports_1("Matrix3", Matrix3);
            exports_1("default", Matrix3);
        }
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
                Spinor3.prototype.one = function () {
                    this.a = 1;
                    this.xy = 0;
                    this.yz = 0;
                    this.zx = 0;
                    return this;
                };
                return Spinor3;
            }();
            exports_1("Spinor3", Spinor3);
            exports_1("default", Spinor3);
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
                Vector3.prototype.apply = function (matrix) {
                    throw new Error("TODO");
                };
                Vector3.prototype.copy = function (v) {
                    this.x = v.x;
                    this.y = v.y;
                    this.z = v.z;
                    return this;
                };
                Vector3.prototype.dual = function (B) {
                    this.x = -B.yz;
                    this.y = -B.zx;
                    this.z = -B.xy;
                    return this;
                };
                Vector3.prototype.divByScalar = function (alpha) {
                    this.x /= alpha;
                    this.y /= alpha;
                    this.z /= alpha;
                    return this;
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
System.register("davinci-newton/engine/RigidBody.js", ["../objects/AbstractSimObject", "../math/Bivector3", "../math/Matrix3", "../math/Spinor3", "../math/Vector", "../math/Vector3"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var AbstractSimObject_1, Bivector3_1, Matrix3_1, Spinor3_1, Vector_1, Vector3_1, RigidBody;
    return {
        setters: [function (AbstractSimObject_1_1) {
            AbstractSimObject_1 = AbstractSimObject_1_1;
        }, function (Bivector3_1_1) {
            Bivector3_1 = Bivector3_1_1;
        }, function (Matrix3_1_1) {
            Matrix3_1 = Matrix3_1_1;
        }, function (Spinor3_1_1) {
            Spinor3_1 = Spinor3_1_1;
        }, function (Vector_1_1) {
            Vector_1 = Vector_1_1;
        }, function (Vector3_1_1) {
            Vector3_1 = Vector3_1_1;
        }],
        execute: function () {
            RigidBody = function (_super) {
                __extends(RigidBody, _super);
                function RigidBody(name) {
                    var _this = _super.call(this, name) || this;
                    _this.mass_ = 1;
                    _this.Ibody = Matrix3_1.default.one();
                    _this.Ibodyinv = Matrix3_1.default.one();
                    _this.varsIndex_ = -1;
                    _this.position_ = new Vector3_1.default();
                    _this.attitude_ = new Spinor3_1.default();
                    _this.linearMomentum_ = new Vector3_1.default();
                    _this.angularMomentum_ = new Bivector3_1.default();
                    _this.V = new Vector3_1.default();
                    _this.Iinv = Matrix3_1.default.one();
                    _this.ω = new Vector3_1.default();
                    _this.Ω = new Bivector3_1.default();
                    _this.cm_body_ = Vector_1.default.ORIGIN;
                    return _this;
                }
                Object.defineProperty(RigidBody.prototype, "X", {
                    get: function () {
                        return this.position_;
                    },
                    set: function (position) {
                        this.position_.copy(position);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "R", {
                    get: function () {
                        return this.attitude_;
                    },
                    set: function (attitude) {
                        this.attitude_.copy(attitude);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "P", {
                    get: function () {
                        return this.linearMomentum_;
                    },
                    set: function (momentum) {
                        this.linearMomentum_.copy(momentum);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RigidBody.prototype, "L", {
                    get: function () {
                        return this.angularMomentum_;
                    },
                    set: function (angularMomentum) {
                        this.angularMomentum_.copy(angularMomentum);
                    },
                    enumerable: true,
                    configurable: true
                });
                RigidBody.prototype.getExpireTime = function () {
                    return Number.POSITIVE_INFINITY;
                };
                RigidBody.prototype.getVarsIndex = function () {
                    return this.varsIndex_;
                };
                RigidBody.prototype.setVarsIndex = function (index) {
                    this.varsIndex_ = index;
                };
                Object.defineProperty(RigidBody.prototype, "M", {
                    get: function () {
                        return this.mass_;
                    },
                    set: function (mass) {
                        this.mass_ = mass;
                    },
                    enumerable: true,
                    configurable: true
                });
                RigidBody.prototype.momentAboutCM = function () {
                    return 1;
                };
                RigidBody.prototype.rotationalEnergy = function () {
                    return 0;
                };
                RigidBody.prototype.translationalEnergy = function () {
                    return 0;
                };
                RigidBody.prototype.bodyToWorld = function (bodyPoint) {
                    var r = Vector_1.default.fromVector(bodyPoint).subtract(this.cm_body_);
                    return r.rotate(this.R).add(this.X);
                };
                RigidBody.prototype.worldVelocityOfBodyPoint = function (bodyPoint) {
                    var r = this.rotateBodyToWorld(Vector_1.default.fromVector(bodyPoint).subtract(this.cm_body_));
                    return Vector_1.default.fromVector(this.ω).cross(r).add(this.V);
                };
                RigidBody.prototype.rotateBodyToWorld = function (bodyPoint) {
                    return Vector_1.default.fromVector(bodyPoint).rotate(this.R);
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
System.register("davinci-newton/engine/RigidBodySim.js", ["../util/AbstractSubject", "../util/contains", "../model/EnergyInfo", "../util/remove", "../core/SimList", "../core/VarsList", "../math/wedge"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    function getVarName(index, localized) {
        switch (index) {
            case Offset.POSITION_X:
                return "position x";
            case Offset.POSITION_Y:
                return "position y";
            case Offset.POSITION_Z:
                return "position z";
            case Offset.ATTITUDE_A:
                return "attitude a";
            case Offset.ATTITUDE_YZ:
                return "attitude yz";
            case Offset.ATTITUDE_ZX:
                return "attitude zx";
            case Offset.ATTITUDE_XY:
                return "attitude xy";
            case Offset.LINEAR_MOMENTUM_X:
                return "momentum x";
            case Offset.LINEAR_MOMENTUM_Y:
                return "momentum y";
            case Offset.LINEAR_MOMENTUM_Z:
                return "momentum z";
            case Offset.ANGULAR_MOMENTUM_YZ:
                return "angular momentum yz";
            case Offset.ANGULAR_MOMENTUM_ZX:
                return "angular momentum zx";
            case Offset.ANGULAR_MOMENTUM_XY:
                return "angular momentum xy";
        }
        throw new Error("getVarName(" + index + ")");
    }
    var AbstractSubject_1, contains_1, EnergyInfo_1, remove_1, SimList_1, VarsList_1, wedge_1, var_names, i18n_names, Offset, NUM_VARS_IN_STATE, RigidBodySim;
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
        }, function (wedge_1_1) {
            wedge_1 = wedge_1_1;
        }],
        execute: function () {
            var_names = ['time', 'kinetic enetry', 'potential energy', 'total energy'];
            i18n_names = ['time', 'kinetic enetry', 'potential energy', 'total energy'];
            (function (Offset) {
                Offset[Offset["POSITION_X"] = 0] = "POSITION_X";
                Offset[Offset["POSITION_Y"] = 1] = "POSITION_Y";
                Offset[Offset["POSITION_Z"] = 2] = "POSITION_Z";
                Offset[Offset["ATTITUDE_A"] = 3] = "ATTITUDE_A";
                Offset[Offset["ATTITUDE_YZ"] = 4] = "ATTITUDE_YZ";
                Offset[Offset["ATTITUDE_ZX"] = 5] = "ATTITUDE_ZX";
                Offset[Offset["ATTITUDE_XY"] = 6] = "ATTITUDE_XY";
                Offset[Offset["LINEAR_MOMENTUM_X"] = 7] = "LINEAR_MOMENTUM_X";
                Offset[Offset["LINEAR_MOMENTUM_Y"] = 8] = "LINEAR_MOMENTUM_Y";
                Offset[Offset["LINEAR_MOMENTUM_Z"] = 9] = "LINEAR_MOMENTUM_Z";
                Offset[Offset["ANGULAR_MOMENTUM_YZ"] = 10] = "ANGULAR_MOMENTUM_YZ";
                Offset[Offset["ANGULAR_MOMENTUM_ZX"] = 11] = "ANGULAR_MOMENTUM_ZX";
                Offset[Offset["ANGULAR_MOMENTUM_XY"] = 12] = "ANGULAR_MOMENTUM_XY";
            })(Offset || (Offset = {}));
            NUM_VARS_IN_STATE = 13;
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
                            names.push(getVarName(k, false));
                        }
                        var localNames = [];
                        for (var k = 0; k < NUM_VARS_IN_STATE; k++) {
                            localNames.push(getVarName(k, true));
                        }
                        var idx = this.varsList_.addVariables(names, localNames);
                        body.setVarsIndex(idx);
                        this.bods_.push(body);
                        this.getSimList().add(body);
                    }
                    this.initializeFromBody(body);
                    this.bods_.forEach(function (b) {});
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
                    this.bods_.forEach(function (body) {
                        var idx = body.getVarsIndex();
                        if (idx < 0) {
                            return;
                        }
                        body.X.x = vars[idx + Offset.POSITION_X];
                        body.X.y = vars[idx + Offset.POSITION_Y];
                        body.X.z = vars[idx + Offset.POSITION_Z];
                        body.R.a = vars[idx + Offset.ATTITUDE_A];
                        body.R.xy = vars[idx + Offset.ATTITUDE_XY];
                        body.R.yz = vars[idx + Offset.ATTITUDE_YZ];
                        body.R.zx = vars[idx + Offset.ATTITUDE_ZX];
                        body.P.x = vars[idx + Offset.LINEAR_MOMENTUM_X];
                        body.P.y = vars[idx + Offset.LINEAR_MOMENTUM_Y];
                        body.P.z = vars[idx + Offset.LINEAR_MOMENTUM_Z];
                        body.L.xy = vars[idx + Offset.ANGULAR_MOMENTUM_XY];
                        body.L.yz = vars[idx + Offset.ANGULAR_MOMENTUM_YZ];
                        body.L.zx = vars[idx + Offset.ANGULAR_MOMENTUM_ZX];
                        body.V.copy(body.P).divByScalar(body.M);
                        body.ω.dual(body.L).neg().apply(body.Iinv);
                        body.Ω.dual(body.ω);
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
                        var mass = body.M;
                        if (mass === Number.POSITIVE_INFINITY) {
                            for (var k = 0; k < NUM_VARS_IN_STATE; k++) change[idx + k] = 0;
                        } else {
                            change[idx + Offset.POSITION_X] = vars[idx + Offset.LINEAR_MOMENTUM_X] / mass;
                            change[idx + Offset.POSITION_Y] = vars[idx + Offset.LINEAR_MOMENTUM_Y] / mass;
                            change[idx + Offset.POSITION_Z] = vars[idx + Offset.LINEAR_MOMENTUM_Z] / mass;
                            var R = body.R;
                            var Ω = body.Ω;
                            change[idx + Offset.ATTITUDE_A] = -0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
                            change[idx + Offset.ATTITUDE_XY] = 0.5 * Ω.xy * R.a;
                            change[idx + Offset.ATTITUDE_YZ] = 0.5 * Ω.yz * R.a;
                            change[idx + Offset.ATTITUDE_ZX] = 0.5 * Ω.zx * R.a;
                            change[idx + Offset.LINEAR_MOMENTUM_X] = 0;
                            change[idx + Offset.LINEAR_MOMENTUM_Y] = 0;
                            change[idx + Offset.LINEAR_MOMENTUM_Z] = 0;
                            change[idx + Offset.ANGULAR_MOMENTUM_XY] = 0;
                            change[idx + Offset.ANGULAR_MOMENTUM_YZ] = 0;
                            change[idx + Offset.ANGULAR_MOMENTUM_ZX] = 0;
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
                    var F = force.getVector();
                    var forceLoc = force.getStartPoint();
                    change[idx + Offset.LINEAR_MOMENTUM_X] += F.x;
                    change[idx + Offset.LINEAR_MOMENTUM_Y] += F.y;
                    change[idx + Offset.LINEAR_MOMENTUM_Z] += F.z;
                    var r = forceLoc.subtract(body.X);
                    change[idx + Offset.ANGULAR_MOMENTUM_YZ] += wedge_1.wedgeYZ(r, F);
                    change[idx + Offset.ANGULAR_MOMENTUM_ZX] += wedge_1.wedgeZX(r, F);
                    change[idx + Offset.ANGULAR_MOMENTUM_XY] += wedge_1.wedgeXY(r, F);
                    var torque = force.getTorque();
                    if (torque.yz !== 0) {
                        change[idx + Offset.ANGULAR_MOMENTUM_YZ] += torque.yz;
                    }
                    if (torque.zx !== 0) {
                        change[idx + Offset.ANGULAR_MOMENTUM_ZX] += torque.zx;
                    }
                    if (torque.xy !== 0) {
                        change[idx + Offset.ANGULAR_MOMENTUM_XY] += torque.xy;
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
                    var idx = body.getVarsIndex();
                    if (idx > -1) {
                        var va = this.varsList_;
                        va.setValue(Offset.POSITION_X + idx, body.X.x);
                        va.setValue(Offset.POSITION_Y + idx, body.X.y);
                        va.setValue(Offset.POSITION_Z + idx, body.X.z);
                        va.setValue(Offset.ATTITUDE_A + idx, body.R.a);
                        va.setValue(Offset.ATTITUDE_XY + idx, body.R.xy);
                        va.setValue(Offset.ATTITUDE_YZ + idx, body.R.yz);
                        va.setValue(Offset.ATTITUDE_ZX + idx, body.R.zx);
                        va.setValue(Offset.LINEAR_MOMENTUM_X + idx, body.P.x);
                        va.setValue(Offset.LINEAR_MOMENTUM_Y + idx, body.P.y);
                        va.setValue(Offset.LINEAR_MOMENTUM_Z + idx, body.P.z);
                        va.setValue(Offset.ANGULAR_MOMENTUM_XY + idx, body.L.xy);
                        va.setValue(Offset.ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
                        va.setValue(Offset.ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
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
                        if (isFinite(b.M)) {
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
                    this.bods_.forEach(function (b) {});
                };
                RigidBodySim.prototype.restoreState = function () {
                    if (this.recentState_ != null) {
                        this.varsList_.setValues(this.recentState_, true);
                    }
                    this.bods_.forEach(function (b) {});
                };
                RigidBodySim.prototype.findCollisions = function (collisions, vars, stepSize) {
                    throw new Error("TODO: findCollisions");
                };
                return RigidBodySim;
            }(AbstractSubject_1.default);
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
                function Force(name, body_, location_, locationCoordType_, direction_, directionCoordType_) {
                    var _this = _super.call(this, name) || this;
                    _this.body_ = body_;
                    _this.location_ = location_;
                    _this.locationCoordType_ = locationCoordType_;
                    _this.direction_ = direction_;
                    _this.directionCoordType_ = directionCoordType_;
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
                    throw new Error("TODO");
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
                Vector.prototype.cross = function (rhs) {
                    var ax = this.x;
                    var ay = this.y;
                    var az = this.z;
                    var bx = rhs.x;
                    var by = rhs.y;
                    var bz = rhs.z;
                    var x = ay * bz - az * by;
                    var y = az * bx - ax * bz;
                    var z = ax * by - ay * bx;
                    return new Vector(x, y, z);
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
                Vector.prototype.rotate = function (spinor) {
                    if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
                        return this;
                    } else {
                        throw new Error("TODO: rotate(spinor)");
                    }
                };
                Vector.dual = function (B) {
                    return new Vector(-B.yz, -B.zx, -B.xy);
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