import * as d3 from 'd3'
import colors from 'dictionary-of-colour-combinations'
import { rgb } from 'd3';

// let colorPicks = [1, 2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]
// let colorPicks = d3.range(niceColors.length)
const map = colors.reduce((map, color, i) => {
  color.combinations.forEach(id => {
    if (map.has(id)) map.get(id).push(i);
    else map.set(id, [ i ]);
  });
  return map;
}, new Map());

console.log(colors)

const palettes = [ ...map.entries() ]
  .sort((a, b) => a[0] - b[0])
  .map(e => e[0])
  .map(n => {
    let palette = []
    colors.forEach(color => {
      // console.log(color, color.combinations.indexOf(n), n)
      if(color.combinations.indexOf(n) > -1) {
        palette.push(color.rgb)
      }
    })
    return palette
  })

let picked = []

let container = d3.selectAll('div')
  .data(palettes)
  .join('div')
  .style('display', 'flex')
  .style('margin', '30px')

container
  .selectAll('div')
  .data(d => d)
  .join('div')
  .style('width', '40px')
  .style('height', '40px')
  .style('background-color', (d) => `rgb(${d})`)

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
