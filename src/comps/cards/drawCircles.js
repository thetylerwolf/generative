import chroma, { scale } from "chroma-js";
import { shuffle } from "d3";
import noisePolygon from "../../brush/noisePolygon";
import { perlin } from "../../noise";
import { ColorSampler, poissonSampler } from "../../technique";
import { pick } from "../../utils/pick";

export function drawCircles(
  context,
  inputWidth,
  inputHeight,
  colors,
  radius,
  drawProbability,
  scaleX = 1,
  scaleY = 1
) {
  const width = inputWidth * scaleX,
    height = inputHeight * scaleY;

  context.save();
  context.translate(
    (inputWidth * (1 - scaleX)) / 2,
    (inputHeight * (1 - scaleY)) / 2
  );

  const pointData = poissonSampler(width, height, 0.005 * width);

  shuffle(pointData);

  pointData.map((p) => {
    if (Math.random() > drawProbability) return;
    // let c = colorSampler.getNearestColor(p.x, p.y, 7);
    let c = pick(colors);
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

  constext.restore();
}
