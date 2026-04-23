import Enemy from "./enemy";

export default class Boss extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(
        (g.size.min.x + g.size.max.x) / 2,
        g.size.max.y - 3
      );
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(2),
      tile: g.tile('evil0'),
      anim: 'bossIdle',
      health: 50,
      value: 500,
    });

    this.name = 'boss'
    this.speed = 0.05;
    this.state = 'patrol';
    this.direction = 1; // 1 = right, -1 = left
    this.chargeCooldown = randInt(180, 300); // time before next charge
    this.topY = this.pos.y; // store patrol height

    this.shadowOffset = -.5;

  }

  update() {
    super.update();
    switch (this.state) {
      case 'patrol':
        this.velocity.x = this.direction * this.speed;
        this.velocity.y = 0;

        // Single, correct edge bounce
        if (this.atScreenEdgeX()) {
          this.direction *= -1;
          this.velocity.x = this.direction * this.speed; // apply immediately
        }

        this.chargeCooldown--;
        if (this.chargeCooldown <= 0) {
          this.state = 'charge';
          this.velocity = vec2(0, -0.3);
        }
        break;

      case 'charge':
        if (this.pos.y < this.g.size.min.y + 2) {
          this.state = 'return';
          this.velocity = vec2(0, 0.3);
        }
        break;

      case 'return':
        if (this.pos.y >= this.topY) {
          this.pos.y = this.topY;
          this.state = 'patrol';
          this.chargeCooldown = randInt(180, 300);
        }
        break;
    }

    // Keep boss clamped, but no direction logic here
    this.pos.x = clamp(
      this.pos.x,
      this.g.size.min.x + this.size.x / 2,
      this.g.size.max.x - this.size.x / 2
    );

    this.angle = 0;
    // this.color = new Color(0, 0, 0, .5)
  }

  renderShadow() {
    drawTile(this.pos.add(vec2(0, this.shadowOffset)),
      vec2(this.size.x * 1.1, this.size.y * 1.1),
      tile(0, this.g.tileSize), this.shadowCol);
  }

}

