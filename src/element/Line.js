import { Point } from "./"
import { gaussianRand } from "../utils"

export default class Line {

  constructor(points=[]) {
    this.points = points.map(p => p.copy())
    this.length = Line.lineLength(points)
  }

  shiftPoints(amount=10) {

    this.points.forEach((p,i) => {
      if(!i || i === p.length-1) return
      p.x += gaussianRand(amount, amount * 0.2)
      p.y += gaussianRand(amount, amount * 0.2)
    })
  }

  pointAlong(percentFromStart) {
    if(this.points.length === 2) {
      return new Point(
        (1 - percentFromStart) * this.points[0].x + percentFromStart * this.points[1].x,
        (1 - percentFromStart) * this.points[0].y + percentFromStart * this.points[1].y
      )
    } else {
      let midPoint = this.points[Math.round(percentFromStart * this.points.length)]
      // return new Point(midPoint.x, midPoint.y)
      return midPoint
    }
  }

  copy() {
    return new Line(this.points.map(p => p.copy()))
  }

  static lineLength(points) {
    let length = 0

    points.forEach((point, i) => {
      let prev = points[i-1]
      if(!prev) return

      length += Line.distance(point, prev)
    })
    return length
  }

  static distance(a,b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
  }

  static pointOnLine(a, b, percentFromA) {
    return new Point(
      (1 - percentFromA) * a.x + percentFromA * b.x,
      (1 - percentFromA) * a.y + percentFromA * b.y
    )
  }
}
