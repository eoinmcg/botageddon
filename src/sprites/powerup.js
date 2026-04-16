import { outlineTile } from "../helpers/drawOutline";
import Particles from "../helpers/particles";
import Sprite from "./sprite";

export default class Powerup extends Sprite {

  constructor(g, pos, size = .5) {
    let type = 'crystal0';
    super(pos, vec2(size), g.tile(type));
    this.g = g;
    this.type = type;

    this.anims = {
      // sparkle: ["crystal0", "crystal1", "crystal2"],
      sparkle: ["fish0", "fish1", "fish2"],
    };
    this.changeAnim("sparkle", 0.1);

    this.renderOrder = 3000;

    this.outline = this.outline || {
      color: BLACK, offset: .1
    };

  }

  collideWithObject(o) {

    if (o.name === 'player') {
      this.g.store[o.player].score += 50;
      this.destroy();
      this.g.sfx.play('key', this.pos);
      Particles.powerup(this.pos, this.g.palette.slime.col);
    }
  }

}
