import niceColors from 'nice-color-palettes'
import chroma from 'chroma-js'
import { shuffle } from 'd3'

import {
  WaterColor,
} from './brush'

import {
  poissonSampler,
  ColorSampler
} from './technique'

import { gaussianRand } from './utils'
import { Triangle, Point } from './element'

const width = 960,
  height = 960


// [2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]

let randomI = 5 || Math.floor(Math.random() * niceColors.length),
  randomColors = niceColors[randomI] || shuffle(niceColors[randomI])
const colors = [
  ...shuffle(randomColors.slice(2))
]

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

canvas.width = width
canvas.height = height

let dpr = window.devicePixelRatio || 1

context.scale(dpr,dpr)

// colorIndex: 66, 8, 5

// colorIndex: 52

const spaceSampler = new ColorSampler({
  width,
  height,
  colors: [0,0,0,0,1,1],
  density: 10,
  maxCenterRange: 0,
  type: 'points'
})

drawBg()
drawTriangles()

function drawTriangles() {

  const divisions = 14,
    stopSplitChance = 0,
    curveChance = 0.5

  let triangles = rootTriangles();
  for (let i = 0; i < divisions; i++) {
    triangles = triangles.map(t => t.split()).flat()
  }
  // drawShapes()

  context.globalAlpha = 0.5
  context.lineWidth = 0.5

  triangles.forEach((triangle) => {

    let tCenter = {
      x: (triangle.p1.x + triangle.p2.x + triangle.p3.x ) / 3,
      y: (triangle.p1.y + triangle.p2.y + triangle.p3.y ) / 3,
    }

    let o = spaceSampler.getNearestColor(tCenter.x, tCenter.y, 1, 0)
    let c = chroma('#fff')
    c = c.hsl()
    c[3] = o
    c = chroma.hsl(...c)
    // c = c.hsl()
    // c[3] += -0.5 + Math.random() * 0.5
    // c = chroma.hsl(...c)
    // c = c.css()

    // context.fillStyle = c
    // context.strokeStyle = c
    context.strokeStyle = c
    // context.fillStyle = "#338"

    context.beginPath()

    triangle.sides.forEach((side,i) => {
      side.points.forEach((p,j) => {
        if(!i && !j) {
          context.moveTo(p.x, p.y);
        }
        context.lineTo(p.x, p.y);
      })
    })

    context.stroke()
  })

  function rootTriangles() {

    return [
      new Triangle(
        new Point(canvas.width * gaussianRand(0, 0.1), canvas.height * gaussianRand(0, 0.1)),
        new Point(canvas.width * gaussianRand(1, 0.1), canvas.height * gaussianRand(0, 0.1)),
        new Point(canvas.width * gaussianRand(0, 0.1), canvas.height * gaussianRand(1,0.1)),
        stopSplitChance, curveChance
      ),
      new Triangle(
        new Point(canvas.width * gaussianRand(1,0.1), canvas.height * gaussianRand(0, 0.1)),
        new Point(canvas.width * gaussianRand(0, 0.1), canvas.height * gaussianRand(1,0.1)),
        new Point(canvas.width * gaussianRand(1,0.1), canvas.height * gaussianRand(1,0.1)),
        stopSplitChance, curveChance
      )
    ]
  }

}

function drawBg() {

  // const bgColor = chroma.mix('#fff', randomColors[0], 0.1)
  // const bgColor = '#ffe6cc' // orange
  const bgColor = '#ccdbff' // blue

  context.fillStyle = bgColor
  context.rect(0, 0, width, height)
  context.fill()
// return
  let pointData = poissonSampler(canvas.width / dpr, canvas.height / dpr, 200)
  shuffle(pointData)

  context.globalAlpha = 0.015

  pointData.forEach((point) => {

    // let c = chroma.mix('#fff', randomColors[0],1)
    let c = colors[Math.floor(colors.length * Math.random()) ]

    c = chroma(c)
    c = c.hsl()
    // c[1] += -0.05 + Math.random() * 0.1
    // c[2] += -0.05 + gaussianRand() * 0.1
    // c[3] += -0.6 * (centerDist/dMax) + gaussianRand() * 0.4
    // c[3] = gaussianRand()
    // c[3] = 0.2
    c[2] += gaussianRand(-0.05, 0.1)

    c = chroma.hsl(...c)
    c = c.css()
    context.fillStyle = c

    // context.globalAlpha = 0.01
    let wc = new WaterColor(context, {
      baseRadius: 40,
      centerX: point.x,
      centerY: point.y,
      numPoints: 6,
      subdivisions: 7,
      rVariance: 60,
      numLayers: 60,
      noiseFunction: () => gaussianRand(0.3,0.2),
    })

    wc.run()

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

      context.fill(polygon)
    }
  })

}
