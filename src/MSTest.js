import niceColors from 'nice-color-palettes'

import { simplex } from './noise'
import { makeCanvas } from './utils';
import { MarchingSquares } from './technique'

simplex.setSeed(Math.random() * 1000)

const width = 960;
const height = 960;

const canvas = makeCanvas()
canvas.width = width
canvas.height = height
const context = canvas.getContext('2d')

draw()

document.body.appendChild(canvas)

function draw() {
  const params = {
    noise_scale: 50,
    noise_persistence: 0.5,
    noiseFunction: (x,y,z) => simplex.noise(x,y,z),
    apply_sigmoid: 0,
    num_shapes: 20,
    bottom_size: -0.1,
    top_size: 0.5,
    gradient: 'radial',
    colors: niceColors[5].slice(3),
    width,
    height,
    padding: 0,
    cell_dim: 2,
    context,
  }

  let ms = new MarchingSquares(params)

  ms.draw()
  let p = ms.gen_path()
  console.log(p)
}
