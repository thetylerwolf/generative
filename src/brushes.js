// Sliced strokes (paint brush)
function slicedStroke(ctx, length, direction, x, y, color ) {

  let xDir = length * Math.cos( direction ),
      yDir = length * Math.sin( direction )

  ctx.lineWidth = 3;
  ctx.lineJoin = ctx.lineCap = 'round';

  ctx.beginPath();

  const segLength = 1

  let lastPoint = { x, y }

  for(let i=0; i<length; i += segLength) {

    let nextPoint = {
      x: lastPoint.x + xDir * i / length,
      y: lastPoint.y + yDir * i / length
    }

    ctx.strokeStyle = color

    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(nextPoint.x, nextPoint.y);
    ctx.stroke();

    ctx.moveTo(lastPoint.x - 4, lastPoint.y - 4);
    ctx.lineTo(nextPoint.x - 4, nextPoint.y - 4);
    ctx.stroke();

    ctx.moveTo(lastPoint.x - 2, lastPoint.y - 2);
    ctx.lineTo(nextPoint.x - 2, nextPoint.y - 2);
    ctx.stroke();

    ctx.moveTo(lastPoint.x + 2, lastPoint.y + 2);
    ctx.lineTo(nextPoint.x + 2, nextPoint.y + 2);
    ctx.stroke();

    ctx.moveTo(lastPoint.x + 4, lastPoint.y + 4);
    ctx.lineTo(nextPoint.x + 4, nextPoint.y + 4);
    ctx.stroke();

  }

}

export {
  slicedStroke
}