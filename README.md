# davinci-newton
2D and 3D Physics Engine using Geometric Algebra, and Units of Measure.

# Getting Started

The following code illustrates the basic flow. For a working example see [STEMCstudio](https://www.stemcstudio.com).

## Constructing the core simulation using the `Physics3` engine.

```typescript
import {
    Geometric3,
    Physics3,
    RungeKutta,
    ConstantEnergySolver,
    DefaultAdavanceStrategy,
    Block3,
    Spring3
} from 'davinci-newton'

//
// Constants
//
const e1 = Geometric3.e1
const e2 = Geometric3.e2
const e3 = Geometric3.e3
const kg = Geometric3.kilogram
const m = Geometric3.meter
const s = Geometric3.second

//
// Initialization
//
const sim = new Physics3()
const rk4 = new RungeKutta(sim)
const ads = new ConstantEnergySolver(sim, sim, rk4)
ads.tolerance = 1E-5
ads.stepLowerBound = 1E-7
const strategy = new DefaultAdvanceStrategy(sim, ads)
const Δt = 0.01 * s

//
// Add objects
//
const width = 0.5 * m
const height = 0.1 * m
const depth = 0.5 * m
const block1 = new Block3(width, height, depth)
const block2 = new Block3(width, height, depth)

block1.M = 1 * kg
block2.M = 1 * kg

block1.X = -1.0 * e1 * m
block2.X = +1.0 * e1 * m

sim.addBody(block1)
sim.addBody(block2)

//
// Add forces
//
const spring = new Spring3(block1, block2)
spring.restLength = 1 * m
spring.stiffness = 1 * kg / (s * s)
sim.addForceLaw(spring)
spring.attach1 = (block1.width * e1 + 0 * block1.height * e2 + block1.depth * e3) / 2

// Inside animation "loop"
strategy.advance(Δt.a, Δt.uom)
```
