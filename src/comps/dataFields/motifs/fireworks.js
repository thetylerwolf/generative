import * as PIXI from "pixi.js";
import chroma from "chroma-js";
import data from "../data";
import Particles from "../Particles";

let elapsed,
  explosionStart = 0;

let graphics = [];

let particles,
  initialSpeed = 5,
  decay = 0.7,
  lifetime = 4,
  particleLife = lifetime,
  fireworkDelay = 1.2,
  gravity = 0.4;
// let delays = [],
//   lifetimes = [];
export default function fireworks(config, colors, app) {
  const { width, height, time } = config;

  if (!particles) {
    particles = new Particles({
      data,
      colors: colors.map((color) => chroma(`rgb(${color})`).hex()),
      width,
      height,
      radius: 10,
      type: "centered",
      bloomSize: 300,
    });
  }

  elapsed = time;
  graphics.forEach((g) => g.destroy());
  graphics = [];

  let g = new PIXI.Graphics();
  g.beginFill("0x" + chroma(`rgb(10,10,10)`).hex().slice(1));
  g.drawRect(0, 0, width, height);
  g.endFill();
  app.stage.addChild(g);
  graphics.push(g);

  drawGrid();

  function drawCircle({ x, y, color, id }) {
    let graphic = new PIXI.Graphics();

    const fill = color;
    graphic.beginFill("0x" + fill.slice(1));
    const explosionAge = elapsed - explosionStart;
    graphic.alpha =
      explosionAge > particleLife * 0.75
        ? 1 - (4 * (explosionAge - particleLife * 0.75)) / particleLife
        : 1;
    graphic.drawCircle(x, y, 2);
    graphic.endFill();
    app.stage.addChild(graphic);
    graphics.push(graphic);
  }

  function drawGrid() {
    if (elapsed > explosionStart + particleLife + fireworkDelay) {
      particles = new Particles({
        data,
        colors: colors.map((color) => chroma(`rgb(${color})`).hex()),
        width,
        height,
        radius: 10,
        type: "centered",
        bloomSize: 300,
      });

      particleLife = lifetime + lifetime * 0.2 * Math.random();
      explosionStart = elapsed;
      fireworkDelay = 0.5 + Math.random() * 1;
      // delays = [];
      // lifetimes = [];
      // console.log(
      //   "p",
      //   particles.circles.map((p) => p.dead)
      // );
    }

    let explosionLife = elapsed - explosionStart;

    particles.circles.forEach((p, i) => {
      if (!p.angle) p.angle = Math.random() * 2 * Math.PI;
      if (!p.speed) {
        p.speed = 0.5 + Math.random() * initialSpeed;
      }
      drawCircle(p);

      p.v = {
        x: Math.cos(p.angle) * p.speed, // / p.speed,
        y: Math.sin(p.angle) * p.speed, // / p.speed,
      };

      p.v.x = p.v.x * decay;
      p.v.y = p.v.y * decay + gravity;

      p.x += p.v.x;
      p.y += p.v.y;
    });
    // console.log(
    //   delays.reduce((prev, curr) => {
    //     return prev + curr;
    //   }, 0) / delays.length,
    //   lifetimes.reduce((prev, curr) => {
    //     return prev + curr;
    //   }, 0) / lifetimes.length
    // );
  }
}
