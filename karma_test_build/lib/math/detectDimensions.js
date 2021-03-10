"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DimensionsSummary_1 = require("./DimensionsSummary");
/**
 *
 */
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
            }
            else if (L.numer === -1) {
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
            }
            else if (L.numer === 0) {
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
    }
    else if (M.numer === 0) {
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
            }
            else if (L.numer === 0) {
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
                            }
                            else if (Q.numer === 1) {
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
                    }
                    else if (T.numer === 0) {
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
                                                    }
                                                    else if (intensity.numer === 1) {
                                                        if (intensity.denom === 1) {
                                                            return DimensionsSummary_1.default.LUMINOUS_INTENSITY;
                                                        }
                                                    }
                                                }
                                            }
                                            else if (amount.numer === 1) {
                                                if (amount.denom === 1) {
                                                    if (intensity.numer === 0) {
                                                        if (intensity.denom === 1) {
                                                            return DimensionsSummary_1.default.AMOUNT_OF_SUBSTANCE;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if (temperature.numer === 1) {
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
                            }
                            else if (Q.numer === 1) {
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
                    }
                    else if (T.numer === 1) {
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
                    }
                    else if (T.numer === 2) {
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
            }
            else if (L.numer === 1) {
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
                    }
                    else if (T.numer === 0) {
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
            }
            else if (L.numer === 2) {
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
                    }
                    else if (T.numer === 0) {
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
            }
            else if (L.numer === 3) {
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
    }
    else if (M.numer === 1) {
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
                    }
                    else if (T.numer === 0) {
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
            }
            else if (L.numer === 1) {
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
                            }
                            else if (Q.numer === 0) {
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
                    }
                    else if (T.numer === -1) {
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
            }
            else if (L.numer === 2) {
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
                    }
                    else if (T.numer === -1) {
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
                    }
                    else if (T.numer === 0) {
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
    }
    else if (M.numer === 2) {
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
exports.default = detectDimensions;
