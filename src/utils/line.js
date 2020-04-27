export function distance(a,b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export function pointOnLine(a, b, percentFromA) {
  return {
    x: (1 - percentFromA) * a.x + percentFromA * b.x,
    y: (1 - percentFromA) * a.y + percentFromA * b.y
  }
}
