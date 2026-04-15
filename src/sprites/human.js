import Sprite from "./sprite";

export default class Human extends Sprite {

  constructor(g, props) {
    props.g = g;


    const t = g.tile(['girl0', 'boy0'].rnd());
    super(props.pos, vec2(.7), t, props);

    this.setCollision();

    this.g = g;
    this.name = "human";

    this.outline = {
      offset: 0.15,
      color: BLACK
    };
  }

  update() {
    super.update()

    if (Math.random() > .99) {
      this.mirror = !this.mirror

    };

  }

  render() {
    const SHADOW = new Color(0, 0, 0, 0.2)
    drawTile(this.pos.add(vec2(0, -.5)), vec2(.7, .5), tile(0, this.g.tileSize), SHADOW);

    super.render();

  }

}
