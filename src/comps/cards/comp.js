// import { color } from '../../element'

// import drawBg from './drawBg.js'
// import drawTriangles from './drawTriangles.js'
// import drawBlob from './drawBlob.js'

const { color } = require("../../element");
const drawBgb0 = require("./drawBgb0");
import { drawCircles } from "./drawCircles";
// const drawTriangles = require('./drawTriangles.js')
// const drawGrain = require('./drawGrain')

// const colors = color.colorDictionary[76]
// const colors = [ 'rgba(0,57,144,1)', 'rgba(52,69,76,1)' ]
const colors = [
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#16429c",
  "#5637f0",
  "#7010a1",
].reverse();
const starColors = [
  "rgba(255,255,255,0.8)",
  "rgba(240, 252, 255, 0.8)",
  "rgba(255, 204, 240, 0.8)",
];
// const bgColor = "rgba(2, 7, 18, 0.5)";
const bgColor = "#FFF";
console.log(colors);
// const bgColor = '#fff'
// const colors = shuffle([...color.colorDictionary[130]])
// const colors = [ 'rgb(18,53,78)', 'rgb(197,97,39)' ]
// 113!
// 2 colors
// [/0, 24x, /50, 76, /84, 106?]
// 3 colors
// [121, 130, 153, 163, 178]
module.exports = function comp(config) {
  const { width, height, context } = config;
  // [2, 5, 8, 11, 15, 17, 23, 24, 29, 36, 48, 51, 55, 66, 94, 98]

  // let randomI = 5 || Math.floor(Math.random() * niceColors.length),
  //   randomColors = niceColors[randomI] || shuffle(niceColors[randomI])
  // const colors = [
  //   // ...shuffle(randomColors.slice(2))
  //   ...randomColors.slice(-1)
  // ]

  // colorIndex: 66, 8, 5

  // colorIndex: 52

  // drawBg(context, colors, '#ccdbff')
  // drawBg(context, width, height, colors.slice(0,2), colors[2])
  console.log("start bg");
  // drawBg(context, width, height, colors, bgColor)
  drawBgb0(context, width, height, colors, bgColor, 7 / 10, 3 / 5);
  // drawTriangles(context, width, height)
  // drawTriangles(context, width, height, '#000')

  context.globalAlpha = 1;

  drawCircles(context, width, height, starColors, 12, 0.1, 4 / 5, 2 / 3);

  // drawBlob3(context, colors, bgColor)

  // console.log('start grain')
  // drawGrain(context, width, height)
};
