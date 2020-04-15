import chroma from 'chroma-js'
import streamlines from '@anvaka/streamlines'
import tooloud from 'tooloud'
import * as d3 from 'd3'
import computeCurl from './lib/curlNoise'

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    canvasWidth = 500 || window.innerWidth,
    canvasHeight = 500 || window.innerHeight

let dpr = window.devicePixelRatio || 1,
  width = canvas.width = Math.floor( canvasWidth * dpr ),
  height = canvas.height = Math.floor( canvasHeight * dpr )

const noiseSeed = Math.floor(Math.random() * 1000)

tooloud.Perlin.setSeed(noiseSeed)
tooloud.Simplex.setSeed(noiseSeed)

const { noise } = tooloud.Fractal,
  perlin = tooloud.Perlin.noise,
  simplex = tooloud.Simplex.noise

const hSections = Math.ceil( height/5 ),
  wSections = Math.ceil( width/5 )
const colorScale = chroma.scale(['#5D7190','#F78481'])
  .mode('rgb').colors(hSections)

const points = d3.range(0, 1000).map((d) => {
  return {
    x: (d * 10) % width * (15/width),
    y: Math.floor(d / width)*10 * 15/width,
    value: 1000 * Math.random()
    // vx: 0,
    // vy: 0,
    // color: colorScale[y]
    // color: chroma(`hsla(${ 360 * y / sections }, 100%, 50%, 1)`).css()
  }
})

const packingData = { children: points },
  h = d3.hierarchy(packingData).sum(d => d.value),
  pack = d3.pack().size([15, 15]),
  pointData = pack( h ).leaves().map(d => ({ x: Math.round(d.x), y: Math.round(d.y) }))

render();

function render() {

  // points.slice(0, 3000).forEach(({x, y, r}) => {
  //   // console.log(x,y)
  //   context.beginPath()
  //   context.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2)
  //   context.stroke()
  // })

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
    // Separation distance between new streamlines.
    dSep: 0.1,
    // Distance between streamlines when integration should stop.
    dTest: 0.05,
    // Integration time step (passed to RK4 method.)
    timeStep: 0.01,

    // If set to true, lines are going to be drawn from the seed points
    // only in the direction of the vector field
    forwardOnly: false,

    // onPointAdded(from, to, config) {
    //   context.lineWidth = 4
    //   context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    //   context.lineJoin = "round";
    //   context.lineCap = "round";
    //   onPointAdded(from, to, config);

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
        onPointAdded(from, to, config)
        return to
      }, null)
    },

  }).run();
}

function onPointAdded(a, b, config) {
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
