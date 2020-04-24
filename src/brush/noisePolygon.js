import { perlin } from '../noise'

export default function noisePolygon(context, baseRadius, centerX, centerY, numPoints=12, noiseFunction=perlin.noise, subdivisions=0) {

  let points = []
  let noiseStart = Math.random() * 10,
    noiseStep = 0.0001

  for(let i=0; i<numPoints; i++) {
    let angle = i * (2 * Math.PI / numPoints),
      x = centerX + baseRadius * Math.cos(angle),
      y = centerY + baseRadius * Math.sin(angle)

    let xOut = x + 10 * noiseFunction(x, 0, 0),
      yOut = y + 10 * noiseFunction(0, y, 0)

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