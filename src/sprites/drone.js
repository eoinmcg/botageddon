import Enemy from "./enemy";

export default class Drone extends Enemy {

  constructor(g, props = {}) {
    if (!props.pos) {
      props.pos = vec2(0, -9)
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.6),
      tile: g.tile('drone'),
      anim: 'drone',
      value: 10,
    });

    this.anims = {
      float: ["drone2", "drone1", "drone0"],
      left: ["drone2"],
      right: ["drone0"],

    };
    this.changeAnim("float", 0.3);

    this.health = 2;
    this.target = false;
    this.speed = 0.02;

    this.renderOrder = 5000;

    this.velocity = vec2(0, -.02);
    this.spawnPos()
    this.hasShadow = true;
    this.shadowOffset = -1;
  }

  spawnPos() {
    const fromBottom = Math.random() > 0.5;

    const x = rand(this.g.size.min.x, this.g.size.max.x);

    const y = fromBottom
      ? this.g.size.min.y - 1.0   // below screen
      : this.g.size.max.y + 1.0;  // above screen

    this.pos = vec2(x, y);

    if (fromBottom) {
      this.velocity.y = Math.abs(this.velocity.y);
    } else {
      this.velocity.y = -Math.abs(this.velocity.y);
    }

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

    if (distance > .1) {
      this.velocity = direction.normalize().scale(this.speed);
    } else {
      this.velocity = vec2(0, 0);
    }
  }



  collideWithObject(o) {
    if (o.name === 'wall') {
      return false;
    }

    return super.collideWithObject(o)
  }
}

