import Sprite from "./sprite";
import Bullet from "./bullet";
import Shield from "./shield";
import Powerup from "./powerup";
import Particles from "../helpers/particles";
import postScore from "../helpers/postScore";


export default class Player extends Sprite {
  constructor(props) {

    const t = props.g.tile("bee0");
    super(props.pos, vec2(.7), t, props);

    this.player = 'p1';

    this.g = props.g;
    this.props = props;
    this.name = "player";
    this.mirror = false;

    this.anims = {
      cat: ["cat0", "cat1"],
      cat_up: ["cat2", "cat3"],
      idle: ["cat0"],
      idle_up: ["cat2"],
    };
    this.changeAnim("cat", 0.2);

    this.hurt = false;
    this.hurtFor = 3;
    this.hurtTimer = new Timer();

    this.charge = 0;

    this.fade = 0;

    this.renderOrder = 2000;

    this.sticks = (props.g.sticks.l.hasTouch && props.g.sticks.r.hasTouch)
      ? props.g.sticks : false;

    this.speed = 0.08;
    this.aimDir = vec2(1, 0);
    this.fireCooldownDelay = .1;
    this.fireCooldown = 0;
    this.facingDir = vec2(0, 1); // default facing down

    this.outline = {
      offset: 0.1,
      color: BLACK
    };

    this.hasShadow = true;
    this.recoilStrength = 0.02;

    this.initStats()

  }

  initStats() {
    this.stats = {
      shots: 0,
      hits: 0,
      misses: 0,
      kills: 0,
      saves: 0,
    }
  }

  update() {
    super.update();

    // Movement
    let move = keyDirection();

    if (isUsingGamepad) {
      const stickL = gamepadStick(0);
      if (stickL.length() > 0.1)
        move = stickL;
    }

    if (this.sticks && this.sticks.l.active) {
      move = this.sticks.l.value.normalize();
    }

    this.velocity = move.scale(this.speed);

    // Aiming
    let aimingWithStick = false;

    if (isUsingGamepad) {
      const stickR = gamepadStick(1);
      if (stickR.length() > 0.2) {
        this.aimDir = stickR.normalize();
        aimingWithStick = true;
      }
    }

    if (this.sticks && this.sticks.r.active) {
      this.aimDir = this.sticks.r.value.normalize();
      aimingWithStick = true;
    }

    if (!aimingWithStick) {
      const toMouse = mousePos.subtract(this.pos);
      if (toMouse.length() > 0.01)
        this.aimDir = toMouse.normalize();
    }

    // Shooting
    this.fireCooldown -= timeDelta;
    this.shoot = false;

    if (!this.sticks && mouseWasPressed(0)) this.shoot = true;

    if (isUsingGamepad) {
      const stickR = gamepadStick(1);
      if (stickR.length() > 0.2)
        this.shoot = true;
    }
    // On touch, fire automatically whenever the right stick is active
    if (this.sticks && this.sticks.r.active) this.shoot = true;

    if (this.shoot && this.fireCooldown <= 0) {
      const spawnPos = this.pos.add(this.aimDir.scale(.2));
      this.shots += 1;
      this.g.stats

      new Bullet(spawnPos, { dir: this.aimDir, angle: this.angle, g: this.g, owner: this.player });
      this.g.sfx.play("shoot", this.pos);
      const gunTip = this.pos.add(this.aimDir.scale(.8));
      Particles.gunsmoke(gunTip);
      this.fireCooldown = this.fireCooldownDelay;
      this.pos = this.pos.subtract(this.aimDir.scale(this.recoilStrength));
    }

    // Hurt / Fade
    this.clampToScreen();

    let t = this.hurtTimer ? this.hurtTimer.get() : 0;
    if (this.hurtTimer && this.hurtTimer.isSet() && this.hurtTimer.elapsed()) {
      this.hurtTimer.unset();
      this.fade = false;
    }
    if (t < 0) {
      this.fade = (t * -1) / this.hurtFor;
    }

    this.mirror = this.aimDir.x < 0;

    const a = this.aimDir.angle();
    this.isUp = a > -1.2 && a < 1.2;
    if (this.velocity.x === 0 && this.velocity.y === 0) {
      this.changeAnim(this.isUp ? 'idle_up' : 'idle')
    }
    else {
      this.changeAnim(this.isUp ? 'cat_up' : 'cat', .1)
    }


    const moveDir = this.pos.subtract(this.lastPos);
    if (moveDir.length() > 0.01) {
      this.facingDir = moveDir.normalize();
    }

    this.lastPos = this.pos.copy();

  }

