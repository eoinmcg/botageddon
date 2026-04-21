import Sprite from "./sprite";
import Particles from "../helpers/particles";

export default class Collected extends Sprite {

  constructor(g, props) {

    props.size = props.size || .5;
    props.t = props.t || 'crystal0';
    super(props.pos, vec2(props.size), g.tile(props.t));
    this.target = props.target || vec2(-4, 6.5)
    this.setCollision(false, false, false);
    this.props = props;
    this.g = g;

  }


  update() {
    const dir = this.target.subtract(this.pos);
    const dist = dir.length();
    const speed = .5;

    if (dist > 0.5) {
      // move toward target
      this.velocity = dir.normalize().scale(speed);
    } else {
      // snap to target and destroy
      this.pos = this.target.copy();
      if (this.props.cb) {
        this.props.cb();
      }
      this.destroy();
    }
  }

}
