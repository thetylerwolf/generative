import niceColors from 'nice-color-palettes'
import chroma from 'chroma-js'
import { shuffle } from 'd3'
import SimplexNoise from 'simplex-noise'

import {
  WaterColor, circle, noisePolygon,
} from './brush'

import {
  poissonSampler,
  ColorSampler,
  MarchingSquares
} from './technique'

import { gaussianRand, makeCanvas } from './utils'
import { Triangle, Point, color } from './element'

const width = 960,
  height = 960


// [2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]

// let randomI = 5 || Math.floor(Math.random() * niceColors.length),
//   randomColors = niceColors[randomI] || shuffle(niceColors[randomI])
// const colors = [
//   // ...shuffle(randomColors.slice(2))
//   ...randomColors.slice(-1)
// ]

const colors = color.bluegold

let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d")

let dpr = window.devicePixelRatio || 1

canvas.style.width = width
canvas.style.height = height

canvas.width = width * dpr
canvas.height = height * dpr

context.scale(dpr,dpr)

// colorIndex: 66, 8, 5

// colorIndex: 52

const spaceSampler = new ColorSampler({
  width,
  height,
  colors: [0,0,0,0,0,1,1,1],
  density: 10,
  maxCenterRange: 500,
  type: 'points'
})

// drawBg(context, colors, '#ccdbff')
drawBg(context, colors, '#fff')
drawTriangles()

context.globalAlpha = 1

drawBlob()

function drawTriangles() {

  const divisions = 16,
    stopSplitChance = 0,
    curveChance = 0.5

  let triangles = rootTriangles();
  for (let i = 0; i < divisions; i++) {
    triangles = triangles.map(t => t.split()).flat()
  }
  // drawShapes()

  context.globalAlpha = 0.5
  context.lineWidth = 0.5

//   spaceSampler.colorCenters.forEach(c => {
//     circle(context, 5, c.x, c.y, c.color === 1 ? 'blue' : 'green')
//   })
//     spaceSampler.colorField.forEach(c => {
//       circle(context, 5, c.x, c.y, c.color === 1 ? 'red' : 'black')
//     })
// return
  triangles.forEach((triangle,i) => {

    let tCenter = {
      x: (triangle.p1.x + triangle.p2.x + triangle.p3.x ) / 3,
      y: (triangle.p1.y + triangle.p2.y + triangle.p3.y ) / 3,
    }

    let o = spaceSampler.getNearestColor(tCenter.x, tCenter.y, 1, 0)
    // if(o) o = 0.5
    // let c = chroma(colors[1]).brighten().alpha(+o)
    let c = chroma('#fff').alpha(+o * 0.5)
    // if(!(i%100)) console.log('o', o)
    // console.log(o)

    // c = chroma.hsl(...c)
    // c = c.hsl()
    // c[3] += -0.5 + Math.random() * 0.5
    // c = chroma.hsl(...c)
    c = c.css()

    // context.fillStyle = c
    // context.strokeStyle = c
    context.strokeStyle = c
    // context.fillStyle = "#338"

    context.beginPath()

    // colorSampler.colorField.forEach(c => {
    //   circle(context, 5, c.x, c.y, c.color)
    // })
    triangle.sides.forEach((side,i) => {
      side.points.forEach((p,j) => {
        if(!i && !j) {
          context.moveTo(p.x, p.y);
        }
        context.lineTo(p.x, p.y);
      })
    })

    context.stroke()
  })



  function rootTriangles() {

    let nw = new Point(-10,-10),
      ne = new Point(width+10, -10),
      se = new Point(width+10,height+10),
      sw = new Point(-10,height+10)

    // return [new Triangle(
    //   new Line([nw,ne]),
    //   new Line([ne,se]),
    //   new Line([se,sw,nw]),
    //   stopSplitChance, curveChance
    // )]

    return [
      new Triangle(nw, ne, sw, stopSplitChance, curveChance),
      new Triangle(ne, se, sw, stopSplitChance, curveChance)
    ]
  }

}

