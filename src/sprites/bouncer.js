import Sprite from "./sprite";

export default class Bouncer extends Sprite {
  constructor(g, props = {}) {
    props.g = g;
    props.pos = props.pos || vec2(rand(-3, 3), -6);
    const t = g.tile(["kitty3"].rnd());
    super(props.pos, vec2(.5), t, props);
    this.g = g;
    this.name = "kitty";
    this.setCollision();
    this.velocity = vec2(rand(.02, .05) * randSign(), -.05);
    this.anims = { bounce: ["kitty1", "kitty2"] };
    this.changeAnim("bounce", 0.1);
    const col = ['pink', 'yellow', 'skyblue', 'peach', 'aqua', 'slime'].rnd();
    this.color = g.palette[col].col;
    this.outline = { offset: 0.1, color: BLACK };
  }

  update() {
    const prevVelY = this.velocity.y;
    super.update();

    if (this.pos.x < -4.5) {
      this.velocity.x *= -1
    }
    if (this.pos.x > 4.5) {
      this.velocity.x *= -1
    }

    if (this.pos.y < -8) {
      const bounced = abs(prevVelY) * 0.75;
      this.velocity.y = max(bounced, 0.08); // minimum bounce height
    }
    if (this.pos.y > -2) {
      this.velocity.y *= -1;
    }

    this.mirror = this.velocity.x < 0;
  }

  collideWithObject(o) {

    return false;

  }
}
