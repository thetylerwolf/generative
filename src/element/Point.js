export default class Point {

  constructor(x,y) {
    this.x = x
    this.y = y
  }

  equals(point) {
    return point.x === this.x &&
    point.y === this.y
  }

  copy() {
    return new Point(this.x, this.y)
  }
}
