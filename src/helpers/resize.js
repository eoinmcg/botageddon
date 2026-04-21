export default function resize(g) {
  let w = g.W, h = g.H;
  setCanvasMaxSize(vec2(w, h));
  setCanvasFixedSize(vec2(w, h));

  const tileSize = g.tileSize;
  const scale = 4; // tiles per world unit (current scale)

  const tilesX = w / tileSize;
  const tilesY = h / tileSize;

  const worldWidth = tilesX / scale;
  const worldHeight = tilesY / scale;

  g.size = {
    min: { x: -worldWidth / 2, y: -worldHeight / 2 },
    max: { x: worldWidth / 2, y: worldHeight / 2 },
  };

  canvasMinAspect = 1.6;
  canvasMaxAspect = 2;
}

