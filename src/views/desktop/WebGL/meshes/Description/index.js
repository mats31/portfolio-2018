import States from 'core/States';
import { autobind } from 'core-decorators';
import { objectVisible } from 'core/decorators';
import projectList from 'config/project-list';
import MaskDescription from './MaskDescription';
import vertexShader from './shaders/description.vs';
import fragmentShader from './shaders/description.fs';

@objectVisible()
export default class Description extends THREE.Object3D {
  constructor() {
    super();

    this.visible = false;
    this.name = 'description';

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
    this._texture = States.resources.getTexture(`${projectList.projects[0].id}-description`).media;
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

    const ratio = this._texture.image.naturalWidth / this._texture.image.naturalHeight;
    const w = 200;
    const h = w / ratio;

    this.scale.set(w, h, 1);
  }

  // State -------------------------

  updateProject(project) {
    this._texture = States.resources.getTexture(`${project.id}-description`).media;
    this._texture.minFilter = THREE.LinearFilter;
    this._texture.magFilter = THREE.LinearFilter;
    this._texture.needsUpdate = true;

    this._material.uniforms.tDiffuse.value = this._texture;
  }

  updateExperiment(experiment) {
    this._texture = States.resources.getTexture(`${experiment.id}-description`).media;
    this._texture.minFilter = THREE.LinearFilter;
    this._texture.magFilter = THREE.LinearFilter;
    this._texture.needsUpdate = true;

    this._material.uniforms.tDiffuse.value = this._texture;
  }

  show() {
    TweenLite.killTweensOf(this._onDelayedHide);

    this.visible = true;
    this._mask.activate();
  }

  hide() {
    this._mask.deactivate();
    TweenLite.delayedCall(1, this._onDelayedHide);
  }

  focus() {
    this._mask.focus();
  }

  blur() {
    this._mask.blur();
  }

  // Events ------------------------
  @autobind
  _onDelayedHide() {
    this.visible = false;
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
