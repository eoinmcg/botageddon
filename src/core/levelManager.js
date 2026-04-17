import { levels } from "../data/levels"
import Alert from "../sprites/alert";
import Dancer from "../sprites/dancer";
import Muncher from "../sprites/muncher";
import Drone from "../sprites/drone";
import Kitty from "../sprites/kitty";
import Wall from "../sprites/wall";


export default class LevelManager {

  constructor(g, levelNum = 1) {
    this.g = g;
    this.levelNum = levelNum;
    this.g.totalLevels = levels.length;

    this.ents = {
      alert: Alert,
      drone: Drone,
      dancer: Dancer,
      muncher: Muncher,
      kitty: Kitty,
      wall: Wall,
    }

    g.waves = {};
    this.g = g;
    this.g.events = [];
    this.loadLevel(levelNum);

  }

  loadLevel(levelNum) {
    this.levelData = levels[levelNum - 1]
    console.log(this.levelData)
    if (this.levelData.music) {
      this.g.music.play(this.levelData.music)
    }
    this.timer = new Timer();
    this.timer.set(this.levelData.time)
    this.complete = false;
    this.levelClear = false;
    new Alert(this.g, { text: this.levelData.title, col: 'slime', outline: 'forestgreen', pos: vec2(-2, 1), sfx: 'score' });

    this.levelData.startUp.forEach((o) => {
      const props = o.props || {};
      new this.ents[o.ent](this.g, props)
    })
  }

  update() {
    if (this.levelClear) return;

    if (!this.g.gameOver && !this.complete && Math.random() > 0.991) {
      new this.ents[this.levelData.types.rnd()](this.g)
    }

    const botCount = engineObjects.filter(item => item.type === 'bot').length;

    if (!this.complete && this.timer.elapsed()) {
      this.complete = true;
      console.log('wave complete')
    }

    if (this.complete && botCount === 0) {
      this.levelClear = true;
      this.g.music.stop();
      this.g.events.push({
        ttl: 1,
        cb: () => {
          this.g.sceneManager.changeScene('LevelComplete');
        }
      })
      new Alert(this.g, { text: 'AREA CLEAR', col: 'pink', outline: 'red', pos: vec2(-3, 1), sfx: 'score' });
    } else {
      this.levelClear = false;
    }

    if (this.complete) {
      console.log('COMPLETE', botCount)
    }

  }

}

