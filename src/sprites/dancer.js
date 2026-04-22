import Enemy from "./enemy";

export default class Dancer extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), g.size.max.y - .5)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.5),
      tile: g.tile('dancer'),
      anim: 'dancer',
      health: 0,
      value: 10,
    });


    this.health = 2;

    this.velocity = vec2(rand(.01, .03), -.02);
    if (props.pos.x < 0) {
      this.velocity.x *= -1;
    }
  }

  update() {
    super.update();

    if (this.atScreenEdgeX()) { this.velocity.x *= -1; }
    if (this.atScreenEdgeY()) { this.velocity.y *= -1; }
  }
}
