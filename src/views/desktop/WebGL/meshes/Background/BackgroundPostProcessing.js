import AbstractPostProcessing from 'helpers/3d/PostProcessing/AbstractPostProcessing';
import { BloomPass } from 'postprocessing';

export default class BackgroundPostProcessing extends AbstractPostProcessing {
  constructor({ scene, renderer, camera }) {
    super(scene, renderer, camera);

    this._bloomPass = new BloomPass({
      resolutionScale: 0.25,
      kernelSize: 2,
      intensity: 4,
      distinction: 0,
      // distinction: 0.01,
    });

    // const folder = window.GUI.addFolder('test');
    // const params = {
    //   intensity: this._bloomPass.intensity,
    //   distinction: this._bloomPass.distinction,
    // };
    //
    // folder.add(params, 'intensity').min(0.0).max(10).step(0.01)
    //   .onChange(() => {
    //     this._bloomPass.intensity = params.intensity;
    //   });
    //
    // folder.add(params, 'distinction').min(0.0).max(10).step(0.01)
    //   .onChange(() => {
    //     this._bloomPass.distinction = params.distinction;
    //   });

    this._composers.default.addPass(this._bloomPass);

    this._lastPass.renderToScreen = false;
    this._lastPass = this._bloomPass;
    this._bloomPass.renderToScreen = false;
  }

  getBloomPass() {
    return this._bloomPass;
  }

  getComposer() {
    return this._composers;
  }
}
