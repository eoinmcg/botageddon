import Sprite from "./sprite";

export default class Wall extends Sprite {
  constructor(g, props) {
    props.size = props.size || .9;
    props.t = props.t || 'wall2';

    super(props.pos, vec2(props.size), g.tile(props.t));
    this.setCollision();
    this.mass = 0;
    this.name = 'wall';
    this.g = g;

    this.shadowOffset = -.5
    // this.outline = {
    //   offset: 0.1,
    //   color: BLACK
    // };

  }
}
