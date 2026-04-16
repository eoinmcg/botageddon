import { CLEAR_BLACK } from "littlejsengine";

export default class VirtualStick {
  constructor(side) {
    this.side = side;
    this.value = new Vector2(0, 0);
    this.active = false;
    this.deadzone = 0.15;
    this.radius = 80;

    this._touchId = null;
    this._current = null;
    this._anchor = null; // set in mount() once canvas is ready

    this._handler = this._handleTouch.bind(this);

    this.hasTouch = VirtualStick.isTouchDevice();
  }

  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  _updateAnchor() {
    const rect = mainCanvas.getBoundingClientRect();
    const offsetX = this.radius * 1;
    const offsetY = this.radius * 1.5;

    this._anchor = {
      x: this.side === 'left'
        ? rect.left + offsetX
        : rect.right - offsetX,
      y: rect.bottom - offsetY
    };
  }

  _clientToWorld(clientX, clientY) {
    const rect = mainCanvas.getBoundingClientRect();
    const canvasX = (clientX - rect.left) * (mainCanvas.width / rect.width);
    const canvasY = (clientY - rect.top) * (mainCanvas.height / rect.height);
    return screenToWorld(new Vector2(canvasX, canvasY));
  }

  _handleTouch(e) {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      const isLeft = touch.clientX < window.innerWidth / 2;
      if ((this.side === 'left') !== isLeft) continue;

      if (e.type === 'touchstart' && this._touchId === null) {
        this._touchId = touch.identifier;
        this._current = { x: touch.clientX, y: touch.clientY };
        this.active = true;

      } else if (e.type === 'touchmove' && this._touchId === touch.identifier) {
        this._current = { x: touch.clientX, y: touch.clientY };

      } else if ((e.type === 'touchend' || e.type === 'touchcancel')
        && this._touchId === touch.identifier) {
        this._touchId = null;
        this._current = null;
        this.active = false;
        this.value = new Vector2(0, 0);
      }
    }
  }

  update() {
    // Recalculate anchor each frame to handle resize/orientation change
    this._updateAnchor();

    if (this.active && this._anchor && this._current) {
      const rect = mainCanvas.getBoundingClientRect();
      const scaleX = mainCanvas.width / rect.width;
      const scaleY = mainCanvas.height / rect.height;

      let dx = ((this._current.x - this._anchor.x) * scaleX) / this.radius;
      let dy = ((this._current.y - this._anchor.y) * scaleY) / this.radius;

      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 1) { dx /= len; dy /= len; }

      const magnitude = Math.sqrt(dx * dx + dy * dy);
      if (magnitude < this.deadzone) {
        this.value = new Vector2(0, 0);
      } else {
        const scale = (magnitude - this.deadzone) / (1 - this.deadzone) / magnitude;
        this.value = new Vector2(dx * scale, -dy * scale);
      }
    }
  }

  render() {
    if (!this._anchor) return;
    if (!VirtualStick.isTouchDevice()) return; // don't bother registering listeners either

    const anchorW = this._clientToWorld(this._anchor.x, this._anchor.y);

    // Knob: snaps to anchor when inactive, follows finger when active
    let knobW = anchorW;
    if (this.active && this._current) {
      const rect = mainCanvas.getBoundingClientRect();
      const scaleX = mainCanvas.width / rect.width;
      const scaleY = mainCanvas.height / rect.height;

      // Clamp knob to the radius boundary
      let dx = (this._current.x - this._anchor.x) * scaleX;
      let dy = (this._current.y - this._anchor.y) * scaleY;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > this.radius) { dx = dx / len * this.radius; dy = dy / len * this.radius; }

      const knobCanvas = new Vector2(
        (this._anchor.x - rect.left) * scaleX + dx,
        (this._anchor.y - rect.top) * scaleY + dy
      );
      knobW = screenToWorld(knobCanvas);
    }

    const radiusW = this.radius / cameraScale;
    const knobRadiusW = this.radius * 0.4 / cameraScale;

    // Dimmer when idle, brighter when active
    const alpha = this.active ? 0.7 : 0.3;

    drawCircle(anchorW, radiusW, new Color(1, 1, 1, alpha * 0.5)); // outer ring
    drawCircle(knobW, knobRadiusW, new Color(1, 1, 1, alpha));       // knob
  }

  mount() {
    if (!VirtualStick.isTouchDevice()) return; // don't bother registering listeners either

    this._updateAnchor();
    document.addEventListener('touchstart', this._handler, { passive: false });
    document.addEventListener('touchmove', this._handler, { passive: false });
    document.addEventListener('touchend', this._handler, { passive: false });
    document.addEventListener('touchcancel', this._handler, { passive: false });
  }

  unmount() {
    document.removeEventListener('touchstart', this._handler);
    document.removeEventListener('touchmove', this._handler);
    document.removeEventListener('touchend', this._handler);
    document.removeEventListener('touchcancel', this._handler);

    this._touchId = null;
    this._current = null;
    this.value = new Vector2(0, 0);
    this.active = false;
  }
}
