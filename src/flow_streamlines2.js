// import niceColors from 'nice-color-palettes'
import { color } from "./element";
import chroma from "chroma-js";
import { shuffle } from "d3";
import { createCanvas } from "canvas";

import { slicedStroke, pointBrush, noisePolygon, circle } from "./brush";

import {
  streamlines,
  streamlines2,
  poissonSampler,
  ColorSampler,
} from "./technique";

import { curl, perlin, simplex, fractal } from "./noise";
import { gaussianRand } from "./utils";

// a4 size
const width = 2480,
  height = 3508;

const { noise } = fractal,
  simplexNoise = simplex.noise;

const noiseSeed = Math.random() * 10000;
simplex.setSeed(noiseSeed);

// [2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]

let colors = [],
  bgColor = "#fff",
  randomI;

const lineWidth = (4 * width) / 960;

while (colors.length !== 3) {
  // 311, 320
  randomI = Math.floor(Math.random() * color.colorDictionary.length);
  randomI = 311;

  const chosenColors = color.colorDictionary[randomI];

  console.log(chosenColors.map((c) => chroma(c).css()));
  bgColor = chosenColors[3];
  colors = chosenColors.slice(0, -1);
}

let canvas = createCanvas(),
  context = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

// colorIndex: 66, 8, 5

// colorIndex: 52
// gradientAngle: 0.7560652001820445
// noiseSeed: 9937.641634185142

let gradientAngle = Math.random() * 2 * Math.PI;

const colorSampler = new ColorSampler({
  width,
  height,
  colors,
  density: 10,
  maxCenterRange: 0,
  // type: 'gradient',
  // gradientAngle,
  // gradientSteps: 10,
});

const spaceSampler = new ColorSampler({
  width,
  height,
  colors: [0, 0, 0.1, 2, 3, 3],
  density: 30,
  maxCenterRange: 0,
  type: "points",
});

console.log({
  noiseSeed,
  colorIndex: randomI,
  gradientAngle,
});

drawBg();
drawLines();

document.body.append(canvas);

function drawLines() {
  // drawShapes()

  context.globalAlpha = 1;

  const pointData = poissonSampler(width, height, 0.004 * width);
  shuffle(pointData);
  console.log(pointData.length);
  // colorSampler.colorField.forEach(path => {
  //   context.strokeStyle = path.color
  //   circle(context, 10, path.x, path.y, path.color)
  // })

  let lines = streamlines2(
    pointData,
    (x, y) => {
      let noiseFactor = 0.001,
        xIn = x * noiseFactor,
        yIn = y * noiseFactor;

      let v = noise(xIn, yIn, 0, 2, simplexNoise);
      // let c = curl(xIn, yIn, 0);
      // v = Math.sqrt(c[0] * c[0] + c[1] * c[1]);
      // let t = (Date.now() % 10)
      // let [x, y] = curl(xIn, yIn, 0 )

      // return { x: x1, y: y1 }
      return v * 1.9 * Math.PI - Math.PI / 2;
    },
    {
      width,
      height,
      resolution: 6,
      // maxLineLength: 600 * width/960,
      minLineLength: 10,
      testDist: lineWidth + 2,
      lineLengthFn: (x, y) => 100 * spaceSampler.getNearestColor(x, y, 5, 0.1),
    }
  );

  lines.forEach(onStreamlineAdded);

  function onStreamlineAdded(points) {
    context.lineWidth = lineWidth;

    let start = points[0];

    let c = colorSampler.getNearestColor(start.x, start.y, 10, 0.3);
    let blank = spaceSampler.getNearestColor(start.x, start.y, 5, 0.3) === 0;

    c = chroma(c);
    c = c.hsl();
    c[3] = 0.1 + Math.random() * 0.8;
    c = chroma.hsl(...c);
    c = c.css();

    context.strokeStyle = blank ? "rgba(255,255,255,0)" : c;
    context.lineJoin = "round";
    context.lineCap = "round";

    // Points is just a sequence of points with `x, y` coordinates through which
    // the streamline goes.
    points.reduce((from, to) => {
      if (!from) return to;
      pointBrush(context, from, to);
      return to;
    }, null);
  }
}

function drawBg() {
  // const bgColor = chroma.mix('#fff', randomColors[0], 0.1)
  const clearColor = "#333";
  context.fillStyle = clearColor;
  context.rect(0, 0, width, height);
  context.fill();
  // return
  let pointData = poissonSampler(width, height, (0.0035 * width * width) / 960);
  shuffle(pointData);

  context.globalAlpha = 0.4;

  pointData.forEach((point) => {
    let dx = point.x - width / 2,
      dy = point.y - height / 2,
      centerDist = Math.sqrt(dx * dx + dy * dy),
      dMax = Math.sqrt((width * width + height * height) / 4);
    // let c = chroma.mix('#fff', randomColors[0],1)
    let c = chroma(bgColor);
    c = c.hsl();
    // c[1] += -0.05 + Math.random() * 0.1
    c[2] += -0.05 + gaussianRand() * 0.1;
    // c[3] += -0.6 * (centerDist/dMax) + gaussianRand() * 0.4
    c[3] += -0.8 + gaussianRand() * 0.4;
    c = chroma.hsl(...c);
    // c.darken(3)
    c = c.css();
    context.fillStyle = c;

    // context.globalAlpha = 0.01
    noisePolygon(context, (20 * width) / 960, point.x, point.y);
  });

  // let circleData = poissonSampler(canvas.width / dpr, canvas.height / dpr, 0.015 * canvas.width)
  // shuffle(circleData)

  // circleData.forEach(point => {
  //   circle(context, 1 + Math.random() * 4, point.x, point.y, `rgba(255,255,255,${0 + Math.random() * 0.05})`)
  // })
}

function drawShapes() {
  // context.globalCompositeOperation = 'destination-over'
  context.globalAlpha = 1;
  context.fillStyle = "#000";
  // context.strokeStyle = '#fff'; //randomColors[3];
  context.lineWidth = 1;

  [1].forEach((prop) => {
    context.beginPath();

    let r = 30 + Math.random() * 70;

    context.ellipse(
      canvas.width * Math.random(),
      canvas.height * Math.random(),
      r,
      r,
      0,
      0,
      Math.PI * 2
    );

    context.fill();
    // context.stroke()
  });
}
