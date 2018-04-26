import States from 'core/States';
import getPerspectiveSize from 'utils/3d/getPerspectiveSize';
import { randomInteger } from 'utils/math';
import { active } from 'core/decorators';
import bgVertex from './shaders/bgCloud.vs';
import bgFragment from './shaders/bgCloud.fs';
import bgFragmentLow from './shaders/bgCloudLow.fs';

@active()
export default class Cloud extends THREE.Object3D {
  constructor() {
    super();

    this._masks = ['ball', 'db', 'gob', 'resn'];

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupGeometry() {
    this._geometry = new THREE.PlaneBufferGeometry( 1, 1, 10, 10 );
  }

  _setupMaterial() {
    const mask = States.resources.getTexture('mask-ball').media;
    mask.needsUpdate = true;

    const maskOpacity = States.resources.getTexture('mask-opacity-ball').media;
    maskOpacity.needsUpdate = true;

    const displacement = States.resources.getTexture('displacement').media;
    displacement.wrapS = THREE.RepeatWrapping;
    displacement.wrapT = THREE.RepeatWrapping;
    displacement.needsUpdate = true;

    this._material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        tMask: { type: 't', value: mask },
        tMaskOpacity: { type: 't', value: maskOpacity },
        tDisplacement: { type: 't', value: displacement },
        uActive: { type: 'f', value: 0 },
        uShapeActive: { type: 'f', value: 0 },
      },
      wireframe: false,
      vertexShader: bgVertex,
      fragmentShader: bgFragment,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // state ----------

  _setRandomMask() {
    const id = this._masks[randomInteger( 0, this._masks.length)];

    const mask = States.resources.getTexture(`mask-${id}`).media;
    mask.needsUpdate = true;
    this._material.uniforms.tMask.value = mask;

    const maskOpacity = States.resources.getTexture(`mask-opacity-${id}`).media;
    maskOpacity.needsUpdate = true;
    this._material.uniforms.tMaskOpacity.value = maskOpacity;
  }

  activate() {
    this._setRandomMask();

    TweenLite.killTweensOf(this._material.uniforms.uActive);
    TweenLite.to(
      this._material.uniforms.uActive,
      4,
      {
        value: 1,
        ease: 'Power4.easeOut',
      },
    );

    // TweenLite.killTweensOf(this._material.uniforms.uShapeActive);
    // TweenLite.to(
    //   this._material.uniforms.uShapeActive,
    //   4,
    //   {
    //     value: 1,
    //     ease: 'Power4.easeOut',
    //   },
    // );
  }

  deactivate() {
    TweenLite.killTweensOf(this._material.uniforms.uActive);
    TweenLite.to(
      this._material.uniforms.uActive,
      4,
      {
        value: 0,
        ease: 'Power4.easeOut',
      },
    );

    // TweenLite.killTweensOf(this._material.uniforms.uShapeActive);
    // TweenLite.to(
    //   this._material.uniforms.uShapeActive,
    //   4,
    //   {
    //     value: 0,
    //     ease: 'Power4.easeOut',
    //   },
    // );
  }

  setLowMode() {
    this._material.fragmentShader = bgFragmentLow;
    this._material.needsUpdate = true;
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
