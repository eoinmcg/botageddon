import Enemy from "./enemy";

export default class Droid extends Enemy {

  constructor(g, props = {}) {

    // Spawn at top or bottom
    if (!props.pos) {
      const spawnTop = randBool();
      const y = spawnTop ? g.size.max.y - 0.5 : g.size.min.y + 0.5;
      const x = rand(g.size.min.x + 1, g.size.max.x - 1);
      props.pos = vec2(x, y);
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(.7),
      tile: g.tile('droid'),
      anim: 'dancer',
      health: 3,
      value: 15,
    });

    this.speed = 0.03;
    this.pickNewDirection();
  }

  pickNewDirection() {
    // one of the 4 cardinal directions
    const dirs = [
      vec2(1, 0),
      vec2(-1, 0),
      vec2(0, 1),
      vec2(0, -1),
    ];

    this.direction = dirs[randInt(0, dirs.length)];
    this.velocity = this.direction.scale(this.speed);

    // Walk for a short random duration
    this.walkTimer = randInt(30, 80);
  }

  update() {
    super.update();

    // Countdown movement timer
    this.walkTimer--;
    if (this.walkTimer <= 0) {
      this.pickNewDirection();
    }

    if (this.atScreenEdgeX() || this.atScreenEdgeY()) {
      this.pickNewDirection();
    }

    if (this.pos.y > this.g.size.max.y + 2 ||
      this.pos.y < this.g.size.min.y - 2) {
      this.destroy(false);
    }
  }
}

