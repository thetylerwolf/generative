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

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

let dpr = window.devicePixelRatio || 1

canvas.width = 960
canvas.height = 960

context.scale(dpr,dpr)

redrawImage()

function redrawImage() {
  context.globalAlpha = 0.015

  let p = {
    x: canvas.width * dpr/2,
    y: canvas.height * dpr/2
  }

  let c = 'rgba(192, 16, 0, 1)'

  context.fillStyle = c
  let wc = new WaterColor(context, {
    baseRadius: 100,
    centerX: p.x,
    centerY: p.y,
    numPoints: 8,
    subdivisions: 3,
    rVariance: 15,
    numLayers: 100,
    // noiseFunction: perlin.noise,
  })

  wc.distortedPolygons.forEach(drawPolygon)

  function drawPolygon(points) {
    console.log(points.length)
    let polygon = new Path2D()

    points.forEach((point,i) => {
      let from = point,
        to = points[i+1]

      if(!to) return

      if(!i) polygon.moveTo(from.x, from.y)
      polygon.lineTo(to.x, to.y)

    })

    polygon.closePath()
    context.fill(polygon)
  }

}
