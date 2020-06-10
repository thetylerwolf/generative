import { perlin, curl } from '../../noise'
import {
  streamlines2
} from '../../technique'
import { poissonSampler } from '../../technique'
import { shuffle } from 'd3'
import { pointBrush } from '../../brush'

// const {
//   WaterColor,
// } = require('~/brush')

module.exports = function drawLines(sourceCtx, context, width, height, color) {

  const lineThickness = width * 5 / 960

  const params = {
    width,
    height,
    resolution: lineThickness,
    maxLineLength: height * 60/960,
    testDist: 1.05 * lineThickness,
    inBoundsFunction: (x,y) => {
      const data = sourceCtx.getImageData(x, y, 1, 1).data
      const [ r, g, b, a ] = data
      return r && g && b && a
    }
  }

  let pointData = poissonSampler(
    width,
    height,
    1.7 * lineThickness
  )
  shuffle(pointData)

  let lines = streamlines2(pointData, (x, y) => {
    let noiseFactor = 0.005,
      xIn = x * noiseFactor,
      yIn = y * noiseFactor

    // let v = perlin.noise(xIn, yIn, 0)
    // let t = (Date.now() % 10)
    let [x2, y2] = curl(xIn, yIn, 0 )
    let v = Math.atan(x2, y2)
    // return { x: x1, y: y1 }
    return v
    // return v * 1.9 * Math.PI - Math.PI/2
  }, params)

  lines.forEach(drawLine)

  function drawLine(points) {
    context.lineWidth = lineThickness

    context.strokeStyle = color
    context.lineJoin = "round";
    context.lineCap = "round";

    // Points is just a sequence of points with `x, y` coordinates through which
    // the streamline goes.
    points.reduce((from, to) => {
      if(!from) return to
      pointBrush(context, from, to)
      return to
    }, null)
  }

}
