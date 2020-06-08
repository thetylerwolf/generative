module.exports = function circle(ctx, radius, x, y, color) {

  ctx.lineJoin = ctx.lineCap = 'round';

  ctx.beginPath();

  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc( x, y, radius, 0, 2*Math.PI, true )
  ctx.fill()

}