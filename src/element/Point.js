import { gaussianRand } from "../utils/random"

export default class Point {

  constructor(x,y) {
    this.x = x
    this.y = y
  }

  equals(point) {
    return point.x === this.x &&
    point.y === this.y
  }

  shift(amountX, amountY) {
    this.x += gaussianRand(0, amountX)
    this.y += gaussianRand(0, amountY)
  }

  copy() {
    return new Point(this.x, this.y)
  }
}
