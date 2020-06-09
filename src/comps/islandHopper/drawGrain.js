import { perlin } from '../../noise'
import {
  flowField
} from '../../technique'
import { poissonSampler } from '../../technique'
import { shuffle } from 'd3'
import { pointBrush } from '../../brush'

// const {
//   WaterColor,
// } = require('~/brush')

module.exports = function drawGrain(context, width, height) {

  const lineThickness = width * 2 / 960

  const params = {
    width,
    height,
    resolution: 3,
    maxLineLength: height * 30/960,
    testDist: 2,
  }

  let pointData = poissonSampler(
    width,
    height,
    lineThickness
  )
  shuffle(pointData)

  let lines = flowField(pointData, (x, y) => {
    let noiseFactor = 0.01,
      xIn = x * noiseFactor,
      yIn = y * noiseFactor

    let v = perlin.noise(xIn, yIn, 0)
    // let t = (Date.now() % 10)
    // let [x, y] = curl(xIn, yIn, 0 )

    // return { x: x1, y: y1 }
    return v * 1.9 * Math.PI - Math.PI/2
  }, params)

  lines.forEach(drawLine)

  function drawLine(points) {
    context.lineWidth = lineThickness

    context.strokeStyle = 'rgba(255,255,255,0.05)'
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
