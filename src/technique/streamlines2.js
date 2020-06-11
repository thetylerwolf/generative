const d3 = require('d3')

function lineTracer (startLocation, fieldFn, quadtree, incomingParams) {
  let params = {
    discontinuationRate: 0.009,
    maxLineLength: 200,
    minLineLength: 0,
    resolution: 12,
    testDist: 3,
    inBoundsFunction: () => true,
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

    // Use quadtree to track where previous lines had been,
    // so to not have them run into each other
    const hasCloseNeighbour = quadtree.find(next.x, next.y, params.testDist)
    if (hasCloseNeighbour) { keepGoing = false; }

    let inBounds = params.inBoundsFunction(next.x, next.y)

    if(inBounds) l.push(next)

    keepGoing = Math.random() > params.discontinuationRate && inBounds && keepGoing && lineLength < params.maxLineLength

  }

  if (l.length > 1 && lineLength > params.minLineLength) {
    quadtree.addAll(l)
  }

  return lineLength > params.minLineLength ? l : []
}

module.exports = function linesGenerator(startingPoints, fieldFn, incomingParams) {
  let params = {
    minStartSpace: 4,
    ...incomingParams
  }

  let quadtree = d3.quadtree()
                .x(d => d.x)
                .y(d => d.y)

  let lines = []

  startingPoints.forEach((point) => {
    if (!quadtree.find(point.x, point.y, params.minStartSpace)) {

      let { maxLineLength } = params
      if(params.lineLengthFn) maxLineLength = params.lineLengthFn(point.x, point.y)

      if(maxLineLength > 0) {
        let l = lineTracer(point, fieldFn, quadtree, { ...params, maxLineLength })

        if (l.length > 1) { lines.push(l) }
      }
    }
  })

  return lines
}
