import chroma from 'chroma-js'
import './lib/noise'

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight

noise.seed(Math.random())

context.lineWidth = 0.1;

// random attractor params
var a = Math.random() * 4 - 2;
var b = Math.random() * 4 - 2;
var c = Math.random() * 4 - 2;
var d = Math.random() * 4 - 2;

// create points. each aligned to left edge of screen,
// spread out top to bottom.
var points = [];

const sections = Math.ceil( height/5 )
const colorScale = chroma.scale(['#5D7190','#F78481'])
  .mode('rgb').colors(sections)

for(var y = 0; y < sections; y++) {
  points.push({
    x: width/2,
    y: y * 5,
    vx: 0,
    vy: 0,
    color: colorScale[y]
    // color: chroma(`hsla(${ 360 * y / sections }, 100%, 50%, 1)`).css()
  })
};

let iterations = 0;

render();

function render() {
  context.clearRect(0, 0, width, height);
  if(iterations > 2000) return;
  for(var i = 0; i < points.length; i++) {
    // get each point and do what we did before with a single point
    var p = Object.assign({},points[i]);
    for(var j = 0; j < 300; j++) {
      var value = getValue(p.x, p.y, iterations * 0.005);
      p.vx += Math.cos(value) * 0.3;
      p.vy += Math.sin(value) * 0.3;

      // move to current position
      context.beginPath();
      context.moveTo(p.x, p.y);

      // add velocity to position and line to new position
      p.x += p.vx;
      p.y += p.vy;
      context.lineTo(p.x, p.y);
      // context.strokeStyle = p.color;
      const lineAngle = Math.atan(p.vy / p.vx) * (360/(Math.PI))

      context.strokeStyle = chroma(`hsla(${150+ lineAngle/4 }, 100%, 30%, 1)`).css()
      context.stroke();

      // apply some friction so point doesn't speed up too much
      p.vx *= 0.99;
      p.vy *= 0.99;

      // // wrap around edges of screen
      // if(p.x > width) p.x = 0;
      // if(p.y > height) p.y = 0;
      // if(p.x < 0) p.x = width;
      // if(p.y < 0) p.y = height;
    }
  }

  // call this function again in one frame tick
  iterations++;
  requestAnimationFrame(render);
}

function getValue(x, y, z) {
  // clifford attractor
  // http://paulbourke.net/fractals/clifford/

  // scale down x and y
  var scale = 0.005;
  return noise.perlin3(x * scale, y * scale, z) * Math.PI * 2
}
