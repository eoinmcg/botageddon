import Enemy from "./enemy";

export default class Dancer extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), 8)
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

    if (this.pos.x > 4 || this.pos.x < -4) {
      this.velocity.x *= -1;
    }

    if (this.pos.y < this.g.size.min.y) {
      console.log('OFF SCREEN');
      this.destroy(false);
    }

  }

  render() {
    drawTile(this.pos.add(vec2(0, -.5)), vec2(.8, .4), tile(0, this.g.tileSize), this.shadowCol);

    super.render();

  }

}
