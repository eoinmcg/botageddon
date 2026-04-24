import Sprite from "./sprite";
import Particles from "../helpers/particles";

export default class Wall extends Sprite {
  constructor(g, props) {
    props.size = props.size || .9;
    props.t = props.t || 'vat1';

    super(props.pos, vec2(props.size), g.tile(props.t));
    this.setCollision();
    this.mass = 0;
    this.name = 'wall';
    this.g = g;
    this.tile = props.t;

    this.shadowOffset = -.5

    this.rnd = new RandomGenerator(time + rand(0, 10));

    this.hits = 0;

    this.lastUpdate = 0;
    this.typingPixels = [];
  }

  update() {
    if (this.tile === 'monitor0') {
      if (this.hits === 10) {
        this.g.medals[2].unlock();
        this.g.sfx.play('smash', this.pos)
        this.hits += 1;
        Particles.sparks(this.pos);

      }
      if (this.hits > 10 && rand() > .99) {
        Particles.sparks(this.pos);
      }
      if (this.hits > 10 > .99) {
        Particles.smoke(this.pos.add(vec2(0, 1)))
      }
    }

    super.update()
  }

  render() {
    if (this.tile === 'vat0') {
      this.renderVat();
    }

    if (this.tile === 'monitor0') {
      this.hits < 10
        ? this.renderMonitor() : this.renderStatic();
    }

    super.render()
  }

  renderVat() {
    const pal = this.g.palette;
    const pulse = Math.sin(time * 2);
    const darkCol = pal.slime.col.lerp(pal.darkgreen.col, .5);
    const col = pal.slime.col.lerp(darkCol, pulse)

    let size = this.size.x - .2,
      offSet = size * .3;

    drawRect(this.pos, vec2(size), col)
    drawRect(this.pos.add(vec2(offSet, 0)), vec2(offSet + .1, this.size.y * .9), this.shadowCol)
  }

  renderMonitor() {
    const now = time;
    const interval = 0.15;
    const col = new Color(0, 1, 0, .5);

    if (now - this.lastUpdate > interval) {
      this.lastUpdate = now;
      this.typingPixels.push(vec2(rand(-.2, .18), rand(-.2, .18)));

      // limit history length
      if (this.typingPixels.length > 5)
        this.typingPixels.shift();
    }
    drawRect(this.pos, this.size.scale(.9), rgb(.2, .2, .2));

    for (const p of this.typingPixels) {
      drawRect(this.pos.add(p), vec2(.1), col);
    }
  }

  renderStatic() {
    drawRect(this.pos, this.size.scale(.9), rgb(.4, .4, .4))
    for (let i = 0; i < 50; i += 1) {
      let pos = vec2(rand(-.3, .3), rand(-.3, .3))
      drawRect(this.pos.add(pos), vec2(.1), this.shadowCol);
    }
  }

}
