import Scene from "./scene";
import { outlineTile } from "../helpers/drawOutline";
import Alert from '../sprites/alert';

export default class Victory extends Scene {

  enter(Game) {
    super.enter(Game);
    this.g = Game;

    this.stick = [gamepadStick(0),];
    this.lastStick = [0];

    this.startTime = time;
    new Alert(this.g, { text: 'VICTORY!', pos: vec2(-3, 0) });

    this.g.medals[2].unlock();

  }

  update() {
    super.update();
    this.handleUiInput();

    if (this.uiInput === 'enter') {
      this.exit()
    }

    if (time - this.startTime > 10) {
      this.exit()
    }

  }

  exit() {
    if (time - this.startTime < 3) return;
    this.g.levelNum = 1;
    this.g.sceneManager.changeScene('Splash');
  }

}


