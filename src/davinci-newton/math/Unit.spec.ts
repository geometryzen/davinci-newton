import { Dimensions } from './Dimensions';
import { QQ } from './QQ';
import { Unit } from './Unit';

const Rat0 = QQ.valueOf(0, 1);
const Rat1 = QQ.valueOf(1, 1);
const Rat2 = QQ.valueOf(2, 1);

const KILOGRAM = Unit.KILOGRAM;
const METER = Unit.METER;
const SECOND = Unit.SECOND;
const AMPERE = Unit.AMPERE;
const COULOMB = Unit.COULOMB;
const KELVIN = Unit.KELVIN;
const MOLE = Unit.MOLE;
const CANDELA = Unit.CANDELA;

const NEWTON = KILOGRAM.mul(METER).div(SECOND).div(SECOND);
const JOULE = NEWTON.mul(METER);
const HERTZ = Unit.inv(SECOND);
const WATT = JOULE.div(SECOND);
const VOLT = JOULE.div(COULOMB);
const WEBER = VOLT.mul(SECOND);
const TESLA = WEBER.div(METER).div(METER);
const OHM = VOLT.div(AMPERE);
const SIEMEN = AMPERE.div(VOLT);
const FARAD = COULOMB.div(VOLT);
const HENRY = KILOGRAM.mul(METER).mul(METER).div(COULOMB).div(COULOMB);
const PASCAL = NEWTON.div(METER).div(METER);

