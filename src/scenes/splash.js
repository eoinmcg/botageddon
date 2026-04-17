import Scene from "./scene";
import Particles from "../helpers/particles";

export default class Splash extends Scene {
  enter(Game) {
    super.enter(Game);
    this.g = Game;

    this.options = ['Start', 'Help', 'Settings'];
    this.yPos = [1, 0, -1];
    this.pointer = 0;

    this.g.resetStore();
    this.stick = [gamepadDpad(0)];
    this.lastStick = [0];

    this.g.levelNum = 1;
    this.activeTextCol = this.g.palette.slime.col;

    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  update() {
    super.update();

    this.handleUiInput();

    if (this.uiInput === 'up') {
      this.pointer -= 1;
      this.g.sfx.play('walk');
    } else if (this.uiInput === 'down') {
      this.pointer += 1;
      this.g.sfx.play('walk');
    }

    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    if (this.uiInput === 'enter') {
      const opt = this.options[this.pointer];
      this.g.swipe.clear();
      if (opt === 'Help') {
        this.g.sceneManager.changeScene('Help');
      } else if (opt === 'Settings') {
        this.g.sceneManager.changeScene('Settings');
      } else if (opt === '1 Player' || opt === 'Start') {
        this.g.sceneManager.changeScene('Play');
      }

    }
    Particles.smoke(vec2(-4, -4), 1);
    Particles.smoke(vec2(3, -3.5), 1);

  }

  render() {
    let p = this.g.palette;
    drawRectGradient(cameraPos, getCameraSize(), p.void.col, p.nightblue.col);

    drawTile(vec2(0, -3), vec2(12), tile(0, vec2(320, 480), 1), new Color(0, 0, 0, .9));
  }

  renderPost() {

    const font = engineFontImage;

    const hi = `HI: ${this.g.hiScore.toString().padStart(5, '0')}`;
    font.drawText(hi, vec2(0, 11.4), 1, true, BLACK);
    font.drawText(hi, vec2(0, 11.5), 1, true);

    setFontDefault('"wheaton"');
    let col = new Color(0, 0, 0, .8);
    this.logoText({
      text: 'robocide', pos: vec2(0, 4), lineWidth: .5, color: this.g.palette.pink.col,
      lineColor: this.g.palette.void.col
    })

    const wave = Math.sin(new Date().getTime() * 0.009);
    const x = wave > 0 ? .1 : 0
    drawTile(vec2(-2.5 + x, this.yPos[this.pointer]), vec2(.7), this.g.tile('select'), undefined, 0);
    this.options.forEach((o, i) => {
      let col = this.pointer === i ? this.activeTextCol : WHITE;
      font.drawText(o, vec2(-1.5, this.yPos[i] - .1), .5, false, BLACK);
      font.drawText(o, vec2(-1.5, this.yPos[i]), .5, false, col);
    })
  }
}
