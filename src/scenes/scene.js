
export default class Scene {
  enter(game) {
    this.g = game;
    this.g.events = [];
  }

  exit() { }

  update() {

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

    for (let i = this.g.events.length - 1; i >= 0; --i) {
      const e = this.g.events[i];
      e.ttl -= timeDelta;

      if (e.ttl < 0) {
        e.cb();
        this.g.events.splice(i, 1);
      }
    }

  }

  updatePost() { }

  render() { }

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
      lineWidth: .75,
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
