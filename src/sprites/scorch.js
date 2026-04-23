export default class Scorch extends EngineObject {
  constructor(g, props) {

    let frame = ['x', 'x2', 'sparkle'].rnd();
    super(props.pos, vec2(rand(.5, .8), rand(.5, .8)), g.tile(frame));

    this.color = g.levelBgCol
      ? g.levelBgCol.lerp(BLACK, rand(.05, .2))
      : new Color(0, 0, 0, rand(.2, .5))

    this.angle = rand(PI)

    this.renderOrder = 1;

    this.g = g;
  }
}
