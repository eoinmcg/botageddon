import Scene from './scene';
import Game from '../core/game';

export default class Routette extends Scene {
  enter(Game, data) {
    super.enter(Game);
    this.g = Game;

    // Store options on the instance to avoid global scope pollution
    this.shopOptions = [];

    const options = [
      { title: 'Gun', pos: vec2(-3, 0) },
      { title: 'Shield', pos: vec2(0, 0) },
      { title: 'Speed', pos: vec2(3, 0) },
    ];

    options.forEach((o) => {
      const option = new Option(o);
      this.shopOptions.push(option);
    });

    this.currentIndex = 0;
    this.timer = 0;
    this.delay = 0.05; // Starting speed

    this.stopping = false;
    this.selected = false;
    this.stepCount = 0;

    // Randomness: 15 to 25 steps ensures it spins at least a few times
    this.stopAt = randInt(15, 25);

    this.setActive();
  }

  setActive() {
    this.shopOptions.forEach((o, i) => {
      o.active = (i === this.currentIndex);
      this.g.sfx.play('score')
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.shopOptions.length;
    this.setActive();
  }

  finish() {
    this.selected = true;
    this.chosen = this.shopOptions[this.currentIndex];
    this.chosen.isFinal = true;

    console.log('SELECTED:', this.chosen.title);
  }

  update() {
    this.handleUiInput();

    if (this.uiInput === 'enter' && !this.stopping && !this.selected) {
      this.stopping = true;
      this.next();
    }

    if (this.selected) return;

    if (this.stopping) {
      this.timer += timeDelta;

      if (this.timer >= this.delay) {
        this.timer = 0;
        this.next();

        this.stepCount++;
        // logarithmic slowdown: feel more natural
        this.delay += 0.015 * (this.stepCount / 5);

        if (this.stepCount >= this.stopAt) {
          this.finish();
        }
      }
    }
  }

  renderPost() {
    setFontDefault('"wheaton"');
    drawText('ROULETTE', vec2(0, 6), 1, this.g.palette.aqua.col);
    drawText('Lose cash, win prizes', vec2(0, 5), .5, this.g.palette.aqua.col);

    if (!this.stopping && !this.selected) {
      // Flash effect for the prompt
      const alpha = Math.abs(Math.sin(time * 5));
      drawText('Press FIRE to Spin', vec2(0, -5.5), 0.45, new Color(1, 1, 1, alpha));
    } else if (this.selected) {
      drawText('COLLECTED:', vec2(0, -5.5), 0.5, YELLOW);
      drawText(this.chosen.title, vec2(0, -6.5), 0.5, YELLOW);
    }
  }
}

class Option extends EngineObject {
  constructor(props) {
    const size = vec2(3, 6).scale(0.8);
    super(props.pos, size);

    this.title = props.title;
    this.active = false;
    this.isFinal = false;
  }

  render() {
    let pos = this.pos.copy();
    if (this.active) {
      pos = pos.add(vec2(0, .1))
    }

    // UI Visual Logic
    let bodyColor = GRAY;
    if (this.active) bodyColor = Game.palette.pink.col;
    if (this.isFinal) bodyColor = YELLOW; // Change color when won

    drawRect(pos, this.size.scale(1.04), CYAN);
    drawRect(pos, this.size, bodyColor);

    // Simple text shadow
    let col = this.active ? BLACK : WHITE,
      shadow = this.active ? WHITE : BLACK;
    drawText(this.title, pos.add(vec2(0, -1.1)), .4, shadow);
    drawText(this.title, pos.add(vec2(0, -1.0)), .4, col);
  }
}

