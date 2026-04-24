import Sprite from "./sprite";
import DedKitty from "./dedKitty";

export default class Kitty extends Sprite {

  constructor(g, props) {
    props.g = g;


    const t = g.tile(["kitty3"].rnd());
    super(props.pos, vec2(.5), t, props);

    this.setCollision();

    this.g = g;
    this.name = "kitty";

    this.following = false;

    this.anims = {
      idle: ["kitty3", "kitty4", "kitty3"],
      run: ["kitty1", "kitty2"],
      stand: ["kitty0"]
    }
    this.changeAnim("idle", 0.5);
    this.mass = 0;
    this.speed = rand(0.05, 0.09);

    const col = [
      'pink', 'yellow', 'skyblue', 'peach', 'aqua', 'slime'
    ].rnd();
    this.color = g.palette[col].col;

    this.outline = {
      offset: 0.1,
      color: BLACK
    };

    this.followOffset = vec2(
      rand(-0.5, 0.5),
      rand(-1.2, -0.6)
    );
    this.drift = vec2(rand(-0.1, 0.1), rand(-0.1, 0.1));

    this.renderOrder = 2999;
    this.hasShadow = true;
  }

  update() {
    super.update()

    if (this.following) {
      this.drift = this.drift.add(vec2(rand(-0.005, 0.005), rand(-0.005, 0.005))).clampLength(0.15);
      return this.followPlayer()
    }

    if (Math.random() > .99) {
      this.mirror = !this.mirror
    };

    this.clampToScreen();
  }

  render() {
    super.render()
    if (!this.following) {
      let col = new Color(0, 0, 0, .5)
      drawRect(this.pos.add(vec2(0, .2)), vec2(1, .05), col)
      drawRect(this.pos.add(vec2(0, -.2)), vec2(1, .05), col)

      drawRect(this.pos.add(vec2(0, -.5)), vec2(1, .05), col)
      drawRect(this.pos.add(vec2(0, .5)), vec2(1, .05), col)

      drawRect(this.pos.add(vec2(.5, 0)), vec2(.05, 1), col)
      drawRect(this.pos.add(vec2(-.5, 0)), vec2(.05, 1), col)
    }
  }

  followPlayer() {
    const p1 = this.g.p1;

    let aim = p1.aimDir;
    if (aim.length() < 0.01) {
      // fallback if player isn't aiming
      aim = vec2(0, 1); // facing down
    }

    const right = vec2(aim.y, -aim.x);   // 90° rotated
    const forward = aim;

    const rotatedOffset =
      right.scale(this.followOffset.x)
        .add(forward.scale(this.followOffset.y))

    const target = p1.pos.add(rotatedOffset).add(this.drift);

    const dir = target.subtract(this.pos);
    const dist = dir.length();

    this.mirror = this.pos.x > target.x;

    if (dist > 0.1) {
      this.velocity = dir.normalize().scale(this.speed);
      this.changeAnim("run", 0.1);
    } else {
      this.velocity = vec2(0);
      this.changeAnim("stand", 0.5);
    }
  }

  destroy() {
    super.destroy()
    if (this.g.levelClear) {
      return;
    }
    this.g.sfx.play('hurt', this.pos)
    this.g.store['p1'].stats.saves -= 1;
    new DedKitty(this.g, { pos: this.pos, color: this.color })
  }
}
