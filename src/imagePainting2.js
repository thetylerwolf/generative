import { createCanvas } from 'canvas'
import chroma from 'chroma-js'

import {
  slicedStroke,
  
  noiseBrush,
} from './brushes'

import { perlin } from './noise'

import {
  pointBrush,
  noisePolygon
} from './brush'
import {poissonSampler, noisePath} from './technique'
import { shuffle } from 'd3'

let canvas = createCanvas(),
    context = canvas.getContext("2d")
    // canvasWidth = canvas.width = window.innerWidth,
    // canvasHeight = canvas.height = window.innerHeight,
// a4 size
const width = 2480,
  height = 1748

const imageSrc = 'images/rose_1.jpg'

let imgCanvas = createCanvas(),
    imgCanvasContext = imgCanvas.getContext('2d')

let dpr = window.devicePixelRatio || 1

const noise = perlin.noise,
  distortionAmount = 400,
  distortionScale = 0.025,
  offset1 = Math.random() * 100,
  offset2 = Math.random() * 100

function scaleCanvases(scaleFactor = 1) {

//   width = Math.floor(imgCanvas.width * scaleFactor)
//   height = Math.floor(imgCanvas.height * scaleFactor)

  canvas.width = width
  canvas.height = height

//   canvas.style.width = width + 'px'
//   canvas.style.height = height + 'px'

//   canvas.width = imgCanvas.width * scaleFactor * dpr
//   canvas.height = imgCanvas.height * scaleFactor * dpr

//   imgCanvas.width = imgCanvas.width * dpr
//   imgCanvas.height = imgCanvas.height * dpr

//   context.scale(dpr, dpr)
//   imgCanvasContext.scale(dpr, dpr)

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

  console.log('image', imgCanvas.width, imgCanvas.height)
  console.log('canvas', canvas.width, canvas.height)

  let imgHeight = imgCanvas.height,
      imgWidth = imgCanvas.width,
      image = imgCanvasContext.getImageData( 0, 0, imgWidth, imgHeight )

  const distortedImage = generateDistortedImageContext({ data: image, width: imgWidth, height: imgHeight }, true)
    // .getImageData(0,0,imgWidth,imgHeight)

  // return document.body.append(distortedImage.canvas)

  console.log(image)
  console.log('canvas in', width, height, 'image out', canvasToImage(0,2))

  const maxPos = height * width
  const maxImgPos = imgHeight * imgWidth
  console.log('canvas max', maxPos, 'image max', maxImgPos)
  let i = 0

  const padding = 150

  const clearColor = '#f9f9f9'
  context.fillStyle = clearColor
  context.rect(0, 0, width, height)
  context.fill()

  let pointData = poissonSampler(width, height, 3 * width/960)
  shuffle(pointData)
  // setInterval(() => {
  //   if( i > maxPos/10 ) {
  //     console.log('done')
  //     return
  //   }

  
  // context.translate(padding,padding)
  pointData.forEach((pos) => {

    let pxPos = canvasToImage( pos.x, pos.y ),
        pxValue = distortedImage.data.slice(pxPos*4,(pxPos*4)+3)

    pxValue = Array.from(pxValue)

    const color = chroma(pxValue).css()

    // const strokeDir = Math.random() * Math.PI * 2,
        // strokeLength = Math.random() * 15,
        // radius = Math.random() * 30,
        // ribbonLength = Math.random() * 5 + 50 * Math.abs(height/2 - pos.y) / height

    // slicedStroke(context, strokeLength, strokeDir, pos.x, pos.y, color)
    // noiseBrush(context, ribbonLength, strokeDir, pos.x, pos.y, color, 0.0025)
    // pointBrush(context, radius, pos.x, pos.y, color)
    context.globalAlpha = 0.4
    // context.fillStyle = color
    // noisePolygon(context, 20 * width/960, pos.x, pos.y)
    let path = noisePath(pos.x, pos.y, 10 + Math.random() * 30, 0.3)
    context.strokeStyle = color
    context.lineWidth = 3
    context.lineJoin = "round";
    context.lineCap = "round";
    // pointBrush(context, path[0], path[path.length-1])
    path.forEach((p,i) => {
      let n = Math.random() * 8
      if(p.x > width-padding + n || p.y > height - padding + n || p.x < padding-n || p.y < padding-n) return
      i ? pointBrush(context, path[i-1], p) : null
    })
    // i++
  })
  // }, 0)

  document.body.append(canvas)

  function canvasToImage(x,y) {
    let xNorm = x / width,
        yNorm = y / height

    let imageX = Math.floor( xNorm * imgWidth ),
        imageY = Math.floor( yNorm * imgHeight )

    return imageX + (imgWidth * imageY)
  }

}

function generateDistortedImageContext(input, reverseMap) {
  const ctx = createCanvas().getContext('2d')
  const outputPixels = ctx.getImageData(0, 0, input.width, input.height);
  distortPixels(
    input.data,
    outputPixels,
    input.width,
    input.height,
    reverseMap
  );
  return outputPixels
}

function distortPixels(inputPixels, outputPixels, width, height, reverseMap) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const inputIndex = reverseMap
        ? getShiftedPixelIndex(x, y, width, height)
        : getPixelIndex(x, y, width);
      const outputIndex = reverseMap
        ? getPixelIndex(x, y, width)
        : getShiftedPixelIndex(x, y, width, height);
      for (let i = 0; i < 4; i++) {
        outputPixels.data[outputIndex + i] = inputPixels.data[inputIndex + i];
      }
    }
  }
}

function getPixelIndex(x, y, width) {
  return y * width * 4 + x * 4;
}

function getShiftedPixelIndex(x, y, width, height) {
  const shift = {
    x: distortionAmount * noise(distortionScale * x, distortionScale * y, 0),
    y: distortionAmount * noise(offset1 + distortionScale * x, offset2 + distortionScale * y, 0)
  };
  const newX = clamp(Math.round(x + shift.x), 0, width - 1);
  const newY = clamp(Math.round(y + shift.y), 0, height - 1);
  return getPixelIndex(newX, newY, width);
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}
