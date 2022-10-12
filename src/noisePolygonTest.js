import niceColors from "nice-color-palettes";
import chroma from "chroma-js";

import {
  ImageSampler,
  poissonSampler,
  streamlines,
  ColorSampler,
  noisePath,
} from "./technique";

import { slicedStroke, pointBrush, circle, noisePolygon } from "./brush";
import { shuffle } from "d3";
import { makeCanvas } from "./utils";

let randomI = Math.floor(Math.random() * niceColors.length),
  randomColors = shuffle(niceColors[randomI]);
const colors = [...randomColors.slice(0, 3)];
// good indices - 43 - 2
console.log("colors index", randomI, colors);
// const colors = [
//   '#97312e',
//   '#29242e',
//   '#bf4631',
//   '#f4ba41'
// ]

let canvas = makeCanvas(),
  context = canvas.getContext("2d");

let bgCanvas = makeCanvas(),
  bgContext = bgCanvas.getContext("2d");

let dpr = window.devicePixelRatio || 1;

bgCanvas.width = canvas.width = 960;
bgCanvas.height = canvas.height = 960;

bgContext.scale(dpr, dpr);
context.scale(dpr, dpr);

const colorSampler = new ColorSampler({
  width: canvas.width,
  height: canvas.height,
  colors,
  density: 10,
});

redrawImage();

function redrawImage() {
  context.globalAlpha = 1;

  // colorSampler.colorCenters.forEach(point => {
  //   context.fillStyle = point.color
  //   context.strokeStyle = point.color
  //   // circle(context, 20, point.x, point.y, point.color)
  //   noisePolygon(context, 20, point.x, point.y, 50)
  // })
  const pointData = poissonSampler(
    canvas.width / dpr,
    canvas.height / dpr,
    0.25 * canvas.width
  );

  shuffle(pointData);

  pointData.forEach((p) => {
    let c = colorSampler.getNearestColor(p.x, p.y, 7);
    c = chroma(c);
    c = c.hsl();
    c[3] = 0.1 + Math.random() * 0.8;
    c = chroma.hsl(...c);
    c = c.css();
    console.log(c);
    // circle(context, 4, p.x, p.y, c)
    // let path = noisePath(p.x, p.y, 10, 0.5)
    context.strokeStyle = c;
    context.fillStyle = c;
    // context.lineWidth = 5
    context.lineJoin = "round";
    context.lineCap = "round";
    noisePolygon(context, 20, p.x, p.y, 36, 0, 0.75);
    // pointBrush(context, path[0], path[path.length-1])
    // path.forEach((p,i) => i ? pointBrush(context, path[i-1], p) : null)
  });

  drawShapes();

  document.body.append(canvas);
  // document.body.append(bgCanvas);
}

function drawShapes() {
  // context.globalCompositeOperation = 'destination-over'
  context.globalAlpha = 1;
  // context.fillStyle = randomColors[3];
  context.strokeStyle = "#000"; //randomColors[3];
  context.lineWidth = 1;

  [0.5].forEach((prop) => {
    context.beginPath();

    context.ellipse(
      bgCanvas.width * Math.random(),
      bgCanvas.height * Math.random(),
      80,
      80,
      0,
      0,
      Math.PI * 2
    );

    // context.fill()
    context.stroke();
  });
}
