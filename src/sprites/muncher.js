import Enemy from "./enemy";

export default class Muncher extends Enemy {

  constructor(g, props = {}) {
    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), g.size.min.y + .2)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.5),
      tile: g.tile('muncher'),
      anim: 'muncher',
      health: 2,
      value: 10,
    });

    if (Math.random() > .5) {
      this.pos.y *= -1;
    }


  }

  update() {
    const direction = this.g.p1.pos.subtract(this.pos);
    const distance = direction.length();

    this.speed = this.hit ? .04 : .02;

    if (distance > .1) {
      this.velocity = direction.normalize(this.speed);
    } else {
      this.velocity = vec2(0)
    }

    super.update();
  }

}
