import { color } from "../../element";
import { poissonSampler } from "../../technique";

export default class Particles {
  constructor({ data, colors, width, height, radius }) {
    this.colors = colors || ["#f00"];
    this.width = width;
    this.height = height;
    this.radius = radius || 10;

    this.update(data);
  }

  update(data) {
    this.particles = data || [];
    this.circles = [];

    this.particles.forEach((n, i) => {
      let users = n.numusers,
        numCircles = users / 5000;

      let color = this.colors[i % this.colors.length];
      for (let i = 0; i <= numCircles; i++) {
        this.circles.push({
          color,
          id: Math.random(),
          name: n.name,
        });
      }
    });

    let pointData = poissonSampler(
      this.width,
      this.height,
      this.radius,
      this.circles.length
    );

    this.circles = this.circles.map((c, i) => ({
      ...c,
      ...pointData[i],
    }));

    console.log(pointData.length, this.circles.length);
  }
}
