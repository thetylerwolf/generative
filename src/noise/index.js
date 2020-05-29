const curl = require('./curl')
const tooloud = require('../lib/tooloud')

const perlin = tooloud.Perlin,
  simplex = tooloud.Simplex,
  fractal = tooloud.Fractal

module.exports = {
  curl,
  perlin,
  simplex,
  fractal
}
