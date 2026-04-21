import Scene from "./scene";
import Particles from '../helpers/particles';

export default class LevelComplete extends Scene {

  enter(Game) {
    this.g = Game;

    Game.levelSize = vec2();

    setCameraPos(Game.levelSize.scale(.5));
    this.change = false;

    this.text = [
      'TIME: ',
      'SAVED: ',
      'KILLED: ',
    ];

    this.g.music.play('victory');

    this.title = 'WAVE COMPLETE';

    this.lines = [];
    this.lineInterval = 1;
    this.lineTimer = null;

    let timers = ['Accuracy', 'Kills', 'Saves'];
    this.renderFrags = [];
    this.timers = {};
    timers.forEach((name, i) => {
      this.timers[name] = new Timer();
      this.timers[name].set(i * 1);
    });


    this.score = this.g.store['p1'].score;
    this.displayScore = this.g.store['p1'].score;

    const stats = this.g.store['p1'].stats;
    stats.accuracy = stats.shots
      ? Math.floor((stats.hits / stats.shots) * 100) : 0

    if (stats.accuracy > 70) {
      this.g.medals[1].unlock();
    }

    this.stats = stats;

    this.g.events.push({
      ttl: 5,
      cb: () => {
        this.g.sceneManager.changeScene('Interval');
      }
    })

    engineObjects.forEach((o) => {
      if (o.name !== 'player') {
        this.destroy();
      }
    })

  }

  update() {
    super.update();
    this.handleUiInput();

    if (this.uiInput === 'enter' && this.score === this.displayScore) {
      this.g.sceneManager.changeScene('Play');
    }

    Object.keys(this.timers).forEach((timer) => {
      if (this.timers[timer].elapsed()) {
        this.timers[timer].unset();
        delete this.timers[timer];
        this.renderFrags.push(timer);
        this.g.sfx.play('bounce');
        this.updateScore(timer);
      }
    });

    if (this.displayScore < this.score - 10) {
      this.displayScore += 10;
      this.g.sfx.play('score');
      Particles.score();
    } else if (this.displayScore < this.score) {
      this.displayScore += 10;
      this.g.sfx.play('score');
      Particles.score();
    }
    this.g.store['p1'].score = this.displayScore;
  }

  renderPost() {

    setFontDefault('"wheaton"');
    const wave = Math.sin(new Date().getTime() * 0.005);

    const slime = this.g.palette.slime.col;
    drawText(this.title, vec2(0, 6), 1, slime);

    let y = 3;
    this.renderFrags.forEach((part, i) => {
      this[`render${part}`](y - (i * 2), wave);
    })

    drawText(`${this.displayScore}`, vec2(0, -6), 1.2, this.g.palette.yellow.col, .2, BLACK, 'center');
  }

  renderAccuracy(y) {
    let text = 'Accuracy:';
    drawText(text, vec2(0, y), .7, WHITE, 0, CLEAR_BLACK, 'right');
    text = `${this.stats.accuracy}%`;
    drawText(text, vec2(1, y), .7, this.g.palette.pink.col, 0, CLEAR_BLACK, 'left');
  }

  renderKills(y) {
    let text = 'KILLS:';
    drawText(text, vec2(0, y), .7, WHITE, 0, BLACK, 'right');
    text = this.stats.kills;
    drawText(text, vec2(1, y), .7, this.g.palette.pink.col, 0, CLEAR_BLACK, 'left');
  }

  renderSaves(y) {
    let text = 'SAVED:';
    drawText(text, vec2(0, y), .7, WHITE, 0, CLEAR_BLACK, 'right');
    text = this.stats.saves;
    drawText(text, vec2(1, y), .7, this.g.palette.pink.col, 0, CLEAR_BLACK, 'left');
  }

  updateScore(type) {
    type = type.toLowerCase();
    let stat = this.stats[type];
    if (type === 'accuracy') {
      this.score += stat;
    } else if (type === 'kills') {
      this.score += stat * 10;
    } else if (type === 'saved') {
      this.score += stat * 20;
    }
  }
}
