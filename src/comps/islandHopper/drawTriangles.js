import chroma from 'chroma-js'

import { Point, Triangle } from "~/element";
import { ColorSampler } from "~/technique";

export default function drawTriangles(context, width, height) {

  const spaceSampler = new ColorSampler({
    width,
    height,
    colors: [0,0,0,0,0,1,1,1],
    density: 10,
    maxCenterRange: 500,
    type: 'points'
  })

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
    if(+o) return
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
