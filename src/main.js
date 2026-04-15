import Game from "./core/game.js";
import VirtualStick from "./sprites/virtualStick.js";
import Swiper from "./lib/swiper.js";
import resize from "./helpers/resize.js";

function gameInit() {
  resize(Game.W, Game.H);
  canvasMaxSize = vec2(2048);
  canvasMinAspect = 1.6;
  canvasMaxAspect = 2;

  Game.sticks = {
    l: new VirtualStick('left'),
    r: new VirtualStick('right'),
  }

  Game.swipe = new Swiper();
  Game.swipe.clear();

  Game.sticks.l.mount();
  Game.sticks.r.mount();

  setCanvasPixelated(true);
  Game.sceneManager.changeScene(Game.startScene);

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
