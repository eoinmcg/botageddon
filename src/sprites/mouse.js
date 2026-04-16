export default class Mouse extends EngineObject {
  constructor(g, size = .75) {
    super(vec2(0), vec2(.1));

    this.drawSize = size;
    this.setCollision();
    this.g = g;
    this.renderOrder = 5000;
    this.name = 'mouse';
    document.body.style.cursor = 'none';

    this.hover = false;

  }

  update() {
    super.update();
    this.pos = mousePos.copy();
    this.hover = false;
  }

  render() {
    const frame = this.hover ? 'pointer1' : 'pointer0';
    drawTile(this.pos.add(vec2(0, -.5)), vec2(this.drawSize), this.g.tile(frame))
  }

  collideWithObject(o) {
    if (o.name === 'box') {
      this.hover = true;
      o.hover = true;
    }
  }
}

