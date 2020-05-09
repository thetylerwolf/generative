import * as d3 from 'd3'
import niceColors from 'nice-color-palettes'

let colorPicks = [1, 2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]

let picked = []

let container = d3.selectAll('div')
  .data(colorPicks)
  .join('div')
  .style('display', 'flex')
  .style('margin', '30px')

container
  .selectAll('div')
  .data(d => niceColors[d])
  .join('div')
  .style('width', '40px')
  .style('height', '40px')
  .style('background-color', d => d)

container
  .append('text')
  .text((d) => d)
  .style('margin-left', '10px')

// container.append('br')
// container.append('br')
// container.append('br')

container.on('click', function(d,i) {
  d3.select(this).style('background-color', '#333')

  picked.push(i)
  console.log(picked)
})
