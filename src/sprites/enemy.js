import Sprite from "./sprite";
import Particles from "../helpers/particles";
import EnemyFire from "./enemyFire";
import Powerup from './powerup';
import Score from './score';
import Scorch from './scorch';
import { followPath } from '../helpers/followPath'
import paths from '../data/paths';

export default class Enemy extends Sprite {

  constructor(g, props = {}) {

    super(props.pos, props.size || vec2(1), props.tile || g.tile('drone0'));

    Object.assign(this, props);

    this.g = g;
    this.hit = false;
    this.type = 'bot'
    this.name = 'baddie';
    this.health = this.health || 1;
    this.value = this.value || 10;
    this.outline = this.outline || {
      color: BLACK, offset: .1
    };

    this.renderOrder = 1000;

    this.anims = {
      dancer: ['dancer1', 'dancer0', 'dancer2', 'dancer0'],
      drone: ['drone0', 'drone1'],
      muncher: ['muncher0', 'muncher1'],
      glide: [''],
    }

    if (this.anim) {
      this.changeAnim(this.anim, .09);
    }

    if (this.path || this.pathOveride) {
      this.pathPoints = this.pathOveride
        ? this.pathOveride : paths[props.path];

      if (this.reverse) {
        this.pathPoints = this.pathPoints
          .map(v => vec2(v.x, -v.y))  // Flip Y
          .reverse();
      }
    }

    this.setCollision();

    this.shots = 0;
    if (this.canShoot && rand() < this.canShoot) {
      this.shots = 1;
    }

  }

  update() {
    super.update();
    this.preventOverlap()

    if (this.hurt > 0) {
      this.hurt -= timeDelta * 20;
      this.color = new Color(1, 0, 0, this.hurt / 10)
    } else {
      this.color = undefined;
    }

    if (this.pathPoints) {
      followPath(this, timeDelta, this.motion || 'linear');
      this.mirror = this.pos.x > this.lastPos.x;
    }

    if (this.hit && rand() > .7) {
      Particles.damage(this.pos, .25);
    }

    if (this.shots && this.canShoot && rand() > .5) {
      this.shots = 0;
      this.shoot();
    }

    let size = this.g.size,
      offset = 1.2;
    if (this.pos.y < size.min.y * offset ||
      this.pos.y > size.max.y * offset ||
      this.pos.x < size.min.x * offset ||
      this.pos.x > size.max.x * offset) {
      this.destroy(false)
    }


  }

  preventOverlap() {
    const drones = engineObjects.filter(o => o.type === 'bot');

    for (const other of drones) {
      if (other === this) continue;

      const diff = this.pos.subtract(other.pos);
      const dist = diff.length();

      const minDist = 0.8;
      if (dist < minDist && dist > 0.001) {
        const push = diff.normalize().scale((minDist - dist) * 0.02);
        this.velocity = this.velocity.add(push);
      }
    }

  }

  collideWithObject(o) {
    this.multiplier = 1; // charge doubles this
    if (o.name === 'bullet') {

      this.health -= 1;
      this.hit = true;
      this.g.store[o.owner].stats.hits += 1;

      if (o.name === 'bullet') {
        o.destroy();
      }

      if (this.health <= 0) {
        this.destroy();
        this.g.store[o.owner].score += this.value;
        this.g.store[o.owner].stats.kills += 1;

      }


      Particles.sparks(this.pos);

      this.g.sfx.play('walk', this.pos);
      this.hurt = 10;
      this.angle += rand(-.1, .1);

      return false;

    }

    if (o.name === 'kitty') {
      o.destroy();
    }

    return super.collideWithObject(o)
  }


  destroy(explode = true) {
    this.dead = true; // prevent double counting
    super.destroy();

    if (!explode) return;
    new Score(this.g, { value: this.value, pos: this.pos });
    Particles.explodeBaddie(this.pos, this.size);
    this.g.sfx.play('explosion', this.pos);

    if (Math.random() > .5) {
      new Powerup(this.g, { pos: this.pos })
    } else {
      new Scorch(this.g, { pos: this.pos });
    }

  }

  remove() {
    this.destroy(false);
  }

  getPlayers() {

    const players = [this.g.p1];
    if (this.g.p2) {
      players.push(this.g.p2);
    }

    return players;
  }

  getRandomPlayer() {
    return this.getPlayers().rnd();
  }

  shoot() {
    let player = this.getRandomPlayer();
    if (!player) return;
    const diff = player.pos.subtract(this.pos);
    const angle = Math.atan2(diff.y, diff.x);
    const speed = this.shotSpeed || .1;
    new EnemyFire(this.g, this.pos, angle, speed);
  }
}

