import Scene from "./scene";

export default class LevelComplete extends Scene {

  enter(Game, data) {
    this.g = Game;
    this.ttl = 2;
    this.startTime = time;
    this.g.music.stop();

    this.p1 = this.g.p1 && this.g.store.p1.lives > -1 ? this.g.p1 : null;

    const stats = this.g.p1.stats
    this.accuracy = stats.shots
      ? Math.floor((stats.hits / stats.shots) * 100) : 0

    this.bonus = this.accuracy * 10;
    this.displayBonus = 0;
    this.g.store['p1'].score += this.bonus;

    this.nextScene = 'Play';
    if (this.g.levelNum > this.g.totalLevels) {
      console.log('GAME COMPLETE, CHAMP!');
      this.nextScene = 'Victory';
    }
  }

  update() {
    this.ttl -= timeDelta;

    if (this.displayBonus >= this.bonus) {
      this.displayBonus = this.bonus;
    } else {
      if (rand() > .75) {
        this.g.sfx.play('score');
      }
      this.displayBonus += 20;
    }

    if (this.uiInput === 'enter') {

      this.g.sceneManager.changeScene(this.nextScene);

      if (this.p1) { this.g.store.p1.score += this.bonus; }

    }

    if (time - this.startTime > 5) {
      this.g.sceneManager.changeScene(this.nextScene);
    }


  }

  renderPost() {

    setFontDefault('"wheaton"');
    drawText(`LEVEL COMPLETE!`, vec2(0, 6), 1, this.g.palette.slime.col);

    const bonus = `+${this.displayBonus}`;
    let pink = this.g.palette['pink'].col;

    drawText(`Accuracy`, vec2(0, 4), .6)
    drawText(this.accuracy + '%', vec2(0, 3), .6, pink);

    drawText(`BONUS`, vec2(0, 1), .6);
    drawText(bonus, vec2(0, 0), .6, pink);

  }

}
