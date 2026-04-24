import Enemy from "./enemy";

export default class Doggo extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), g.size.max.y - .5)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.6),
      tile: g.tile('doggo'),
      anim: 'doggo',
      health: 0,
      value: 10,
    });


    this.health = 2;
    this.speed = 0.025;

    this.velocity = vec2(rand(.01, .03), -.02);
    if (props.pos.x < 0) {
      this.velocity.x *= -1;
    }
  }

  update() {
    this.mirror = this.g.p1.pos.x < this.pos.x;

    if (this.target) {
      this.moveToTarget(this.target);
    }

    if (this.atScreenEdgeX()) { this.velocity.x *= -1; }
    if (this.atScreenEdgeY()) { this.velocity.y *= -1; }

    super.update();

  }
}
