import { color } from '../../element'

import drawBg from './drawBg'
import drawTriangles from './drawTriangles'
import drawBlob from './drawBlob'
import drawBlob2 from './drawBlob2'

// const colors = color.bluegold
const colorIndex = Math.floor(Math.random() * color.colorDictionary.length)
// const colors = color.colorDictionary[colorIndex]
const colors = color.colorDictionary[76]
// const colors = [ 'rgb(18,53,78)', 'rgb(197,97,39)' ]
// 113!¨¨¨
// [/0, 24x, /50, 76, /84, 106?]
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
  drawBg(context, width, height, colors, '#fff')
  // drawTriangles(context, width, height)

  context.globalAlpha = 1

  drawBlob2(context, colors)

}