export default function chaikin(arr, num) {
  if (num === 0) return arr;
  const l = arr.length;
  const smooth = arr.map((c,i) => {
    let next = arr[i+1]
    if(!next) return
    return [
      [0.75*c[0] + 0.25*next[0],0.75*c[1] + 0.25*next[1]],
      [0.25*c[0] + 0.75*next[0],0.25*c[1] + 0.75*next[1]]
    ];
  }).filter(d => d).flat();
  return num === 1 ? smooth : chaikin(smooth, num - 1);
}

// export default function chaikin(arr, num) {
//   if (num === 0) return arr;
//   const l = arr.length;
//   const smooth = arr.map((c,i) => {
//     return [
//       [0.75*c[0] + 0.25*arr[(i + 1)%l][0],0.75*c[1] + 0.25*arr[(i + 1)%l][1]],
//       [0.25*c[0] + 0.75*arr[(i + 1)%l][0],0.25*c[1] + 0.75*arr[(i + 1)%l][1]]
//     ];
//   }).flat();
//   return num === 1 ? smooth : chaikin(smooth, num - 1);
// }
