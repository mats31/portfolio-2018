import States from 'core/States';
import { autobind } from 'core-decorators';
import { objectVisible } from 'core/decorators';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { getPerspectiveSize } from 'utils/3d';
import MaskDescription from './MaskDescription';
import vertexShader from './shaders/description.vs';
import fragmentShader from './shaders/description.fs';

@objectVisible()
export default class Description extends THREE.Object3D {
  constructor(options) {
    super();

    this.visible = false;

    this.name = 'description';
    this._type = options.type;
    this._camera = options.camera;

    this._baseH = 50;

    this._setupMaskDescription();
    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupMaskDescription() {
    this._mask = new MaskDescription();
  }

  _setupGeometry() {
    this._geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1 );
  }

  _setupMaterial() {
    const id = this._type === 'project' ? `${projectList.projects[0].id}-description` : `${experimentList.experiments[0].id}-description`;
    this._texture = States.resources.getTexture(id).media;
    this._texture.minFilter = THREE.LinearFilter;
    this._texture.magFilter = THREE.LinearFilter;

    this._maskTexture = new THREE.Texture(this._mask.getTexture());
    this._maskTexture.minFilter = THREE.LinearFilter;

    this._material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        tDiffuse: { type: 't', value: this._texture },
        tMask: { type: 't', value: this._maskTexture },
      },
      vertexShader,
      fragmentShader,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);

    this.position.set(0, -160, 200);

    this.scale.set(1, 1, 1);
    const perspectiveSize = getPerspectiveSize(this._camera, Math.abs(this._camera.position.z - this.position.z));
    const ratio = this._texture.image.naturalWidth / this._texture.image.naturalHeight;
    let w = perspectiveSize.width;
    let h = w / ratio;

    if (h > 80) {
      h = 60;
      w = h * ratio;
    }

    this.scale.set(w, h, 1);
  }

  // State -------------------------

  updateProject(project) {
    this._texture = States.resources.getTexture(`${project.id}-description`).media;
    this._texture.minFilter = THREE.LinearFilter;
    this._texture.magFilter = THREE.LinearFilter;
    this._texture.needsUpdate = true;

    this._material.uniforms.tDiffuse.value = this._texture;

    this.scale.set(1, 1, 1);
    const perspectiveSize = getPerspectiveSize(this._camera, Math.abs(this._camera.position.z - this.position.z));
    const ratio = this._texture.image.naturalWidth / this._texture.image.naturalHeight;
    let w = perspectiveSize.width;
    let h = w / ratio;

    if (h > 80) {
      h = 60;
      w = h * ratio;
    }

    if (window.innerWidth > window.innerHeight) {
      h = 120;
      w = h * ratio;
    }

    this.scale.set(w, h, 1);
  }

  // updateExperiment(experiment) {
  //   this._texture = States.resources.getTexture(`${experiment.id}-description`).media;
  //   this._texture.minFilter = THREE.LinearFilter;
  //   this._texture.magFilter = THREE.LinearFilter;
  //   this._texture.needsUpdate = true;
  //
  //   this._material.uniforms.tDiffuse.value = this._texture;
  //
  //   const ratio = this._texture.image.naturalWidth / this._texture.image.naturalHeight;
  //   // const w = 200;
  //   // const h = w / ratio;
  //   const h = this._baseH;
  //   const w = h * ratio;
  //
  //   this.scale.set(w, h, 1);
  // }

  show({ delay = 0 } = {}) {
    TweenLite.killTweensOf(this._onDelayedHide);

    TweenLite.delayedCall(delay, this._onDelayedShow);
  }

  hide() {
    TweenLite.killTweensOf(this._onDelayedShow);

    this._mask.deactivate();
    TweenLite.delayedCall(0, this._onDelayedHide);
  }

  focus() {
    this._mask.focus();
  }

  blur() {
    this._mask.blur();
  }

  @autobind
  _onDelayedShow() {
    this.visible = true;
    this._mask.activate();
  }

  @autobind
  _onDelayedHide() {
    this.visible = false;
  }

  // Events ------------------------

  resize() {
    this.scale.set(1, 1, 1);
    const perspectiveSize = getPerspectiveSize(this._camera, Math.abs(this._camera.position.z - this.position.z));
    const ratio = this._texture.image.naturalWidth / this._texture.image.naturalHeight;
    let w = perspectiveSize.width;
    let h = w / ratio;

    if (h > 80) {
      h = 60;
      w = h * ratio;
    }

    if (window.innerWidth > window.innerHeight) {
      h = 120;
      w = h * ratio;
    }

    this.scale.set(w, h, 1);
  }

  // Update ------------------------

  update(time) {
    this._material.uniforms.uTime.value = time;

    this._updateRotation(time);
    this._updateMask();
  }

  _updateRotation(time) {
    this.rotation.y = Math.sin(time * 0.1) * 0.15;
    this.rotation.z = Math.cos(time * 0.1) * 0.01;
  }

  _updateMask() {
    this._mask.update();

    if (this._mask.needsUpdate) {
      this._maskTexture.needsUpdate = true;
    }
  }
}
