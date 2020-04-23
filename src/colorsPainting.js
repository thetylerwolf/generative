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
} from './brush'

const colors = ['#f0f', '#f0f', '#00f', '#00f', '#0ff0', '#f0f']

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

let dpr = window.devicePixelRatio || 1

canvas.width = 500
canvas.height = 960

context.scale(dpr,dpr)

const colorSampler = new ColorSampler(canvas.width, canvas.height, colors)

redrawImage()

function redrawImage() {

  context.globalAlpha = 0.4

  const pointData = poissonSampler(canvas.width, canvas.height, 3)

  pointData.forEach(p => {
    let c = colorSampler.getNearestColor(p.x, p.y, 20)
    let path = noisePath(p.x, p.y, 10)
    context.strokeStyle = c
    context.lineWidth = 2
    path.forEach((p,i) => i ? pointBrush(context, path[i-1], p, c) : null)
  })

}