function drawBg(context, colors, bgColor) {

  const canvas = context.canvas
  // const bgColor = chroma.mix('#fff', randomColors[0], 0.1)
  // const bgColor = '#ffe6cc' // orange
  // const bgColor = '#ccdbff' // blue
  // const bgColor = '#141d2f' // darker blue
  // const bgColor = '#26375a' // dark blue
  // const bgColor = '#010a18' // dark blue
  context.fillStyle = bgColor
  context.rect(0, 0, width, height)
  context.fill()
// return
  let pointData = poissonSampler(canvas.width, canvas.height, 400)

  // let pointData = []
  // for(let h = 100; h<canvas.height;h+=450) {
  //   for(let w = 100; w<canvas.width;w+=450) {
  //     pointData.push({
  //       x: w,
  //       y: h
  //     })
  //   }
  // }

  context.globalAlpha = 0.015

  let wcs = pointData.map((point) => {

    // let c = chroma.mix('#fff', randomColors[0],1)
    let c = ['rgba(255,255,255,0)', colors[2], colors[5]][Math.floor(Math.random() * 3)] || colors[0]

    c = chroma(c)
    // c = c.hsl()
    // c[1] += -0.05 + Math.random() * 0.1
    // c[2] += -0.05 + gaussianRand() * 0.1
    // c[3] += -0.6 * (centerDist/dMax) + gaussianRand() * 0.4
    // c[3] = gaussianRand()
    // c[3] = 0.2
    // c[2] += gaussianRand(-0.05, 0.1)

    // c = chroma.hsl(...c)
    c = c.darken(gaussianRand(0.5,0.5))
    c = c.desaturate(gaussianRand(0,0.2))
    // c = c.desaturate()

    c = c.css()
    // context.fillStyle = c

    // context.globalAlpha = 0.01
    let wc = new WaterColor(context, {
      baseRadius: 40,
      centerX: point.x,
      centerY: point.y,
      numPoints: 6,
      subdivisions: 7,
      rVariance: 60,
      initialrVariance: 250,
      numLayers: 60,
      noiseFunction: () => gaussianRand(0.3,0.2),
      color: c,
    })

    wc.run()

    return wc
  })
  wcs[0].distortedPolygons.forEach((p,i) => {
    wcs.forEach(wc => {
      context.fillStyle = wc.color
      drawPolygon(wc.distortedPolygons[i])
    })
  })



  function drawPolygon(points) {
    // console.log(points.length)
    let polygon = new Path2D()

    points.forEach((point,i) => {
      let from = point,
        to = points[i+1]

      if(!to) return

      if(!i) polygon.moveTo(from.x, from.y)
      polygon.lineTo(to.x, to.y)

    })

    polygon.closePath()

    context.fill(polygon)
  }


}

function drawBlob() {

  const sCanvas = makeCanvas(),
    sCtx = sCanvas.getContext('2d')

  sCanvas.width = width * dpr
  sCanvas.height = height * dpr

  context.scale(dpr,dpr)

  // document.body.append(sCanvas)

  // const colors = ['rgba(255, 255, 255, 1)']

  const simplex1 = new SimplexNoise(),
    simplex2 = new SimplexNoise()

  const params = {
    noise_scale: 50,
    noise_persistence: 0.5,
    noiseFunction: (x,y,z) => simplex1.noise3D(x/2,y,z),
    // noiseFunction: (x,y,z) => simp.noise3D(x,y,z),
    num_shapes: 5,
    bottom_size: -0.1,
    top_size: 0.5,
    gradient: 'radial',
    colors: ['rgba(255,255,255,1)'],
    width: width * dpr,
    height: height * dpr,
    padding: 0,
    cell_dim: 2,
    context: sCtx,
  }

  const params2 = {
    ...params,
    noiseFunction: (x,y,z) => simplex2.noise3D(x/2,y,z),
  }

  let ms = new MarchingSquares(params)
  let ms2 = new MarchingSquares(params2)

  sCtx.globalAlpha = 1
  let dx = -width * dpr / 2 + Math.random() * width * dpr,
    dy = -height * dpr / 2 + Math.random() * height * dpr
  sCtx.save()
  sCtx.translate(dx, dy)
  // ms.trace()
  ms.draw()
  sCtx.restore()

  dx = -width * dpr / 2 + Math.random() * width * dpr,
  dy = -height * dpr / 2 + Math.random() * height * dpr
  sCtx.save()
  sCtx.translate(dx, dy)
  ms2.draw()
  sCtx.restore()

  sCtx.globalCompositeOperation = 'source-atop'

  let paintColors = [
    chroma(colors[1]).css(),
    chroma(colors[2]).css(),
    // chroma('#ffa').darken(3).css()
  ]
  // drawBg2(sCtx, paintColors, '#c0c0c0')
  drawPolys(sCtx, paintColors, '#c0c0c0')

  context.globalAlpha = 1
  context.drawImage(sCanvas, 0, 0)

}

