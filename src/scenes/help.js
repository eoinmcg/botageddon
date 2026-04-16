import Scene from "./scene";
import Mouse from "../sprites/mouse";

export default class Help extends Scene {

  enter(Game) {
    this.g = Game;

    this.stick = [gamepadStick(0),];
    this.lastStick = [0];

    this.mouse = new Mouse(this.g);

    new Box(this.g, vec2(0, -2), vec2(9, .7), 'https://eoinmcgrath.com');
    new Box(this.g, vec2(0, -3), vec2(9, .7), 'https://snabisch.itch.io/free-music-sequences-for-pico-8');
    new Box(this.g, vec2(0, -4), vec2(9, .7), 'https://github.com/KilledByAPixel/LittleJS');
    new Box(this.g, vec2(0, -6), vec2(9, .7), 'scene:Splash');
    console.log('CREATING BOXES')
  }

  update() {
    super.update();

    this.handleUiInput()

    if (this.uiInput === 'up') {
      this.g.sfx.play('walk');
    }
    if (this.uiInput === 'down') {
      this.g.sfx.play('walk');
    }

    if (this.uiInput === 'enter') {
      this.g.sceneManager.changeScene('Splash');
    }
  }

  renderPost() {

    const font = engineFontImage;

    this.logoText({
      text: 'ABOUT', pos: vec2(0, 5), size: 1.3, color: this.g.palette.slime.mk(),
      lineColor: BLACK
    });

    font.drawText(`Controls`, vec2(-4, 2), .5, false, this.g.palette.pink.mk());
    font.drawText(`keyboard and mouse\n\nor use a gamepad`, vec2(-4, 1), .4, false);

    const gray = this.g.palette.gray.mk();
    font.drawText(`code & gfx: @eoinmcg`, vec2(-4, -2), .4, false, gray);
    font.drawText(`music: by Snabisch`, vec2(-4, -3), .4, false, gray);
    font.drawText(`made with: LittleJS`, vec2(-4, -4), .4, false, gray);

    font.drawText(`Press fire to quit`, vec2(-4, -6), .4, false, gray);

  }
}



class Point extends EngineObject {

  constructor(pos) {
    super(pos, vec2(.5));

    this.setCollision();
    this.color = RED;

  }

  update() {
    this.color = RED;
    super.update();
  }

  render() {
    drawRect(this.pos, this.size, this.color);
  }

  collideWithObject(o) {
    this.color = YELLOW;
    if (keyIsDown('KeyX')) {
      this.destroy();
    }
  }

}

class Box extends EngineObject {
  constructor(g, pos, size, link) {
    super(pos, size);
    this.setCollision();

    this.g = g;
    this.hover = false;
    this.name = 'box';
    this.color = new Color(1, 1, 1, 0);
    this.active = new Color(1, 1, 0, .2);

    if (link) {
      this.link = link;
    }
  }

  update() {
    if (this.hover && mouseWasPressed(0)) {
      this.handleClick();
    }
    this.hover = false;
    super.update();
  }

  render() {
    drawRect(this.pos, this.size, this.hover ? this.active : this.color);
  }

  handleClick() {

    if (!this.link) return;

    const isScene = this.link.includes('scene:')

    if (isScene) {
      const scene = this.link.split(':').pop();
      this.g.sceneManager.changeScene(scene);
    } else {
      const a = document.createElement('a');
      a.href = this.link;
      a.target = '_blank';
      a.click();

    }
  }

}
