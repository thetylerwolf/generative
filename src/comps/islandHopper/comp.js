// import { color } from '../../element'

// import drawBg from './drawBg.js'
// import drawTriangles from './drawTriangles.js'
// import drawBlob from './drawBlob.js'

const { color } = require('../../element')
const drawBg = require('./drawBg.js')
// const drawTriangles = require('./drawTriangles.js')
const drawBlob2 = require('./drawBlob2.js')

const colors = color.colorDictionary[76]
// const colors = shuffle([...color.colorDictionary[130]])
// const colors = [ 'rgb(18,53,78)', 'rgb(197,97,39)' ]
// 113!
// 2 colors
// [/0, 24x, /50, 76, /84, 106?]
// 3 colors
// [121, 130, 153, 163, 178]
export default function comp(config) {

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

  // colorIndex: 66, 8, 5

  // colorIndex: 52

  // drawBg(context, colors, '#ccdbff')
  // drawBg(context, width, height, colors.slice(0,2), colors[2])
  drawBg(context, width, height, colors, 'rgba(248,237,67,0.05)')
  // drawTriangles(context, width, height)
  // drawTriangles(context, width, height, '#000')

  context.globalAlpha = 1

  drawBlob2(context, colors)

}