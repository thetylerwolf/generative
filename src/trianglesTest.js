import niceColors from 'nice-color-palettes'
import chroma from 'chroma-js'
import { shuffle } from 'd3'
import { Triangle, Point } from './technique'

import {
  ImageSampler,
  ColorSampler,
} from './technique'

import { makeCanvas } from './utils'

const best = [2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]

let randomI = Math.floor(Math.random() * best.length),
  randomColors = shuffle(niceColors[randomI])
const colors = [
  ...randomColors
]
// good indices - 43 - 2
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

const width = 960 ,
  height = 960

canvas.width = width
canvas.height = height

context.scale(dpr,dpr)

const colorSampler = new ColorSampler({
  width, 
  height, 
  colors, 
  density: 10, 
  maxCenterRange: 0, 
  type: 'lines',
})

const divisions = 14,
  stopSplitChance = 0.07

let triangles = rootTriangles();
for (let i = 0; i < divisions; i++) {
  triangles = triangles.map(t => t.split()).flat()
}

redrawImage()

function redrawImage() {
  // context.globalAlpha = 0.5

  let n = triangles.length - 1

  // let i = setInterval(() => {
  //   if(n < 0) {
  //     console.log('done')
  //     return clearInterval(i)
  //   }
  //   let triangle = triangles[n]
  //   n--
  triangles.forEach((triangle) => {

    let tCenter = {
      x: (triangle.point1.x + triangle.point2.x + triangle.point3.x ) / 3,
      y: (triangle.point1.y + triangle.point2.y + triangle.point3.y ) / 3,
    }

    let c = colorSampler.getNearestColor(tCenter.x, tCenter.y, 2, 0.01)
    c = chroma(c)
    c = c.hsl()
    c[3] += -0.5 + Math.random() * 0.5
    c = chroma.hsl(...c)
    c = c.css()

    context.fillStyle = c
    context.strokeStyle = c

    context.beginPath()

    context.moveTo(triangle.point1.x, triangle.point1.y);
	  context.lineTo(triangle.point2.x, triangle.point2.y);
    context.lineTo(triangle.point3.x, triangle.point3.y);
    context.lineTo(triangle.point1.x, triangle.point1.y);

    Math.random() > 0.2 ? context.fill() : context.stroke()
    // context.stroke()
  // }, 1)
  })

  // context.stroke()
}

function rootTriangles() {
  const d = divisions;
  const s = stopSplitChance;

  return [
    new Triangle(
      new Point(0, 0), new Point(canvas.width, 0), new Point(0, canvas.height), stopSplitChance
    ),
    new Triangle(
      new Point(canvas.width, 0), new Point(0, canvas.height), new Point(canvas.width, canvas.height), stopSplitChance
    )
  ]
}
