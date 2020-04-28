import niceColors from 'nice-color-palettes'
import chroma from 'chroma-js'
import { shuffle } from 'd3'

import {
  slicedStroke,
  pointBrush,
  noisePolygon,
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
  ...randomColors.slice(0,3)
]

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

canvas.width = width
canvas.height = height

let dpr = window.devicePixelRatio || 1

context.scale(dpr,dpr)

// context.fillStyle = '#eeddce'
// context.rect(0, 0, width, height)
// context.fill()

const colorSampler = new ColorSampler(width, height, colors, 10, 0, 'gradient')

redrawImage()

function redrawImage() {

  context.globalAlpha = 0.3

  let w = 15,
    h = height/width * 15

  const pointData = poissonSampler(w, h, 0.025 * w)

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
    maxLength: 0.5,
    lengthVariance: 0.1,
    // Separation distance between new streamlines.
    dSep: 0.01,
    // Distance between streamlines when integration should stop.
    dTest: 0.005,
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

      let c = colorSampler.getNearestColor(a.x, a.y, 10)
      
      c = chroma(c)
      c = c.hsl()
      c[3] = 0.1 + Math.random() * 0.8
      c = chroma.hsl(...c)
      c = c.css()

      context.strokeStyle = c
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
