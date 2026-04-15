import Particles from '../helpers/particles';
import Sprite from './sprite'

export default class Bullet extends Sprite {
  constructor(pos, props) {

    const t = props.g.tile('circle');
    super(pos, vec2(.2), t, props);

    this.name = 'bullet';
    this.speed = .5;
    this.velocity = props.dir.normalize(0.4);
    this.angle = props.angle;
    this.owner = props.owner || 'p1';

    this.setCollision();

    this.renderOrder = 3000;

    // this.color = this.g.palette.yellow.mk()
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
    // console.log('HOT', o);
  }
}
