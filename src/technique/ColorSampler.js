import poissonSampler from './poissonSampler'

export default class ColorSampler {

  constructor(width, height, colors=[], density=10, maxCenterRange=0, type='points') {

    this.colorPaths = []
    // radius so that colors.length # of points will fit and no more
    let radius = Math.sqrt((width * height) / (colors.length * 2))

    if(type === 'points') this.placeColorCentersPoints(width, height, radius, colors)
    else if (type === 'lines') this.placeColorCentersPaths(width, height, radius, colors)

    this.colorField = poissonSampler(width, height, width * 1/density)

    this.colorField.forEach(p => {
      let c = this.getNearestColorCenter(p.x, p.y, maxCenterRange)
      p.color = c
    })
  }

  placeColorCentersPoints(width, height, radius, colors) {

    this.colorCenters = poissonSampler(width, height, radius).slice(0, colors.length)

    this.colorCenters.forEach((d,i) => d.color = colors[i] || 'rgba(255,255,255,0)')

  }

  placeColorCentersPaths(width, height, radius, colors) {
    this.colorPaths = []

    for(let i=0; i<colors.length; i++) {
      // TODO: Rather than making the paths with the sampler,
      // build them so that they overlap minimally (maybe use nosie?)
      let colorPath = poissonSampler(width, height, radius).map(p => [p.x, p.y])
      colorPath = this.chaikin(colorPath, 3)
      colorPath = colorPath.map(d => ({
        x: d[0],
        y: d[1],
        color: colors[i],
      }))

      this.colorPaths.push(colorPath)
    }

    this.colorCenters = this.colorPaths.flat()
  }

  chaikin(arr, num) {
    if (num === 0) return arr;
    const l = arr.length;
    const smooth = arr.map((c,i) => {
      return [
        [0.75*c[0] + 0.25*arr[(i + 1)%l][0],0.75*c[1] + 0.25*arr[(i + 1)%l][1]],
        [0.25*c[0] + 0.75*arr[(i + 1)%l][0],0.25*c[1] + 0.75*arr[(i + 1)%l][1]]
      ];
    }).flat();
    return num === 1 ? smooth : this.chaikin(smooth, num - 1);
  }

  getNearestColor(x, y, sampleSize=1, pickProbability=0) {
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

    if(!nearestPoint) return 'rgba(255,255,255,0)'
    return nearestPoint.color

  }

}