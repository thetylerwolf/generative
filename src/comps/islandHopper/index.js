const canvasSketch = require('canvas-sketch')
const Canvas = require('canvas')
const comp = require('./comp').default

// import canvasSketch from 'canvas-sketch'
// import Canvas from 'canvas'
// import comp from './comp.js'

const canvas = new Canvas()

const settings = {
  dimensions: [ 2048, 2048 ],
  canvas,
};

const sketch = () => {
  return (config) => {
    comp(config)
  };
};

canvasSketch(sketch, settings)
  .then(() => {
    // Once sketch is loaded & rendered, stream a PNG with node-canvas
    const out = fs.createWriteStream('output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Done rendering'));
  });
