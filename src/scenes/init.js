import Scene from "./scene";
import { outlineTile } from "../helpers/drawOutline";

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
    drawText('outline', vec2(-2.5, 6.5), .6)
    drawText('plain', vec2(2.5, 6.5), .6)

    outlineTile({
      pos: vec2(-2.5, 5),
      size: vec2(1),
      tileInfo: this.g.tile('drone1')
    })
    drawTile(vec2(2.5, 5), vec2(1), this.g.tile('drone1'))

    outlineTile({
      pos: vec2(-2.5, 3),
      size: vec2(1),
      tileInfo: this.g.tile('muncher0')
    })
    drawTile(vec2(2.5, 3), vec2(1), this.g.tile('muncher0'))

    outlineTile({
      pos: vec2(-2.5, 1),
      size: vec2(1),
      tileInfo: this.g.tile('cat0')
    })
    drawTile(vec2(2.5, 1), vec2(1), this.g.tile('cat0'))


  }

}

