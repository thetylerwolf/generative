import chroma from 'chroma-js'

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

let imgCanvas = document.getElementById('imgCanvas'),
    imgCanvasContext = imgCanvas.getContext('2d')

let dpr = window.devicePixelRatio || 1

function scaleCanvases() {

  canvas.style.width = imgCanvas.width * dpr + 'px'
  canvas.style.height = imgCanvas.height * dpr + 'px'

  let rect = canvas.getBoundingClientRect()

  canvas.width = imgCanvas.width * dpr
  canvas.height = imgCanvas.height * dpr

  imgCanvas.width = imgCanvas.width * dpr
  imgCanvas.height = imgCanvas.height * dpr

  context.scale(dpr, dpr)
  imgCanvasContext.scale(dpr, dpr)

}

let img = new Image()

img.addEventListener('load', () => {

  imgCanvas.width = img.width
  imgCanvas.height = img.height

  scaleCanvases()

  imgCanvasContext.drawImage(img, 0, 0)

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

    context.beginPath()
    context.fillStyle = chroma(pxValue).css()
    context.arc( pos.x, pos.y, 6, 0, 2*Math.PI, true )
    context.fill()

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
