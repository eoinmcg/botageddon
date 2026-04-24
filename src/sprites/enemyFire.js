import Sprite from "./sprite";
import Particles from "../helpers/particles";

export default class EnemyFire extends Sprite {

  constructor(g, pos, angle, speed = .1) {
    super(pos, vec2(.7), g.tile('charge'));

    this.g = g;
    this.velocity = vec2(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
    );

    // this.color = g.palette.yellow.col;
    this.name = 'enemyFire';

    this.speed = speed;
    // this.angle = angle;

    this.renderOrder = 3000;

    this.outline = { color: g.palette.void.col, offset: .1 }
    // this.outline = { color: BLACK, offset: .15 }

  }

  update() {
    super.update();
  }

  collideWithObject(o) {
    if (o.name === 'player') {
      Particles.sparks(this.pos);
      this.destroy();
    }

    if (o.name === 'kitty' && o.following) {
      Particles.sparks(this.pos);
      o.destroy();
      this.destroy();
    }

    if (o.name === 'bullet') {
      Particles.sparks(this.pos);
      o.destroy();
      this.destroy();
    }

    if (o.name === 'wall') {
      Particles.sparks(this.pos);
      this.destroy();
      this.g.sfx.play('walk', this.pos)
    }

  }
}
