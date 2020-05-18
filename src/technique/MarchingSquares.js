import { scaleLinear } from "d3";
import { makeCanvas } from "../utils";

const defaultParams = {
  noise_scale: 50,
  noise_persistence: 0.5,
  apply_sigmoid: 0,
  num_shapes: 20,
  bottom_size: -0.1,
  top_size: 0.5,
  gradient: 'radial',
  colors: ['#888'],
  context: null,
  width: 300,
  height: 300,
  padding: 0,
  cell_dim: 2,
};

export default class MarchingSquares {

  constructor(params=defaultParams) {

    if(!params.context) throw new Error('MarchingSquares requires a canvas context2D')

    Object.assign(this, params)
    this.tick = 0
    this.grid_dim_x = params.width;
    this.grid_dim_y = params.height
    this.canvas_dim_x = this.grid_dim_x + 2 * this.padding;
    this.canvas_dim_y = this.grid_dim_y + 2 * this.padding;
    this.nx = this.grid_dim_x / this.cell_dim;
    this.ny = this.grid_dim_y / this.cell_dim;
    this.points = []

  };
  
  draw() {

    const {
      colors,
      top_size,
      bottom_size,
      range,
      tick,
      num_shapes,
      gradient
    } = this

    // const bgColor = '#010a18' // dark blue  
    const range = top_size - bottom_size;
    const z_val = bottom_size + (range * tick) / num_shapes;
    const col = colors[Math.floor(Math.random() * colors.length)];
  
    context.fillStyle = col
    // context.strokeStyle = '#fff'
  
    this.noise_grid = this.build_noise_grid(gradient);
  
    process_grid(z_val);
  
    // points.forEach(square => {
    //   context.beginPath()
    //   square.forEach((p,i) => {
    //     let [x,y] = p
    //     if(!i) {
    //       context.moveTo(...p)
    //     } else {
    //       context.lineTo(...p)
    //     }
    //   })
    //   context.closePath()
    //   context.fill()
    // })
  };
  
  process_grid(z_val) {
    context.save()
    for (let y = 0; y < ny; y++) {
      context.save()
      for (let x = 0; x < nx; x++) {
        process_cell(x, y, z_val);
        context.translate(cell_dim, 0);
      }
      context.restore()
      context.translate(0, cell_dim);
    }
    context.restore()
  }
  
  process_cell(x, y, threshold) {
    const v1 = get_noise(x, y);
    const v2 = get_noise(x + 1, y);
    const v3 = get_noise(x + 1, y + 1);
    const v4 = get_noise(x, y + 1);
  
    const b1 = v1 > threshold ? 8 : 0;
    const b2 = v2 > threshold ? 4 : 0;
    const b3 = v3 > threshold ? 2 : 0;
    const b4 = v4 > threshold ? 1 : 0;
  
    const id = b1 + b2 + b3 + b4;
  
    if (id === 0) return;
  
    // let p = draw_line(context, id, v1, v2, v3, v4, threshold, cell_dim)
    let p = draw_poly(context, id, v1, v2, v3, v4, threshold, cell_dim)
    points.push(p)
  }
  
  get_noise(x, y) {
    return noise_grid[y][x];
  }
  
  build_noise_grid(gradient) {
    return [...Array(ny + 1)].map((_, y) =>
      [...Array(nx + 1)].map((_, x) => sum_octave(16, x, y) + get_offset(gradient, x, y))
    );
  }
  
  get_offset(gradient, x, y) {
    if (gradient === 'fill') return 0;
    if (gradient === 'linear') return y / nx - 0.5;
    if (gradient === 'radial') return 0.2 - distance_from_centre(x, y) / (nx / 2);
    if (gradient === 'ring') return -Math.abs(-1 + distance_from_centre(x, y) / (nx / 4));
  }
  
  distance_from_centre(x, y) {
    return Math.sqrt(Math.pow(nx / 2 - x, 2) + Math.pow(ny / 2 - y, 2));
  }
  
  sum_octave(num_iterations, x, y) {
    let noise = 0;
    let maxAmp = 0;
    let amp = 1;
    let freq = 1 / opts.noise_scale;
  
    for (let i = 0; i < num_iterations; i++) {
      noise += simplex.noise(x * freq, y * freq, i) * amp;
      maxAmp += amp;
      amp *= opts.noise_persistence;
      freq *= 2;
    }
  
    return noise / maxAmp;
  }

}

