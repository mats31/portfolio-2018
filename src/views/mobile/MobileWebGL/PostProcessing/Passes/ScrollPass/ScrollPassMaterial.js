import States from 'core/States';
import vertexShader from './shaders/scrollPass.vs';
import fragmentShader from './shaders/scrollPass.fs';

export default class ScrollPassMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      depthWrite: false,
      depthTest: false,
      uniforms: {
        t_diffuse: { type: 't', value: null },
        uFadeIn: { type: 'f', value: 0 },
        uFadeOut: { type: 'f', value: 0 },
        uDirection: { type: 'f', value: 1 },
        uResolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uFisheye: { type: 'f', value: 0.5 },
      },
      vertexShader,
      fragmentShader,
    });
  }
}
