import chroma from 'chroma-js'
import * as PIXI from 'pixi.js'

import {
  slicedStroke,
  pointBrush,
  noiseBrush
} from './brushes'

const app = new PIXI.Application({
  antialias: true,
  width: window.innerWidth,
  height: window.innerHeight
})

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight

let imgCanvas = document.getElementById('imgCanvas'),
    imgCanvasContext = imgCanvas.getContext('2d')

let dpr = window.devicePixelRatio || 1

function scaleCanvases(scaleFactor = 1) {

  canvas.style.width = imgCanvas.width * scaleFactor * dpr + 'px'
  canvas.style.height = imgCanvas.height * scaleFactor * dpr + 'px'

  let rect = canvas.getBoundingClientRect()

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

  scaleCanvases(1/4)

  imgCanvasContext.drawImage(img, 0, 0)

  redrawImage()
  redrawImage()

}, false)

img.src = 'images/family.jpg'

function redrawImage() {

  console.log('image', imgCanvas.width, imgCanvas.height)
  console.log('canvas', canvas.width, canvas.height)

  let width = canvas.width,
      height = canvas.height

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
    if( i > maxPos ) {
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
        strokeLength = Math.random() * 15,
        radius = Math.random() * 30,
        ribbonLength = 2 + Math.random() * 10

    // slicedStroke(context, strokeLength, strokeDir, pos.x, pos.y, color)
    noiseBrush(context, ribbonLength, strokeDir, pos.x, pos.y, color, 0.0005)
    // pointBrush(context, radius, pos.x, pos.y, color)

    i++
  }, 0)

  function canvasToImage(x,y) {
    let xNorm = x / width,
        yNorm = y / height

    let imageX = Math.floor( xNorm * imgWidth ),
        imageY = Math.floor( yNorm * imgHeight )

    // console.log('in', x, y, 'out', imageX, imageY)

    return imageX + (imgWidth * imageY)
  }

}
