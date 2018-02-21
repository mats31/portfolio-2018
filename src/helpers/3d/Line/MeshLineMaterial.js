import basicVertex from './shaders/meshLineVertex.vs';
import basicFragment from './shaders/meshLineFragment.fs';

export default class MeshLineMaterial extends THREE.RawShaderMaterial {

  constructor({
    uniforms = {},
    props = {},
    vertexShader = basicVertex,
    fragmentShader = basicFragment,
  } = {} ) {
    super( {
      uniforms: {
        u_alpha: { type: 'f', value: 1 },
        u_time: { type: 'f', value: 0 },
        u_lineWidth: { type: 'f', value: 15 },
        u_resolution: { type: 'v2', value: new THREE.Vector2(1, 1) },
        ...uniforms,
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      ...props,
    });

    this.type = 'MeshLineMaterial';
  }
}
