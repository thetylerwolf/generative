import { line } from '../utils'

function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

export default class Triangle {
  constructor(point1, point2, point3, stopSplitChance=0) {
    this.point1 = point1
    this.point2 = point2
    this.point3 = point3
    this.stopSplitChance = stopSplitChance

    this.canSplit = true;
  }
  
  split() {
    const { stopSplitChance } = this
    // Stop the triangle from splitting
    if (!this.canSplit || Math.random() < stopSplitChance) {
      this.canSplit = false;
      return [this]
    }
    
    // Subdivide on the longest side, so find the distance of all the edges
    // and rearrange the points so that the longest edge is formed between
    // `a` and `b`.
    let a = this.point1;
    let b = this.point2;
    let c = this.point3;
    
    const ab = line.distance(a, b);
    const bc = line.distance(b, c);
    const ca = line.distance(c, a);
    
    if (ab > bc && ab > ca) {
      // no-op
    } else if (bc > ab && bc > ca) {
      // a -> b
      a = this.point2;
      // b -> c
      b = this.point3;
      // c -> a
      c = this.point1;
    } else {
      // a -> c
      a = this.point3;
      // b -> a
      b = this.point1;
      // c -> b
      c = this.point2;
    }
    
    // Gaussian point around 0.5
    const r = gaussianRand();

    // Get the split point on the line formed by `a` and `b` at the random
    // position
    const m = line.pointOnLine(a, b, r);
    
    // Form two new triangles that are formed from drawing a line from the
    // split point to the unused-point `c`
    return [
      new Triangle(a, m, c),
      new Triangle(m, b, c)
    ];
  }
}
