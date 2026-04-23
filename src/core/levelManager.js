import { levels } from "../data/levels"
import Alert from "../sprites/alert";
import Doggo from "../sprites/doggo";
import Muncher from "../sprites/muncher";
import Drone from "../sprites/drone";
import Chip from "../sprites/chip";
import Droid from "../sprites/droid";
import Boss from "../sprites/boss";
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
      doggo: Doggo,
      muncher: Muncher,
      chip: Chip,
      droid: Droid,
      boss: Boss,
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
    if (!this.levelData) return;


    if (this.levelData.music) {
      this.g.music.play(this.levelData.music)
    }
    this.timer = new Timer();
    this.timer.set(this.levelData.time)
    this.complete = false;
    this.g.levelClear = false;
    new Alert(this.g, { text: this.levelData.title, col: 'white', outline: 'red', pos: vec2(-2.3, 1), sfx: 'score' });

    this.levelData.startUp.forEach((o) => {
      const props = o.props || {};
      new this.ents[o.ent](this.g, props)
    })

    if (this.levelData.isBoss) {
      new Boss(this.g)
    }

  }

  update() {
    if (this.g.levelClear) return;
    if (this.g.gameOver) return;

    if (!this.levelData && this.levelNum > levels.length) {
      this.g.sceneManager.changeScene('Victory');
      return;
    }

    const botCount = engineObjects.filter(o => o.type === 'bot').length;

    if (!this.complete && this.timer.elapsed()) {
      this.complete = true;
    }


    if (this.complete && botCount === 0) {
      const nextScene = this.levelData.isBoss
        ? 'Victory' : 'LevelComplete';
      const alertText = this.levelData.isBoss
        ? 'Goodnight!!!' : 'SECT0R CLEAR';
      this.g.levelClear = true;
      this.g.music.stop();
      this.g.events.push({
        ttl: 3,
        cb: () => {
          this.g.sceneManager.changeScene(nextScene);
          this.g.levelNum += 1;
        }
      })
      new Alert(this.g, { text: alertText, col: 'white', outline: 'red', pos: vec2(-3.3, 1), sfx: 'score' });
    } else {
      this.g.levelClear = false;
    }

    const maxBots = this.levelData.maxBots || 15;
    if (botCount >= maxBots || this.levelData.isBoss) return;

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

  render() {
    const random = new RandomGenerator(this.g.levelNum);

    let cols = [
      rgb(.4, .2, .2),
      rgb(.2, .4, .2),
      rgb(.2, .2, .4),
      rgb(.4, .4, .2),
      rgb(.2, .4, .2),
      rgb(.2, .4, .4),
    ]

    const data = this.levelData?.bg || {
      col: cols[random.int(0, cols.length - 1)],
      walls: true,
      tile: 2,
    };

    this.g.levelBgCol = data.col;
    const colLight = data.col.lerp(WHITE, .2);
    const colDark = data.col.lerp(BLACK, .1);
    const tileSize = 64;
    const flip = PI % (2 * PI);

    const xTiles = Math.ceil(this.g.W / tileSize);
    const yTiles = Math.ceil(this.g.H / tileSize);

    drawRect(cameraPos, vec2(1000), data.col);

    for (let y = -yTiles; y <= yTiles; y++) {
      for (let x = -xTiles; x <= xTiles; x++) {
        const pos = vec2(x - 0.5, y - 0.5);
        drawTile(
          pos,
          vec2(2),
          tile(data.tile, vec2(32), 2),
          new Color(1, 1, 1, random.float(0, .05))
        );
      }
    }

    // top and bottom yellow&black stripes
    for (let x = -xTiles; x <= xTiles; x++) {
      drawTile(vec2(x, -yTiles - .1), vec2(1), tile(0, vec2(32), 2), undefined, flip);
      drawTile(vec2(x, yTiles + .1), vec2(1), tile(0, vec2(32), 2));
    }

    // walls
    if (data.walls) {
      const wallCol = data.col.lerp(BLACK, .5)
      for (let y = -yTiles; y <= yTiles; y++) {
        drawTile(vec2(-xTiles + .5, y), vec2(1), tile(4, vec2(32), 2), wallCol);
        drawTile(vec2(xTiles - .5, y), vec2(1), tile(4, vec2(32), 2), wallCol, 0, true);
      }
    }

    // center tile
    drawTile(vec2(0), vec2(1.6), tile(2, vec2(32), 2), colLight);
    drawTile(vec2(0), vec2(1.5), tile(1, vec2(32), 2), colDark);

  }

}

