import Scene from "./scene";

export default class Intro extends Scene {

  enter(Game) {
    super.enter(Game);
    this.g = Game;

    this.text = `The year is 1984.

The future is dead.
The machines won.
Humanity is a memory.

Cats inherit the ruins.
A bot army is hell-bent on
destroying all remaining
moggies.

Buckle up, kitty! Nine lives
won't be enough to survive
this mayhem!

Go give those toasters hell!`;

    setFontDefault('"wheaton"');
    this.canSkip = false;

    this.g.events.push({
      ttl: 1,
      cb: () => {
        this.canSkip = true;
      }
    })
    this.g.events.push({
      ttl: 15,
      cb: () => {
        this.g.sceneManager.changeScene('Play');
      }
    })

    this.printText = '';

    this.addLetter();
    this.nextLetterTimer = .03;
    this.nextLetter = this.nextLetterTimer;

  }

  update() {

    this.handleUiInput();

    this.nextLetter -= timeDelta;
    if (this.nextLetter < 0) {
      this.addLetter();
      this.nextLetter = this.nextLetterTimer;
    }

    if (this.text.length === this.printText.length) {
      this.canSkip === true;
    }

    if (this.uiInput === 'enter') {
      this.g.sceneManager.changeScene('Play');
    }

    super.update();
  }


  addLetter() {
    if (this.printText === this.text) return;
    this.printText = this.text.substring(0, this.printText.length + 1);
    this.g.sfx.play('walk')
  }

  render() {
    const pulse = Math.sin(time * .5);
    const p = this.g.palette;

    drawRectGradient(cameraPos, getCameraSize(), p.void.col, p.darkred.col.lerp(p.red.col, pulse));
    drawTile(vec2(0, -3), vec2(12), tile(0, vec2(160, 160), 1), new Color(0, 0, 0, .5), 0, true);

    drawText(this.printText, vec2(-4, .9), .55, this.g.palette.void.col, 0, BLACK, 'left')
    drawText(this.printText, vec2(-4, 1), .55, this.g.palette.slime.col, 0, BLACK, 'left')

    if (this.text.length === this.printText.length) {
      const font = engineFontImage;
      const flash = Math.sin(time * 2);
      if (flash > 0) {
        font.drawText('START', vec2(0, this.g.size.min.y + 1.9), .5, true, BLACK);
        font.drawText('START', vec2(0, this.g.size.min.y + 2), .5, true, WHITE);
      }
    }

    super.render();

  }
}