  render() {
    const wave = Math.sin(time * 20);

    // when hit / recovering
    if (this.fade) {
      let size = (1 - this.fade) * 10;
      let ringColor = new Color(1, 1, 1, this.fade);
      // drawTile(this.pos, vec2(clamp(size, .5, 1)), this.g.tile('circle'), ringColor)
      drawCircle(this.pos, this.size.x + 2, ringColor);
    }

    //shadow
    // drawTile(this.pos.add(vec2(0, -.5)), vec2(.7, .5), tile(0, this.g.tileSize), this.shadowCol);

    let skipParent = this.fade && wave > 0;

    if (this.isUp) this.renderGun(skipParent);
    if (!skipParent) {
      super.render();
    }

    if (!this.isUp) this.renderGun(skipParent);

    if (!this.sticks) {
      drawTile(mousePos, vec2(.5), tile(12, this.g.tileSize), this.g.palette.slime.mk());
    }

  }

  renderGun(skipParent) {

    if (skipParent) return;

    const lineStart = this.pos.add(vec2(0, -.2));
    const lineEnd = this.pos.add(this.aimDir.scale(.8));

    // gun handle (rear grip)
    const perp = vec2(-this.aimDir.y, this.aimDir.x);
    const handleDir = this.aimDir.x > 0 ? 1 : -1;
    const handleA = lineStart;
    const handleB = lineStart.subtract(perp.scale(.2 * handleDir));
    drawLine(handleA, handleB, 0.15, BLACK);

    // second handle (foregrip, partway along the barrel)
    const foregrip = this.pos.add(this.aimDir.scale(.4));
    const foregrip2 = foregrip.subtract(perp.scale(.5 * handleDir));
    drawLine(foregrip, foregrip2, 0.15, BLACK);

    // barrel
    drawLine(lineStart, lineEnd, 0.2, new Color(.01, .01, .01));

  }


  collideWithObject(o) {
    const canHit = ["baddie", "enemyFire", "platform", "rock"];

    if (o.name === 'kitty' && !o.following) {
      o.following = true;
      this.g.store[this.player].stats.saves += 1;
      this.g.sfx.play('help', this.pos)
      return false;
    } else if (o.name === 'kitty') {
      return false;
    }
    if (this.fade) return;

    if (canHit.includes(o.name)) {
      if (o.name !== "platform" && o.type !== "boss" && o.name !== "rock") {
        o.destroy(true);
        this.g.store[this.player].score += o.value || 0;
      }

      let powerups = this.g.store[this.player].powerups;

      this.g.store[this.player].lives -= 1;
      this.g.store[this.player].powerups = 0;
      this.initStats();
      this.g.sfx.play("smash", this.pos);
      Particles.explode(this.pos, 0.25);
      Particles.sparks(this.pos);
      this.killedAt = time;

      this.hurtTimer.set(this.hurtFor);
      this.fade = 1;

      this.g.sfx.play("hurt", this.pos);
      setPaused(true);
      this.children.forEach((c) => {
        c.destroy();
      });

      this.g.playerFlash = this.player;
      this.hitStop(() => {
        const startAngle = PI / 1.3;
        this.g.playerFlash = false;
        for (let i = 0; i < powerups; i++) {
          const angle = startAngle + (PI * 2 * i) / powerups;
          new Powerup(this.g, this.pos, angle);
        }
      });

      if (this.g.store[this.player].lives < 0) {
        postScore(this.g.store[this.player].score, this.g);
        this.destroy();
        for (let i = 0; i < 4; i += 1) {
          this.g.events.push({
            ttl: i * 0.2,
            cb: () => {
              Particles.explode(this.pos.add(vec2(rand(-1, 1))), rand(1, 2));
              this.g.sfx.play("explosion", this.pos);
            },
          });
        }
        this.g.sfx.play("explosion", this.pos);
        this.g.sfx.play("hurt", this.pos);
      }
    }
    return super.collideWithObject(o)
  }

  updateStore(k, v) {
    this.g.store[this.player][k] += v;
  }

  getStore(k) {
    return this.g.store[this.player][k];
  }

}
