const chroma = require('chroma-js')
const SimplexNoise = require('simplex-noise')

const {
  // gaussianRand,
  makeCanvas,
} = require('~/utils')
const {
  // poissonSampler,
  MarchingSquares,
} = require('~/technique')
// const {
//   WaterColor,
// } = require('~/brush')
const drawTriangles = require('./drawTriangles2')

module.exports = function drawBlob(context, colors) {

  const sCanvas = makeCanvas(),
    sCtx = sCanvas.getContext('2d')

  const { width, height } = context.canvas

  sCanvas.width = width
  sCanvas.height = height

  // document.body.append(sCanvas)

  // const colors = ['rgba(255, 255, 255, 1)']

  const simplex1 = new SimplexNoise(),
    simplex2 = new SimplexNoise()

  const params = {
    noise_scale: 200,
    noise_persistence: 0.3,
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
  let dx = -width / 2 + Math.random() * width,
    dy = -height / 2 + Math.random() * height
  sCtx.save()
  sCtx.translate(dx, dy)
  // ms.trace()
  ms.draw()
  sCtx.restore()

  dx = -width / 2 + Math.random() * width,
  dy = -height / 2 + Math.random() * height
  sCtx.save()
  sCtx.translate(dx, dy)
  ms2.draw()
  sCtx.restore()

  dx = -width / 2 + Math.random() * width,
  dy = -height / 2 + Math.random() * height
  sCtx.save()
  sCtx.translate(dx, dy)
  ms2.draw()
  sCtx.restore()

  sCtx.globalCompositeOperation = 'source-atop'

  // drawBg2(sCtx, paintColors, '#c0c0c0')
  sCtx.drawImage(context.canvas, 0, 0)

  sCtx.globalAlpha = 0.5
  sCtx.strokeWidth = width * 1.3 / 960

  drawTriangles(sCtx, width, height, '#fff')

  context.globalAlpha = 1
  context.drawImage(sCanvas, 0, 0)

}
