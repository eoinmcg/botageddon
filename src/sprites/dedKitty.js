import Sprite from "./sprite";

export default class DedKitty extends Sprite {

  constructor(g, props) {
    props.g = g;

    const t = g.tile("skull");
    super(props.pos, vec2(.8), t, props);

    this.color = new Color(1, 1, 1, .7);
    this.renderOrder = 500;
    this.color = props.color;
    this.color.a = .5;

    this.hasShadow = false;
    this.mass = 0;
    this.setCollision(false, false, false);


  }

}
