// import { color } from '../../element'

// import drawBg from './drawBg.js'
// import drawTriangles from './drawTriangles.js'
// import drawBlob from './drawBlob.js'

const { color } = require('../../element')
const drawBg = require('./drawBg.js')
const drawTriangles = require('./drawTriangles.js')
const drawBlob = require('./drawBlob.js')


const colors = color.bluegold

module.exports = function comp(config) {

  const {
    width,
    height,
    context
  } = config
  // [2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]

  // let randomI = 5 || Math.floor(Math.random() * niceColors.length),
  //   randomColors = niceColors[randomI] || shuffle(niceColors[randomI])
  // const colors = [
  //   // ...shuffle(randomColors.slice(2))
  //   ...randomColors.slice(-1)
  // ]

  // let canvas = context.canvas

  // let dpr = (window && window.devicePixelRatio) || 1

  // canvas.style.width = width
  // canvas.style.height = height

  // canvas.width = width * dpr
  // canvas.height = height * dpr

  // context.scale(dpr,dpr)

  // colorIndex: 66, 8, 5

  // colorIndex: 52

  // drawBg(context, colors, '#ccdbff')
  console.log(0)
  drawBg(context, width, height, colors, '#fff')
  console.log(1)
  drawTriangles(context, width, height)
  console.log(2)

  context.globalAlpha = 1
  console.log(3)
  drawBlob(context, colors)
}