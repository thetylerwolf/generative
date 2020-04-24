import niceColors from 'nice-color-palettes'

import {
  ImageSampler,
  poissonSampler,
  streamlines,
  ColorSampler,
  noisePath,
} from './technique'

import {
  slicedStroke,
  pointBrush,
  circle,
  noisePolygon,
} from './brush'

let randomI = Math.floor(Math.random() * niceColors.length)
const colors = [
  ...niceColors[randomI]
]
console.log('colors index', randomI)
// const colors = [
//   '#97312e',
//   '#29242e',
//   '#bf4631',
//   '#f4ba41'
// ]

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

let dpr = window.devicePixelRatio || 1

canvas.width = 960
canvas.height = 960

context.scale(dpr,dpr)

const colorSampler = new ColorSampler(canvas.width, canvas.height, colors, 10, canvas.width/5)

redrawImage()

function redrawImage() {

  colorSampler.colorCenters.forEach(point => {
    context.fillStyle = point.color
    context.strokeStyle = point.color
    // circle(context, 20, point.x, point.y, point.color)
    noisePolygon(context, 20, point.x, point.y, 50)
  })

  // pointData.forEach(p => {
  //   let c = colorSampler.getNearestColor(p.x, p.y, 7, 0.03)
  //   // circle(context, 4, p.x, p.y, c)
  //   let path = noisePath(p.x, p.y, 10, 0.5)
  //   context.strokeStyle = c
  //   context.lineWidth = 5
  //   context.lineJoin = "round";
  //   context.lineCap = "round";
  //   pointBrush(context, path[0], path[path.length-1])
  //   // path.forEach((p,i) => i ? pointBrush(context, path[i-1], p) : null)
  // })

}
