import Scene from "./scene";
import Player from "../sprites/player";
import Alert from "../sprites/alert";
import { setItem } from "../helpers/store.js";

import LevelManager from "../core/levelManager.js";


export default class Play extends Scene {

  enter(g) {
    super.enter(g);
    this.g = g;
    this.g.plays += 1;
    setItem('plays', this.g.plays);


    this.g.gameOver = false;

    this.yPos = [-4, -5];
    this.pointer = 0;
    this.lastStick = [0];
    document.body.style.cursor = 'none'

    this.wave = new LevelManager(this.g, 1);
    this.g.p1 = new Player({ g: this.g, pos: vec2(0, -1), wave: this.wave });



  }

  update() {
    super.update();

    this.wave.update()

    if (this.g.store.p1.score > this.g.hiScore) {
      if (!this.g.newHiscore) {
        new Alert(this.g, { text: 'NEW HISCORE!!', col: 'yellow', pos: vec2(-3.7, -5), sfx: 'score' });
      }
      this.g.newHiscore = true;
      this.g.hiScore = Math.max(this.g.store.p1.score, this.g.store.p2.score);
      this.g.medals[1].unlock();
    }

    const p1Dead = this.g.store.p1.lives < 0;

    if (p1Dead && !this.g.gameOver) {
      if (this.g.newHiscore) {
        setItem('HiScore', this.g.hiScore);
      }
      this.g.gameOver = time;
      this.setGameOver();
      try {
        this.g.music.pause();
      } catch (e) { }
    }


    if (this.g.gameOver) {
      this.checkGameOverInput();
    }

    this.g.sticks.l.update();
    this.g.sticks.r.update();

  }

  updatePost() {
    if (!this.g.gameOver && (keyWasPressed('KeyP') || gamepadWasPressed(9))) {
      this.togglePause();
    }
  }

  togglePause() {
    paused = !paused;

    if (paused && !this.g.sfx.isMuted) {
      this.g.music.mute();
    } else if (!this.g.sfx.isMuted) {
      this.g.music.unmute();
    }
  }


  checkGameOverInput() {
    const stick = gamepadStick(0);
    const swipe = this.g.swipe.dir;

    if (keyWasPressed('ArrowUp')
      || swipe === 'up'
      || (this.lastStick[0] > 0 && stick.y === 0)) {
      this.pointer -= 1;
      this.g.sfx.play('walk');
      this.g.swipe.clear();
    }
    if (keyWasPressed('ArrowDown')
      || swipe === 'down'
      || (this.lastStick[0] < 0 && stick.y === 0)) {
      this.pointer += 1;
      this.g.sfx.play('walk');
      this.g.swipe.clear();
    }
    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    this.lastStick = [stick.y];

    if (time > (this.g.gameOver + 2)) {
      if (keyWasPressed('Space')
        || keyWasPressed('KeyF')
        || keyWasPressed('Enter')
        || swipe === 'tap'
        || gamepadWasPressed(0)
        || gamepadWasPressed(2)) {
        if (this.pointer === 0) {
          let p1Type = this.g.p1.type;
          let p2Type = this.g.p2?.type;
          this.g.resetStore();
          this.g.store.p1.type = p1Type;
          this.g.store.p2.type = p2Type;

          this.g.swipe.clear();
          // this.levelManager = new LevelManager(this.g, this.g.levelNum);
          this.g.sceneManager.changeScene('Play');
          this.g.swipe.clear();
        } else {
          this.g.sceneManager.changeScene('Splash');
        }
      }
    }

  }

  render() {
    drawRect(cameraPos, vec2(1000), rgb(0.1, 0.1, 0.2));
  }

  renderPost() {
    const wave = Math.sin(new Date().getTime() * 0.005);
    const font = engineFontImage;

    // const hi = `HI: ${this.g.hiScore.toString().padStart(5, '0')}`;
    // const col = this.g.newHiscore ? this.g.palette.lime.mk() : WHITE;
    // font.drawText(hi, vec2(0, -6.1), .5, true, BLACK);
    // font.drawText(hi, vec2(0, -6), .5, true, col);

    const leftX = -4.5;

    const text = this.g.p2 && this.g.p1.destroyed
      ? wave > 0 ? 'PRESS FIRE' : ''
      : `${this.g.store.p1.score.toString().padStart(5, '0')}`;
    font.drawText(text, vec2(leftX, 6.5), .5, false, BLACK);
    font.drawText(text, vec2(leftX, 6.6), .5, false, WHITE);
    const heartTile = this.g.tile('heart');
    const pink = this.g.palette.pink.col;
    for (let i = 0; i < this.g.store.p1.lives; i += 1) {
      drawTile(vec2(4.5 - (i * .7), 6.5), vec2(.7), heartTile, pink);
    }


    if (this.g.gameOver) {
      if (wave > 0) {
        this.logoText({
          text: 'GAME OVER', pos: vec2(0, 2), size: 1.3,
          color: this.g.palette.slime.mk(),
          lineColor: BLACK

        })
      }
      font.drawText('CONTINUE?', cameraPos.add(vec2(0, -4)), .7, true);
      font.drawText('QUIT', cameraPos.add(vec2(0, -5)), .7, true);

      drawTile(vec2(-4, this.yPos[this.pointer]), vec2(.5), this.g.tile('select'), undefined, 0);
    }

    if (wave > 0 && paused && !this.g.hitStop) {
      font.drawText(`PAUSED`, vec2(0, .75), 1, true, BLACK);
      font.drawText(`PAUSED`, vec2(0, 1), 1, true, this.g.palette.lime.mk());
    }

    // hacky. ensure enemyFire appears above explosions
    engineObjects.forEach((o) => {
      if (o.name === 'enemyFire') {
        o.render();
      };
    })

    this.g.sticks.l.render();
    this.g.sticks.r.render();

  }

}
