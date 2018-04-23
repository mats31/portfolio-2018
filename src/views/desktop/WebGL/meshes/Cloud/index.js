import States from 'core/States';
import getPerspectiveSize from 'utils/3d/getPerspectiveSize';
import { active } from 'core/decorators';
import bgVertex from './shaders/bgCloud.vs';
import bgFragment from './shaders/bgCloud.fs';

@active()
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
    const mask = States.resources.getTexture('mask').media;
    mask.needsUpdate = true;

    const maskOpacity = States.resources.getTexture('mask-opacity').media;
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
      },
      vertexShader: bgVertex,
      fragmentShader: bgFragment,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // state ----------

  activate() {
    TweenLite.killTweensOf(this._material.uniforms.uActive);
    TweenLite.to(
      this._material.uniforms.uActive,
      2,
      {
        value: 1,
        ease: 'Power4.easeOut',
      },
    );
  }

  deactivate() {
    TweenLite.killTweensOf(this._material.uniforms.uActive);
    TweenLite.to(
      this._material.uniforms.uActive,
      2,
      {
        value: 0,
        ease: 'Power4.easeOut',
      },
    );
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
