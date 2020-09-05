// import { color } from '../../element'
import * as d3 from 'd3'
import * as PIXI from 'pixi.js'
import chaikin from '../../technique/chaikin'
import { color, Line, Point } from '../../element'
import { pointBrush, circle } from '../../brush'
import { gaussianRand } from '../../utils'
import { ColorSampler } from '../../technique'
import { perlin } from '../../noise'
import poissonSampler from '../../technique/poissonSampler'


// import drawBg from './drawBg.js'
// import drawTriangles from './drawTriangles.js'
// import drawBlob from './drawBlob.js'

const colors = d3.shuffle(color.colorDictionary[270])
const bgColor = '#fafafa'

console.log(colors)

export default function comp(config) {

  const {
    width,
    height,
    context
  } = config

  const maxDisplacement = height/2,
    noiseSeed = Math.random() * 1000,
    noiseResolution = 0.0006,
    lineWidth = 80

//   const app = new PIXI.Application({
//     antialias: true,
//     width,
//     height,
//     view: context.canvas
//   })
// return
  let line = new Line([
      new Point(0, gaussianRand(height/5, height/20) ),
      new Point(width, gaussianRand(height/6, height/20) )
    ]),
    squares = []

  const colorSampler = new ColorSampler({
    // width: line.points[1].x - line.points[0].x,
    // height: maxDisplacement,
    width,
    height,
    colors,
    density: 20,
    type: 'gradient',
  })

  context.beginPath();
  context.fillStyle = bgColor
  context.fillRect(0, 0, width, height);

  context.fill();
  context.closePath()

  // drawCircles(height * 500 / width, height * 30 / width)

  makeLine()
  drawSquares()
  drawLine()

  function makeLine() {

    let start = line.points[0],
      end = line.points[1],
      curve = []

    for(let i=1; i<2; i++) {
      let curvePoint = Line.pointOnLine(start,end,0.25 * i)
      curvePoint.shift(0, height/4)
      curve.push(curvePoint)
    }

    const nc = new Line([ start.copy(), ...curve, end.copy() ])
    // This (below) can fix any gaps
    nc.shiftPoints(gaussianRand(0.05, 0.05) * nc.length)

    curve = chaikin(nc.points.map(p => [p.x, p.y]), 3)
    curve = curve.map(p => new Point(p[0],p[1]))
    line = new Line([ start.copy(), ...curve, end.copy() ])

  }

  function drawLine() {
    context.strokeStyle = bgColor
    context.lineWidth = lineWidth
    context.lineJoin = context.lineCap = 'round';

    // const draw = d3.line().x(d => d.x).y(d => d.y)
    // draw.context(context)
    // draw.curve(d3.curveBasis)

    context.beginPath()
    // draw(line.points)
    // context.stroke()
    let from
    line.points.forEach((p,i) => {
      if(!i) return from = p
      let to = p

      // pointBrush(context, from, to)
      context.moveTo(from.x,from.y)
      context.lineTo(to.x,to.y)
      from = p
    })

    context.stroke()
  }

  function drawSquares () {

    let from

    const resolution = 0.1
    line.points.forEach((to,i) => {
      if(!i) return from = to

      const xDist = to.x - from.x,
        pointDensity = 1.5,
        stopFrequency = pointDensity/xDist

      let stops = 0

      for(let j=0; j<=1; j=j) {

        j += Math.random() * stopFrequency

        let location = Line.pointOnLine(from, to, j)

        if(location.x < 0.1*width || location.x > 0.9*width) {
          continue
        }

        squares.push(location)
        stops++
      }

      console.log(i, xDist, stops)

      from = to
    })

    d3.shuffle(squares).forEach((square,i) => {
      for(let j=0; j<40; j++) {

        const displacement = squareDist(square.x),
          y = square.y + displacement,
          size = squareSize()

        const color = colorSampler.getNearestColor(
          square.x - line.points[0].x,
          displacement,
          3,
          0
        )

        context.beginPath()
        context.save()
        context.translate(square.x, y)
        context.rotate(Math.random() * Math.PI/2)
        context.rect(-size/2, -size/2, size, size)
        context.fillStyle = square.color || `rgba(${color.slice(0,3)},1)`
        context.fill()
        context.restore()
        context.closePath()

      }
    })

  }

  function squareDist(x) {
    const displacement = maxDisplacement - maxDisplacement * perlin.noise(x*noiseResolution, noiseSeed, noiseSeed)
    return Math.abs(d3.randomNormal(0, displacement*0.25 )())
    // return Math.abs(gaussianRand(0, displacement*2))
  }

  function squareSize() {
    return d3.randomNormal(15, 13)()
  }

  function drawCircles(density, radius) {
    let points = poissonSampler(
      width,
      height,
      Math.max(width, height) / density
    )

    points.forEach(p => {
      const r = gaussianRand(radius, radius/4)

      const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
      gradient.addColorStop(0, 'rgba(240,240,240,1)')
      gradient.addColorStop(1, 'rgba(240,240,240,0.05)')
      circle(context, r, p.x, p.y, gradient)
    })
  }

}