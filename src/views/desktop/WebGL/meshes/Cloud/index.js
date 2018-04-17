import getPerspectiveSize from 'utils/3d/getPerspectiveSize';
import bgVertex from './shaders/bgCloud.vs';
import bgFragment from './shaders/bgCloud.fs';

export default class Cloud extends THREE.Object3D {
  constructor() {
    super();

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupGeometry() {
    this._geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1 );
  }

  _setupMaterial() {
    this._material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { type: 'f', value: 0 },
      },
      vertexShader: bgVertex,
      fragmentShader: bgFragment,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // Events ----------
  resize(camera) {
    const perspectiveSize = getPerspectiveSize(camera, camera.position.z);

    this.scale.set(perspectiveSize.width * 1.3, perspectiveSize.height * 1.3, 1);
  }

  // Update -------
  update(time) {
    this._material.uniforms.uTime.value = time;
  }
}
