const chroma = require('chroma-js')
const { poissonSampler, ColorSampler } = require("../../technique")
const { WaterColor, circle } = require("../../brush")
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

  let color0 = colors[0],
    color2 = colors[1],
    color1 = chroma.mix(color0, color2, 0.95)
    // color3 = chroma.mix(color2, chroma(color2).brighten(), 0.15).css()

  let colorSampler = new ColorSampler({
    width,
    height,
    // colors: [colors[2], colors[5], colors[2], colors[5]],
    // colors: [...colors, ...colors, ...colors, ...colors],
    // colors: [ color0, color1, color2 ],
    colors,
    density: 20,
    // maxCenterRange: 500,
    // type: 'gradient',
    // type: 'points',
  })

  const minRadius = height/15,
    maxRadius = height/3,
    pointRadius = Math.max(minRadius, Math.min(maxRadius, Math.sqrt(width*width + height*height) / 15)),
    rVariance = 0.3 * pointRadius,
    wcSettings = {
      baseRadius: 0.3 * pointRadius,
      numPoints: 6,
      subdivisions: 7,
      initialrVariance: rVariance,
      numLayers: 35,
      noiseFunction: () => Math.random(),
    }

  let pointData = poissonSampler(
    width,
    height,
    pointRadius
  )
console.log(pointData.length + ' points')
console.log('radius ' + pointRadius)
  context.globalAlpha = 0.015

  let wcs = pointData.map((point) => {

    let c = colorSampler.getNearestColor(point.x, point.y, 1, 0)
    if(!c) return

    c = chroma(c)

    // c = c.brighten(gaussianRand(0.5,0.2))
    c = c.darken(gaussianRand(0.5,0.2))
    c = c.desaturate(gaussianRand(0.1,0.2))

    // c = chroma.mix(c, '#fff', 0.1)
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

  wcs[0].distortedPolygons.forEach((p,i) => {
    wcs.forEach(wc => {
      context.fillStyle = wc.color
      drawPolygon(wc.distortedPolygons[i])
    })
  })

  drawCircles(context, width, height, height * 500 / 16701, height * 30 / 16701)
  drawCircles(context, width, height, height * 500 / 16701, height * 20 / 16701)
  drawCircles(context, width, height, height * 500 / 16701, height * 30 / 16701)
  // drawCircles(context, width, height, 250, 5)

  context.globalAlpha = 0.05
  context.fillStyle = '#fff'
  context.rect(0, 0, width, height)
  context.fill()

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
    Math.max(width, height) / density
  )

  points.forEach(p => {
    const r = gaussianRand(radius, radius/4)

    const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0.05)')
    circle(context, r, p.x, p.y, gradient)
  })
}
