import AbstractPostProcessing from '/helpers/3d/PostProcessing/AbstractPostProcessing';
import ScrollPass from './Passes/ScrollPass';

export default class PostProcessing extends AbstractPostProcessing {
  constructor({ scene, renderer, camera }) {
    super(scene, renderer, camera);

    this._scrollPass = new ScrollPass();


    this._composers.default.addPass(this._scrollPass);

    this._lastPass.renderToScreen = false;
    this._lastPass = this._scrollPass;
    this._scrollPass.renderToScreen = true;
  }

  // State ----------------------------

  animate(deltaTarget) {
    this._scrollPass.animate(deltaTarget);
  }

  resize() {
    this._scrollPass.resize();
  }

}
