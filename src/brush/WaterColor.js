import { randomNormal, interpolateArray } from 'd3'
import { perlin } from '../noise'

export default class WaterColor {

  constructor(context, options) {
    this.ctx = context
    const {
      baseRadius = 10,
      centerX = 0,
      centerY = 0,
      numPoints = 12,
      subdivisions = 0,
      noiseFunction = perlin.noise,
      rVariance = 5,
      numLayers = 1,
    } = options

    this.baseRadius = baseRadius
    this.centerX = centerX
    this.centerY = centerY
    this.numPoints = numPoints
    this.subdivisions = subdivisions
    this.noiseFunction = noiseFunction
    this.rVariance = rVariance
    this.distortedPolygons = []

    let points = []

    for(let i=0; i<numPoints; i++) {
      let angle = i * (2 * Math.PI / numPoints),
        x = centerX + baseRadius * Math.cos(angle),
        y = centerY + baseRadius * Math.sin(angle)

      points.push({ x, y, angle })

    }

    this.polygon = points

    let dp = this.polygon
    for(let j=0; j<3; j++) {
      dp = this.distortPolygon(subdivisions, dp)
    }
    for(let i=0; i<numLayers; i++) {
      let p = this.distortPolygon(subdivisions, dp)
      p = this.distortPolygon(subdivisions, p)
      this.distortedPolygons.push(p)
    }
  }



  distortPolygon(height, polygon) {
    if(!height) {
      return polygon
    }

    let rand = randomNormal(0.5, 0.2)

    let distortedPoly = height === this.subdivisions ? [] : [...polygon]

    polygon.forEach((from, i) => {

      let to = polygon[i+1] ? polygon[i+1] : polygon[0]

      let midPoint = rand()

      let twoPi = 2 * Math.PI

      let x = from.x + midPoint * (to.x - from.x),
        y = from.y + midPoint * (to.y - from.y),
        angle = (from.angle + (to.angle === 0 ? twoPi : to.angle)) / 2

      let variance = (angle > 0 && angle < Math.PI/2) ? this.rVariance/3 : this.rVariance
      // let variance = this.rVariance

      let newFrom = {
        x: from.x + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * variance),
        y: from.y + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * variance),
        angle: from.angle,
      }

      let inserted = {
        x: x + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * variance),
        y: y + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * variance),
        angle
      }

      distortedPoly.push(newFrom)
      distortedPoly.push(inserted)

      return to
    }, null)


    return this.distortPolygon(height - 1, distortedPoly)

  }

  noisePolygon(context, baseRadius, centerX, centerY, numPoints=12, subdivisions=0, noiseFunction=perlin.noise) {

    let points = []
    let noiseStart = Math.random() * 10,
      noiseStep = 0.01,
      distortionRadius = 10

    for(let i=0; i<numPoints; i++) {
      let angle = i * (2 * Math.PI / numPoints),
        x = centerX + baseRadius * Math.cos(angle),
        y = centerY + baseRadius * Math.sin(angle)

      // blob
      // let noiseX = Math.cos(noiseStart + x * noiseStep),
      //   noiseY = Math.sin(noiseStart + y * noiseStep)

      let noiseX = Math.cos(angle * i + noiseStep * i + noiseStart),
        noiseY = Math.sin(angle * i + noiseStep * i + noiseStart)

      let xOut = x + distortionRadius * Math.cos(2 * Math.PI * noiseFunction(noiseX, noiseY, 0)),
        yOut = y + distortionRadius * Math.sin(2 * Math.PI * noiseFunction(noiseX, noiseY, 0))

      points.push([ xOut, yOut ])

    }

    // context.beginPath()

    let polygon = new Path2D()

    points.forEach((point,i) => {
      let from = point,
        to = points[i+1]

      if(!to) return

      if(!i) polygon.moveTo(from[0], from[1])
      polygon.lineTo(to[0], to[1])

    })

    polygon.closePath()
    context.fill(polygon)

  }

}