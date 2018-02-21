import Signals from 'core/Signals';
import { autobind } from 'core-decorators';
import { EffectComposer, RenderPass } from 'postprocessing';

export default class AbstractPostprocessing {
  constructor(scene, renderer, camera) {
    this._camera = camera;
    this._scene = scene;
    this._renderer = renderer;

    this._resolution = new THREE.Vector2();

    this._composers = {
      default: new EffectComposer(this._renderer),
    };

    this._renderPasses = {
      default: new RenderPass(this._scene, this._camera),
    };

    this._composers.default.addPass(this._renderPasses.default);

    this._lastPass = this._renderPasses.default;
    this._lastPass.renderToScreen = true;

    this._setSize(window.innerWidth, window.innerHeight);

    this._addEvents();
  }

  _addEvents() {
    Signals.onResize.add(this._onResize);
  }

  // State ---------------------

  _setSize(width, height) {
    this._size = new THREE.Vector2(width, height);
    this._resolution.set(width, height);
    this._composers.default.setSize(width, height);
  }

  // Events --------------------

  @autobind
  _onResize() {
    this.resize();
  }

  resize() {
    this._setSize(window.innerWidth, window.innerHeight);
  }

  // Update --------------------

  update({ delta = 0, renderToScreen = true }) {
    this._lastPass.renderToScreen = renderToScreen;
    this._composers.default.render(delta);
  }

}
