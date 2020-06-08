const chroma = require('chroma-js')

const { Point, Triangle } = require("../../element")
const { ColorSampler } = require("../../technique")

module.exports = function drawTriangles(context, width, height, color='#fff') {

  const divisions = 16,
    stopSplitChance = 0,
    curveChance = 0.5

  let triangles = rootTriangles();
  for (let i = 0; i < divisions; i++) {
    triangles = triangles.map(t => t.split()).flat()
  }
  // drawShapes()

  // context.globalAlpha = 0.5
  // context.lineWidth = 0.5

//   spaceSampler.colorCenters.forEach(c => {
//     circle(context, 5, c.x, c.y, c.color === 1 ? 'blue' : 'green')
//   })
//     spaceSampler.colorField.forEach(c => {
//       circle(context, 5, c.x, c.y, c.color === 1 ? 'red' : 'black')
//     })
// return
  triangles.forEach((triangle,i) => {

    // if(o) o = 0.5
    // let c = chroma(colors[1]).brighten().alpha(+o)
    let c = chroma(color).alpha(0.5)
    // if(!(i%100)) console.log('o', o)
    // console.log(o)

    // c = chroma.hsl(...c)
    // c = c.hsl()
    // c[3] += -0.5 + Math.random() * 0.5
    // c = chroma.hsl(...c)
    c = c.css()

    // context.fillStyle = c
    // context.strokeStyle = c
    context.strokeStyle = 'rgba(255,255,255,1)'
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
