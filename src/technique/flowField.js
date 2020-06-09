function lineTracer (startLocation, fieldFn, incomingParams) {
  let params = {
    discontinuationRate: 0.009,
    maxLineLength: 200,
    resolution: 12,
    testDist: 3,
    ...incomingParams
  }

  let { width, height } = params

  let keepGoing = true

  let l = [{
    theta: fieldFn(startLocation.x, startLocation.y),
    ...startLocation
  }]

  let lineLength = 0

  const stepSize = params.resolution * 0.211

  while (keepGoing) {

    let prev = l[l.length - 1]

    if (prev.x < 0 || prev.x > width * 2 || prev.y < 0 || prev.y > height * 2) {
      keepGoing = false;
    }

    // fieldFn returns an angle
    let theta = fieldFn(prev.x, prev.y)

    let next = {
      x: prev.x + stepSize * Math.cos(theta),
      y: prev.y + stepSize * Math.sin(theta),
      theta
    }

    let dx = next.x - prev.x,
      dy = next.y - prev.y

    lineLength += Math.sqrt(dx * dx + dy * dy)

    l.push(next)

    keepGoing = Math.random() > params.discontinuationRate && keepGoing && lineLength < params.maxLineLength

  }

  return l
}

module.exports = function linesGenerator(startingPoints, fieldFn, incomingParams) {
  let params = {
    minStartSpace: 4,
    ...incomingParams
  }

  let lines = []

  startingPoints.forEach((point) => {

      let { maxLineLength } = params
      if(params.lineLengthFn) maxLineLength = params.lineLengthFn(point.x, point.y)

      if(maxLineLength > 0) {
        let l = lineTracer(point, fieldFn, { ...params, maxLineLength })

        if (l.length > 1) { lines.push(l) }
      }

  })

  return lines
}
