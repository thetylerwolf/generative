const chroma = require('chroma-js')

module.exports = class ImageSampler {

  constructor(canvas, imageSrc, options) {

    const { dpr, scaleFactor } = {
      dpr: 0,
      scaleFactor: 1,
      ...options
    }

    let imgCanvas = document.createElement('canvas'),
      imgCanvasContext = imgCanvas.getContext('2d')

    this.dpr = window.devicePixelRatio || 1
    this.scaleFactor = scaleFactor
    this.canvas = canvas
    this.imgCanvas = imgCanvas

    let img = new Image()

    let p = new Promise((resolve, reject) => {

      img.addEventListener('load', () => {

        imgCanvas.width = img.width
        imgCanvas.height = img.height

        this.setScale(scaleFactor)

        imgCanvasContext.drawImage(img, 0, 0)

        this.imageData = imgCanvasContext.getImageData( 0, 0, imgCanvas.width, imgCanvas.height)

        resolve(this)

      }, false)

    })

    img.src = imageSrc

    return p

  }

  sampleImage(canvasX, canvasY) {
    let pxPos = this.canvasToImage( canvasX, canvasY ),
      pxValue = this.imageData.data.slice(pxPos*4,(pxPos*4)+3)

      pxValue = Array.from(pxValue)
      return chroma(pxValue).css()
  }

  setScale() {

    const { imgCanvas, canvas } = this

    let width = this.width = Math.floor(imgCanvas.width * this.scaleFactor)
    let height = this.height = Math.floor(imgCanvas.height * this.scaleFactor)
    let dpr = this.dpr

    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    canvas.width = imgCanvas.width * this.scaleFactor * dpr
    canvas.height = imgCanvas.height * this.scaleFactor * dpr

    imgCanvas.width = imgCanvas.width * dpr
    imgCanvas.height = imgCanvas.height * dpr

    this.canvas.getContext('2d').scale(dpr, dpr)
    this.imgCanvas.getContext('2d').scale(dpr, dpr)
  }

  imageToCanvas(imagePos) {

  }

  canvasToImage(canvasX, canvasY) {
    let xNorm = canvasX / this.width,
        yNorm = canvasY / this.height

    let imgWidth = this.imgCanvas.width,
      imgHeight = this.imgCanvas.height

    let imageX = Math.floor( xNorm * imgWidth ),
        imageY = Math.floor( yNorm * imgHeight )

    return imageX + (imgWidth * imageY)
  }

}