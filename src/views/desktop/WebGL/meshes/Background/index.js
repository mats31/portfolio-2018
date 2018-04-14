import FBOPersistence from 'helpers/3d/FBOPersistence/FBOPersistence';
import getPerspectiveSize from 'utils/3d/getPerspectiveSize';
import BackgroundInstancedItems from './BackgroundItem';

export default class Background extends FBOPersistence {
  constructor(options) {
    super(options);

    this._object = new THREE.Object3D();

    this._setupBackgroundItems();
    this._setupPlane();
  }

  _setupBackgroundItems() {
    this._backgroundInstancedItems = new BackgroundInstancedItems({});
    this._scene.add(this._backgroundInstancedItems);
  }

  _setupPlane() {
    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    this._material = new THREE.MeshBasicMaterial({
      map: this.getTexture(),
      transparent: true,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._object.add(this._mesh);
  }

  getObject() {
    return this._object;
  }

  // Events ------------------
  resize(camera) {
    const perspectiveSize = getPerspectiveSize(camera, camera.position.z);

    this._object.scale.set(perspectiveSize.width, perspectiveSize.height, 1);
  }

  // Update ------------------

  update() {
    this._renderer.render(this._scene, this._camera, this._FBO2, true);

    const t1 = this._FBO1;
    this._FBO1 = this._FBO2;
    this._FBO2 = t1;

    this._bufferPlane.updateDiffuse(this._FBO1.texture);
  }
}
