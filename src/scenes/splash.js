import Scene from "./scene";
import Alert from "../sprites/alert";
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
    this.activeTextCol = this.g.palette.pink.col;

    this.startTime = time;
    this.showStatic = false;

    this.g.events.push({
      ttl: 3,
      cb: () => {
        this.toggleStatic();
      }
    })

    setFontDefault('"wheaton"');
    new Alert(this.g, {
      text: 'ROBOCIDE',
      pos: vec2(-4.2, 5),
      ttl: 0,
      fontSize: 1.7,
      col: 'slime',
      outline: 'forestgreen'
    });
  }

  toggleStatic() {
    this.showStatic = !this.showStatic;
    if (this.showStatic) {
      this.g.sfx.play('jet')
    }
    this.g.events.push({
      ttl: rand(.5, 5),
      cb: () => {
        this.toggleStatic()
      }
    })

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
    } else if (this.uiInput === 'enter') {
      const opt = this.options[this.pointer];
      this.g.swipe.clear();
      if (opt === 'Help') {
        this.g.sceneManager.changeScene('Help');
      } else if (opt === 'Settings') {
        this.g.sceneManager.changeScene('Settings');
      } else if (opt === '1 Player' || opt === 'Start') {
        this.g.plays += 1;
        this.g.sceneManager.changeScene('Intro');
      }
    }

    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    Particles.smoke(vec2(1, -2.5), 1);
    Particles.smoke(vec2(3, -1.7), 1);

  }

  render() {
    let p = this.g.palette;
    drawRectGradient(cameraPos, getCameraSize(), p.void.col, p.nightblue.col);
    drawTile(vec2(0, -3), vec2(12), tile(1, vec2(160, 160), 1), new Color(0, 0, 0, .5));
    drawTile(vec2(0, -3), vec2(12), tile(0, vec2(160, 160), 1));

    const frame = Math.sin(new Date().getTime() * 0.005) > 0 ? 'kitty3' : 'kitty4';
    drawTile(vec2(-4.7, -4.0), vec2(.6), this.g.tile(frame), BLACK)
    super.render();

    if (this.showStatic) {
      this.static(0, 0)
    }
  }

  renderPost() {

    if (time - this.startTime < .6) return;
    const font = engineFontImage;

    const hi = `HI: ${this.g.hiScore.toString().padStart(5, '0')}`;
    font.drawText(hi, vec2(0, this.g.size.min.y + 1.9), .5, true, BLACK);
    font.drawText(hi, vec2(0, this.g.size.min.y + 2), .5, true, GRAY);

    setFontDefault('"wheaton"');

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
