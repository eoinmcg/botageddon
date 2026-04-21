import { levels } from "../data/levels"
import Alert from "../sprites/alert";
import Dancer from "../sprites/dancer";
import Muncher from "../sprites/muncher";
import Drone from "../sprites/drone";
import Kitty from "../sprites/kitty";
import Wall from "../sprites/wall";
import Powerup from "../sprites/powerup";


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
      powerup: Powerup,
    }

    g.waves = {};
    this.g = g;
    this.g.events = [];
    this.loadLevel(levelNum);

  }

  loadLevel(levelNum) {
    this.levelData = levels[levelNum - 1]
    if (this.levelData.music) {
      this.g.music.play(this.levelData.music)
    }
    this.timer = new Timer();
    this.timer.set(this.levelData.time)
    this.complete = false;
    this.g.levelClear = false;
    new Alert(this.g, { text: this.levelData.title, col: 'slime', outline: 'forestgreen', pos: vec2(-2, 1), sfx: 'score' });

    this.levelData.startUp.forEach((o) => {
      const props = o.props || {};
      new this.ents[o.ent](this.g, props)
    })
  }

  update() {
    if (this.g.levelClear) return;
    if (this.g.gameOver) return;

    const botCount = engineObjects.filter(o => o.type === 'bot').length;

    if (!this.complete && this.timer.elapsed()) {
      this.complete = true;
    }


    if (this.complete && botCount === 0) {
      this.g.levelClear = true;
      this.g.music.stop();
      this.g.events.push({
        ttl: 3,
        cb: () => {
          this.g.sceneManager.changeScene('LevelComplete');
          this.g.levelNum += 1;
        }
      })
      new Alert(this.g, { text: 'AREA CLEAR', col: 'pink', outline: 'red', pos: vec2(-3, 1), sfx: 'score' });
    } else {
      this.g.levelClear = false;
    }

    const maxBots = this.levelData.maxBots || 15;
    if (botCount >= maxBots) return;

    if (!this.spawnCooldown) this.spawnCooldown = 0;
    this.spawnCooldown -= timeDelta;


    const progress = this.timer.getPercent(); // 0 → 1
    const dynamicFreq = lerp(this.levelData.freq, this.levelData.freq - 0.03, progress);

    if (!this.g.gameOver
      && !this.complete
      && this.spawnCooldown <= 0
      && Math.random() > dynamicFreq) {
      new this.ents[this.levelData.types.rnd()](this.g)
      this.spawnCooldown = this.levelData.spawnDelay || 0.2;
    }


  }

}

