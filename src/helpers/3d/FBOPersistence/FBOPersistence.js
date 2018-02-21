import BufferPlane from './BufferPlane';

export default class FBOPersistence {
  constructor({ renderer, width, height, bufferPlaneVertex = null, bufferPlaneFragment = null }) {

    this._renderer = renderer;
    this._width = width;
    this._height = height;
    this._bufferPlaneVertex = bufferPlaneVertex;
    this._bufferPlaneFragment = bufferPlaneFragment;

    this._setupScene();
    this._setupCamera();
    this._setupRenderTargets();
    this._setupBufferPlane();
  }

  _setupScene() {
    this._scene = new THREE.Scene();
  }

  _setupCamera() {
    this._cameraPosition = new THREE.Vector3(0, 0, 1);
    this._cameraTarget = new THREE.Vector3(0, 0, 0);
    this._camera = new THREE.OrthographicCamera(this._width / -2, this._width / 2, this._height / 2, this._height / -2, -10000, 10000);

    this._camera.position.copy(this._cameraPosition);
    this._camera.lookAt(this._cameraTarget);
  }

  _setupRenderTargets() {
    const params = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      format: THREE.RGBAFormat,
      transparent: true,
    };

    this._FBO1 = new THREE.WebGLRenderTarget(this._width, this._height, params);
    this._FBO2 = new THREE.WebGLRenderTarget(this._width, this._height, params);
  }

  _setupBufferPlane() {
    this._bufferPlane = new BufferPlane({
      height: this._height,
      width: this._width,
      texture: this._FBO1.texture,
      bufferPlaneVertex: this._bufferPlaneVertex,
      bufferPlaneFragment: this._bufferPlaneFragment,
    });
    this._bufferPlane.position.z = -1;

    this._scene.add(this._bufferPlane);
  }

  // Getters -------------------------------------------------------------------

  getTexture() {
    return this._FBO2.texture;
  }

  // Events --------------------------------------------------------------------

  resize() {}

  // Update --------------------------------------------------------------------

  update() { // To overwrite
    this._renderer.render(this._scene, this._camera, this._FBO2, true);

    const t1 = this._FBO1;
    this._FBO1 = this._FBO2;
    this._FBO2 = t1;

    this._bufferPlane.updateDiffuse(this._FBO1.texture);
  }
}
