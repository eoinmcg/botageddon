export default class Scene {
  enter(game) {
    this.g = game;
    this.g.events = [];
    this.uiInput = false;
    this.lastStickY = 0
    this.g.screenShake = 0;
  }

  exit() { }

  update() {
    setCameraPos(vec2(0, 0));
    if (this.g.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.g.screenShake;
      const shakeY = (Math.random() - 0.5) * this.g.screenShake;

      cameraPos = cameraPos.add(vec2(shakeX, shakeY));

      this.g.screenShake *= 0.9;
    }

    if (keyWasPressed('KeyM')) {
      this.g.sfx.toggleMute();
      this.g.music.toggleMute();
    }

    if (keyWasPressed('KeyO')) {
      toggleFullscreen();
    }

    this.skip = false;
    if (mouseWasReleased(0)
      || keyWasReleased('KeySpace')
      || keyWasReleased('KeyEnter')
      || keyWasReleased('KeyX')
      || keyWasReleased('KeyZ')
      || gamepadWasReleased(2)
      || gamepadWasReleased(0)) {
      this.skip = true;
    }

    this.uiInput = false;

    if (!this.g.events) return

    for (let i = this.g.events.length - 1; i >= 0; --i) {
      const e = this.g.events[i];
      e.ttl -= timeDelta;

      if (e.ttl < 0) {
        e.cb();
        this.g.events.splice(i, 1);
      }
    }

  }

  // for navigating menus on splash screen etc
  handleUiInput() {

    const stick = gamepadStick(0);
    const swipe = this.g.swipe.dir;

    this.uiInput = false;
    if (keyWasPressed('ArrowUp')
      || swipe === 'up'
      || (this.lastStickY > 0 && stick.y === 0)) {
      this.uiInput = 'up';
      this.g.swipe.clear();
    }
    if (keyWasPressed('ArrowDown')
      || swipe === 'down'
      || (this.lastStickY < 0 && stick.y === 0)) {
      this.uiInput = 'down';
      this.g.swipe.clear();
    }
    if (keyWasPressed('Enter')
      || keyWasPressed('KeyX')
      || gamepadWasPressed(0)
      || gamepadWasPressed(1)
      || gamepadWasPressed(2)
      || gamepadWasPressed(7)
      || mouseWasPressed(0)
      || swipe === 'tap'
      || keyWasPressed('Space')) {
      this.uiInput = 'enter';
      this.g.swipe.clear();
    }

    this.lastStickY = stick.y;
  }

  updatePost() { }

  render() {
    for (const o of engineObjects) {
      if (o.hasShadow) o.renderShadow();
    }
  }

  renderPost() {
  }

  renderTint(tint = .7) {
    const w = mainCanvas.width / cameraScale;
    const h = mainCanvas.height / cameraScale;
    drawRect(vec2(0, 0), vec2(w, h), new Color(0, 0, 0, tint));
  }

  setGameOver() {
    this.g.music.stop();
    window.setTimeout(() => {
      this.g.music.play('gameOver');
    }, 1000);
  }


  logoText(props) {
    const defaults = {
      text: 'OHAI!',
      pos: vec2(0),
      size: 1.3,
      color: WHITE,
      lineWidth: .25,
      lineColor: BLACK,
      textAlign: 'center',
      font: '"wheaton',
      fontStyle: 'normal',

      angle: 0,
    }

    props = { ...defaults, ...props };

    drawText(props.text,
      props.pos,
      props.size,
      props.color,
      props.lineWidth,
      props.lineColor,
      props.textAlign,
      props.font,
      props.fontStyle,
      props.maxWidth,
      props.angle
    );

  }
}
