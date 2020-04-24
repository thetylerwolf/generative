import chroma from 'chroma-js'

import {
  slicedStroke,
  pointBrush,
  noiseBrush,
} from './brushes'

import {
  noisePolygon
} from './brush'

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
  let i = 0

  setInterval(() => {
    if( i > maxPos/10 ) {
      console.log('done')
      return
    }

    let pos = {
      x: Math.floor( Math.random() * width ),
      y: Math.floor( Math.random() * height )
    }

    let pxPos = canvasToImage( pos.x, pos.y ),
        pxValue = image.data.slice(pxPos*4,(pxPos*4)+3)

    pxValue = Array.from(pxValue)

    const color = chroma(pxValue).css()

    const strokeDir = Math.random() * Math.PI * 2,
        // strokeLength = Math.random() * 15,
        // radius = Math.random() * 30,
        ribbonLength = Math.random() * 5 + 50 * Math.abs(height/2 - pos.y) / height

    // slicedStroke(context, strokeLength, strokeDir, pos.x, pos.y, color)
    // noiseBrush(context, ribbonLength, strokeDir, pos.x, pos.y, color, 0.0025)
    // pointBrush(context, radius, pos.x, pos.y, color)
    context.globalAlpha = 0.05
    context.fillStyle = color
    noisePolygon(context, 20, pos.x, pos.y, 20)
    i++
  }, 0)

  function canvasToImage(x,y) {
    let xNorm = x / width,
        yNorm = y / height

    let imageX = Math.floor( xNorm * imgWidth ),
        imageY = Math.floor( yNorm * imgHeight )

    return imageX + (imgWidth * imageY)
  }

}
