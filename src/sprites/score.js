export default class Score extends EngineObject {
  constructor(g, props) {

    super(props.pos, vec2(1));

    Object.assign(this, props);

    this.velocity = vec2(0, this.value > 100 ? .005 : .01);
    this.ttl = 1;
    this.g = g;
  }

  update() {
    this.ttl -= timeDelta;
    // this.velocity.y += .001;
    if (this.ttl < 0) this.destroy();
  }

  render() {
    let col = this.g.palette[this.value > 100 ? 'yellow' : 'white'].mk(this.ttl);
    const font = engineFontImage;
    font.drawText('+' + this.value, this.pos, .3, true, col)
  }
}
