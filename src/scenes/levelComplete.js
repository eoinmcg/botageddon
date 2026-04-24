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

    this.title = 'SECT0R COMPLETE';
    this.g.levelNum += 1;

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

    if (stats.kills === 0) {
      this.g.medals[3].unlock();
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

  render() {
    let p = this.g.palette;
    drawRectGradient(cameraPos, getCameraSize(), p.void.col, p.steel.col.lerp(BLACK, .7));
  }

  renderPost() {

    setFontDefault('"wheaton"');
    const wave = Math.sin(new Date().getTime() * 0.005);

    const slime = this.g.palette.slime.col;
    drawText(this.title, vec2(0, 6), .8, slime);

    let y = 3;
    this.renderFrags.forEach((part, i) => {
      this[`render${part}`](y - (i * 2), wave);
    })

    drawText(`${this.displayScore}`, vec2(0, -6), 1.2, this.g.palette.yellow.col, .2, BLACK, 'center');
    drawCRTBorder();
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


function drawCRTBorder() {
  const canvas = mainCanvas;
  const ctx = mainContext;
  const w = canvas.width;
  const h = canvas.height;

  ctx.save();

  const vignette = ctx.createRadialGradient(
    w / 2, h / 2, h * 0.3,   // inner circle
    w / 2, h / 2, h * 0.85   // outer circle
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.75)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  const lineSpacing = Math.max(2, Math.floor(h / 200)); // scale with resolution
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 0; y < h; y += lineSpacing * 2) {
    ctx.fillRect(0, y, w, lineSpacing);
  }

  const bevel = Math.round(Math.min(w, h) * 0.045); // ~4.5% of smaller dimension
  // ctx.strokeStyle = '#1a1a1a';
  ctx.strokeStyle = '#d4c9b0';
  ctx.lineWidth = bevel * 2;
  ctx.strokeRect(0, 0, w, h);

  // Inner highlight edge (top-left bright, bottom-right dark — classic bevel)
  const half = bevel;
  ctx.lineWidth = 2;

  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; // top & left highlight
  ctx.beginPath();
  ctx.moveTo(half, h - half);
  ctx.lineTo(half, half);
  ctx.lineTo(w - half, half);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; // bottom & right shadow
  ctx.beginPath();
  ctx.moveTo(half, h - half);
  ctx.lineTo(w - half, h - half);
  ctx.lineTo(w - half, half);
  ctx.stroke();

  // --- 4. Curved corner mask (CRTs have rounded screens) ---
  const cornerR = Math.min(w, h) * 0.07;
  ctx.fillStyle = '#000';

  // Draw black rounded-rect cutout by filling corners
  // Top-left
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(cornerR, 0);
  ctx.arcTo(0, 0, 0, cornerR, cornerR);
  ctx.closePath();
  ctx.fill();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.lineTo(w - cornerR, 0);
  ctx.arcTo(w, 0, w, cornerR, cornerR);
  ctx.closePath();
  ctx.fill();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(cornerR, h);
  ctx.arcTo(0, h, 0, h - cornerR, cornerR);
  ctx.closePath();
  ctx.fill();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - cornerR, h);
  ctx.arcTo(w, h, w, h - cornerR, cornerR);
  ctx.closePath();
  ctx.fill();

  // --- 5. Subtle green phosphor tint (optional, comment out if unwanted) ---
  ctx.fillStyle = 'rgba(0, 255, 80, 0.03)';
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}
