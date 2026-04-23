import Sprite from "./sprite";
import Collected from "./collected";

export default class Powerup extends Sprite {

  constructor(g, props) {
    let type = 'crystal0';
    const size = props.size ?? 0.5
    super(props.pos, vec2(size), g.tile(type));
    this.g = g;
    this.type = type;

    this.anims = {
      sparkle: ["crystal0", "crystal1", "crystal2"],
      // sparkle: ["fish0", "fish1", "fish2"],
    };
    this.changeAnim("sparkle", 0.1);

    this.renderOrder = 2500;

    this.outline = this.outline || {
      color: BLACK, offset: .1
    };
    this.ttl = 5;
    this.visible = true;
  }

  update() {
    this.ttl -= timeDelta;

    if (this.ttl <= 0) {
      this.destroy();
      return;
    }

    if (this.ttl < 1) {
      this.visible = Math.floor(this.ttl * 10) % 2 === 0;
    }
    super.update();
  }

  render() {
    if (!this.visible) return;
    super.render()
  }

  collideWithObject(o) {
    if (o.name === 'player') {
      this.g.sfx.play('score');
      const cb = () => {
        this.g.store[o.player].coin += 1;
        this.g.store[o.player].score += 10;
        this.g.flashScore = 1;
      }
      new Collected(this.g, { pos: this.pos, cb })
      this.destroy();
    }
  }
}
