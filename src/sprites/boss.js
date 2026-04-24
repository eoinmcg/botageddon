import Enemy from "./enemy";
import EnemyFire from "./enemyFire";
import Particles from "../helpers/particles";

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

    this.maxHealth = this.health;
    console.log(this.maxHealth);
    this.name = 'boss'
    this.speed = 0.05;
    this.state = 'patrol';
    this.direction = 1; // 1 = right, -1 = left
    this.chargeCooldown = randInt(180, 300); // time before next charge
    this.topY = this.pos.y; // store patrol height

    this.shadowOffset = -.5;

    this.batteryCol = new Color(.1, .1, .1)
    this.batteryHighlight = new Color(1, 1, 1, .5)
    this.fireCoolDown = 5;

    this.outline = {
      offset: 0.2,
      color: BLUE
    };
  }

  update() {
    super.update();
    this.pulse = Math.sin(time * 2);
    this.mouthWidth = .4 + this.pulse;
    this.mouthWidth = clamp(this.mouthWidth, .3, 1);

    if (this.mouthWidth > .8
      && this.state === 'patrol'
      && this.fireCoolDown < 0
      && Math.random() > .7) {

      const diff = this.g.p1.pos.subtract(this.pos);
      const angle = Math.atan2(diff.y, diff.x);
      const speed = this.shotSpeed || .1;
      new EnemyFire(this.g, this.pos.add(vec2(0, -1)), angle)
      this.g.sfx.play('shock', this.pos)
      this.fireCoolDown = 10;
    }
    this.fireCoolDown -= 1;

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
  }

  render() {

    super.render();
    this.renderBattery()

    // eyes
    const pal = this.g.palette;
    const col = pal.red.col.lerp(pal.pink.col, this.pulse)
    drawRect(this.pos.add(vec2(-.7, .29)), vec2(.3, .5), col)
    drawRect(this.pos.add(vec2(-.55, .15)), vec2(.6, .27), col)

    drawRect(this.pos.add(vec2(.7, .29)), vec2(.3, .5), col)
    drawRect(this.pos.add(vec2(.55, .15)), vec2(.6, .27), col)

    // mouth
    const mouthCol = this.fireCoolDown < 0
      ? BLACK
      : this.g.palette.darkred.col.lerp(BLACK, this.fireCoolDown / 10);
    drawRect(this.pos.add(vec2(0, -.5)), vec2(this.mouthWidth, .4), mouthCol)

  }

  renderBattery() {
    const width = 1;
    const height = .3;
    const yOffset = 1.8;
    const healthBarSize = vec2(width, height);
    const healthWidth = (this.health / this.maxHealth) * healthBarSize.x;

    const healthVal = (this.health / this.maxHealth)

    let col = this.g.palette.slime.col;
    if (healthVal < .66) col = this.g.palette.yellow.col;
    if (healthVal < .33) col = this.g.palette.red.col;

    // black background bar (centered)
    drawRect(this.pos.add(vec2(0, yOffset)), healthBarSize.add(vec2(height)), this.batteryCol);
    drawRect(this.pos.add(vec2(width * .65, yOffset)), vec2(.2), this.batteryCol);

    // red bar (left-aligned)
    drawRect(
      vec2(this.pos.x - (width * .5) + healthWidth / 2, this.pos.y + yOffset),
      vec2(healthWidth, height * .9),
      col
    );
    drawRectGradient(
      vec2(this.pos.x - (width * .5) + healthWidth / 2, this.pos.y + yOffset),
      vec2(healthWidth, height * .9),
      CLEAR_WHITE, this.batteryHighlight
    );

  }

  renderShadow() {
    drawTile(this.pos.add(vec2(0, this.shadowOffset)),
      vec2(this.size.x * 1.1, this.size.y * 1.1),
      tile(0, this.g.tileSize), this.shadowCol);
  }

  collideWithObject(o) {
    if (o.name === 'wall') {
      return false;
    }
    if (o.name === 'kitty') {
      o.destroy();
      return false;
    }

    return super.collideWithObject(o)
  }

  destroy() {
    let i = 5;
    const pos = this.pos;
    for (let i = 0; i < 1; i += .1) {
      this.g.events.push({
        ttl: i,
        cb: () => {
          Particles.explodeBaddie(pos.add(vec2(rand(.5))), this.size);
          this.g.sfx.play('explosion', pos);

        }
      })
    }
    super.destroy();
  }

}

