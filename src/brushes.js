import './lib/noise'

noise.seed(Math.random())

// Sliced strokes (paint brush)
function slicedStroke(ctx, length, direction, x, y, color) {

  let xDir = length * Math.cos( direction ),
      yDir = length * Math.sin( direction )

  ctx.lineWidth = 3;
  ctx.lineJoin = ctx.lineCap = 'round';

  ctx.beginPath();

  const segLength = 1

  let lastPoint = { x, y }

  for(let i=0; i<length; i += segLength) {

    let pathProp = i / length

    let nextPoint = {
      x: lastPoint.x + xDir * pathProp,
      y: lastPoint.y + yDir * pathProp
    }

    ctx.strokeStyle = color

    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(nextPoint.x, nextPoint.y);
    ctx.stroke();

    ctx.moveTo(lastPoint.x - 4 * (Math.random() + 1 - pathProp), lastPoint.y - 4 * (Math.random() + 1 - pathProp));
    ctx.lineTo(nextPoint.x - 4 * (Math.random() + 1 - pathProp), nextPoint.y - 4 * (Math.random() + 1 - pathProp));
    ctx.stroke();

    ctx.moveTo(lastPoint.x - 2 * (Math.random() + 1 - pathProp), lastPoint.y - 2 * (Math.random() + 1 - pathProp));
    ctx.lineTo(nextPoint.x - 2 * (Math.random() + 1 - pathProp), nextPoint.y - 2 * (Math.random() + 1 - pathProp));
    ctx.stroke();

    ctx.moveTo(lastPoint.x + 2 * (Math.random() + 1 - pathProp), lastPoint.y + 2 * (Math.random() + 1 - pathProp));
    ctx.lineTo(nextPoint.x + 2 * (Math.random() + 1 - pathProp), nextPoint.y + 2 * (Math.random() + 1 - pathProp));
    ctx.stroke();

    ctx.moveTo(lastPoint.x + 4 * (Math.random() + 1 - pathProp), lastPoint.y + 4 * (Math.random() + 1 - pathProp));
    ctx.lineTo(nextPoint.x + 4 * (Math.random() + 1 - pathProp), nextPoint.y + 4 * (Math.random() + 1 - pathProp));
    ctx.stroke();

  }

}

function pointBrush(ctx, radius, x, y, color) {

  ctx.lineJoin = ctx.lineCap = 'round';

  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc( x, y, radius, 0, 2*Math.PI, true )
  ctx.fill()

}

function noiseBrush(ctx, length, direction, x, y, color, noiseScale=1, noiseFunction) {
// TODO make this work
//   let xDir = length * Math.cos( direction ),
//       yDir = length * Math.sin( direction )

  ctx.lineWidth = 3;
  ctx.lineJoin = ctx.lineCap = 'round';

  ctx.beginPath();

  const segLength = 1

  let lastPoint = { x, y }

  let vx = 0,
      vy = 0

  for(let i=0; i<length; i += segLength) {

    let nextPoint = {
      x: lastPoint.x + vx,
      y: lastPoint.y + vy
    }

    let nextV = getValue(nextPoint.x, nextPoint.y)
    vx += Math.cos(nextV) * 0.3
    vy += Math.sin(nextV) * 0.3

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

    lastPoint = nextPoint

  }


  function getValue(x, y) {
    if(noiseFunction) return noiseFunction(x * noiseScale, y * noiseScale, 0) * Math.PI * 2
    return noise.simplex2(x * noiseScale, y * noiseScale) * Math.PI * 2
  }

}

export {
  slicedStroke,
  pointBrush,
  noiseBrush
}