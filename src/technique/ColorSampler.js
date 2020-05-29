const chroma = require('chroma-js')
const poissonSampler = require('./poissonSampler')
const chaikin = require('./chaikin')

let defaultParams = {
  width: 300,
  height: 300,
  colors: [],
  density: 10,
  maxCenterRange: 0,
  type: 'points',
  gradientAngle: Math.PI/2,
  gradientSteps: 10,
}

module.exports = class ColorSampler {

  constructor(params=defaultParams) {

    const {
      width,
      height,
      colors,
      density,
      maxCenterRange,
      type,
      gradientAngle,
      gradientSteps,
    } = params

    Object.assign(this, params)

    this.colorPaths = []
    // radius so that colors.length # of points will fit and no more
    let radius = Math.sqrt((width * height) / (colors.length * 2))

    if(type === 'points') this.placeColorCentersPoints(width, height, radius, colors)
    else if (type === 'lines') this.placeColorCentersPaths(width, height, radius, colors)
    else if (type === 'gradient') this.placeColorCentersGradient(width, height, radius, colors, gradientAngle, gradientSteps)
    else throw new Error('Color sampler type must be "points" or "lines" or "gradient"')

    this.colorField = poissonSampler(width, height, width * 1/density)

    this.colorField.forEach(p => {
      let c = this.getNearestColorCenter(p.x, p.y, maxCenterRange)
      p.color = c
    })
  }

  placeColorCentersPoints(width, height, radius, colors) {

    this.colorCenters = poissonSampler(width, height, radius).slice(0, colors.length)

    this.colorCenters.forEach((d,i) => d.color = colors[i])

  }

  placeColorCentersGradient(width, height, radius, colors, angle, steps) {

    const scale = chroma.scale(colors).mode('lab')

    this.colorCenters = []

    const gAngle = angle % (Math.PI * 2)


    for(let i=0; i<steps; i++) {
      // TODO: This is a very naive implementation
      // try something that makes sense
      this.colorCenters.push({
        x: width * (i/steps) * Math.cos(gAngle),
        y: height * (i/steps) * Math.sin(gAngle),
        color: scale( i/steps ) || 'rgba(255,255,255,0)',
      })
    }

  }

  placeColorCentersPaths(width, height, radius, colors) {
    this.colorPaths = []

    for(let i=0; i<colors.length; i++) {
      // TODO: Rather than making the paths with the sampler,
      // build them so that they overlap minimally (maybe use nosie?)
      let colorPath = poissonSampler(width, height, radius).map(p => [p.x, p.y])
      colorPath = chaikin(colorPath, 3)
      colorPath = colorPath.map(d => ({
        x: d[0],
        y: d[1],
        color: colors[i],
      }))

      this.colorPaths.push(colorPath)
    }

    this.colorCenters = this.colorPaths.flat()
  }

  getNearestColor(x, y, sampleSize=1, pickProbability=0) {

    if(!sampleSize) sampleSize = 1

    let points = this.colorField.map(c => {
      let dx = c.x - x,
        dy = c.y - y,
        d = Math.sqrt(dx * dx + dy * dy)

      return {
        point: c,
        color: c.color,
        distance: d
      }
    })

    points.sort((a,b) => a.distance - b.distance)

    let lastIndex = Math.min(points.length, sampleSize),
      selectionPoints = points.slice(0, lastIndex)

    let pick = Math.random() < pickProbability
    if((lastIndex < points.length) && pick) {
      let extraIndex = Math.floor(points.length * Math.random())
      selectionPoints.push(points[extraIndex])
    }

    let randomIndex = Math.floor(Math.random() * selectionPoints.length)

    return selectionPoints[randomIndex].color

  }

  getNearestColorCenter(x, y, maxDistance) {
    let nearestPoint = null,
      nearestPos = Infinity

    this.colorCenters.forEach(c => {
      let dx = c.x - x,
        dy = c.y - y,
        d = Math.sqrt(dx * dx + dy * dy)

      if(d < nearestPos) {
        if(!maxDistance || (maxDistance && d < maxDistance)) {
          nearestPos = d,
          nearestPoint = c
        }
      }

    })

    if(nearestPoint === null) return 'rgba(255,255,255,0)'
    return nearestPoint.color

  }

}
