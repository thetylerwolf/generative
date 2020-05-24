import { scaleLinear } from "d3";
import SimplexNoise from 'simplex-noise'
import { Point, Line } from "../element";

const simplex = new SimplexNoise()

const defaultParams = {
  noise_scale: 50,
  noise_persistence: 0.5,
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
  noiseFunction: (x,y,z) => simplex.noise3D(x,y,z),
};

export default class MarchingSquares {

  constructor(params=defaultParams) {

    if(!params.context) throw new Error('MarchingSquares requires a canvas context2D')

    Object.assign(this, defaultParams, params)
    this.tick = 1
    this.grid_dim_x = params.width;
    this.grid_dim_y = params.height
    this.canvas_dim_x = this.grid_dim_x + 2 * this.padding;
    this.canvas_dim_y = this.grid_dim_y + 2 * this.padding;
    this.nx = this.grid_dim_x / this.cell_dim;
    this.ny = this.grid_dim_y / this.cell_dim;
    this.range = this.top_size - this.bottom_size;
    this.points = []

    this.noise_grid = this.build_noise_grid(this.gradient);

  };

  draw() {

    const {
      colors,
      bottom_size,
      range,
      tick,
      num_shapes,
      gradient,
      context,
    } = this

    // const bgColor = '#010a18' // dark blue
    const z_val = bottom_size + (range * tick) / num_shapes;
    const col = colors[Math.floor(Math.random() * colors.length)];

    context.fillStyle = col
    context.strokeStyle = col
    // context.strokeStyle = '#fff'

    this.process_grid(z_val);

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

  trace() {
    const {
      colors,
      bottom_size,
      range,
      tick,
      num_shapes,
      gradient,
      context,
    } = this

    // const bgColor = '#010a18' // dark blue
    const z_val = bottom_size + (range * tick) / num_shapes;

    this.process_path(z_val);
    this.split_paths()

    return this.polygons
  }

  process_grid(z_val) {

    const { context, nx, ny, cell_dim } = this

    context.save()
    for (let y = 0; y < ny; y++) {
      context.save()
      for (let x = 0; x < nx; x++) {
        this.process_cell(x, y, z_val);
        context.translate(cell_dim, 0);
      }
      context.restore()
      context.translate(0, cell_dim);
    }
    context.restore()
  }

  process_path(z_val) {

    const { context, nx, ny, cell_dim } = this

    let xOffset = 0,
        yOffset = 0

    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {

        if(y < 2) console.log(x, xOffset, xOffset+cell_dim)
        this.process_cell(x, y, z_val, true, xOffset, yOffset);
        xOffset += cell_dim
      }
      xOffset = 0
      yOffset += cell_dim
    }
    yOffset = 0
  }

  process_cell(x, y, threshold, pathOnly=false, xOffset=0, yOffset=0) {
    const v1 = this.get_noise(x, y);
    const v2 = this.get_noise(x + 1, y);
    const v3 = this.get_noise(x + 1, y + 1);
    const v4 = this.get_noise(x, y + 1);

    const b1 = v1 > threshold ? 8 : 0;
    const b2 = v2 > threshold ? 4 : 0;
    const b3 = v3 > threshold ? 2 : 0;
    const b4 = v4 > threshold ? 1 : 0;

    const id = b1 + b2 + b3 + b4;

    if (id === 0) return;

    // let p = draw_line(context, id, v1, v2, v3, v4, threshold, cell_dim)
    if(pathOnly) this.build_path(id, v1, v2, v3, v4, threshold, xOffset, yOffset)
    else this.draw_poly(this.context, id, v1, v2, v3, v4, threshold, this.cell_dim)

  }

  get_noise(x, y) {
    return this.noise_grid[y][x];
  }

  build_noise_grid(gradient) {
    const { ny, nx } = this

    return [...Array(ny + 1)].map((_, y) =>
      [...Array(nx + 1)].map((_, x) => this.sum_octave(16, x, y) + this.get_offset(gradient, x, y))
    );
  }

  get_offset(gradient, x, y) {
    const { nx } = this

    if (gradient === 'fill') return 0;
    if (gradient === 'linear') return y / nx - 0.5;
    if (gradient === 'radial') return 0.2 - this.distance_from_center(x, y) / (nx / 2);
    if (gradient === 'ring') return -Math.abs(-1 + this.distance_from_center(x, y) / (nx / 4));
  }

