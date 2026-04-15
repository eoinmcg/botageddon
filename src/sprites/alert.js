export default class Alert extends EngineObject {
  constructor(g, props = {}) {

    const defaults = {
      fonts: g.fonts,
      text: 'OHAI!',
      pos: vec2(0, -2),
      blink: false,
      fontSize: 1,
      col: 'white',
      outline: 'red',
      sfx: null,
      ttl: 3
    };

    props = { ...defaults, ...props };

    super(props.pos);
    this.pos = props.pos;
    this.col = g.palette[props.col].mk();
    this.fontSize = props.fontSize;
    this.outline = g.palette[props.outline].mk();

    this.renderOrder = 1000;

    this.props = props;
    this.blink = props.blink;
    this.timer = props.ttl > 0
      ? new Timer(props.ttl) : false;
    this.text = props.text;
    this.printText = '';

    this.fonts = props.fonts;
    if (props.sfx) {
      g.sfx.play(props.sfx);
    }
    if (props.stopMusic) {
      g.stopMusic();
    }

    this.addLetter();
    this.nextLetterTimer = .05;
    this.nextLetter = this.nextLetterTimer;
  }

  addLetter() {
    if (this.printText === this.text) return;
    this.printText = this.text.substring(0, this.printText.length + 1);


  }

  update() {

    this.nextLetter -= timeDelta;
    if (this.nextLetter < 0) {
      this.addLetter();
      this.nextLetter = this.nextLetterTimer;
    }

    if (this.timer && this.printText === this.text) {
      this.pos.y += 0.05;
    }
    if (this.timer && this.timer.elapsed()) {
      this.destroy();
    }
  }

  render() {
    const wave = Math.sin(new Date().getTime() * 0.005);
    if (this.blink && wave > 0) { return; }

    setFontDefault('"wheaton"');
    drawText(this.printText, this.pos.add(vec2(0, this.fontSize / -15)), this.fontSize, this.outline, 0, BLACK, 'left');
    drawText(this.printText, this.pos, this.fontSize, this.col, 0, BLACK, 'left');
  }
}
