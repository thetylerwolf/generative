const tooloud = require('../lib/tooloud')

const { noise } = tooloud.Simplex

module.exports = function noisePath(x, y, length, noiseScale=1, noiseFunction = noise) {
  // This is the draw function
    const segLength = 1

    let lastPoint = { x, y }

    let points = [lastPoint]

    let vx = 0,
        vy = 0

    for(let i=0; i<length; i += segLength) {

      let nextPoint = {
        x: lastPoint.x + vx,
        y: lastPoint.y + vy
      }

      let nextV = getValue(nextPoint.x, nextPoint.y)
      vx += Math.cos(nextV) * 0.3
      vy += Math.sin(nextV) * 0.3

      lastPoint = nextPoint

      points.push(lastPoint)

    }

    return points

    function getValue(x, y) {
      if(noiseFunction) return noiseFunction(x * noiseScale, y * noiseScale, 0) * Math.PI * 2
      return noise(x * noiseScale, y * noiseScale, 0) * Math.PI * 2
    }

  }
