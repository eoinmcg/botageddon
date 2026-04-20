import Enemy from "./enemy";

export default class Muncher extends Enemy {

  constructor(g, props = {}) {
    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), 7.5)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.5),
      tile: g.tile('muncher'),
      anim: 'muncher',
      health: 0,
      value: 10,
    });


    this.speed = .03;
  }

  update() {
    super.update();

    const direction = this.g.p1.pos.subtract(this.pos);
    const distance = direction.length();

    if (distance > .1) {
      this.velocity = direction.normalize(this.speed);
    } else {
      this.velocity = vec2(0)
    }

  }

}
