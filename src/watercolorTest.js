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
  WaterColor,
} from './brush'
import { makeCanvas } from './utils'

let randomI = Math.floor(Math.random() * niceColors.length)
const colors = [
  ...niceColors[randomI]
]
// good indices - 43
console.log('colors index', randomI)
// const colors = [
//   '#97312e',
//   '#29242e',
//   '#bf4631',
//   '#f4ba41'
// ]

// let canvas = makeCanvas(),
let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

let dpr = window.devicePixelRatio || 1

let width = 960,
  height = 960

canvas.width = width
canvas.height = height

context.scale(dpr,dpr)

redrawImage()

function redrawImage() {
  context.globalAlpha = 0.015

  let p = {
    x: canvas.width / (dpr * 2),
    y: canvas.height / (dpr * 2)
  }
console.log(canvas.width, canvas.height, p)
  let c = 'rgba(192, 16, 0, 1)'

  context.fillStyle = c
  let wc = new WaterColor(context, {
    baseRadius: 100,
    centerX: p.x,
    centerY: p.y,
    numPoints: 8,
    subdivisions: 3,
    rVariance: 15,
    numLayers: 30,
    // noiseFunction: perlin.noise,
  })

  wc.distortedPolygons.forEach(drawPolygon)

  function drawPolygon(points, i) {
    // console.log(points.length)
    let polygon = new Path2D()

    points.forEach((point,i) => {
      let from = point,
        to = points[i+1]

      if(!to) return

      if(!i) polygon.moveTo(from.x, from.y)
      polygon.lineTo(to.x, to.y)

    })

    polygon.closePath()
    setTimeout(() => {
      context.fill(polygon)
    },0)

  }
  console.log('done')
}
