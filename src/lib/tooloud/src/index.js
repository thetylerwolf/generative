/*
    Perlin noise implementation taken from http://mrl.nyu.edu/~perlin/noise/
    Simplex noise implementation taken from http://www.csee.umbc.edu/~olano/s2002c36/ch02.pdf
    Worley noise implementation taken from https://aftbit.com/cell-noise-2/
*/

const Perlin = require('./Perlin')
const Simplex = require('./Simplex')
const Worley = require('./Worley')
const Fractal = require('./Fractal')

const perlin = new Perlin();
const simplex = new Simplex();
const worley = new Worley();

module.exports = {
    Perlin: {
        noise: perlin.noise,
        setSeed: perlin.setSeed,
        create: seed => new Perlin(seed)
    },

    Simplex: {
        noise: simplex.noise,
        setSeed: simplex.setSeed,
        create: seed => new Simplex(seed)
    },

    Worley: {
        Euclidean: worley.Euclidean,
        Manhattan: worley.Manhattan,
        setSeed: worley.setSeed,
        create: seed => new Worley(seed)
    },

    Fractal: {
        noise: Fractal.noise
    }
}