import {
  ImageSampler,
  poissonSampler,
  streamlines,
} from './technique'

import {
  slicedStroke,
  pointBrush,
} from './brush'

import {
  curl,
  perlin,
  simplex,
  fractal
} from './noise'

const noiseSeed = Math.floor(Math.random() * 1000)
console.log('noise seed', noiseSeed)
perlin.setSeed(noiseSeed)
simplex.setSeed(noiseSeed)

const { noise } = fractal,
  simplexNoise = simplex.noise

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

const imageSrc = 'images/11.jpg'

let imgSampler

setup()

async function setup() {

  imgSampler = await new ImageSampler(canvas, imageSrc, {
    scaleFactor: 0.2
  })

  redrawImage()

}

function redrawImage() {

  context.globalAlpha = 0.1

  const pointData = poissonSampler(canvas.width, canvas.height, 10)
  pointData.forEach(point => {
    point.x = point.x * 15/canvas.width,
    point.y = point.y * 15/canvas.height
  })

  streamlines({
    // As usual, define your vector field:
    vectorField(p) {
      let noiseFactor = 0.06,
        xIn = p.x * noiseFactor,
        yIn = p.y * noiseFactor

      let v = noise(xIn, yIn, 0, 2, simplexNoise),
        x1 = Math.cos(v * 1.9 * Math.PI - Math.PI/4)

      let [x, y] = curl(xIn, yIn, 0 )

      return { x: x1, y: y }
    },
    boundingBox: { left: 0, top: 0, width: 15, height: 15 },
    seed: pointData,
    maxLength: 2,
    // Separation distance between new streamlines.
    dSep: 0.01,
    // Distance between streamlines when integration should stop.
    dTest: 0.005,
    // Integration time step (passed to RK4 method.)
    timeStep: 0.01,

    // If set to true, lines are going to be drawn from the seed points
    // only in the direction of the vector field
    // forwardOnly: true,

    // onPointAdded(from, to, config) {
    //   context.lineWidth = 4
    //   context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    //   context.lineJoin = "round";
    //   context.lineCap = "round";
    //   drawPointConnection(from, to, config);

    // },
    onStreamlineAdded(points, config) {
      context.lineWidth = 2

      let a = transform(points[0], config.boundingBox);

      const color = imgSampler.sampleImage(a.x, a.y)

      context.strokeStyle = color
      context.lineJoin = "round";
      context.lineCap = "round";
      // Points is just a sequence of points with `x, y` coordinates through which
      // the streamline goes.
      points.reduce((from, to) => {
        if(!from) return to
        drawPointConnection(from, to, config)
        return to
      }, null)
    },

  }).run();

  function drawPointConnection(from, to, config) {
    let a = transform(from, config.boundingBox),
      b = transform(to, config.boundingBox)

    pointBrush(context, a, b)
  }

  function transform(pt, boundingBox) {
    var tx = (pt.x - boundingBox.left)/boundingBox.width;
    var ty = (pt.y - boundingBox.top)/boundingBox.height;
    return {
      x: tx * canvas.width,
      y: (1 - ty) * canvas.height
    }
  }

}
