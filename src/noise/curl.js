import tooloud from 'tooloud'

const perlin = tooloud.Perlin.noise

export default function computeCurl(x, y, z){
  var eps = 0.0001;

  //Find rate of change in X direction
  var n1 = perlin(x + eps, y, z);
  var n2 = perlin(x - eps, y, z);

  //Average to find approximate derivative
  var a = (n1 - n2)/(2 * eps);

  //Find rate of change in Y direction
  var n1 = perlin(x, y + eps, z);
  var n2 = perlin(x, y - eps, z);

  //Average to find approximate derivative
  var b = (n1 - n2)/(2 * eps);

  //Curl
  return [b, -a];
}