function drawBg2(context, colors, bgColor) {

  const canvas = context.canvas

  context.fillStyle = bgColor
  context.rect(0, 0, canvas.width, canvas.height)
  context.fill()
  let pointData = poissonSampler(canvas.width, canvas.height, context.canvas.width/10)

  context.globalAlpha = 0.015

  const colors2 = ['#ffD700', '#ffD700']

  let wcs = pointData.map((point) => {

    let c = [colors[0], colors[2]][Math.round(Math.random())] || colors[0]
    // let c = colors2[Math.round(Math.random())] || colors2[0]

    c = chroma(c)
    // c = c.hsl()
    // c[1] += -0.05 + Math.random() * 0.1
    // c[2] += -0.05 + gaussianRand() * 0.1
    // c[3] += -0.6 * (centerDist/dMax) + gaussianRand() * 0.4
    // c[3] = gaussianRand()
    // c[3] = 0.2
    // c[2] += gaussianRand(-0.05, 0.1)

    // c = chroma.hsl(...c)
    c = c.darken(gaussianRand(0.5,0.5))
    // c = c.desaturate(gaussianRand(0,0.2))

    c = c.css()
    // context.fillStyle = c

    // context.globalAlpha = 0.01
    let wc = new WaterColor(context, {
      baseRadius: 10,
      centerX: point.x,
      centerY: point.y,
      numPoints: 6,
      subdivisions: 7,
      rVariance: 60,
      initialrVariance: 10,
      numLayers: 30,
      noiseFunction: () => gaussianRand(0.3,0.2),
      color: c,
    })

    wc.run()

    return wc
  })
  wcs[0].distortedPolygons.forEach((p,i) => {
    wcs.forEach(wc => {
      context.fillStyle = wc.color
      drawPolygon(wc.distortedPolygons[i])
    })
  })



  function drawPolygon(points) {
    // console.log(points.length)
    let polygon = new Path2D()

    points.forEach((point,i) => {
      let from = point,
        to = points[i+1]

      if(!to) return

      if(!i) polygon.moveTo(from.x, from.y)
      polygon.lineTo(to.x, to.y)

    })

    polygon.closePath()

    context.fill(polygon)
  }


}

function drawPolys(context, colors, bgColor) {
  context.globalAlpha = 0.05
  const canvas = context.canvas

  context.fillStyle = bgColor
  context.rect(0, 0, canvas.width, canvas.height)
  context.fill()

  const pointData = poissonSampler(canvas.width, canvas.height, 0.0025 * canvas.width)

  shuffle(pointData)

  pointData.forEach(p => {
    let c = ['#fff', '#c0c0c0'][Math.floor(Math.random() * 2)] || colors[0]
    c = chroma(c)
    c = c.brighten(gaussianRand(0.5,0.5))
    c = c.css()

    context.fillStyle = c
    context.lineJoin = "round";
    context.lineCap = "round";
    noisePolygon(context, 20, p.x, p.y, 20)
  })

}
