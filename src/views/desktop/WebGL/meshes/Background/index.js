import States from 'core/States';
import { autobind } from 'core-decorators';
import FBOPersistence from 'helpers/3d/FBOPersistence/FBOPersistence';
import getPerspectiveSize from 'utils/3d/getPerspectiveSize';
import BackgroundInstancedItems from './BackgroundInstancedItem';
import BackgroundPostProcessing from './BackgroundPostProcessing';
import backgroundItemVertex from './shaders/backgroundItem.vs';
import backgroundItemFragment from './shaders/backgroundItem.fs';
import vertexShader from './shaders/background.vs';
import fragmentShader from './shaders/background.fs';

export default class Background extends FBOPersistence {
  constructor(options) {
    super(options);

    this._object = new THREE.Object3D();

    this._setupBackgroundItems();
    this._setupPlane();

    this._addEvents();
  }

  _setupBackgroundItems() {
    const map = States.resources.getTexture('background').media;
    map.needsUpdate = true;

    this._backgroundInstancedItems = new BackgroundInstancedItems({
      nb: 15,
      material: new THREE.ShaderMaterial({
        // blending: THREE.AdditiveBlending,
        transparent: true,
        uniforms: {
          tDiffuse: { type: 't', value: map },
          uTime: { type: 'f', value: 0 },
          uGlobalScale: { type: 'f', value: 1 },
        },
        vertexShader: backgroundItemVertex,
        fragmentShader: backgroundItemFragment,
      }),
    });
    this._scene.add(this._backgroundInstancedItems);
  }

  _setupPlane() {
    this._backgroundPostProcessing = new BackgroundPostProcessing({
      scene: this._scene,
      renderer: this._renderer,
      camera: this._camera,
    });

    this._rtt = this._backgroundPostProcessing.getComposer().default.writeBuffer;

    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    this._material = new THREE.ShaderMaterial({
      uniforms: {
        // tDiffuse: { type: 't', value: this._FBO2 },
        tDiffuse: { type: 't', value: this._rtt },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._object.add(this._mesh);
  }

  _addEvents() {
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  getObject() {
    return this._object;
  }

  // State -------------------

  show() {
    this._backgroundInstancedItems.show();
  }

  hide() {
    this._backgroundInstancedItems.hide();
  }

  // Events ------------------
  @autobind
  _onScrollWheel() {
    this._backgroundInstancedItems.scrollWheel();
  }

  resize(camera) {
    const perspectiveSize = getPerspectiveSize(camera, camera.position.z);

    this._object.scale.set(perspectiveSize.width * 1.4, perspectiveSize.height * 1.4, 1);
  }

  // Update ------------------

  update(time) {
    this._renderer.render(this._scene, this._camera, this._FBO2, true);

    const t1 = this._FBO1;
    this._FBO1 = this._FBO2;
    this._FBO2 = t1;

    this._bufferPlane.updateDiffuse(this._FBO1.texture);
    this._backgroundInstancedItems.update(time);

    this._backgroundPostProcessing.getBloomPass().readBuffer = this._FBO2;
    this._backgroundPostProcessing.update({ renderToScreen: false });

    this._object.rotation.y = Math.sin(time * 0.5) * Math.PI * 0.1;
  }
}
