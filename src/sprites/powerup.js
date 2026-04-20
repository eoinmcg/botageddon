import Particles from "../helpers/particles";
import Sprite from "./sprite";
import Collected from "./collected";

export default class Powerup extends Sprite {

  constructor(g, props) {
    let type = 'crystal0';
    props.size = props.size || .5;
    super(props.pos, vec2(props.size), g.tile(type));
    this.g = g;
    this.type = type;

    this.anims = {
      sparkle: ["crystal0", "crystal1", "crystal2"],
      // sparkle: ["fish0", "fish1", "fish2"],
    };
    this.changeAnim("sparkle", 0.1);

    this.renderOrder = 3000;

    this.outline = this.outline || {
      color: BLACK, offset: .1
    };

  }

  collideWithObject(o) {

    if (o.name === 'player') {
      this.g.sfx.play('score');
      const cb = () => {
        this.g.store[o.player].coin += 1;
        this.g.store[o.player].score += 10;
        this.g.flashScore = 1;
        this.g.sfx.play('key', this.pos);
      }
      new Collected(this.g, { pos: this.pos, cb })
      this.destroy();
    }
  }

}
