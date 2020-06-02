export default function circle(ctx, radius, x, y, color) {

  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc( x, y, radius, 0, 2*Math.PI, true )
  ctx.fill()
  ctx.closePath()

}