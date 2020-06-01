const { perlin } = require('../noise')

module.exports = function noisePolygon(context, baseRadius, centerX, centerY, numPoints=12, subdivisions=0, noiseFunction=perlin.noise) {

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

  context.beginPath()

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
