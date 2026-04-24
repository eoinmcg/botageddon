import Scene from "./scene";

export default class Init extends Scene {
  enter(Game) {
    super.enter(Game);
    this.g = Game;

    const params = new URLSearchParams(window.location.search);
    const searchObject = Object.fromEntries(params.entries());

    this.showText = searchObject?.next ? false : true;
    this.nextScene = searchObject?.next || 'Splash';
  }

  update() {
    super.update()
    this.handleUiInput();
    this.pulse = Math.sin(time * 2);

    if (this.uiInput === 'enter') {
      this.g.sceneManager.changeScene(this.nextScene);
    }
  }

  render() {
    let p = this.g.palette;
    const bg = new Color();
    bg.setHex('#193d3f');
    drawRect(cameraPos, getCameraSize(), bg);

    setFontDefault('"wheaton"');
    // if (this.showText) {
    // drawText('ROBOCIDE', vec2(0), 1, p.slime.col.lerp(p.void.col, this.pulse))
    // }

    drawText('ROBOCIDE', vec2(0, -.15), 1.9, p.void.col);
    drawText('ROBOCIDE', vec2(0), 1.8, p.slime.col);

    const size = this.g.size;

  }

}

