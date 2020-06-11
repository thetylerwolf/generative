const chroma = require('chroma-js')
const SimplexNoise = require('simplex-noise')

const createCanvas = require('canvas').createCanvas
const {
  // poissonSampler,
  MarchingSquares,
} = require('../../technique')
// const {
//   WaterColor,
// } = require('~/brush')
const drawTriangles = require('./drawTriangles2')
const drawLines = require('./drawLines')

module.exports = function drawBlob(context, colors, bgColor) {

  const { width, height } = context.canvas

  const sCanvas = createCanvas(width, height),
    sCtx = sCanvas.getContext('2d')

    const tCanvas = createCanvas(width, height),
      tCtx = tCanvas.getContext('2d')

  // document.body.append(sCanvas)

  // const colors = ['rgba(255, 255, 255, 1)']

  const simplex1 = new SimplexNoise(),
    simplex2 = new SimplexNoise()

  const params = {
    noise_scale: 200,
    noise_persistence: 0.4,
    noiseFunction: (x,y,z) => simplex1.noise3D(x/2,y,z),
    // noiseFunction: (x,y,z) => simp.noise3D(x,y,z),
    num_shapes: 5,
    bottom_size: -0.5,
    top_size: 0.5,
    gradient: 'radial',
    colors: ['rgba(255,255,255,1)'],
    width: width,
    height: height,
    padding: 0,
    cell_dim: Math.floor(width * 2/960),
    context: sCtx,
  }

  const params2 = {
    ...params,
    noiseFunction: (x,y,z) => simplex2.noise3D(x/2,y,z),
  }

  let ms = new MarchingSquares(params)
  // let ms2 = new MarchingSquares(params2)

  sCtx.globalAlpha = 1
  let dx = -width / 2 + Math.random() * width,
    dy = -height / 2 + Math.random() * height * 3/4
  sCtx.save()
  sCtx.translate(dx, dy)
  // ms.trace()
  ms.draw()
  sCtx.restore()

  // dx = -width / 2 + Math.random() * width,
  // dy = -height / 2 + Math.random() * height
  // sCtx.save()
  // sCtx.translate(dx, dy)
  // ms2.draw()
  // sCtx.restore()

  sCtx.globalCompositeOperation = 'source-atop'

  // drawBg2(sCtx, paintColors, '#c0c0c0')
  sCtx.drawImage(context.canvas, 0, 0)

  tCtx.lineWidth = height * 1 / 1024
  tCtx.lineCap = 'round'
  tCtx.lineJoin = 'round'
  if(height > 5000) tCtx.lineWidth = height * 0.75 / 960
  console.log(height, tCtx.lineWidth)

  drawTriangles(tCtx, width, height, bgColor)

  sCtx.globalAlpha = 0.75
  sCtx.drawImage(tCanvas, 0, 0)

  context.globalAlpha = 1
  context.drawImage(sCanvas, 0, 0)

}
