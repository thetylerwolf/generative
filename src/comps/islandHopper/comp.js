import { color } from '../../element'

import drawBg from './drawBg.js'
import drawTriangles from './drawTriangles.js'
import drawBlob from './drawBlob.js'

const colors = color.bluegold

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
  drawTriangles(context, width, height)

  context.globalAlpha = 1

  drawBlob(context, colors)

}