describe("Unit", function () {
    const symbols = ["kg", "m", "s", "C", "K", "mol", "cd"];

    it("Construction", function () {
        const meter = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        expect(meter.multiplier).toBe(1);
    });

    it("toString", function () {
        const dimensionless = Unit.valueOf(1234, Dimensions.valueOf(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        // expect(ONE.toString(void 0, true)).toBe("");
        expect(METER.toString(void 0, true)).toBe("m");
        expect(KILOGRAM.toString(void 0, true)).toBe("kg");
        expect(SECOND.toString(void 0, true)).toBe("s");
        expect(AMPERE.toString(10, true)).toBe("A");
        expect(COULOMB.toString(10, true)).toBe("C");
        expect(KELVIN.toString(10, true)).toBe("K");
        expect(MOLE.toString(10, true)).toBe("mol");
        expect(CANDELA.toString(10, true)).toBe("cd");
        expect(dimensionless.toString(10, true)).toBe("1234");
    });
    it("mul", function () {
        const meter = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const centimeter = meter.__mul__(0.01);
        const inch = centimeter.__mul__(2.54);
        const foot = inch.__mul__(12);
        const yard = foot.__mul__(3);
        const mile = yard.__mul__(1760);
        const micron = meter.__mul__(1e-6);
        const nanometer = meter.__mul__(1e-9);

        expect(meter.toFixed(4, true)).toBe("m");
        expect(centimeter.toString()).toBe("0.01 m");
        expect(inch.toFixed(4).toString()).toBe("0.0254 m");
        expect(foot.toFixed(4).toString()).toBe("0.3048 m");
        expect(yard.toFixed(4).toString()).toBe("0.9144 m");
        expect(mile.toFixed(3).toString()).toBe("1609.344 m");
        expect(micron.toString()).toBe("0.000001 m");
        expect(nanometer.toString()).toBe("1e-9 m");

        expect(inch.multiplier).toBeCloseTo(0.0254, 4);
        expect(foot.multiplier).toBeCloseTo(0.3048, 4);
        expect(yard.multiplier).toBeCloseTo(0.9144, 4);
        expect(mile.multiplier).toBeCloseTo(1609.344, 4);
        expect(micron.multiplier * 1e6).toBe(1);
        expect(nanometer.multiplier * 1e9).toBe(1);
    });
    it("mul by number", function () {
        const meter = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const yard = meter.__mul__(2.54 * 36 / 100);
        expect(yard.toString()).toBe("0.9144 m");
    });
    it("mul by Unit", function () {
        const meter = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const second = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat0, Rat1, Rat0, Rat0, Rat0, Rat0), symbols);
        const areaUnit = meter.mul(second);
        expect(meter.toString(void 0, true)).toBe("m");
        expect(second.toString(void 0, true)).toBe("s");
        expect(areaUnit.toString(void 0, true)).toBe("m s");
    });
    it("div by Unit", function () {
        const meter = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const second = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat0, Rat1, Rat0, Rat0, Rat0, Rat0), symbols);
        const speedUnit = meter.div(second);
        expect(meter.toString(void 0, true)).toBe("m");
        expect(second.toString(void 0, true)).toBe("s");
        expect(speedUnit.toString(10, true)).toBe("m/s");
    });
    it("pow by number", function () {
        const meter = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const square = Unit.pow(meter, Rat2);
        // const radian = Unit.valueOf(1, Dimensions.valueOf(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        expect(meter.toString(void 0, true)).toBe("m");
        expect(square.toString(void 0, true)).toBe("m**2");
    });
    it("inverse", function () {
        // const dimensionless = Unit.valueOf(1234, Dimensions.valueOf(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        // expect(Unit.inv(Unit.ONE)).toBe(Unit.ONE);
        expect(Unit.inv(METER).toString(void 0, true)).toBe("m**-1");
        expect(Unit.inv(KILOGRAM).toString(void 0, true)).toBe("kg**-1");
        expect(Unit.inv(SECOND).toString(10, true)).toBe("Hz");
        expect(Unit.inv(AMPERE).toString(void 0, true)).toBe("s C**-1");
        expect(Unit.inv(KELVIN).toString(void 0, true)).toBe("K**-1");
        expect(Unit.inv(MOLE).toString(void 0, true)).toBe("mol**-1");
        expect(Unit.inv(CANDELA).toString(void 0, true)).toBe("cd**-1");
    });
    it("electric current", function () {
        expect(AMPERE.toString(10, true)).toBe("A");
    });
    it("electric charge", function () {
        expect(COULOMB.toString(10, true)).toBe("C");
    });
    it("force", function () {
        expect(NEWTON.toString(10, true)).toBe("N");
    });
    it("energy", function () {
        expect(JOULE.toString(10, true)).toBe("J or N·m");
    });
    it("frequency", function () {
        expect(HERTZ.toString(10, true)).toBe("Hz");
    });
    it("power", function () {
        expect(WATT.toString(10, true)).toBe("W or J/s");
    });
    it("electric potential", function () {
        expect(VOLT.toString(10, true)).toBe("V or W/A");
    });
    it("electric field strength", function () {
        expect(VOLT.div(METER).toString(10, true)).toBe("V/m");
    });
    it("magnetic flux", function () {
        expect(WEBER.toString(10, true)).toBe("Wb");
    });
    it("magnetic flux density", function () {
        expect(TESLA.toString(10, true)).toBe("T or Wb/m**2");
    });
    it("electrical resistance", function () {
        expect(OHM.toString(10, true)).toBe("Ω or V/A");
    });
    it("electrical conductance", function () {
        expect(SIEMEN.toString(10, true)).toBe("S or A/V");
    });
    it("electrical capacitance", function () {
        expect(FARAD.toString(10, true)).toBe("F or C/V");
    });
    it("electrical inductance", function () {
        expect(WEBER.div(AMPERE).toString(10, true)).toBe("H or Wb/A");
        expect(HENRY.toString(10, true)).toBe("H or Wb/A");
    });
    it("electric permittivity", function () {
        expect(FARAD.div(METER).toString(10, true)).toBe("F/m");
    });
    it("electric permeability", function () {
        expect(HENRY.div(METER).toString(10, true)).toBe("H/m");
    });
    it("pressure, stress", function () {
        expect(PASCAL.toString(10, true)).toBe("Pa or N/m**2 or J/m**3");
    });
    it("angular momentum", function () {
        expect(JOULE.mul(SECOND).toString(10, true)).toBe("J·s");
    });
    it("dynamic viscosity", function () {
        expect(PASCAL.mul(SECOND).toString(10, true)).toBe("Pa·s");
    });
    it("moment of force", function () {
        expect(NEWTON.mul(METER).toString(10, true)).toBe("J or N·m");
    });
    it("surface tension", function () {
        expect(NEWTON.div(METER).toString(10, true)).toBe("N/m");
    });
    it("heat flux density", function () {
        expect(WATT.div(METER).div(METER).toString(10, true)).toBe("W/m**2");
    });
    it("heat capacity, entropy", function () {
        expect(JOULE.div(KELVIN).toString(10, true)).toBe("J/K");
    });
    it("energy density", function () {
        expect(JOULE.div(METER).div(METER).div(METER).toString(10, true)).toBe("Pa or N/m**2 or J/m**3");
    });
    it("specific energy", function () {
        expect(JOULE.div(KILOGRAM).toString(10, true)).toBe("J/kg");
    });
    it("molar energy", function () {
        expect(JOULE.div(MOLE).toString(10, true)).toBe("J/mol");
    });
    it("electric line charge density", function () {
        expect(COULOMB.div(METER).toString(10, true)).toBe("C/m");
    });
    it("electric surface charge density", function () {
        expect(COULOMB.div(METER).div(METER).toString(10, true)).toBe("C/m**2");
    });
    it("electric volume charge density", function () {
        expect(COULOMB.div(METER).div(METER).div(METER).toString(10, true)).toBe("C/m**3");
    });
    it("exposure (x-rays and γ-rays)", function () {
        expect(COULOMB.div(KILOGRAM).toString(10, true)).toBe("C/kg");
    });
    it("sqrt(m)", function () {
        expect(Unit.sqrt(METER).toString(10, true)).toBe("m**1/2");
    });

    describe("Operator Overloading", function () {

        var m = METER;

        describe("Binary +", function () {

            it("m.__add__(m)", function () {
                var actual = m.__add__(m);
                expect(actual.multiplier).toBe(2);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });
            it("m.__radd__(m)", function () {
                var actual = m.__radd__(m);
                expect(actual.multiplier).toBe(2);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

        describe("Binary -", function () {

            it("m.__sub__(m)", function () {
                var actual = m.__sub__(m);
                expect(actual.multiplier).toBe(0);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m.__rsub__(m)", function () {
                var actual = m.__rsub__(m);
                expect(actual.multiplier).toBe(0);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

        describe("Binary *", function () {

            it("m.__mul__(m)", function () {
                var actual = m.__mul__(m);
                expect(actual.toString(void 0, true)).toBe("m**2");
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(2);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m * 5", function () {
                var actual = m.__mul__(5);
                expect(actual.toString()).toBe("5 m");
                expect(actual.multiplier).toBe(5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m.__rmul__(m)", function () {
                var actual = m.__rmul__(m);
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(2);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("5 * m", function () {
                var actual = m.__rmul__(5);
                expect(actual.multiplier).toBe(5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

        describe("Binary /", function () {

            it("m.__div__(m)", function () {
                var actual = m.__div__(m);
                expect(actual.toString(void 0, true)).toBe("");
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(0);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m / 5", function () {
                var actual = m.__div__(5);
                expect(actual.toString()).toBe("0.2 m");
                expect(actual.multiplier).toBe(1 / 5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m.__rdiv__(m)", function () {
                var actual = m.__rdiv__(m);
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(0);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("5 / m", function () {
                var actual = m.__rdiv__(5);
                expect(actual instanceof Unit).toBe(true);
                expect(actual.multiplier).toBe(5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(-1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

    });

});
