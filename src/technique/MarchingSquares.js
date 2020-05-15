import { scaleLinear } from "d3";

export function draw_line(p, id, nw, ne, se, sw, threshold, dim) {
  const n = [map(threshold, nw, ne, 0, dim), 0];
  const e = [dim, map(threshold, ne, se, 0, dim)];
  const s = [map(threshold, sw, se, 0, dim), dim];
  const w = [0, map(threshold, nw, sw, 0, dim)];

  if (id === 1 || id === 14) p.line(...s, ...w);
  else if (id === 2 || id === 13) p.line(...e, ...s);
  else if (id === 3 || id === 12) p.line(...e, ...w);
  else if (id === 4 || id === 11) p.line(...n, ...e);
  else if (id === 6 || id === 9) p.line(...n, ...s);
  else if (id === 7 || id === 8) p.line(...w, ...n);
  else if (id === 5 || id == 10) {
    p.line(...e, ...s);
    p.line(...w, ...n);
  }
}

function map(v, d0, d1, r0, r1) {
  return scaleLinear(
    [d0, d1],
    [r0, r1]
  )(v)
}

export function draw_poly(ctx, id, v1, v2, v3, v4, threshold, dim) {
  const n = [map(threshold, v1, v2, 0, dim), 0];
  const e = [dim, map(threshold, v2, v3, 0, dim)];
  const s = [map(threshold, v4, v3, 0, dim), dim];
  const w = [0, map(threshold, v1, v4, 0, dim)];
  const nw = [0, 0];
  const ne = [dim, 0];
  const se = [dim, dim];
  const sw = [0, dim];

  // p.noStroke();
  // p.beginShape();
  let points = []

  ctx.beginPath()
  if (id === 1) {
    ctx.moveTo(...s)
    // p.vertex(...s);
    ctx.lineTo(...w);
    ctx.lineTo(...sw);
    points = points.concat([s, s, sw])
  } else if (id === 2) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
    ctx.lineTo(...se);
    points = points.concat([e, s, se])
  } else if (id === 3) {
    ctx.moveTo(...e);
    ctx.lineTo(...w);
    ctx.lineTo(...sw);
    ctx.lineTo(...se);

    points = points.concat([e, w, sw, se])
  } else if (id === 4) {
    ctx.moveTo(...n);
    ctx.lineTo(...e);
    ctx.lineTo(...ne);

    points = points.concat([n, e, ne])
  } else if (id === 5) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
    ctx.lineTo(...sw);
    ctx.lineTo(...w);
    ctx.lineTo(...n);
    ctx.lineTo(...ne);

    points = points.concat([e, s, sw, w, n, ne])
  } else if (id === 6) {
    ctx.moveTo(...n);
    ctx.lineTo(...s);
    ctx.lineTo(...se);
    ctx.lineTo(...ne);

    points = points.concat([n, s, se, ne])
  } else if (id === 7) {
    ctx.moveTo(...w);
    ctx.lineTo(...n);
    ctx.lineTo(...ne);
    ctx.lineTo(...se);
    ctx.lineTo(...sw);

    points = points.concat([w, n, ne, se, sw])
  } else if (id === 15) {
    ctx.moveTo(...nw);
    ctx.lineTo(...ne);
    ctx.lineTo(...se);
    ctx.lineTo(...sw);

    points = points.concat([nw, ne, se, sw])
  } else if (id === 14) {
    ctx.moveTo(...s);
    ctx.lineTo(...w);
    ctx.lineTo(...nw);
    ctx.lineTo(...ne);
    ctx.lineTo(...se);

    points = points.concat([s, w, nw, ne, se])
  } else if (id === 13) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
    ctx.lineTo(...sw);
    ctx.lineTo(...nw);
    ctx.lineTo(...ne);

    points = points.concat([e, s, sw, nw, ne])
  } else if (id === 12) {
    ctx.moveTo(...e);
    ctx.lineTo(...w);
    ctx.lineTo(...nw);
    ctx.lineTo(...ne);

    points = points.concat([e, w, nw, ne])
  } else if (id === 11) {
    ctx.moveTo(...n);
    ctx.lineTo(...e);
    ctx.lineTo(...se);
    ctx.lineTo(...sw);
    ctx.lineTo(...nw);

    points = points.concat([n, e, se, sw, nw])
  } else if (id === 10) {
    ctx.moveTo(...e);
    ctx.lineTo(...se);
    ctx.lineTo(...s);
    ctx.lineTo(...w);
    ctx.lineTo(...nw);
    ctx.lineTo(...n);

    points = points.concat([e, se, s, w, nw, n])
  } else if (id === 9) {
    ctx.moveTo(...n);
    ctx.lineTo(...s);
    ctx.lineTo(...sw);
    ctx.lineTo(...nw);

    points = points.concat([n, s, sw, nw])
  } else if (id === 8) {
    ctx.moveTo(...w);
    ctx.lineTo(...n);
    ctx.lineTo(...nw);

    points = points.concat([w, n, nw])
  }
  ctx.closePath();
ctx.fill()
  return points
}

export function draw_grid(p, dim, num) {
  const spacing = dim / num;
  p.stroke(0, 70);
  for (let i = 0; i <= num; i++) {
    p.line(i * spacing, 0, i * spacing, dim);
    p.line(0, i * spacing, dim, i * spacing);
  }
}
