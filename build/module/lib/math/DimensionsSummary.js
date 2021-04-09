/**
 * A summary of all the exponents in physical dimensions.
 * This is used to improve the performance of comparing units of measure.
 * @hidden
 */
export var DimensionsSummary;
(function (DimensionsSummary) {
    /**
     * The `amount of substance` base quantity.
     */
    DimensionsSummary[DimensionsSummary["AMOUNT_OF_SUBSTANCE"] = 0] = "AMOUNT_OF_SUBSTANCE";
    DimensionsSummary[DimensionsSummary["ANGULAR_MOMENTUM"] = 1] = "ANGULAR_MOMENTUM";
    /**
     * The `area` derived quantity.
     */
    DimensionsSummary[DimensionsSummary["AREA"] = 2] = "AREA";
    /**
     * The `electric charge, quantity of electricity` derived quantity.
     */
    DimensionsSummary[DimensionsSummary["ELECTRIC_CHARGE"] = 3] = "ELECTRIC_CHARGE";
    /**
     * The `electric current` base quantity.
     */
    DimensionsSummary[DimensionsSummary["ELECTRIC_CURRENT"] = 4] = "ELECTRIC_CURRENT";
    DimensionsSummary[DimensionsSummary["ELECTRIC_FIELD"] = 5] = "ELECTRIC_FIELD";
    DimensionsSummary[DimensionsSummary["ELECTRIC_PERMITTIVITY_TIMES_AREA"] = 6] = "ELECTRIC_PERMITTIVITY_TIMES_AREA";
    DimensionsSummary[DimensionsSummary["ENERGY_OR_TORQUE"] = 7] = "ENERGY_OR_TORQUE";
    DimensionsSummary[DimensionsSummary["FORCE"] = 8] = "FORCE";
    DimensionsSummary[DimensionsSummary["FRICTION_COEFFICIENT"] = 9] = "FRICTION_COEFFICIENT";
    DimensionsSummary[DimensionsSummary["INV_LENGTH"] = 10] = "INV_LENGTH";
    DimensionsSummary[DimensionsSummary["INV_MASS"] = 11] = "INV_MASS";
    DimensionsSummary[DimensionsSummary["INV_MOMENT_OF_INERTIA"] = 12] = "INV_MOMENT_OF_INERTIA";
    DimensionsSummary[DimensionsSummary["INV_TIME"] = 13] = "INV_TIME";
    /**
     * The `length` base qiantity.
     */
    DimensionsSummary[DimensionsSummary["LENGTH"] = 14] = "LENGTH";
    /**
     * The `liminous intensity` base quantity.
     */
    DimensionsSummary[DimensionsSummary["LUMINOUS_INTENSITY"] = 15] = "LUMINOUS_INTENSITY";
    /**
     * The `mass` base quantity.
     */
    DimensionsSummary[DimensionsSummary["MASS"] = 16] = "MASS";
    DimensionsSummary[DimensionsSummary["MOMENT_OF_INERTIA"] = 17] = "MOMENT_OF_INERTIA";
    DimensionsSummary[DimensionsSummary["MOMENTUM"] = 18] = "MOMENTUM";
    DimensionsSummary[DimensionsSummary["MOMENTUM_SQUARED"] = 19] = "MOMENTUM_SQUARED";
    DimensionsSummary[DimensionsSummary["ONE"] = 20] = "ONE";
    DimensionsSummary[DimensionsSummary["RATE_OF_CHANGE_OF_AREA"] = 21] = "RATE_OF_CHANGE_OF_AREA";
    DimensionsSummary[DimensionsSummary["STIFFNESS"] = 22] = "STIFFNESS";
    /**
     * The `thermodynamic temperature` base quantity.
     */
    DimensionsSummary[DimensionsSummary["THERMODYNAMIC_TEMPERATURE"] = 23] = "THERMODYNAMIC_TEMPERATURE";
    /**
     * The `time` base quantity.
     */
    DimensionsSummary[DimensionsSummary["TIME"] = 24] = "TIME";
    DimensionsSummary[DimensionsSummary["TIME_SQUARED"] = 25] = "TIME_SQUARED";
    DimensionsSummary[DimensionsSummary["VELOCITY"] = 26] = "VELOCITY";
    DimensionsSummary[DimensionsSummary["VELOCITY_SQUARED"] = 27] = "VELOCITY_SQUARED";
    /**
     * The `volume` derived quantity.
     */
    DimensionsSummary[DimensionsSummary["VOLUME"] = 28] = "VOLUME";
})(DimensionsSummary || (DimensionsSummary = {}));
