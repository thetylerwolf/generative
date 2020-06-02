import dictionary from 'dictionary-of-colour-combinations'

const map = dictionary.reduce((map, color, i) => {
  color.combinations.forEach(id => {
    if (map.has(id)) map.get(id).push(i);
    else map.set(id, [ i ]);
  });
  return map;
}, new Map());

const colorDictionary = [ ...map.entries() ]
  .sort((a, b) => a[0] - b[0])
  .map(e => e[0])
  .map(n => {
    let palette = []
    dictionary.forEach(color => {
      // console.log(color, color.combinations.indexOf(n), n)
      if(color.combinations.indexOf(n) > -1) {
        palette.push(color.rgb)
      }
    })
    return palette
  })

export default {
  bluesteel: [
    'rgba(255, 255, 255, 1)',
    'rgba(0, 23, 31, 1)',
    'rgba(0, 52, 89, 1)',
    'rgba(0, 126, 167, 1)',
    'rgba(0, 168, 232, 1)'
  ],
  realblue: [
    'rgba(255, 255, 255, 1)',
    'rgba(0, 0, 31, 1)',
    'rgba(0, 0, 89, 1)',
    'rgba(0, 0, 167, 1)',
    'rgba(0, 0, 232, 1)'
  ],
  bluegold: [
    'rgba(255, 255, 255, 1)',
    'rgba(0, 0, 31, 1)',
    'rgba(0, 0, 89, 1)',
    'rgba(0, 0, 167, 1)',
    'rgba(0, 0, 232, 1)',
    // '#ffD700'
    // '#aa6c39'
    '#7a6a29'
  ],
  colorDictionary,
}
