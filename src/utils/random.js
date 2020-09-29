export function gaussianRand(mean=0.5, std=0.5) {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return ((rand - 3)/6) * std + mean
}