const chroma = require('chroma-js')
const { poissonSampler } = require("../../technique")
const { WaterColor } = require("../../brush")
const { gaussianRand } = require('../../utils')

module.exports = function drawBg(context, width, height, colors, bgColor) {
  // const bgColor = chroma.mix('#fff', randomColors[0], 0.1)
  // const bgColor = '#ffe6cc' // orange
  // const bgColor = '#ccdbff' // blue
  // const bgColor = '#141d2f' // darker blue
  // const bgColor = '#26375a' // dark blue
  // const bgColor = '#010a18' // dark blue
  context.fillStyle = bgColor
  context.rect(0, 0, width, height)
  context.fill()
// return
  let pointData = poissonSampler(width, height, Math.sqrt(width*width + height*height)/2)

  // let pointData = []
  // for(let h = 100; h<canvas.height;h+=450) {
  //   for(let w = 100; w<canvas.width;w+=450) {
  //     pointData.push({
  //       x: w,
  //       y: h
  //     })
  //   }
  // }

  context.globalAlpha = 0.015
console.log('a')
  let wcs = pointData.map((point) => {

    // let c = chroma.mix('#fff', randomColors[0],1)
    let c = [0, colors[2], colors[5]][Math.floor(Math.random() * 3)] || colors[0]
    if(!c) return
    c = chroma(c)
    // c = c.hsl()
    // c[1] += -0.05 + Math.random() * 0.1
    // c[2] += -0.05 + gaussianRand() * 0.1
    // c[3] += -0.6 * (centerDist/dMax) + gaussianRand() * 0.4
    // c[3] = gaussianRand()
    // c[3] = 0.2
    // c[2] += gaussianRand(-0.05, 0.1)

    // c = chroma.hsl(...c)
    c = c.darken(gaussianRand(0.5,0.5))
    c = c.desaturate(gaussianRand(0,0.2))
    // c = c.desaturate()

    c = c.css()
    // context.fillStyle = c

    // context.globalAlpha = 0.01
    let wc = new WaterColor(context, {
      baseRadius: 40,
      centerX: point.x,
      centerY: point.y,
      numPoints: 6,
      subdivisions: 7,
      rVariance: 60,
      initialrVariance: 250,
      numLayers: 60,
      noiseFunction: () => gaussianRand(0.3,0.2),
      color: c,
    })

    wc.run()
    console.log(wc)
    return wc
  }).filter(d => d)
  console.log('b')
  wcs[0].distortedPolygons.forEach((p,i) => {
    // console.log(i)
    wcs.forEach(wc => {
      context.fillStyle = wc.color
      drawPolygon(wc.distortedPolygons[i])
    })
  })
  console.log('c')



  function drawPolygon(points) {
    // console.log(points.length)
    // let polygon = new Path2D()

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
