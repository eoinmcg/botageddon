import Enemy from "./enemy";

export default class Drone extends Enemy {

  constructor(g, props = {}) {
    if (!props.pos) {
      props.pos = vec2(rand(g.size.min.x, g.size.max.x), 8)
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
    };
    this.changeAnim("float", 0.3);


    this.health = 2;

    this.velocity = vec2(0, -.02);
    if (props.pos.x < 0) {
      this.velocity.x *= -1;
    }

    this.target = g.p1;

    this.speed = 0.02;
  }

  update() {

    if (this.target) {
      this.wobbleToTarget(this.target);
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

  wobbleToTarget(target) {
    let direction = target.pos.subtract(this.pos);

    const baseSpeed = 0.01;
    const wobbleSpeed = 2;
    const wobbleWidth = 0.02;

    const moveVec = direction.normalize(baseSpeed);

    const sideVec = moveVec.rotate(Math.PI / 2).normalize(wobbleWidth);
    const wobble = sideVec.scale(Math.sin(time * wobbleSpeed));

    this.velocity = moveVec.add(wobble);
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

