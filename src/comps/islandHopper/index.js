const canvasSketch = require('canvas-sketch')
const createCanvas = require('canvas').createCanvas
const comp = require('./comp')

// import canvasSketch from 'canvas-sketch'
// import Canvas from 'canvas'
// import comp from './comp.js'

const dimensions = [ 2048, 2048 ]
const canvas = createCanvas()

const settings = {
  dimensions,
  canvas,
};

const sketch = () => {
  return (config) => {
    comp(config)
  };
};
console.log('hey!')
canvasSketch(sketch, settings)
  .then(() => {
    console.log('start!')
    // Once sketch is loaded & rendered, stream a PNG with node-canvas
    const out = fs.createWriteStream('output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Done rendering'));
  });
