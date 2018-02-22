import { Pass } from 'postprocessing';
import ScrollPassMaterial from './ScrollPassMaterial';

export default class ScrollPass extends Pass {

  constructor() {
    super();

    this.name = 'scrollPass';
    this.needsSwap = true;
    this.material = new ScrollPassMaterial();
    this.quad.material = this.material;

    this._addGUI();
  }

  // State --------------------

  _addGUI() {
    const folder = GUI.addFolder('ScrollPass')
    const params = {
      fadeIn: this.material.uniforms.uFadeIn.value,
      fadeOut: this.material.uniforms.uFadeOut.value,
    };

    folder.add(params, 'fadeIn').min(0.0).max(2).step(0.01)
      .onChange(() => {
        this.material.uniforms.uFadeIn.value = params.fadeIn;
      });

    folder.add(params, 'fadeOut').min(0.0).max(2).step(0.01)
      .onChange(() => {
        this.material.uniforms.uFadeOut.value = params.fadeOut;
      });
  }

  animate() {
    TweenLite.to(
      this.material.uniforms.uFadeIn,
      2,
      {
        value: 2,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this.material.uniforms.uFadeOut,
      2,
      {
        delay: 0.03,
        value: 2,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this.material.uniforms.uFadeIn.value = 0;
          this.material.uniforms.uFadeOut.value = 0;
        },
      },
    );
  }

  render(renderer, readBuffer, writeBuffer) {

    this.material.uniforms.t_diffuse.value = readBuffer.texture;
    renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  }

}
