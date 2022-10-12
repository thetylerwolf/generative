import chroma from "chroma-js";
import { shuffle } from "d3";
import noisePolygon from "../../brush/noisePolygon";
import { perlin } from "../../noise";
import { ColorSampler, poissonSampler } from "../../technique";

export function drawCircles(
  context,
  width,
  height,
  colors,
  radius,
  drawProbability
) {
  const colorSampler = new ColorSampler({
    width: width,
    height: height,
    colors,
    density: 10,
  });

  const pointData = poissonSampler(width, height, 0.005 * width);

  shuffle(pointData);

  pointData.map((p) => {
    if (Math.random() > drawProbability) return;
    let c = colorSampler.getNearestColor(p.x, p.y, 7);
    c = chroma(c);
    c = c.hsl();
    c[3] = 0.1 + Math.random() * 0.8;
    c = chroma.hsl(...c);
    c = c.css();

    // circle(context, 4, p.x, p.y, c)
    // let path = noisePath(p.x, p.y, 10, 0.5)
    context.strokeStyle = c;
    context.fillStyle = c;
    // context.lineWidth = 5
    context.lineJoin = "round";
    context.lineCap = "round";
    return noisePolygon(
      context,
      radius * perlin.noise(p.x / 10, p.y / 10, 0),
      p.x,
      p.y,
      36,
      0,
      1
    );
    // pointBrush(context, path[0], path[path.length-1])
    // path.forEach((p,i) => i ? pointBrush(context, path[i-1], p) : null)
  });
}
