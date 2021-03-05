# davinci-newton
3D Physics Modeling and Engine using Geometric Algebra, Units of Measure, and TypeScript.

# Getting Started

The following code illustrates the basic flow. For a working example see [STEMCstudio](https://www.stemcstudio.com).
Look for examples with `NEWTON` in the title. 

## Constructing the core simulation using the `Physics3` engine.

```typescript
//
// Constants
//
const e1 = NEWTON.Geometric3.e1
const e2 = NEWTON.Geometric3.e2
const e3 = NEWTON.Geometric3.e3
const kilogram = NEWTON.Geometric3.kilogram
const meter = NEWTON.Geometric3.meter
const second = NEWTON.Geometric3.second

//
// Initialization
//
const sim = new NEWTON.Physics3()
const rk4 = new NEWTON.RungeKutta(sim)
const ads = new NEWTON.ConstantEnergySolver(sim, sim, rk4)
ads.tolerance = 1E-5
ads.stepLowerBound = 1E-7
const strategy = new NEWTON.DefaultAdvanceStrategy(sim, ads)
const Δt = 0.01 * second
sim.showForces = true

//
// Add objects
//
const width = 0.5 * meter
const height = 0.1 * meter
const depth = 0.5 * meter
const block1 = new NEWTON.Block3(width, height, depth)
const block2 = new NEWTON.Block3(width, height, depth)

block1.M = 1 * kilogram
block2.M = 1 * kilogram

block1.X = -1.0 * e1 * meter
block2.X = +1.0 * e1 * meter

sim.addBody(block1)
sim.addBody(block2)

//
// Add forces
//
const spring = new NEWTON.Spring3(block1, block2)
spring.restLength = 1 * meter
spring.stiffness = 1 * kilogram / (second * second)
sim.addForceLaw(spring)
spring.attach1 = (block1.width * e1 + 0 * block1.height * e2 + block1.depth * e3) / 2

// Inside animation "loop"
strategy.advance(Δt.a, Δt.uom)
```

## Visualizing the simulation using the `EIGHT` library.

The `Block3` class provides objects for modeling; they do not have a graphics role.
You must add your own diagram. This can be done using the `EIGHT` library, for example.

```typescript
/**
 * Returns an event listener function for handling the 'resize' event.
 * The returned function, when invoked, modifies the canvas size of the engine
 * and updates the aspect ratio of the camera.
 */
function makeResizeToWindowListener(engine: EIGHT.Engine, camera: EIGHT.PerspectiveCamera): () => void {
    const resizeListener = function() {
      engine.size(window.innerWidth, window.innerHeight)
      engine.canvas.style.width = `${window.innerWidth}px`
      engine.canvas.style.height = `${window.innerHeight}px`
      camera.aspect	= window.innerWidth / window.innerHeight
    }
    return resizeListener
}

const e1 = EIGHT.Geometric3.e1(true)
const e2 = EIGHT.Geometric3.e2(true)
const e3 = EIGHT.Geometric3.e3(true)

/**
 * A utility for dynamicall rendering a list of simulation objects.
 */
export default class MotionDiagram {
    private readonly engine: EIGHT.Engine
    private readonly scene: EIGHT.Scene
    private readonly ambients: EIGHT.Facet[] = []
    private readonly camera = new EIGHT.PerspectiveCamera()
    private readonly trackball: EIGHT.TrackballControls
    private readonly dirLight = new EIGHT.DirectionalLight()
    private readonly arrow: EIGHT.Arrow
    private readonly ball: EIGHT.Sphere
    private readonly box: EIGHT.Box
    private readonly rod: EIGHT.Cylinder

    /**
     * 
     */
    constructor(canvasId: string, private simList: NEWTON.SimList) {
        this.engine = new EIGHT.Engine(canvasId)
            .size(500, 500)
            .clearColor(0.1, 0.1, 0.1, 1.0)
            .enable(EIGHT.Capability.DEPTH_TEST)
        
        this.scene = new EIGHT.Scene(this.engine)
        
        this.camera.eye.copyVector(3 * e3 + 2 * e2)
        this.ambients.push(this.camera)

        // The trackball captures the camera position for resetting.
        this.trackball = new EIGHT.TrackballControls(this.camera)
        
        this.ambients.push(this.dirLight)
        
        this.trackball.subscribe(this.engine.canvas)
        // trackball.enableContextMenu()
        // trackball.noPan = true
        
        const marker = new EIGHT.Sphere(this.engine, {mode: 'mesh'})
        
        const grid = new EIGHT.GridZX(this.engine)
        this.scene.add(grid)
        this.arrow = new EIGHT.Arrow(this.engine)
        this.ball = new EIGHT.Sphere(this.engine, {mode: 'wire'})
        this.box = new EIGHT.Box(this.engine, {mode: 'wire'})
        this.rod = new EIGHT.Cylinder(this.engine, {mode: 'wire'})
    }

    /**
     * 
     */
    clear(): void {
        this.engine.clear()
    }
    
    /**
     * 
     */
    makeResizeToWindowListener(): () => void {
        return makeResizeToWindowListener(this.engine, this.camera)
    }

    /**
     * 
     */
    render(): void {
        this.trackball.update()
    
        this.dirLight.direction.copyVector(this.camera.look).subVector(this.camera.eye)

        const arrow = this.arrow
        const ball = this.ball
        const box = this.box
        const rod = this.rod
        this.simList.forEach((simObject) => {
            if (simObject instanceof NEWTON.Block3) {
                box.position.copyVector(simObject.X)
                box.attitude.copySpinor(simObject.R)
                box.width = simObject.width.a
                box.height = simObject.height.a
                box.depth = simObject.depth.a
                box.color = simObject['color']
                box.render(this.ambients)
                // Show linear momentum
                arrow.position.copyVector(simObject.X)
                arrow.vector = simObject.P * 0.8
                arrow.color = EIGHT.Color.red
                arrow.render(this.ambients)
                // Show angular momentum.
                // TODO: a bivector representation would be better here.
                const J = new NEWTON.Geometric3().dual(simObject.L).neg()
                arrow.position.copyVector(simObject.X)
                arrow.vector = J * 10
                arrow.color = simObject['color']
                // arrow.render(ambients)
            }
            else if (simObject instanceof NEWTON.Sphere3) {
                ball.position.copyVector(simObject.X)
                ball.attitude.copySpinor(simObject.R)
                ball.radius = simObject.radius.a
                ball.color = simObject['color']
                ball.render(this.ambients)
                // Show the momenta
                arrow.position.copyVector(simObject.X)
                arrow.vector = simObject.P * 0.8
                arrow.color = EIGHT.Color.red
                arrow.render(this.ambients)
            }
            else if (simObject instanceof NEWTON.Cylinder3) {
                rod.position.copyVector(simObject.X)
                rod.attitude.copySpinor(simObject.R)
                rod.radius = simObject.radius.a
                rod.length = simObject.height.a
                rod.color = simObject['color']
                rod.render(this.ambients)
                // Show the momenta
                arrow.position.copyVector(simObject.X)
                arrow.vector = simObject.P * 0.8
                arrow.color = EIGHT.Color.red
                arrow.render(this.ambients)
            }
            else if (simObject instanceof NEWTON.Spring3) {
                const spring = simObject;
                const end1 = spring.end1;
                const end2 = spring.end2;
                const s = end2 - end1;
                rod.X.copyVector(end1+end2).divByScalar(2)
                rod.axis = end2 - end1
                rod.length = s.magnitude().a
                rod.render(this.ambients)
            }
            else if (simObject instanceof NEWTON.Force3) {
                const forceApp = simObject
                const body = forceApp.getBody()
                const F = forceApp.F
                const x = forceApp.x
                arrow.position.copyVector(x)
                arrow.vector = F * 1
                arrow.color = EIGHT.Color.blue
                arrow.render(this.ambients)
            } 
            else {
            }
        })
        this.scene.render(this.ambients)
    }
    
    /**
     * Resets the the viewing position.
     */
    resetView(): void {
        this.trackball.reset()
    }
}
```

## Adding an energy-time graph to the simulation.

```typescript
//
// Initialization. 'graph' is the identifier of a canvas element.
//
const graph = new NEWTON.EnergyTimeGraph('graph', sim.varsList)

graph.axes.hAxisScale = second.uom
graph.axes.vAxisScale = sim.totalEnergy().uom

/**
 * Counter used to throttle data capture by the graph.
 */
let frame = 0

// Inside animation "loop"
frame++
if (frame % 5 === 0) {
    graph.memorize()
}
graph.render()
```

# Thanks

Erik Neumann at [myPhysicsLαb.com](www.myphysicslab.com) for the original 2D code and graphing.

This project adds:

* 3D
* Geometric Algebra
* Units of Measure
* TypeScript integration
* Generic n-dimensional Physics Engine



