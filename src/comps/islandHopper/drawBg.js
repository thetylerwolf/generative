const chroma = require('chroma-js')
const { poissonSampler, ColorSampler } = require("../../technique")
const { WaterColor } = require("../../brush")
const { gaussianRand } = require('../../utils')

module.exports = function drawBg(context, width, height, colors, bgColor) {

  // const bgColor = chroma.mix('#fff', randomColors[0], 0.1)
  // const bgColor = '#ffe6cc' // orange
  // const bgColor = '#ccdbff' // blue
  // const bgColor = '#141d2f' // darker blue
  // const bgColor = '#26375a' // dark blue
  // const bgColor = '#010a18' // dark blue
  context.fillStyle = '#fff'
  context.rect(0, 0, width, height)
  context.fill()
  context.fillStyle = bgColor
  context.rect(0, 0, width, height)
  context.fill()
// return
  let colorSampler = new ColorSampler({
    width,
    height,
    // colors: [colors[2], colors[5], colors[2], colors[5]],
    colors: [...colors, ...colors, ...colors, ...colors],
    density: 20,
    // maxCenterRange: 500,
    type: 'points',
    // gradientAngle: Math.PI,
  })

  const maxRadius = 1000,
    pointRadius = Math.min(maxRadius, Math.sqrt(width*width + height*height) / 17),
    rVariance = 0.3 * pointRadius,
    wcSettings = {
      baseRadius: 0.2 * pointRadius,
      numPoints: 6,
      subdivisions: 7,
      initialrVariance: rVariance,
      numLayers: 30,
      noiseFunction: () => Math.random(),
    }

  let pointData = poissonSampler(
    width,
    height,
    pointRadius
  )

  context.globalAlpha = 0.015
console.log(pointData.length, 'points')
  let wcs = pointData.map((point) => {

    let c = colorSampler.getNearestColor(point.x, point.y, 1, 0)
    if(!c) return

    c = chroma(c)

    // c = c.brighten(gaussianRand(0.5,0.2))
    c = c.darken(gaussianRand(0.5,0.2))
    c = c.desaturate(gaussianRand(0,0.2))

    c = c.css()

    let wc = new WaterColor(context, {
      ...wcSettings,
      centerX: point.x,
      centerY: point.y,
      color: c,
      rVariance: gaussianRand(0.3, 0.1) * pointRadius,
    })

    wc.run()

    return wc
  }).filter(d => d)
console.log('start wcs')
  wcs[0].distortedPolygons.forEach((p,i) => {
    wcs.forEach(wc => {
      context.fillStyle = wc.color
      drawPolygon(wc.distortedPolygons[i])
    })
  })

  // drawCircles(context, width, height, 400, 2)
  // drawCircles(context, width, height, 250, 5)
  // drawCircles(context, width, height, 250, 5)

  function drawPolygon(points) {
    // console.log(points.length)

    context.beginPath()
    points.forEach((point,i) => {
      let from = point,
        to = points[i+1]

      if(!to) return

      if(!i) context.moveTo(from.x, from.y)
      context.lineTo(to.x, to.y)

    })

    context.closePath()

    context.fill()
  }


}

function drawCircles(context, width, height, density, radius) {
  let points = poissonSampler(
    width,
    height,
    Math.sqrt(width*width + height*height) / density
  )

  points.forEach(p => circle(context, gaussianRand(radius, radius*3/4), p.x, p.y, '#fff'))
}
