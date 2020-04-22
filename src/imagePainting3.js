import chroma from 'chroma-js'

import {
  slicedStroke,
  pointBrush,
  noiseBrush
} from './brush'

import tooloud from 'tooloud'
import computeCurl from './lib/curlNoise'
import poissonDiscSampler from './lib/poissonSampler'
import streamlines from './lib/streamlines'

const noiseSeed = Math.floor(Math.random() * 1000)
console.log('noise seed', noiseSeed)
tooloud.Perlin.setSeed(noiseSeed)
tooloud.Simplex.setSeed(noiseSeed)

const { noise } = tooloud.Fractal,
  simplex = tooloud.Simplex.noise

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    // canvasWidth = canvas.width = window.innerWidth,
    // canvasHeight = canvas.height = window.innerHeight,
    width,
    height

const imageSrc = 'images/11.jpg'

let imgCanvas = document.getElementById('imgCanvas'),
    imgCanvasContext = imgCanvas.getContext('2d')

let dpr = window.devicePixelRatio || 1

function scaleCanvases(scaleFactor = 1) {

  width = Math.floor(imgCanvas.width * scaleFactor)
  height = Math.floor(imgCanvas.height * scaleFactor)

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  canvas.width = imgCanvas.width * scaleFactor * dpr
  canvas.height = imgCanvas.height * scaleFactor * dpr

  imgCanvas.width = imgCanvas.width * dpr
  imgCanvas.height = imgCanvas.height * dpr

  context.scale(dpr, dpr)
  imgCanvasContext.scale(dpr, dpr)

}

let img = new Image()

img.addEventListener('load', () => {

  imgCanvas.width = img.width
  imgCanvas.height = img.height

  scaleCanvases(0.2)

  imgCanvasContext.drawImage(img, 0, 0)

  redrawImage()
  // redrawImage()

}, false)

img.src = imageSrc

function redrawImage() {

  context.globalAlpha = 0.05
  let pointData = [],
  sampler = poissonDiscSampler(canvas.width, canvas.height, 10),
  sample

  while(sample = sampler()) pointData.push({ x: sample[0] * 15/canvas.width, y: sample[1] * 15/canvas.height })


  console.log('image', imgCanvas.width, imgCanvas.height)
  console.log('canvas', canvas.width, canvas.height)

  let imgHeight = imgCanvas.height,
      imgWidth = imgCanvas.width,
      image = imgCanvasContext.getImageData( 0, 0, imgWidth, imgHeight )

  console.log(image)
  console.log('canvas in', width, height, 'image out', canvasToImage(0,2))

  const maxPos = height * width
  const maxImgPos = imgHeight * imgWidth
  console.log('canvas max', maxPos, 'image max', maxImgPos)

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
    maxLength: 2,
    // Separation distance between new streamlines.
    dSep: 0.05,
    // Distance between streamlines when integration should stop.
    dTest: 0.025,
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

      let a = transform(points[0], config.boundingBox);

      // context.strokeStyle = `rgba(128, 128, 175, 0.6)`;
      let pxPos = canvasToImage( a.x, a.y ),
      pxValue = image.data.slice(pxPos*4,(pxPos*4)+3)

      pxValue = Array.from(pxValue)

      const color = chroma(pxValue).css()

      context.strokeStyle = color
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

  function drawPointConnection(from, to, config) {
    let a = transform(from, config.boundingBox),
      b = transform(to, config.boundingBox)

    slicedStroke(context, a, b)
  }

  function transform(pt, boundingBox) {
    var tx = (pt.x - boundingBox.left)/boundingBox.width;
    var ty = (pt.y - boundingBox.top)/boundingBox.height;
    return {
      x: tx * width,
      y: (1 - ty) * height
    }
  }

  function canvasToImage(x,y) {
    let xNorm = x / width,
        yNorm = y / height

    let imageX = Math.floor( xNorm * imgWidth ),
        imageY = Math.floor( yNorm * imgHeight )

    return imageX + (imgWidth * imageY)
  }

}
