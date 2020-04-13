import chroma from 'chroma-js'
import streamlines from '@anvaka/streamlines'
import tooloud from 'tooloud'

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight

let dpr = window.devicePixelRatio || 1,
  width = canvas.width = canvasWidth * dpr,
  height = canvas.height = canvasHeight * dpr

tooloud.Perlin.setSeed(Math.floor(Math.random() * 1000))
const { noise } = tooloud.Fractal

// context.lineWidth = 0.1;

// random attractor params

// create points. each aligned to left edge of screen,
// spread out top to bottom.
var points = [];

const sections = Math.ceil( height/5 )
const colorScale = chroma.scale(['#5D7190','#F78481'])
  .mode('rgb').colors(sections)

for(var y = 0; y < sections; y++) {
  points.push({
    x: 0,
    y: y*5,
    vx: 0,
    vy: 0,
    color: colorScale[y]
    // color: chroma(`hsla(${ 360 * y / sections }, 100%, 50%, 1)`).css()
  })
};


render();

function render() {
  streamlines({
    // As usual, define your vector field:
    vectorField(p) {
      let noiseFactor = 0.3,
        xIn = p.x * noiseFactor,
        yIn = p.y * noiseFactor

      let v = noise(xIn, yIn, 0, 1.4, tooloud.Perlin.noise),
        x = Math.cos(v * Math.PI - Math.PI/2),
        y = Math.sin(v * Math.PI - Math.PI/2)

      return { x, y }
    },
    // seed: points,
    // Separation distance between new streamlines.
    dSep: 0.05,
    // Distance between streamlines when integration should stop.
    dTest: 0.04,
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
      context.lineWidth = 4
      context.strokeStyle = `rgba(0, 0, 0, 0.6)`;
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
