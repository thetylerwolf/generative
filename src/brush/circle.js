module.exports = function circle(ctx, radius, x, y, color) {
  ctx.lineJoin = ctx.lineCap = "round";

  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
  ctx.fill();
};
