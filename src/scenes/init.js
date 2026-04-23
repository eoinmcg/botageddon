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
    drawRect(cameraPos, getCameraSize(), p.void.col);

    setFontDefault('"wheaton"');
    if (this.showText) {
      drawText('READY?', vec2(0), 1, p.slime.col.lerp(p.void.col, this.pulse))
    }
  }

}

