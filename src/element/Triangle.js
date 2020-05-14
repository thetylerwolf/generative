import { Line, Point } from './'
import { gaussianRand } from '../utils'
import { chaikin } from '../technique'

export default class Triangle {
  constructor(p1, p2, p3, stopSplitChance=0, curveChance=0) {

    if(p1 instanceof Point) {
      this.p1 = p1.copy()
      this.p2 = p2.copy()
      this.p3 = p3.copy()

      this.sides = [
        new Line([this.p1, this.p2]),
        new Line([this.p2, this.p3]),
        new Line([this.p3, this.p1])
      ]

    } else if (p1 instanceof Line) {
      this.sides = [ p1.copy(), p2.copy(), p3.copy() ]

      this.p1 = p1.points[0].copy()
      this.p2 = p2.points[0].copy()
      this.p3 = p3.points[0].copy()
    }

    this.stopSplitChance = stopSplitChance
    this.curveChance = curveChance

    this.canSplit = true;
  }

  split() {
    const { stopSplitChance, curveChance } = this
    // Stop the triangle from splitting
    if (!this.canSplit || Math.random() < stopSplitChance) {
      this.canSplit = false;
      return [this]
    }

    // Subdivide on the longest side, so find the distance of all the edges
    // and rearrange the points so that the longest edge is formed between
    // `a` and `b`.
    let sides = [...this.sides].sort((a,b) => b.length - a.length)

    let [ab, bc, ca] = sides,
      a = ab.points[0],
      b = ab.points[ab.points.length-1],
      c = bc.points[0].equals(b) ? bc.points[bc.points.length-1] : bc.points[0]

    // Gaussian point around 0.5
    let r = gaussianRand(0.5, 0.8);

    // Get the split point on the line formed by `a` and `b` at the random
    // position
    let m = ab.pointAlong(r),
      mIndex = ab.points.indexOf(m)

    // Make sure we're not splitting on an end point
    if(mIndex == 0 || mIndex == ab.length-1) {
      mIndex = Math.max(mIndex, 1)
      mIndex = Math.min(mIndex, ab.length-2)
    }

    m = m.copy()

    let am = mIndex > -1 ? new Line(ab.points.slice(0, mIndex+1)) : new Line([a, m]),
      mc = new Line([m, c]),
      mb = mIndex > -1 ? new Line(ab.points.slice(mIndex)) : new Line([m, b]),
      cm = new Line([c, m])

    ca = new Line([c, a])
    bc = new Line([b, c])

    if(Math.random() > curveChance && mc.length > 60) {

      let nc = mc

      let nc0 = nc.points[0],
        nc1 = nc.points[1],
        curve = []

      for(let i=1; i<3; i++) {
        let mp = Line.pointOnLine(nc0,nc1,0.25 * i)
        curve.push(mp)
      }

      nc = new Line([ nc0.copy(), ...curve, nc1.copy() ])
      // This (below) can fix any gaps
      nc.shiftPoints(gaussianRand(0, 10) * cm.length/10)

      curve = chaikin(nc.points.map(p => [p.x, p.y]), 4)
      curve = curve.map(p => new Point(p[0],p[1]))
      curve.splice(0, 1, nc0)
      curve.splice(curve.length-1, 1, nc1)
      mc = new Line([...curve])

      // let reversePoints = curve.slice(1,mc.points.length).reverse()
      // cm = new Line([ nc1, ...reversePoints, nc0 ])
      cm = mc.copy()
      cm.points.reverse()

    }

    // Form two new triangles that are formed from drawing a line from the
    // split point to the unused-point `c`
    return [
      new Triangle(am, mc, ca, stopSplitChance, curveChance),
      new Triangle(mb, bc, cm, stopSplitChance, curveChance)
    ];
  }
}