import Enemy from "./enemy";

export default class Drone extends Enemy {

  constructor(g, props = {}) {
    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), 8)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.75),
      tile: g.tile('drone'),
      anim: 'drone',
      health: 0,
      value: 10,
    });


    this.health = 2;

    this.velocity = vec2(0, -.02);
    if (props.pos.x < 0) {
      this.velocity.x *= -1;
    }

  }

}

