import Scene from "./scene";
import Alert from "../sprites/alert";
import EvilBot from "../sprites/evilBot";
import { insults } from "../data/levels";
import { outlineTile } from "../helpers/drawOutline";

export default class Interval extends Scene {
  enter(Game) {
    super.enter(Game);
    this.g = Game;
    this.insult = insults.rnd();

    let taunts = splitTaunt(this.insult)

    this.start = time;

    Object.keys(this.g.store.p1.stats).forEach((k) => {
      this.g.store.p1.stats[k] = 0;
    })

    new Alert(this.g, {
      text: taunts.shift(),
      pos: vec2(-4.5, -5),
      ttl: 0,
      fontSize: .6,
      col: 'pink',
      outline: 'red'
    });
    this.g.sfx.play('jet')

    let count = 0;
    taunts.forEach((text, i) => {
      count = i;
      this.g.events.push({
        ttl: 3 * (i + .7),
        cb: () => {
          this.g.sfx.play('jet')
          new Alert(this.g, {
            text: text,
            pos: vec2(-4.5, -5.8 - (i * .7)),
            ttl: 0,
            fontSize: .45,
            col: 'slime',
            outline: 'forestgreen'
          });
        }
      })
    });
    count += 1;

    this.g.events.push({
      ttl: 3 * (count + .5),
      cb: () => {
        this.bot.isFleeing = true;
      }
    })

    this.bot = new EvilBot({ g: this.g, pos: vec2(0), size: vec2(1.5) })
  }

  render() {
    let p = this.g.palette;
    drawRectGradient(cameraPos, getCameraSize(), p.forestgreen.col, p.void.col);
    super.render();
    this.static()
  }

  update() {
    this.handleUiInput();
    this.isTalking = engineObjects.filter(o => o.name === 'alert' && o.printText !== o.text).length
    this.bot.isTalking = this.isTalking;

    if (time - this.start > 12) {
      this.g.sceneManager.changeScene('Play');
    }

    if (this.uiInput === 'enter' && time - this.start > 2) {
      this.g.sceneManager.changeScene('Play');
    }

    super.update();
  }

}

function splitTaunt(text) {
  const chunks = [];
  const match = text.match(/^(.*?[!?])/);
  const title = match ? match[1].trim() : text;

  const rest = text.slice(title.length).trim();

  const words = rest.split(/\s+/).filter(Boolean);

  chunks.push(title)
  for (let i = 0; i < words.length; i += 5) {
    chunks.push(words.slice(i, i + 5).join(" "));
  }

  return chunks
}
