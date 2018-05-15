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

    this._mode = 'high';
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
          uRange: { type: 'f', value: 512 },
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

    // const displacement = States.resources.getTexture('displacement').media;
    // displacement.wrapS = THREE.RepeatWrapping;
    // displacement.wrapT = THREE.RepeatWrapping;
    // displacement.needsUpdate = true;

    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 20, 20);
    this._material = new THREE.ShaderMaterial({
      uniforms: {
        // tDiffuse: { type: 't', value: this._FBO2 },
        // uTime: { type: 'f', value: 0 },
        tDiffuse: { type: 't', value: this._rtt.texture },
        // tDisplacement: { type: 't', value: displacement },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._object.add(this._mesh);
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

  setLowMode() {
    this._bufferPlane.setSize(128, 128);

    this._FBO1.setSize(128, 128);
    this._FBO2.setSize(128, 128);

    this._camera.left = 128 / -2;
    this._camera.right = 128 / 2;
    this._camera.top = 128 / 2;
    this._camera.bottom = 128 / -2;
    this._camera.updateProjectionMatrix();

    this._backgroundInstancedItems.setLowMode();

    this._material.uniforms.tDiffuse.value = this._FBO2.texture;

    this._mode = 'low';
  }

  // Events ------------------
  touch() {
    this._backgroundInstancedItems.touch();
  }

  touchend() {
    this._backgroundInstancedItems.touchend();
  }

  resize(camera) {
    const perspectiveSize = getPerspectiveSize(camera, camera.position.z);

    this._object.scale.set(perspectiveSize.width * 1.5, perspectiveSize.height * 1.5, 1);
  }

  // Update ------------------

  update(time) {
    this._renderer.render(this._scene, this._camera, this._FBO2, true);

    const t1 = this._FBO1;
    this._FBO1 = this._FBO2;
    this._FBO2 = t1;

    this._bufferPlane.updateDiffuse(this._FBO1.texture);
    this._backgroundInstancedItems.update(time);

    if (this._mode === 'high') {
      this._backgroundPostProcessing.getBloomPass().readBuffer = this._FBO2;
      this._backgroundPostProcessing.update({ renderToScreen: false });
    }

    this._object.rotation.y = Math.sin(time * 0.5) * Math.PI * 0.05;

    // this._material.uniforms.uTime.value = time;
  }
}
