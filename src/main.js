import Game from "./core/game.js";
import resize from "./helpers/resize.js";
import { tvShader, passthroughShader } from "./lib/tvShader.js";

function gameInit() {
  resize(Game.W, Game.H);
  canvasMaxSize = vec2(2048);
  canvasMinAspect = 1.6;
  canvasMaxAspect = 2;

  setCanvasPixelated(true);
  Game.sceneManager.changeScene(Game.startScene);

  Game.shaders = { tvShader, passthroughShader };

  // new PostProcessPlugin(tvShader);
  // postProcess.enabled = false;

}

function gameUpdate() {
  Game.sceneManager.update();
}

function gameUpdatePost() {
  Game.sceneManager.updatePost();
}

function gameRender() {
  Game.sceneManager.render();
}

function gameRenderPost() {
  Game.sceneManager.renderPost();
}

engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  Game.images,
);
