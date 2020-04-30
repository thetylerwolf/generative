import niceColors from 'nice-color-palettes'
import chroma from 'chroma-js'
import { shuffle } from 'd3'

import {
  slicedStroke,
  pointBrush,
  noisePolygon,
  circle,
} from './brush'

import {
  streamlines,
  poissonSampler,
  ColorSampler
} from './technique'

import {
  curl,
  perlin,
  simplex,
  fractal
} from './noise'

const width = 960,
  height = 960

const { noise } = fractal,
  simplexNoise = simplex.noise

simplex.setSeed(Math.random() * 10000)


let randomI = Math.floor(Math.random() * niceColors.length),
  randomColors = shuffle(niceColors[randomI])
const colors = [
  ...randomColors.slice(1)
]

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

canvas.width = width
canvas.height = height

let dpr = window.devicePixelRatio || 1

context.scale(dpr,dpr)

const bgColor = chroma.mix('#fff', randomColors[0], 0.1)
// context.fillStyle = bgColor
// context.rect(0, 0, width, height)
// context.fill()

const colorSampler = new ColorSampler({
  width,
  height,
  colors,
  density: 10,
  maxCenterRange: 0,
  type: 'gradient',
  gradientAngle: Math.random() * 2 * Math.PI,
  gradientSteps: 10,
})

const spaceSampler = new ColorSampler({
  width,
  height,
  colors: [0,1,2,2,2],
  density: 10,
  maxCenterRange: 0,
  type: 'points'
})

drawBg()
drawLines()

function drawLines() {

  // drawShapes()

  context.globalAlpha = 0.3

  let w = 15,
    h = height/width * 15

  const pointData = poissonSampler(w, h, 0.025 * w)
  shuffle(pointData)

  // colorSampler.colorField.forEach(path => {
  //   context.strokeStyle = path.color
  //   circle(context, 10, path.x, path.y, path.color)
  // })

  streamlines({
    // As usual, define your vector field:
    vectorField(p) {
      let noiseFactor = 0.06,
        xIn = p.x * noiseFactor,
        yIn = p.y * noiseFactor

      let v = noise(xIn, yIn, 0, 2, simplexNoise),
        x1 = Math.cos(v * 1.9 * Math.PI - Math.PI/2),
        y1 = Math.sin(v * 1.9 * Math.PI - Math.PI/2)
      // let t = (Date.now() % 10)
      let [x, y] = curl(xIn, yIn, 0 )

      return { x: x1, y: y1 }
    },
    boundingBox: { left: 0, top: 0, width: 15, height: 15 },
    seed: pointData,
    maxLength: 0.1,
    // lengthVariance: 0.1,
    // Separation distance between new streamlines.
    dSep: 0.05,
    // Distance between streamlines when integration should stop.
    dTest: 0.015,
    // Integration time step (passed to RK4 method.)
    timeStep: 0.01,

    // If set to true, lines are going to be drawn from the seed points
    // only in the direction of the vector field
    // forwardOnly: true,

    // onPointAdded(from, to, config) {
    //   context.lineWidth = 4
    //   context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    //   context.lineJoin = "round";
    //   context.lineCap = "round";
    //   drawPointConnection(from, to, config);

    // For watercolor feel
    //   context.globalAlpha = 0.05
    //   context.fillStyle = color
    //   noisePolygon(context, 20, from[0], from[1], 20)
    // },
    onStreamlineAdded(points, config) {
      context.lineWidth = 2

      let a = transform(points[0], config.boundingBox);

      let c = colorSampler.getNearestColor(a.x, a.y, 10, 0.3)
      let blank = spaceSampler.getNearestColor(a.x, a.y, 5, 0.3) === 1

      c = chroma(c)
      c = c.hsl()
      c[3] = 0.1 + Math.random() * 0.8
      c = chroma.hsl(...c)
      c = c.css()

      context.strokeStyle = blank ? 'rgba(255,255,255,0)' : c
      context.lineJoin = "round";
      context.lineCap = "round";

      // Points is just a sequence of points with `x, y` coordinates through which
      // the streamline goes.
      points.reduce((from, to) => {
        if(!from) return to
        drawPointConnection(from, to, config)
        return to
      }, null)
    },

  }).run();

  function drawPointConnection(from, to, config) {
    let a = transform(from, config.boundingBox),
      b = transform(to, config.boundingBox)

    pointBrush(context, a, b)
  }

  function transform(pt, boundingBox) {
    var tx = (pt.x - boundingBox.left)/boundingBox.width;
    var ty = (pt.y - boundingBox.top)/boundingBox.height;
    return {
      x: tx * width,
      y: (1 - ty) * height
    }
  }

}

function drawBg() {
  let pointData = poissonSampler(canvas.width / dpr, canvas.height / dpr, 0.0025 * canvas.width)
  shuffle(pointData)

  pointData.forEach((point) => {
    let c = chroma.mix('#fff', randomColors[0],0.2)
    c = c.hsl()
    c[1] += -0.05 + Math.random() * 0.1
    c[3] += -0.4 + Math.random() * 0.8
    c = chroma.hsl(...c)
    c = c.css()
    context.fillStyle = c
    // context.globalAlpha = 0.01
    noisePolygon(context, 20, point.x, point.y)
  })

  let circleData = poissonSampler(canvas.width / dpr, canvas.height / dpr, 0.015 * canvas.width)
  shuffle(circleData)

  circleData.forEach(point => {
    circle(context, 10, point.x, point.y, `rgba(255,255,255,${0.5 * Math.random() * 0.2})`)
  })
}

function drawShapes() {
  // context.globalCompositeOperation = 'destination-over'
  context.globalAlpha = 1
  context.fillStyle = '#000';
  // context.strokeStyle = '#fff'; //randomColors[3];
  context.lineWidth = 1;

  [1].forEach(prop => {
    context.beginPath()

    let r = 30 + Math.random() * 70

    context.ellipse(
      canvas.width * Math.random(),
      canvas.height * Math.random(),
      r,
      r,
      0,
      0,
      Math.PI * 2
    )

    context.fill()
    // context.stroke()
  })

}
