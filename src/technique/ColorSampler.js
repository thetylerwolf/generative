import poissonSampler from './poissonSampler'

export default class ColorSampler {

  constructor(width, height, colors=[], density=0.1) {

    // radius so that colors.length # of points will fit and no more
    let radius = Math.sqrt((width * height) / (colors.length * 2))

    this.colorCenters = poissonSampler(width, height, radius).slice(0, colors.length)

    this.colorCenters.forEach((d,i) => d.color = colors[i] || 'rgba(255,255,255,0)')

    this.colorField = poissonSampler(width, height, width * density)

    this.colorField.forEach(p => {
      let c = this.getNearestColorCenter(p.x, p.y)
      p.color = c
    })
  }

  getNearestColor(x, y, sampleSize=1) {
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
      randomIndex = Math.floor(Math.random() * lastIndex)

    return points[randomIndex].color

  }

  getNearestColorCenter(x, y) {
    let nearestPoint = null,
      nearestPos = Infinity

    this.colorCenters.forEach(c => {
      let dx = c.x - x,
        dy = c.y - y,
        d = Math.sqrt(dx * dx + dy * dy)

      if(d < nearestPos) {
        nearestPos = d,
        nearestPoint = c
      }
    })

    if(!nearestPoint) return 'rgba(255,255,255,0)'
    return nearestPoint.color

  }

}