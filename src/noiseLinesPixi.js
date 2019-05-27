import chroma from 'chroma-js'
import * as PIXI from 'pixi.js'

import './lib/noise'

const app = new PIXI.Application({
  antialias: true,
  width: window.innerWidth,
  height: window.innerHeight
})
app.renderer.backgroundColor = 0xfafafa

document.body.appendChild(app.view)

const width = app.renderer.width,
    height = app.renderer.height

noise.seed(Math.random())

// create points. each aligned to left edge of screen,
// spread out top to bottom.
var points = [];

const sections = Math.ceil( height/5 )
const colorScale = chroma.scale(['#5D7190','#F78481'])
  .mode('rgb').colors(sections)

for(var y = 0; y < sections; y++) {
  let point = {
    x: width/2,
    y: y * 5,
    vx: 0,
    vy: 0,
    color: '0x' + colorScale[y].slice(1),
    line: new PIXI.Graphics()
    // color: chroma(`hsla(${ 360 * y / sections }, 100%, 50%, 1)`).css()
  }

  points.push(point)

};

let iterations = 0;

app.ticker.add(() => {
  render()
})

// render();

function render() {

  for(var i = 0; i < points.length; i++) {
    // get each point and do what we did before with a single point
    var p = Object.assign({},points[i]);

    const line = p.line
    line.clear()
    line.lineStyle(0.3, p.color,1,1,false)

    for(var j = 0; j < 100; j++) {
      var value = getValue(p.x, p.y, iterations * 0.0005);
      p.vx += Math.cos(value) * 5;
      p.vy += Math.sin(value) * 5;

      // move to current position
      // context.beginPath();
      // context.moveTo(p.x, p.y);
      line.moveTo(p.x, p.y)

      // add velocity to position and line to new position
      p.x += p.vx;
      p.y += p.vy;
      line.lineTo(p.x, p.y);
      // context.strokeStyle = p.color;
      const lineAngle = Math.atan(p.vy / p.vx) * (360/(Math.PI))

      // apply some friction so point doesn't speed up too much
      p.vx *= 0.85;
      p.vy *= 0.85;

    }

    app.stage.addChild(line)
  }

  // call this function again in one frame tick
  iterations++;
  // requestAnimationFrame(render);
}

function getValue(x, y, z) {
  // clifford attractor
  // http://paulbourke.net/fractals/clifford/

  // scale down x and y
  var scale = 0.005;
  return noise.simplex3(x * scale, y * scale, z) * Math.PI * 2
}
