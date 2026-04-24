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
    if (this.g && this.g.screenShake > 0) {
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
    const isTouchDevice = navigator.maxTouchPoints > 0;

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

    // Only check enter if no directional swipe was already handled
    if (!this.uiInput) {
      if (keyWasPressed('Enter')
        || keyWasPressed('KeyX')
        || gamepadWasPressed(0)
        || gamepadWasPressed(1)
        || gamepadWasPressed(2)
        || gamepadWasPressed(7)
        || (!isTouchDevice && mouseWasPressed(0))  // only on real mouse
        || swipe === 'tap'
        || keyWasPressed('Space')) {
        this.uiInput = 'enter';
        this.g.swipe.clear();
      }
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

  static() {
    const random = new RandomGenerator(10 + Math.floor(new Date().getTime() / 50)); // reseed every 50ms for flicker
    const t = new Date().getTime() * 0.001;
    const palette = this.g.palette;

    // Scanline interference bands
    const bandCount = 3;
    for (let b = 0; b < bandCount; b++) {
      const bandY = cameraPos.y + Math.sin(t * 0.7 + b * 2.1) * (mainCanvasSize.y / cameraScale) * 0.4;
      const bandH = (random.float(30, 8)) / cameraScale;
      const bandW = (mainCanvasSize.x / cameraScale) * 1.2;
      const bandPos = vec2(cameraPos.x, bandY);
      const bandColor = palette.white.mk(random.float(0.06, 0.02));
      drawRect(bandPos, vec2(bandW, bandH), bandColor);
    }

    // Static noise particles
    for (let i = 1000; i--;) {
      const worldW = mainCanvasSize.x / cameraScale;
      const worldH = mainCanvasSize.y / cameraScale;

      const worldX = cameraPos.x - worldW / 2 + random.float(worldW);
      const worldY = cameraPos.y - worldH / 2 + random.float(worldH);

      // Randomly choose: tiny dot, horizontal streak, or bright speck
      const kind = random.float();
      let w, h, alpha;

      if (kind < 0.6) {
        // Standard noise dot
        const size = random.float(1.5, 0.5) / cameraScale;
        w = size; h = size;
        alpha = random.float(0.9, 0.2);
      } else if (kind < 0.85) {
        // Horizontal streak (interlace artifact)
        w = random.float(12, 3) / cameraScale;
        h = random.float(1, 0.5) / cameraScale;
        alpha = random.float(0.7, 0.15);
      } else {
        // Bright blown-out speck
        const size = random.float(3, 1.5) / cameraScale;
        w = size; h = size;
        alpha = random.float(1.0, 0.7);
      }

      // Mix of white, near-white, and occasional faint color noise
      let color;
      const colorRoll = random.float();
      if (colorRoll < 0.75) {
        color = palette.white.mk(alpha);
      } else if (colorRoll < 0.88) {
        // Faint green phosphor tint
        color = new Color(0.6, 1.0, 0.6, alpha * 0.6);
      } else {
        // Faint blue/purple fringe
        color = new Color(0.7, 0.7, 1.0, alpha * 0.5);
      }

      drawRect(vec2(worldX, worldY), vec2(w, h), color);
    }

    // Occasional full-width horizontal glitch line
    if (random.float() < 0.15) {
      const glitchY = cameraPos.y - (mainCanvasSize.y / cameraScale) / 2
        + random.float(mainCanvasSize.y / cameraScale);
      const glitchH = random.float(2, 0.5) / cameraScale;
      const glitchW = mainCanvasSize.x / cameraScale;
      const glitchAlpha = random.float(0.5, 0.1);
      drawRect(vec2(cameraPos.x, glitchY), vec2(glitchW, glitchH), palette.white.mk(glitchAlpha));
    }
  }

}
