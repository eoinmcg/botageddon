import Enemy from "./enemy";

export default class Chip extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x + 1, g.size.max.x - 1), g.size.max.y - .5)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.5),
      tile: g.tile('chip'),
      anim: 'chip',
      health: 0,
      value: 10,
    });

    this.velocity = vec2(rand(-.02, .02), -.02);
  }

  update() {
    super.update();

    this.velocity.y = -0.02;

    const targetAngle = this.velocity.angle();
    this.angle = lerpAngle(this.angle, targetAngle, 0.1); // 0.1 = smoothing factor


    if (this.atScreenEdgeX()) { this.velocity.x *= -1; }
    if (this.pos.y > this.g.size.max.y + 1) {
      this.destroy(false)
    }
  }
}

