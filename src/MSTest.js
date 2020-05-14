import niceColors from 'nice-color-palettes'

import { simplex } from './noise'
import { makeCanvas } from './utils';
import { MarchingSquares } from './technique'

const { draw_poly } = MarchingSquares

let noise_grid;

let opts;
let palette;

let tick = 1;
let canvas, context

const grid_dim_x = 960;
const grid_dim_y = 960;
const padding = 0;
const canvas_dim_x = grid_dim_x + 2 * padding;
const canvas_dim_y = grid_dim_y + 2 * padding;
const cell_dim = 5;
const nx = grid_dim_x / cell_dim;
const ny = grid_dim_y / cell_dim;

init()
draw()

function init() {
  canvas = makeCanvas()
  context = canvas.getContext('2d')

  opts = {
    noise_scale: 50,
    noise_persistence: 0.5,
    apply_sigmoid: 0,
    num_shapes: 20,
    bottom_size: -0.1,
    top_size: 0.5,
    gradient: 'radial',
    palette: niceColors[5]
  };

  palette = opts.palette

};

function draw() {
  const bgColor = '#010a18' // dark blue
  context.fillStyle = bgColor
  context.rect(0, 0, canvas_dim_x, canvas_dim_y)
  context.fill()

  const range = opts.top_size - opts.bottom_size;
  const z_val = opts.bottom_size + (range * tick) / opts.num_shapes;
  const col = palette[tick % palette.length];

  noise_grid = build_noise_grid(opts.gradient);
  context.fill()
  process_grid(z_val);
  context.restore()

};

function process_grid(z_val) {
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

function process_cell(x, y, threshold) {
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


  draw_poly(context, id, v1, v2, v3, v4, threshold, cell_dim)
}

function get_noise(x, y) {
  return noise_grid[y][x];
}

function build_noise_grid(gradient) {
  return [...Array(ny + 1)].map((_, y) =>
    [...Array(nx + 1)].map((_, x) => sum_octave(16, x, y) + get_offset(gradient, x, y))
  );
}

function get_offset(gradient, x, y) {
  if (gradient === 'fill') return 0;
  if (gradient === 'linear') return y / nx - 0.5;
  if (gradient === 'radial') return 0.2 - distance_from_centre(x, y) / (nx / 2);
  if (gradient === 'ring') return -Math.abs(-1 + distance_from_centre(x, y) / (nx / 4));
}

function distance_from_centre(x, y) {
  return Math.sqrt(Math.pow(nx / 2 - x, 2) + Math.pow(ny / 2 - y, 2));
}

function sum_octave(num_iterations, x, y) {
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
