import Enemy from "./enemy";

export default class Drone extends Enemy {

  constructor(g, props = {}) {
    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), 7.5)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.6),
      tile: g.tile('drone'),
      anim: 'drone',
      health: 0,
      value: 10,
    });

    this.anims = {
      float: ["drone2", "drone1", "drone0"],
      left: ["drone2"],
      right: ["drone0"],

    };
    this.changeAnim("float", 0.3);


    this.health = 2;

    this.velocity = vec2(0, -.02);
    if (props.pos.x < 0) {
      this.velocity.x *= -1;
    }

    this.target = false;

    this.speed = 0.02;
  }

  update() {

    if (this.target) {
      if (this.target.pos.x < this.pos.x) {
        this.changeAnim('left');
      } else {
        this.changeAnim('right');
      }
      this.moveToTarget(this.target);
      this.color = RED;
    }

    if (this.hit && !this.target) {
      this.target = this.g.p1
      this.speed *= 2;
    }

    super.update();
  }

  moveToTarget(target) {

    const direction = target.pos.subtract(this.pos);

    const distance = direction.length();

    if (distance > 1) { // only move if we aren't already there
      this.velocity = direction.normalize(this.speed);
    } else {
      // stop moving, we've arrived
      this.velocity = new Vector2(0, 0);
    }
  }


  render() {

    drawTile(this.pos.add(vec2(0, -1)), vec2(.8, .4), tile(0, this.g.tileSize), this.shadowCol);
    super.render();
  }

  collideWithObject(o) {
    if (o.name === 'wall') {
      return false;
    }

    return super.collideWithObject(o)
  }
}

