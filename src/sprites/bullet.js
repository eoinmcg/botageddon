import Particles from '../helpers/particles';
import Sprite from './sprite'

export default class Bullet extends Sprite {
  constructor(pos, props) {

    const t = props.g.tile('circle');
    super(pos, vec2(.2), t, props);

    this.name = 'bullet';
    this.speed = .3
    this.velocity = props.dir.normalize().scale(this.speed);
    this.angle = props.angle;
    this.owner = props.owner || 'p1';

    this.g.store[this.owner].stats.shots += 1;

    this.setCollision();

    this.renderOrder = 3000;

    this.outline = {
      offset: .1, color: RED
    }
  }

  update() {
    super.update();

    if (this.isOffScreen()) {
      this.destroy();
    }
  }

  render() {
    super.render();
  }

  collideWithObject(o) {
    if (o.name === 'wall') {
      o.hits += 1;
      this.destroy(true);
    }
    if (o.name === 'kitty' && !o.following) {
      this.destroy(true);
    }

    if (o.name === 'kitty') {
      return false;
    }

    return super.collideWithObject(o)
  }

  destroy(withEffect = false) {

    if (withEffect) {
      const dir = this.velocity.normalize().scale(-1);
      const hitPos = this.pos.add(this.velocity.normalize().scale(-0.1));
      Particles.gunhit(hitPos, dir.angle())
    }

    super.destroy();
  }
}
