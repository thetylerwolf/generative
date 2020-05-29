import chroma from 'chroma-js'
import SimplexNoise from 'simplex-noise'

import {
  // gaussianRand,
  makeCanvas,
} from '~/utils'
import {
  // poissonSampler,
  MarchingSquares,
} from '~/technique'
// import {
//   WaterColor,
// } from '~/brush'
import drawPolys from './drawPolys'

export default function drawBlob(context, dpr, colors) {

  const sCanvas = makeCanvas(),
    sCtx = sCanvas.getContext('2d')

  const { width, height } = context.canvas

  sCanvas.width = width
  sCanvas.height = height

  context.scale(dpr,dpr)

  // document.body.append(sCanvas)

  // const colors = ['rgba(255, 255, 255, 1)']

  const simplex1 = new SimplexNoise(),
    simplex2 = new SimplexNoise()

  const params = {
    noise_scale: 50,
    noise_persistence: 0.5,
    noiseFunction: (x,y,z) => simplex1.noise3D(x/2,y,z),
    // noiseFunction: (x,y,z) => simp.noise3D(x,y,z),
    num_shapes: 5,
    bottom_size: -0.1,
    top_size: 0.5,
    gradient: 'radial',
    colors: ['rgba(255,255,255,1)'],
    width: width,
    height: height,
    padding: 0,
    cell_dim: 2,
    context: sCtx,
  }

  const params2 = {
    ...params,
    noiseFunction: (x,y,z) => simplex2.noise3D(x/2,y,z),
  }

  let ms = new MarchingSquares(params)
  let ms2 = new MarchingSquares(params2)

  sCtx.globalAlpha = 1
  let dx = -width * dpr / 2 + Math.random() * width * dpr,
    dy = -height * dpr / 2 + Math.random() * height * dpr
  sCtx.save()
  sCtx.translate(dx, dy)
  // ms.trace()
  ms.draw()
  sCtx.restore()

  dx = -width * dpr / 2 + Math.random() * width * dpr,
  dy = -height * dpr / 2 + Math.random() * height * dpr
  sCtx.save()
  sCtx.translate(dx, dy)
  ms2.draw()
  sCtx.restore()

  sCtx.globalCompositeOperation = 'source-atop'

  let paintColors = [
    chroma(colors[1]).css(),
    chroma(colors[2]).css(),
    // chroma('#ffa').darken(3).css()
  ]
  // drawBg2(sCtx, paintColors, '#c0c0c0')
  drawPolys(sCtx, paintColors, '#c0c0c0')

  context.globalAlpha = 1
  context.drawImage(sCanvas, 0, 0)

}

// function drawBg2(context, colors, bgColor) {

//   const canvas = context.canvas

//   context.fillStyle = bgColor
//   context.rect(0, 0, canvas.width, canvas.height)
//   context.fill()
//   let pointData = poissonSampler(canvas.width, canvas.height, context.canvas.width/10)

//   context.globalAlpha = 0.015

//   const colors2 = ['#ffD700', '#ffD700']

//   let wcs = pointData.map((point) => {

//     let c = [colors[0], colors[2]][Math.round(Math.random())] || colors[0]
//     // let c = colors2[Math.round(Math.random())] || colors2[0]

//     c = chroma(c)
//     // c = c.hsl()
//     // c[1] += -0.05 + Math.random() * 0.1
//     // c[2] += -0.05 + gaussianRand() * 0.1
//     // c[3] += -0.6 * (centerDist/dMax) + gaussianRand() * 0.4
//     // c[3] = gaussianRand()
//     // c[3] = 0.2
//     // c[2] += gaussianRand(-0.05, 0.1)

//     // c = chroma.hsl(...c)
//     c = c.darken(gaussianRand(0.5,0.5))
//     // c = c.desaturate(gaussianRand(0,0.2))

//     c = c.css()
//     // context.fillStyle = c

//     // context.globalAlpha = 0.01
//     let wc = new WaterColor(context, {
//       baseRadius: 10,
//       centerX: point.x,
//       centerY: point.y,
//       numPoints: 6,
//       subdivisions: 7,
//       rVariance: 60,
//       initialrVariance: 10,
//       numLayers: 30,
//       noiseFunction: () => gaussianRand(0.3,0.2),
//       color: c,
//     })

//     wc.run()

//     return wc
//   })
//   wcs[0].distortedPolygons.forEach((p,i) => {
//     wcs.forEach(wc => {
//       context.fillStyle = wc.color
//       drawPolygon(wc.distortedPolygons[i])
//     })
//   })



//   function drawPolygon(points) {
//     // console.log(points.length)
//     let polygon = new Path2D()

//     points.forEach((point,i) => {
//       let from = point,
//         to = points[i+1]

//       if(!to) return

//       if(!i) polygon.moveTo(from.x, from.y)
//       polygon.lineTo(to.x, to.y)

//     })

//     polygon.closePath()

//     context.fill(polygon)
//   }

// }
