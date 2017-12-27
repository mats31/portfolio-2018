import States from 'core/States';
import vertexShader from './shaders/project.vs';
import fragmentShader from './shaders/project.fs';


export default class Project extends THREE.Object3D {

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

    this.scale.set(20, 20);
  }

}
