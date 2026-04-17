import Sprite from "./sprite";

export default class Kitty extends Sprite {

  constructor(g, props) {
    props.g = g;


    const t = g.tile(["kitty3"].rnd());
    super(props.pos, vec2(.5), t, props);

    this.setCollision();

    this.g = g;
    this.name = "kitty";

    this.anims = {
      idle: ["kitty3", "kitty4", "kitty3"],
    }
    this.changeAnim("idle", 0.5);
    this.mass = 0;

    this.cols = [
      g.palette.pink.mk(1),
      g.palette.orange.mk(1),
      g.palette.yellow.mk(1),
    ];
    this.color = this.cols.rnd();

    this.outline = {
      offset: 0.1,
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
