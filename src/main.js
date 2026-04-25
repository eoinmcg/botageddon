import Game from "./core/game.js";
import VirtualStick from "./sprites/virtualStick.js";
import Swiper from "./lib/swiper.js";
import resize from "./helpers/resize.js";


async function gameInit() {

  const isWavedashHost = window.location.hostname.includes('wavedash.com');

  let Wavedash = null;
  if (isWavedashHost && window.Wavedash) {
    try {
      Wavedash = await window.Wavedash;
    } catch (e) {
      console.warn("Wavedash SDK failed to load:", e);
    }
  }
  Wavedash && Wavedash.updateLoadProgressZeroToOne(0);

  resize(Game);

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

  const loadingDiv = document.querySelector('.loading');
  if (loadingDiv) {
    loadingDiv.remove();
  }

  Wavedash && Wavedash.updateLoadProgressZeroToOne(1);
  // Wavedash && Wavedash.init({ debug: true });
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


(function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    script.onload = function() {
      eruda.init();
      console.log('Eruda debug console initialized.');
    };
    document.head.appendChild(script);
  }
})();
