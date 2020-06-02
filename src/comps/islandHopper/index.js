const canvasSketch = require('canvas-sketch')
// const Canvas = require('canvas')
const comp = require('./comp').default

const report = {
  start: Date.now()
}
// import canvasSketch from 'canvas-sketch'
// import Canvas from 'canvas'
// import comp from './comp.js'

// const canvas = new Canvas()
const width = 2048
const settings = {
  dimensions: [ width, Math.round(width/1.5) ],
  // canvas,
};

const sketch = () => {
  return (config) => {
    comp(config)
  };
};

canvasSketch(sketch, settings)
  .then((data) => {
    console.log(data)
    console.log((Date.now() - report.start)/1000, report)
  //   // Once sketch is loaded & rendered, stream a PNG with node-canvas
  //   const out = fs.createWriteStream('output.png');
  //   const stream = canvas.createPNGStream();
  //   stream.pipe(out);
  //   out.on('finish', () => console.log('Done rendering'));
  });
