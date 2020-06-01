module.exports = function slicedStroke(ctx, from, to, opts) {

  ctx.beginPath();

  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  ctx.moveTo(from.x - 4, from.y - 4);
  ctx.lineTo(to.x - 4, to.y - 4);
  ctx.stroke();

  ctx.moveTo(from.x - 2, from.y - 2);
  ctx.lineTo(to.x - 2, to.y - 2);
  ctx.stroke();

  ctx.moveTo(from.x + 2, from.y + 2);
  ctx.lineTo(to.x + 2, to.y + 2);
  ctx.stroke();

  ctx.moveTo(from.x + 4, from.y + 4);
  ctx.lineTo(to.x + 4, to.y + 4);
  ctx.stroke();

  ctx.closePath()

}
