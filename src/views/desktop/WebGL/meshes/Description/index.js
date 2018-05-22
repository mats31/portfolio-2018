import States from 'core/States';
import { autobind } from 'core-decorators';
import { objectVisible } from 'core/decorators';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
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

    this._baseH = Math.max( 1.3, Math.min( 2.5, window.innerWidth * 0.001 ) );

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
        uOffset: { type: 'v2', value: new THREE.Vector2() },
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
    // const w = 200;
    // const h = w / ratio;
    const h = this._baseH;
    const w = h * ratio;

    this.scale.set(w, h, 1);
  }

  // State -------------------------

  updateProject(project) {
    this._texture = States.resources.getTexture(`${project.id}-description`).media;
    this._texture.minFilter = THREE.LinearFilter;
    this._texture.magFilter = THREE.LinearFilter;
    this._texture.needsUpdate = true;

    this._material.uniforms.tDiffuse.value = this._texture;

    const ratio = this._texture.image.naturalWidth / this._texture.image.naturalHeight;
    // const w = 200;
    // const h = w / ratio;
    const h = this._baseH;
    const w = h * ratio;

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

  // Events ------------------------
  @autobind
  _onDelayedShow() {
    this.visible = true;
    this._mask.activate();
  }

  @autobind
  _onDelayedHide() {
    this.visible = false;
  }

  resize() {
    this._baseH = Math.max( 1.3, Math.min( 2.5, window.innerWidth * 0.0012) );

    const ratio = this._texture.image.naturalWidth / this._texture.image.naturalHeight;
    const h = this._baseH;
    const w = h * ratio;

    this.scale.set(w, h, 1);

    if (window.innerWidth < 700) {
      this.position.x = 0;
    } else {
      this.position.x = -9.5;
    }
  }

  // Update ------------------------

  update(time, camera) {
    this._material.uniforms.uTime.value = time;
    this._material.uniforms.uOffset.value.x += (camera.rotation.y - this._material.uniforms.uOffset.value.x) * 0.2;
    this._material.uniforms.uOffset.value.y += (-camera.rotation.x * 3 - this._material.uniforms.uOffset.value.y) * 0.2;

    this.rotation.x = this._material.uniforms.uOffset.value.y;
    this.rotation.y = this._material.uniforms.uOffset.value.x;

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
