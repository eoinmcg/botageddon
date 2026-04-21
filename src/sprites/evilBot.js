import Sprite from "./sprite";
import Particles from "../helpers/particles";

export default class EvilBot extends Sprite {

  constructor(props) {

    const t = props.g.tile("cat0");

    super(props.pos, props.size, t, props);

    this.anims = {
      talk: ["evil0", "evil1"],
      idle: ["evil1"],
    };
    this.changeAnim("talk", 0.05);

    this.g = props.g;
    this.props = props;
    this.name = "evilBot";

    this.eyeColor = this.g.palette.red.mk(1);
    this.eyeColor.a = .5;

    this.outline = {
      offset: 0.1,
      color: BLUE
    };

    this.isFleeing = false;

    this.velocity = vec2(0, .001)
  }

  update() {
    super.update()

    if (this.isFleeing) {
      Particles.jetpack(this.pos.add(vec2(0, -.5)))
      this.g.sfx.play('jet', this.pos);
      this.velocity.y *= 1.2;
    }

    // const wave = Math.sin(time * 0.05);
    // this.pos.y += wave;
    if (this.isTalking) {
      this.eyeColor.a = rand(.6, 1)
      this.changeAnim('talk', 0.07)
    } else {
      this.changeAnim('idle')
    }

    this.eyeColor.a * .9;
    this.eyeColor.a = clamp(.5, 1);

  }

  render() {

    drawRect(vec2(this.pos.x, this.pos.y + .2), vec2(this.size.x * .9, 1), this.eyeColor)
    super.render()
  }



}
