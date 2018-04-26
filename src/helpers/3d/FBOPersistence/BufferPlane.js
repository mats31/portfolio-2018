import vertexShader from './shaders/bufferPlane.vs';
import fragmentShader from './shaders/bufferPlane.fs';

export default class BufferPlane extends THREE.Object3D {
  constructor({ height, width, texture, bufferPlaneVertex = vertexShader, bufferPlaneFragment = fragmentShader }) {
    super();

    this._height = height;
    this._width = width;
    this._texture = texture;
    this._bufferPlaneVertex = bufferPlaneVertex === null ? vertexShader : bufferPlaneVertex;
    this._bufferPlaneFragment = bufferPlaneFragment === null ? fragmentShader : bufferPlaneFragment;

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
      side: THREE.FrontSide,
      uniforms: {
        t_diffuse: { type: 't', value: this._texture },
      },
      vertexShader: this._bufferPlaneVertex,
      fragmentShader: this._bufferPlaneFragment,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh( this._geometry, this._material );
    this.add(this._mesh);
    this.scale.set(this._width, this._height, 1);
  }

  setSize(w, h) {
    this._width = w;
    this._height = h;

    this.scale.set(this._width, this._height, 1);
  }

  updateDiffuse( texture ) {
    this._material.uniforms.t_diffuse.value = texture;
  }
}
