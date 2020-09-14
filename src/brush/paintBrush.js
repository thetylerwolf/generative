function paintBrush(ctx, from, to, opts) {

  const settings = {
      strokeWidth: 4,
      brushWidth: 30,
      density: 3,
      ...opts
    },
    { strokeWidth, brushWidth, density } = settings

  const numBristles = Math.floor( brushWidth / density ),
    bristles = Array.from({ length: numBristles }).map((d,i) =>
      generateBristle(i, settings)
    )

  bristles.forEach((b) => {

    ctx.lineWidth = strokeWidth

    ctx.beginPath();

    ctx.moveTo(from.x + b.dx, from.y + b.dy);
    ctx.lineTo(to.x + b.dx, to.y + b.dy);
    ctx.stroke();

    ctx.closePath()
  })

}

function generateBristle(i, { brushWidth, density }) {
  return {
    dx: 0,
    dy: density * i
  }
}

export default paintBrush