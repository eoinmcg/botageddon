export function static(bandCount = 3, particles = 1000) {
  const random = new RandomGenerator(10 + Math.floor(new Date().getTime() / 50)); // reseed every 50ms for flicker
  const t = new Date().getTime() * 0.001;
  const palette = this.g.palette;

  // Scanline interference bands
  const bandCount = 3;
  for (let b = 0; b < bandCount; b++) {
    const bandY = cameraPos.y + Math.sin(t * 0.7 + b * 2.1) * (mainCanvasSize.y / cameraScale) * 0.4;
    const bandH = (random.float(30, 8)) / cameraScale;
    const bandW = (mainCanvasSize.x / cameraScale) * 1.2;
    const bandPos = vec2(cameraPos.x, bandY);
    const bandColor = palette.white.mk(random.float(0.06, 0.02));
    drawRect(bandPos, vec2(bandW, bandH), bandColor);
  }

  // Static noise particles
  for (let i = particles; i--;) {
    const worldW = mainCanvasSize.x / cameraScale;
    const worldH = mainCanvasSize.y / cameraScale;

    const worldX = cameraPos.x - worldW / 2 + random.float(worldW);
    const worldY = cameraPos.y - worldH / 2 + random.float(worldH);

    // Randomly choose: tiny dot, horizontal streak, or bright speck
    const kind = random.float();
    let w, h, alpha;

    if (kind < 0.6) {
      // Standard noise dot
      const size = random.float(1.5, 0.5) / cameraScale;
      w = size; h = size;
      alpha = random.float(0.9, 0.2);
    } else if (kind < 0.85) {
      // Horizontal streak (interlace artifact)
      w = random.float(12, 3) / cameraScale;
      h = random.float(1, 0.5) / cameraScale;
      alpha = random.float(0.7, 0.15);
    } else {
      // Bright blown-out speck
      const size = random.float(3, 1.5) / cameraScale;
      w = size; h = size;
      alpha = random.float(1.0, 0.7);
    }

    // Mix of white, near-white, and occasional faint color noise
    let color;
    const colorRoll = random.float();
    if (colorRoll < 0.75) {
      color = palette.white.mk(alpha);
    } else if (colorRoll < 0.88) {
      // Faint green phosphor tint
      color = new Color(0.6, 1.0, 0.6, alpha * 0.6);
    } else {
      // Faint blue/purple fringe
      color = new Color(0.7, 0.7, 1.0, alpha * 0.5);
    }

    drawRect(vec2(worldX, worldY), vec2(w, h), color);
  }

  // Occasional full-width horizontal glitch line
  if (random.float() < 0.15) {
    const glitchY = cameraPos.y - (mainCanvasSize.y / cameraScale) / 2
      + random.float(mainCanvasSize.y / cameraScale);
    const glitchH = random.float(2, 0.5) / cameraScale;
    const glitchW = mainCanvasSize.x / cameraScale;
    const glitchAlpha = random.float(0.5, 0.1);
    drawRect(vec2(cameraPos.x, glitchY), vec2(glitchW, glitchH), palette.white.mk(glitchAlpha));
  }
}

