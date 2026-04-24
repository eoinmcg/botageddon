import Scene from "./scene";
import Alert from '../sprites/alert';
import Bouncer from "../sprites/bouncer";

export default class Victory extends Scene {

  enter(Game) {
    super.enter(Game);
    this.g = Game;

    this.startTime = time;
    this.showBackground = false;
    new Alert(this.g, { text: 'VICTORY!', pos: vec2(-2.5, 0) });
    this.g.events.push({
      ttl: 2,
      cb: () => {
        new Alert(this.g, {
          text: 'THE ROBOTS ARE GONE!',
          fontSize: .5,
          col: 'slime',
          outline: 'void',
          pos: vec2(-3, 0)
        });
      }
    });
    this.g.events.push({
      ttl: 4,
      cb: () => {
        new Alert(this.g, {
          text: 'KITTIES PROSPER!',
          fontSize: .5,
          col: 'orange',
          outline: 'red',
          pos: vec2(-3, 0)
        });
      }
    });
    this.g.events.push({
      ttl: 6,
      cb: () => {
        this.showBackground = true;
      }
    });

    this.g.medals[4].unlock();


    const size = this.g.size
    new PhysicsObject(vec2(size.min.x - .3, 0), vec2(1, size.max.y * 2)); // left wall
    new PhysicsObject(vec2(size.max.x + .3, 0), vec2(1, size.max.y * 2)); // left wall
    new PhysicsObject(vec2(0, -9), vec2(size.max.x * 2, 1), 'floor'); // floor
  }

  update() {
    super.update();
    this.handleUiInput();

    if (this.showBackground
      && engineObjects.length < 100
      && Math.random() > .99) {
      this.g.sfx.play('open')
      new Bouncer(this.g)
    }

    if (this.uiInput === 'enter') {
      this.exit()
    }

    if (time - this.startTime > 50) {
      this.exit()
    }
  }

  render() {
    if (!this.showBackground) return;
    let p = this.g.palette;
    drawRectGradient(cameraPos, getCameraSize(), p.cloudblue.col, p.skyblue.col);
    drawTile(vec2(0, -2.4), vec2(12), tile(1, vec2(160, 160), 1), new Color(0, 0, 0, .1));
    drawTile(vec2(0, -2.9), vec2(12), tile(3, vec2(160, 160), 1));


  }

  exit() {
    if (time - this.startTime < 3) return;
    this.g.levelNum = 1;
    this.g.sceneManager.changeScene('Splash');
  }

}
