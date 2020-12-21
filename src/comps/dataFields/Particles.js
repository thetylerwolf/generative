import { color } from "../../element";
import { poissonSampler } from "../../technique";

export default class Particles {
  constructor({
    data,
    colors,
    width,
    height,
    radius,
    bloomSize = 300,
    type = "centered",
  }) {
    this.colors = colors || ["#f00"];
    this.width = width;
    this.height = height;
    this.radius = radius || 10;
    this.bloomSize = bloomSize;

    this.instantiateParticles(data);

    if (type === "poisson") {
      this.createPoisson();
    } else if (type === "centered") {
      this.createCentered();
    }
  }

  instantiateParticles(data) {
    this.particles = data || [];
    this.circles = [];

    this.particles.forEach((n, i) => {
      let users = n.numusers,
        numCircles = users / 8000;

      let color = this.colors[i % this.colors.length];
      for (let i = 0; i <= numCircles; i++) {
        this.circles.push({
          color,
          id: Math.random(),
          name: n.name,
        });
      }
    });
  }

  createPoisson() {
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
  }

  createCentered() {
    const bloomSize = this.bloomSize;

    let center = {
      x: Math.random() * (this.width - bloomSize) + bloomSize / 2,
      y: Math.random() * (this.height - bloomSize) + bloomSize / 2,
    };

    this.circles = this.circles.map((c, i) => ({
      color: c.color,
      id: c.id,
      name: c.name,
      ...center,
    }));
  }
}