export function draw_line(ctx, id, nw, ne, se, sw, threshold, dim) {
  const n = [map(threshold, nw, ne, 0, dim), 0];
  const e = [dim, map(threshold, ne, se, 0, dim)];
  const s = [map(threshold, sw, se, 0, dim), dim];
  const w = [0, map(threshold, nw, sw, 0, dim)];

  ctx.beginPath()

  if (id === 1 || id === 14) {
    ctx.moveTo(...s);
    ctx.lineTo(...w);
  }
  else if (id === 2 || id === 13) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
  }
  else if (id === 3 || id === 12) {
    ctx.moveTo(...e);
    ctx.lineTo(...w);
  }
  else if (id === 4 || id === 11) {
    ctx.moveTo(...n);
    ctx.lineTo(...e);
  }
  else if (id === 6 || id === 9) {
    ctx.moveTo(...n);
    ctx.lineTo(...s);
  }
  else if (id === 7 || id === 8) {
    ctx.moveTo(...w);
    ctx.lineTo(...n);
  }
  else if (id === 5 || id == 10) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
    ctx.lineTo(...w);
    ctx.lineTo(...n);
  }

  ctx.closePath()
  ctx.stroke()
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
  let square = []

  ctx.beginPath()
  if (id === 1) {
    ctx.moveTo(...s)
    // p.vertex(...s);
    ctx.lineTo(...w);
    ctx.lineTo(...sw);
    square = [s, s, sw]
  } else if (id === 2) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
    ctx.lineTo(...se);
    square = [e, s, se]
  } else if (id === 3) {
    ctx.moveTo(...e);
    ctx.lineTo(...w);
    ctx.lineTo(...sw);
    ctx.lineTo(...se);

    square = [e, w, sw, se]
  } else if (id === 4) {
    ctx.moveTo(...n);
    ctx.lineTo(...e);
    ctx.lineTo(...ne);

    square = [n, e, ne]
  } else if (id === 5) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
    ctx.lineTo(...sw);
    ctx.lineTo(...w);
    ctx.lineTo(...n);
    ctx.lineTo(...ne);

    square = [e, s, sw, w, n, ne]
  } else if (id === 6) {
    ctx.moveTo(...n);
    ctx.lineTo(...s);
    ctx.lineTo(...se);
    ctx.lineTo(...ne);

    square = [n, s, se, ne]
  } else if (id === 7) {
    ctx.moveTo(...w);
    ctx.lineTo(...n);
    ctx.lineTo(...ne);
    ctx.lineTo(...se);
    ctx.lineTo(...sw);

    square = [w, n, ne, se, sw]
  } else if (id === 15) {
    ctx.moveTo(...nw);
    ctx.lineTo(...ne);
    ctx.lineTo(...se);
    ctx.lineTo(...sw);

    square = [nw, ne, se, sw]
  } else if (id === 14) {
    ctx.moveTo(...s);
    ctx.lineTo(...w);
    ctx.lineTo(...nw);
    ctx.lineTo(...ne);
    ctx.lineTo(...se);

    square = [s, w, nw, ne, se]
  } else if (id === 13) {
    ctx.moveTo(...e);
    ctx.lineTo(...s);
    ctx.lineTo(...sw);
    ctx.lineTo(...nw);
    ctx.lineTo(...ne);

    square = [e, s, sw, nw, ne]
  } else if (id === 12) {
    ctx.moveTo(...e);
    ctx.lineTo(...w);
    ctx.lineTo(...nw);
    ctx.lineTo(...ne);

    square = [e, w, nw, ne]
  } else if (id === 11) {
    ctx.moveTo(...n);
    ctx.lineTo(...e);
    ctx.lineTo(...se);
    ctx.lineTo(...sw);
    ctx.lineTo(...nw);

    square = [n, e, se, sw, nw]
  } else if (id === 10) {
    ctx.moveTo(...e);
    ctx.lineTo(...se);
    ctx.lineTo(...s);
    ctx.lineTo(...w);
    ctx.lineTo(...nw);
    ctx.lineTo(...n);

    square = [e, se, s, w, nw, n]
  } else if (id === 9) {
    ctx.moveTo(...n);
    ctx.lineTo(...s);
    ctx.lineTo(...sw);
    ctx.lineTo(...nw);

    square = [n, s, sw, nw]
  } else if (id === 8) {
    ctx.moveTo(...w);
    ctx.lineTo(...n);
    ctx.lineTo(...nw);

    square = [w, n, nw]
  }

  ctx.closePath();
  ctx.fill()

  return square
}

export function draw_grid(p, dim, num) {
  const spacing = dim / num;
  p.stroke(0, 70);
  for (let i = 0; i <= num; i++) {
    p.line(i * spacing, 0, i * spacing, dim);
    p.line(0, i * spacing, dim, i * spacing);
  }
}
