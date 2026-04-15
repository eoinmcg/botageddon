import Sprite from "./sprite";
import Bullet from "./bullet";
import Shield from "./shield";
import Powerup from "./powerup";
import Particles from "../helpers/particles";
import postScore from "../helpers/postScore";


export default class Player extends Sprite {
  constructor(g, pos) {
    const props = { g };

    const t = g.tile("bee0");
    super(pos, vec2(.5), t, props);

    this.player = 'p1';

    this.g = g;
    this.name = "player";
    this.mirror = false;

    this.anims = {
      fly: ["bee0", "bee1", "bee2"],
    };
    this.changeAnim("fly", 0.1);

    this.hurt = false;
    this.hurtFor = 3;
    this.hurtTimer = new Timer();

    this.charge = 0;

    this.fade = 0;

    this.renderOrder = 2000;

    this.sticks = (g.sticks.l.hasTouch && g.sticks.r.hasTouch)
      ? g.sticks : false;

    this.speed = 0.05;
    this.aimDir = vec2(1, 0);
    this.fireCooldownDelay = .1;
    this.fireCooldown = 0;


    this.outline = {
      offset: 0.15,
      color: BLACK
    };

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
    this.pos = this.pos.add(this.velocity);

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

    this.angle = this.aimDir.angle();

    // Shooting
    this.fireCooldown -= timeDelta;
    this.shoot = false;

    if (!this.sticks && mouseWasPressed(0)) this.shoot = true;

    if (isUsingGamepad && gamepadIsDown(7)) this.shoot = true;
    // On touch, fire automatically whenever the right stick is active
    if (this.sticks && this.sticks.r.active) this.shoot = true;

    if (this.shoot && this.fireCooldown <= 0) {
      const spawnPos = this.pos.add(this.aimDir.scale(.2));
      new Bullet(spawnPos, { dir: this.aimDir, angle: this.angle, g: this.g });
      this.g.sfx.play("shoot", this.pos);
      Particles.gunsmoke(this.pos);
      this.fireCooldown = this.fireCooldownDelay;
    }

    // Hurt / Fade
    this.clampToScreen();

    let t = this.hurtTimer.get();
    if (this.hurtTimer && this.hurtTimer.isSet && this.hurtTimer.elapsed()) {
      this.hurtTimer.unset();
      this.fade = false;
    }
    if (t < 0) {
      this.fade = (t * -1) / this.hurtFor;
    }
  }

  render() {
    const wave = Math.sin(time * 20);

    if (this.fade) {
      let size = (1 - this.fade) * 10;
      let ringColor = new Color(1, 1, 1, this.fade);
      drawTile(this.pos, vec2(clamp(size, .5, 1)), this.g.tile('circle'), ringColor)
    }

    drawTile(this.pos.add(vec2(0, -.5)), vec2(.7, .5), tile(0, this.g.tileSize), this.shadowCol);

    let skipParent = this.fade && wave > 0;
    if (!skipParent) {
      super.render();
    }
    if (!this.sticks) {
      drawTile(mousePos, vec2(.5), tile(12, this.g.tileSize), this.g.palette.lime.mk());
    }

  }


  clampToScreen() {
    this.pos.x = clamp(
      this.pos.x,
      this.g.size.min.x + 0.5,
      this.g.size.max.x - 0.5,
    );
    this.pos.y = clamp(
      this.pos.y,
      this.g.size.min.y + 0.5,
      this.g.size.max.y - 0.5,
    );

  }

  collideWithObject(o) {
    if (this.fade) return;
    const canHit = ["baddie", "enemyFire", "platform", "rock"];
    if (canHit.includes(o.name)) {
      if (o.name !== "platform" && o.type !== "boss" && o.name !== "rock") {
        // this.g.store[this.player].score += o.value || 0;
        o.destroy(true);
      }

      let powerups = this.g.store[this.player].powerups;

      this.g.store[this.player].lives -= 1;
      this.g.store[this.player].powerups = 0;
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
  }

  updateStore(k, v) {
    this.g.store[this.player][k] += v;
  }

  getStore(k) {
    return this.g.store[this.player][k];
  }

  applyPowerups(bulletProps) {
    const powerups = this.getStore("powerups");
    if (!powerups) return;

    let props;
    if (powerups > 0) {
      new Bullet(this.pos.add(vec2(0, -0.75)), bulletProps);
    }
    if (powerups > 2) {
      props = { ...bulletProps };
      props.angle = props.angle + PI / 12;
      new Bullet(this.pos.add(vec2(0, 0.75)), props);
    }
    if (powerups > 3) {
      props = { ...bulletProps };
      props.angle = props.angle - PI / 12;
      new Bullet(this.pos.add(vec2(0, 0.75)), props);
    }
    if (powerups > 4) {
      props = { ...bulletProps };
      props.angle = props.angle + PI;
      new Bullet(this.pos.add(vec2(0, -0.5)), props);
    }
    if (powerups > 5 && this.children.length === 0) {
      this.children.push(new Shield(this.g, this.pos, this));
    }
    if (powerups > 5) {
      this.g.medals[2].unlock();
    }
  }
}
