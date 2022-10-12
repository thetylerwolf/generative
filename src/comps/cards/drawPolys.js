const chroma = require('chroma-js')
const { shuffle } = require('d3')

const { gaussianRand } = require('../../utils')
const {
  poissonSampler,
} = require('../../technique')
const {
  noisePolygon,
} = require('../../brush')

module.exports = function drawPolys(context, colors, bgColor) {
  context.globalAlpha = 0.05
  const canvas = context.canvas

  context.fillStyle = bgColor
  context.rect(0, 0, canvas.width, canvas.height)
  context.fill()

  const pointData = poissonSampler(canvas.width, canvas.height, 0.0025 * canvas.width)

  shuffle(pointData)

  pointData.forEach(p => {
    let c = ['#fff', '#c0c0c0'][Math.floor(Math.random() * 2)] || colors[0]
    c = chroma(c)
    c = c.brighten(gaussianRand(0.5,0.5))
    c = c.css()

    context.fillStyle = c
    context.lineJoin = "round";
    context.lineCap = "round";
    noisePolygon(context, 20, p.x, p.y, 20)
  })

}
