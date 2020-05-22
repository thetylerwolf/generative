import niceColors from 'nice-color-palettes'

import {
  poissonSampler,
  ColorSampler,
  noisePath,
} from './technique'

import {
  pointBrush,
  circle,
} from './brush'

let randomI = () => Math.floor(Math.random() * niceColors.length)
const colors = [
  ...niceColors[randomI()]
]

// const colors = [
//   '#97312e',
//   '#29242e',
//   '#bf4631',
//   '#f4ba41'
// ]

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

let dpr = window.devicePixelRatio || 1

const width = canvas.width = 960
const height = canvas.height = 960

context.scale(dpr,dpr)

const colorSampler = new ColorSampler({
  width,
  height,
  colors: [0,0,0,0,1,1].map(d => `rgba(${d*255},0,0,1)`),
  density: 5,
  maxCenterRange: 0,
  type: 'points'
})

redrawImage()

function redrawImage() {

  context.globalAlpha = 0.5

  const pointData = poissonSampler(canvas.width, canvas.height, 0.0025 * canvas.width)

  // colorSampler.colorCenters.forEach(c => {
  //   circle(context, 5, c.x, c.y, c.color)
  // })
  // colorSampler.colorField.forEach(c => {
  //   circle(context, 5, c.x, c.y, c.color)
  // })
  pointData.forEach(p => {
    let c = colorSampler.getNearestColor(p.x, p.y, 1)
    circle(context, 4, p.x, p.y, c)
    // let path = noisePath(p.x, p.y, 10, 0.5)
    // context.strokeStyle = c
    // context.lineWidth = 5
    // context.lineJoin = "round";
    // context.lineCap = "round";
    // pointBrush(context, path[0], path[path.length-1])
    // path.forEach((p,i) => i ? pointBrush(context, path[i-1], p) : null)
  })

}
