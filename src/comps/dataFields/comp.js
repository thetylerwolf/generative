import { color } from "../../element";
import motifs from "./motifs";
import * as PIXI from "pixi.js";

const canvas = document.getElementsByTagName("canvas")[0];

// let stage = new PIXI.Stage(0xFFFFFF),
//   renderer = PIXI.autoDetectRenderer({
//     width: canvas.width,
//     height: canvas.height,
//     view: canvas,
//   })
let app,
  elapsed = 0,
  colors = [];

while (colors.length !== 4) {
  colors =
    color.colorDictionary[
      Math.floor(Math.random() * color.colorDictionary.length)
    ];
}
// const bgColor = '#FFFEF6'
console.log(colors);

export default function comp(config) {
  const { width, height, context, time } = config;

  if (!app) {
    app = new PIXI.Application({
      antialias: true,
      width,
      height,
      view: context.canvas,
      // transparent: false,
      // backgroundColor: 0xff0000
    });
  }

  motifs[0](config, colors, app);
}
