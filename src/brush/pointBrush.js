export default function pointBrush(ctx, from, to) {

  ctx.beginPath()

  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  ctx.closePath()

}
