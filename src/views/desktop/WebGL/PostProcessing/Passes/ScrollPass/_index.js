import { Pass } from 'postprocessing';
import ScrollPassMaterial from './ScrollPassMaterial';

export default class ScrollPass extends Pass {

  constructor() {
    super();

    this.name = 'scrollPass';
    this.needsSwap = true;
    this.material = new ScrollPassMaterial();
    this.quad.material = this.material;

    // this._addGUI();
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

  animate(deltaTarget) {
    const sign = Math.sign(deltaTarget);
    // this.material.uniforms.t_diffuse.value.minFilter = THREE.LinearFilter;
    // this.material.uniforms.t_diffuse.value.magFilter = THREE.LinearFilter;

    this.material.uniforms.uFadeIn.value = 0;
    this.material.uniforms.uFadeOut.value = 0;
    // this.material.uniforms.uFadeIn.value = sign > 0 ? 1 : 0;
    // this.material.uniforms.uFadeOut.value = sign > 0 ? 1 : 0;
    this.material.uniforms.uDirection.value = Math.sign(deltaTarget);
    // TweenLite.killTweensof(this.material.uniforms.uFadeIn);
    // TweenLite.killTweensof(this.material.uniforms.uFadeOut);


    TweenLite.to(
      this.material.uniforms.uFadeIn,
      // sign > 0 ? 0.5 : 2,
      2,
      {
        // value: sign > 0 ? 0 : 2,
        value: 2,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this.material.uniforms.uFadeOut,
      // sign > 0 ? 0.5 : 2,
      2,
      {
        delay: 0.03,
        // value: sign > 0 ? 0 : 2,
        value: 2,
        ease: 'Power4.easeOut',
        // onComplete: () => {
        //   this.material.uniforms.uFadeIn.value = 0;
        //   this.material.uniforms.uFadeOut.value = 0;
        // },
      },
    );
  }

  resize() {
    this.material.uniforms.uResolution.value.x = window.innerWidth;
    this.material.uniforms.uResolution.value.y = window.innerHeight;
  }

  render(renderer, readBuffer, writeBuffer) {

    this.material.uniforms.t_diffuse.value = readBuffer.texture;
    renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  }

}
