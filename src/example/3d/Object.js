import vertexShader from './shaders/basic.vs';
import fragmentShader from './shaders/basic.fs';


export default class Object extends THREE.Object3D {

  // Setup ---------------------------------------------------------------------

  constructor() {
    super();

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupGeometry() {
    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
  }

  _setupMaterial() {
    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {},
      transparent: true,
    });
  }

  _setupMesh() {

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);

    this.scale.set(10, 10);
  }

}
