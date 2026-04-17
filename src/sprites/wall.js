import Game from "../core/game";

export default class Wall extends EngineObject {
  constructor(g, props) {
    props.size = props.size || 1;
    props.t = props.t || 'wall0';

    super(props.pos, vec2(props.size), g.tile(props.t));
    this.setCollision();
    this.mass = 0;
    this.name = 'wall';

    this.color = Game.palette.peach.col;
  }
}
