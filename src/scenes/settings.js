import Scene from "./scene";

export default class Settings extends Scene {
  enter(Game) {
    this.g = Game;

    this.stick = [gamepadStick(0)];
    this.lastStick = [0];

    this.options = ["Mute", "Fullscreen", "Clear HiScore", "Exit"];
    this.yPos = [0, -1, -2, -3];
    this.pointer = 0;

  }

  update() {
    super.update();

    this.handleUiInput();

    if (this.uiInput === 'up') {
      this.pointer -= 1;
      this.g.sfx.play("walk");
      this.g.swipe.clear();
    } else if (this.uiInput === 'down') {
      this.pointer += 1;
      this.g.sfx.play("walk");
      this.g.swipe.clear();
    } else if (this.uiInput === 'enter') {
      this.runChoice(this.pointer);
      this.g.swipe.clear();
    }

    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

  }

  renderPost() {
    const font = engineFontImage;
    const gray = this.g.palette.gray.mk();

    this.logoText({
      text: "SETTINGS",
      pos: vec2(0, 4),
      size: 1.3,
      color: this.g.palette.pink.mk(),
      lineColor: BLACK
    });

    const wave = Math.sin(new Date().getTime() * 0.009);
    const t = wave > 0 ? "muncher0" : "muncher1";

    drawTile(
      vec2(-3.5, this.yPos[this.pointer] + 0.2),
      vec2(.5),
      this.g.tile(t)
    );

    this.options.forEach((o, i) => {
      let text = o;
      if (o === "Mute" && this.g.sfx.isMuted) {
        text = "Mute: on";
      }
      if (o === "Mute" && !this.g.sfx.isMuted) {
        text = "Mute: off";
      }
      let col = this.pointer === i ? WHITE : gray;
      font.drawText(text, vec2(-2.5, this.yPos[i]), 0.5, false, col);
    });
  }

  runChoice(option) {
    if (option === 0) {
      this.g.sfx.toggleMute();
      this.g.music.toggleMute();
    }
    if (option === 1) {
      toggleFullscreen();
    }
    if (option === 2) {
      try {
        localStorage.clear();
        this.g.hiScore = 500;
        this.g.sfx.play("spotted");
      } catch (e) {
        console.warn("FAILED TO CLEAR SCORES");
      }
    }
    if (option === 3) {
      this.g.sceneManager.changeScene("Splash");
    }
  }
}