  distance_from_center(x, y) {
    const { ny, nx } = this

    return Math.sqrt(Math.pow(nx / 2 - x, 2) + Math.pow(ny / 2 - y, 2));
  }

  sum_octave(num_iterations, x, y) {
    let noise = 0;
    let maxAmp = 0;
    let amp = 1;
    let freq = 1 / this.noise_scale;

    for (let i = 0; i < num_iterations; i++) {
      noise += this.noiseFunction(x * freq, y * freq, i) * amp;
      maxAmp += amp;
      amp *= this.noise_persistence;
      freq *= 2;
    }

    return noise / maxAmp;
  }

  draw_line(ctx, id, nw, ne, se, sw, threshold, dim) {
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

  build_path(id, nw, ne, se, sw, threshold, x, y) {
    const r = (n) => Math.round(n * 10) / 10
    const n = [
      r(map(threshold, nw, ne, x, x+this.cell_dim)), 
      r(y+this.cell_dim)
    ];
    const e = [
      r(x+this.cell_dim), 
      r(map(threshold, ne, se, y, y+this.cell_dim))
    ];
    const s = [
      r(map(threshold, sw, se, x, x+this.cell_dim)), 
      r(y+this.cell_dim)
    ];
    const w = [
      r(x), 
      r(map(threshold, nw, sw, y, y+this.cell_dim))
    ];

    if (id === 1 || id === 14) {
      this.points.push([ new Point(...s),  new Point(...w)]);
    }
    else if (id === 2 || id === 13) {
      this.points.push([ new Point(...e),  new Point(...s)]);
    }
    else if (id === 3 || id === 12) {
      this.points.push([ new Point(...e),  new Point(...w)]);
    }
    else if (id === 4 || id === 11) {
      this.points.push([ new Point(...n),  new Point(...e)]);
    }
    else if (id === 6 || id === 9) {
      this.points.push([ new Point(...n),  new Point(...s)]);
    }
    else if (id === 7 || id === 8) {
      this.points.push([ new Point(...w),  new Point(...n)]);
    }
    else if (id === 5 || id == 10) {
      this.points.push([ new Point(...e),  new Point(...s),  new Point(...w),  new Point(...n)]);
    }

    return this.points
  }

  split_paths() {
    // TODO: make this function

    let polygons = [],
      currentPoly = []

    while(this.points.length) {
      let currentPoint = this.points.shift()
      while(currentPoint) {
        // console.log('found', currentPoint)

        currentPoly.push(currentPoint)

        let nearest = null,
          nearestDist = Infinity
        this.points.forEach((line) => {
          let d1 = Line.distance(currentPoint[1], line[0]),
            d2 = Line.distance(currentPoint[1], line[1])
          // if(line[0].x === currentPoint[1].x || line[1].x === currentPoint[0].x) console.log(currentPoint, line);
          // (new Line(currentPoint)).equals(new Line(line))
          if(d1 < nearestDist) {
            nearest = line
            nearestDist = d1
          }
          
          if (d2 < nearestDist) {
            line.reverse()
            nearest = line
            nearestDist = d2
          }
        })
        
        // console.log(Line.distance(currentPoint[1], nearest[0]), currentPoint, nearest)
        if(nearestDist < 4) {
          currentPoint = nearest
          let i = this.points.indexOf(currentPoint)
          this.points.splice(i,1)
          currentPoly.push(currentPoint)
        }
        else currentPoint = null
      
      }
      polygons.push(currentPoly)
      currentPoly = []
    }

    this.polygons = polygons
    return polygons
    console.log('polygons', polygons)

  }

  draw_poly(ctx, id, v1, v2, v3, v4, threshold, dim) {
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
    ctx.stroke()

    return square
  }

  draw_grid(p, dim, num) {
    const spacing = dim / num;
    p.stroke(0, 70);
    for (let i = 0; i <= num; i++) {
      p.line(i * spacing, 0, i * spacing, dim);
      p.line(0, i * spacing, dim, i * spacing);
    }
  }

}

function map(v, d0, d1, r0, r1) {
  return scaleLinear(
    [d0, d1],
    [r0, r1]
  )(v)
}
