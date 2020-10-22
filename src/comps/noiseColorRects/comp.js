import * as PIXI from "pixi.js";
import { color } from "../../element";
import SimplexNoise from "simplex-noise";
import chroma from "chroma-js";
import { curl } from '../../noise'

const canvas = document.getElementsByTagName("canvas")[0];

// let stage = new PIXI.Stage(0xFFFFFF),
//   renderer = PIXI.autoDetectRenderer({
//     width: canvas.width,
//     height: canvas.height,
//     view: canvas,
//   })
let app, elapsed = 0, colors = []

while(colors.length !== 3) {
  colors =
    color.colorDictionary[
      Math.floor(Math.random() * color.colorDictionary.length)
    ];
}
// const bgColor = '#FFFEF6'
console.log(colors);
// const bgColor = '#fff'
// const colors = shuffle([...color.colorDictionary[130]])
// const colors = [ 'rgb(18,53,78)', 'rgb(197,97,39)' ]
// 113!
// 2 colors
// [/0, 24x, /50, 76, /84, 106?]
// 3 colors
// [121, 130, 153, 163, 178]
let graphics = []

const noiseR = new SimplexNoise(Math.random() + ''),
  noiseG = curl,
  noiseB = new SimplexNoise(Math.random() + '')

const colorScaleR = chroma
  .scale(['rgb(255,255,255)', `rgb(${colors[0]})`])
  .domain([-1, 1]),
  colorScaleG = chroma
  .scale(['rgb(255,255,255)', `rgb(${colors[1]})`])
  .domain([-1, 1]),
  colorScaleB = chroma
  .scale(['rgb(255,255,255)', `rgb(${colors[2]})`])
  .domain([-1, 1]);

export default function comp(config) {
  const { width, height, context, time } = config;
  // [2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]
  const rectSize = 15,
    xSize = Math.floor(width / rectSize),
    ySize = Math.floor(height / rectSize),
    noiseScale = 0.005,
    zScale = 0.005;

  if (!app) {
    app = new PIXI.Application({
      antialias: true,
      width,
      height,
      view: context.canvas,
    });
  }

  elapsed += time
  graphics.forEach(g => g.destroy())
  graphics = []
  console.log("draw color rects");

  drawGrid();

  function drawRect(x, y) {
    let graphic = new PIXI.Graphics();

    const fill = chroma.average(colors.map(c=>`rgb(${c})`), 'hcl', [
      (1 + noiseR.noise3D(x * noiseScale, y * noiseScale, elapsed * zScale))/2,
      (1 + noiseG(x * noiseScale, y * noiseScale, elapsed * zScale)[0])/2,
      (1 + noiseB.noise3D(x * noiseScale, y * noiseScale, elapsed * zScale))/2
    ]).hex();

    graphic.beginFill("0x" + fill.slice(1));
    graphic.drawRect(x, y, rectSize, rectSize);
    graphic.endFill();
    app.stage.addChild(graphic);
    graphics.push(graphic)
  }

  function drawGrid() {
    for (let i = 0; i <= ySize; i++) {
      for (let j = 0; j <= xSize; j++) {
        drawRect(j * rectSize, i * rectSize);
      }
    }
  }
}
