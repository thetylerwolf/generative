import chroma from 'chroma-js'
import streamlines from './lib/streamlines'
import tooloud from 'tooloud'
import * as d3 from 'd3'
import computeCurl from './lib/curlNoise'
import poissonSampler from './lib/poissonSampler'

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    canvasWidth = 500 || window.innerWidth,
    canvasHeight = 500 || window.innerHeight

let dpr = 2 || window.devicePixelRatio || 1,
  width = canvas.width = Math.floor( canvasWidth * dpr ),
  height = canvas.height = Math.floor( canvasHeight * dpr )

const noiseSeed = Math.floor(Math.random() * 1000)

tooloud.Perlin.setSeed(noiseSeed)
tooloud.Simplex.setSeed(noiseSeed)

const { noise } = tooloud.Fractal,
  simplex = tooloud.Simplex.noise

const colorScale = chroma.scale(['#5D7190','#F78481'])
  .mode('rgb').colors(Math.ceil(height/10))

let pointData = [],
  sampler = poissonSampler(width, height, 5),
  sample

while(sample = sampler()) pointData.push({ x: sample[0] * 15/width, y: sample[1] * 15/height })

d3.shuffle(pointData)
// console.log(pointData.slice(0, 100))
render();

function render() {

  // pointData.slice(0, 3000).forEach(({x, y, r}) => {
  //   // console.log(x,y)
  //   context.beginPath()
  //   context.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2)
  //   context.stroke()
  // })
  // return
  streamlines({
    // As usual, define your vector field:
    vectorField(p) {
      let noiseFactor = 0.06,
        xIn = p.x * noiseFactor,
        yIn = p.y * noiseFactor

      let v = noise(xIn, yIn, 0, 2, simplex),
        x1 = Math.cos(v * 1.9 * Math.PI - Math.PI/4),
        y1 = Math.sin(v * 1.9 * Math.PI - Math.PI/2)
      // let t = (Date.now() % 10)
      let [x, y] = computeCurl(xIn, yIn, 0 )

      return { x: x1, y: y }
    },
    boundingBox: { left: 0, top: 0, width: 15, height: 15 },
    seed: pointData,
    maxLength: 1,
    // Separation distance between new streamlines.
    dSep: 0.1,
    // Distance between streamlines when integration should stop.
    dTest: 0.05,
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

    // },
    onStreamlineAdded(points, config) {
      context.lineWidth = 2
      // context.strokeStyle = `rgba(128, 128, 175, 0.6)`;
      context.strokeStyle = colorScale[Math.round(points[0].y * 6)]
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
}

function drawPointConnection(a, b, config) {
  let ctx = context
  ctx.beginPath();
  a = transform(a, config.boundingBox);
  b = transform(b, config.boundingBox);
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.closePath();
}

function transform(pt, boundingBox) {
  var tx = (pt.x - boundingBox.left)/boundingBox.width;
  var ty = (pt.y - boundingBox.top)/boundingBox.height;
  return {
    x: tx * width,
    y: (1 - ty) * height
  }
}
