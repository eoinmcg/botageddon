import Scene from "./scene";

export default class Splash extends Scene {
  enter(Game) {
    super.enter(Game);
    this.g = Game;

    this.options = ['Start', 'Help', 'Settings'];
    this.yPos = [-3, -4, -5];
    this.pointer = 0;

    this.g.resetStore();
    this.stick = [gamepadDpad(0)];
    this.lastStick = [0];

    this.g.levelNum = 1;
    this.activeTextCol = this.g.palette.pink.mk();

    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  update() {
    super.update();

    const stick = gamepadStick(0);
    const swipe = this.g.swipe.dir;

    if (keyWasPressed('ArrowUp')
      || swipe === 'up'
      || (this.lastStick[0] > 0 && stick.y === 0)) {
      this.pointer -= 1;
      this.g.sfx.play('walk');
      this.g.swipe.clear();
    }
    if (keyWasPressed('ArrowDown')
      || swipe === 'down'
      || (this.lastStick[0] < 0 && stick.y === 0)) {
      this.pointer += 1;
      this.g.sfx.play('walk');
      this.g.swipe.clear();
    }

    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    if (keyWasPressed('Enter')
      || keyWasPressed('KeyX')
      || gamepadWasPressed(0)
      || gamepadWasPressed(1)
      || gamepadWasPressed(2)
      || swipe === 'tap'
      || keyWasPressed('Space')) {
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

    this.lastStick = [stick.y];

  }

  render() {
    drawRectGradient(cameraPos, getCameraSize(), BLACK, new Color(.3, 0, 0));
  }

  renderPost() {

    const font = engineFontImage;

    const hi = `HI: ${this.g.hiScore.toString().padStart(5, '0')}`;
    font.drawText(hi, vec2(0, 11.4), 1, true, BLACK);
    font.drawText(hi, vec2(0, 11.5), 1, true);

    const red = this.g.palette.red.mk();
    const yellow = this.g.palette.yellow.mk();
    const lime = this.g.palette.lime.mk();
    mainContext.font = 'wheaton';
    setFontDefault('"wheaton"');
    let col = new Color(0, 0, 0, .8);
    this.logoText({
      text: 'botageddon', pos: vec2(0, 2), lineWidth: .2, color: lime,
      lineColor: BLACK
    })

    const wave = Math.sin(new Date().getTime() * 0.009);
    const t = wave > 0 ? 'cursor0' : 'cursor1';
    drawTile(vec2(-2.5, this.yPos[this.pointer] + .1), vec2(.5), this.g.tile(t), undefined, 0);
    this.options.forEach((o, i) => {
      let col = this.pointer === i ? this.activeTextCol : WHITE;
      font.drawText(o, vec2(-1.5, this.yPos[i] - .1), .5, false, BLACK);
      font.drawText(o, vec2(-1.5, this.yPos[i]), .5, false, col);
    })
  }
}
