  import { randomNormal, interpolateArray } from 'd3'
import { perlin } from '../noise'

const randomSeed = Math.random() * 10000

export default class WaterColor {

  constructor(context, options) {
    this.ctx = context
    const {
      baseRadius = 100,
      centerX = 0,
      centerY = 0,
      numPoints = 12,
      subdivisions = 0,
      noiseFunction = perlin.noise,
      rVariance = 5,
      numLayers = 1,
      maxPoints = 5000,
    } = options

    this.baseRadius = baseRadius
    this.centerX = centerX
    this.centerY = centerY
    this.numPoints = numPoints
    this.numLayers = numLayers
    this.subdivisions = subdivisions
    this.noiseFunction = noiseFunction
    this.rVariance = rVariance
    this.distortedPolygons = []
    this.maxPoints = maxPoints

    this.init()

  }

  init() {
    let points = []
    
    for(let i=0; i<this.numPoints; i++) {
      let angle = i * (2 * Math.PI / this.numPoints),
        x = this.centerX + this.baseRadius * Math.cos(angle),
        y = this.centerY + this.baseRadius * Math.sin(angle),
        seed = Math.abs(this.noiseFunction(i * 0.01,0,randomSeed))
        // seed = randomNormal(0.25,0.25)()
        // seed = 1

      points.push({ x, y, angle, seed })
    }

    for(let i=0; i<this.subdivisions; i++) {
      points = this.subdivide(points)
    }

    this.polygon = points
  }

  run() {
    let dp
    for(let k=0; k<this.numLayers; k++) {
      dp = this.distort(this.polygon)
      this.distortedPolygons.push(dp)
    }
  }

  distort(points) {
    let p = points
    for(let i=0; i<5; i++) {
      p = p.map(point => this.shiftPoint(point, this.rVariance))
    }
    return p
  }

  subdivide(points) {

    let newPoly = [],
      rand = randomNormal(0.5, 0.2)

    points.forEach((from, i) => {

      let to = points[i+1] ? points[i+1] : points[0]

      let midPoint = rand()
      let twoPi = 2 * Math.PI

      let x = from.x + midPoint * (to.x - from.x),
        y = from.y + midPoint * (to.y - from.y),
        seed = from.seed + midPoint * (to.seed - from.seed),
        angle = (from.angle + (to.angle === 0 ? twoPi : to.angle)) / 2

      let newPoint = {
        x: x,
        y: y,
        angle,
        seed
      }

      newPoint = this.shiftPoint(newPoint, this.rVariance)

      newPoly.push(from)
      newPoly.push(newPoint)

    })

    return newPoly
  }

  shiftPoint(point, dist) {
    let p = {
      x: randomNormal(point.x, point.seed * dist)(),
      y: randomNormal(point.y, point.seed * dist)()
    }
    return {
      ...point,
      ...p
    }
  }

}