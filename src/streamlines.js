import chroma from 'chroma-js'
import streamlines from '@anvaka/streamlines'
import tooloud from 'tooloud'
import * as d3 from 'd3'

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight

let dpr = 2 || window.devicePixelRatio || 1,
  width = canvas.width = Math.floor( canvasWidth * dpr ),
  height = canvas.height = Math.floor( canvasHeight * dpr )

tooloud.Perlin.setSeed(Math.floor(Math.random() * 1000))
const { noise } = tooloud.Fractal,
  perlin = tooloud.Perlin.noise,
  simplex = tooloud.Simplex.noise

// context.lineWidth = 0.1;



const hSections = Math.ceil( height/5 ),
  wSections = Math.ceil( width/5 )
const colorScale = chroma.scale(['#5D7190','#F78481'])
  .mode('rgb').colors(hSections)

const points = d3.range(0, wSections * hSections).map((d) => {
  return {
    x: (d * 10) % width * (15/width),
    y: Math.floor(d / width)*10 * 15/width,
    // value: 1000 * Math.random()
    // vx: 0,
    // vy: 0,
    // color: colorScale[y]
    // color: chroma(`hsla(${ 360 * y / sections }, 100%, 50%, 1)`).css()
  }
})

const packingData = { children: points },
  h = d3.hierarchy(packingData).sum(d => 1),
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
      let noiseFactor = 0.2,
        xIn = p.x * noiseFactor,
        yIn = p.y * noiseFactor

      let v = noise(xIn, yIn, 0, 2, simplex),
        x = Math.cos(v * 1.9 * Math.PI - Math.PI/2),
        y = Math.sin(v * 1.9 * Math.PI - Math.PI/2)
      // let t = (Date.now() % 10)
      // let [x, y] = computeCurl(xIn, yIn, p.x )

      return { x, y }
    },
    boundingBox: { left: 0, top: 0, width: 15, height: 15 },
    seed: pointData,
    // Separation distance between new streamlines.
    dSep: 0.05,
    // Distance between streamlines when integration should stop.
    dTest: 0.018,
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
      context.lineWidth = 2.5
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

function computeCurl(x, y, z){
  var eps = 0.0001;

  //Find rate of change in X direction
  var n1 = perlin(x + eps, y, z);
  var n2 = perlin(x - eps, y, z); 

  //Average to find approximate derivative
  var a = (n1 - n2)/(2 * eps);

  //Find rate of change in Y direction
  var n1 = perlin(x, y + eps, z); 
  var n2 = perlin(x, y - eps, z); 

  //Average to find approximate derivative
  var b = (n1 - n2)/(2 * eps);

  //Curl
  return [b, -a];
}
