import * as PIXI from "pixi.js";
import { color } from "../../../element";
import SimplexNoise from "simplex-noise";
import chroma from "chroma-js";
import data from "../data";
import Particles from "../Particles";

const canvas = document.getElementsByTagName("canvas")[0];

let elapsed = 0;

let graphics = [],
  pointData = [];

const noiseX = new SimplexNoise(Math.random() + ""),
  noiseY = new SimplexNoise(Math.random() + "");

let particles;

export default function expanding(config, colors, app) {
  const { width, height, context, time } = config;

  const minRadius = 15,
    maxRadius = 30,
    xSize = Math.floor(width / minRadius),
    ySize = Math.floor(height / minRadius),
    noiseScale = 0.005,
    zScale = 0.001;

  if (!particles) {
    particles = new Particles({
      data,
      colors: colors.map((color) => chroma(`rgb(${color})`).hex()),
      width,
      height,
      radius: 10,
    });
  }

  elapsed += time;
  graphics.forEach((g) => g.destroy());
  graphics = [];

  let g = new PIXI.Graphics();
  g.beginFill("0x" + chroma(`rgb(250,250,250)`).hex().slice(1));
  g.drawRect(0, 0, width, height);
  g.endFill();
  app.stage.addChild(g);
  graphics.push(g);

  drawGrid();

  function drawCircle({ x, y, color, id }) {
    let graphic = new PIXI.Graphics();

    const fill = color;
    graphic.beginFill("0x" + fill.slice(1));
    // graphic.drawCircle(x, y, minRadius, minRadius);
    graphic.drawCircle(x, y, 5);
    graphic.endFill();
    app.stage.addChild(graphic);
    graphics.push(graphic);
  }

  function drawGrid() {
    particles.circles.forEach((p, i) => {
      if (!p.noise) p.noise = new SimplexNoise(i + "");
      drawCircle(p);

      p.v = p.v || { x: 0, y: 0 };

      p.v.x += p.noise.noise2D(p.x, time / 20);
      p.v.y += p.noise.noise2D(p.y, time / 20);

      const friction = 0.04;
      p.v.x -= p.v.x * friction;
      p.v.y -= p.v.y * friction;

      p.x += p.v.x;
      p.y += p.v.y;

      p.x = p.x > width ? -10 : p.x;
      p.y = p.y > height ? -10 : p.y;

      p.x = p.x < 0 ? width + 10 : p.x;
      p.y = p.y < 0 ? height + 10 : p.y;
    });
  }
}
