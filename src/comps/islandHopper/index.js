const canvasSketch = require('canvas-sketch')
const createCanvas = require('canvas').createCanvas
const comp = require('./comp')
// const fs = require('fs')

// import canvasSketch from 'canvas-sketch'
// import Canvas from 'canvas'
// import comp from './comp.js'

const report = {}

const height = 1024,
dimensions = [ height/1.5, height ]
const canvas = createCanvas()

const settings = {
  // dimensions,
  // dimensions: 'a4',
  dimensions: 'b0',
  canvas,
  pixelsPerInch: 300,
};

const sketch = () => {
  return (config) => {
    report.start = Date.now()
    comp(config)
  };
};

canvasSketch(sketch, settings)
  .then(() => {
    // console.log('start!')
    console.log('finish', (Date.now() - report.start) / 1000)
    // Once sketch is loaded & rendered, stream a PNG with node-canvas
    // const out = fs.createWriteStream('output.png');
    // const stream = canvas.createPNGStream();
    // stream.pipe(out);
    // out.on('finish', () => console.log('Done rendering'));
  });

function download() {
  let link = document.createElement('a');
  link.download = 'filename.png';
  link.href = document.getElementById('canvas').toDataURL()
  link.click();
}
