import States from 'core/States';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { selected } from 'core/decorators';
import { randomFloat } from 'utils/math';
import { getPerspectiveSize } from 'utils/3d';
import projectVertexShader from './shaders/projectPoint.vs';
import projectFragmentShader from './shaders/projectPoint.fs';
import experimentVertexShader from './shaders/experimentPoint.vs';
import experimentFragmentShader from './shaders/experimentPoint.fs';

@selected()
export default class Points extends THREE.Object3D {
  constructor(options) {
    super();

    this._mouse = new THREE.Vector2();

    this._time = 0;
    this._selectOffsetValue = 0;
    this._lastTranslation = 0;
    this._currentIndex = 0;
    this._correction = 0;
    this._nbItems = 0;
    States.global.progress = 0;
    this._nextIndex = 1;

    this._type = options.type;
    this._getNbItems();
    this._nb = 262144; // 512 x 512

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();

    this._selectNeedsUpdate = false;
    this._selectTimeout = null;
    this.visible = false;

    Signals.onColorStocked.dispatch();
  }

  _getNbItems() {

    if (this._type === 'project') {
      this._nbItems = projectList.projects.length;
    } else {
      this._nbItems = experimentList.experiments.length;
    }
  }

  _setupGeometry() {

    this._geometry = new THREE.BufferGeometry();

    const width = 512;
    const height = 512;

    this._aPosition = new THREE.BufferAttribute( new Float32Array( this._nb * 3 ), 3 );
    this._aHidePosition = new THREE.BufferAttribute( new Float32Array( this._nb * 3 ), 3 );

    this._aCoordinates = new THREE.BufferAttribute( new Float32Array( this._nb * 2 ), 2 );

    this._aSelect = new THREE.BufferAttribute( new Float32Array( this._nb * 1 ), 1 );
    this._selectOffsetSpeeds = new Float32Array( this._nb );
    this._aDirection = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aSpeed = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aRadius = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aOffset = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aPress = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );

    let index = 0;
    for (let i = 0; i < height; i += 1) {
      const y = i - height * 0.5;

      for (let j = 0; j < width; j += 1) {
        const x = ( width - j ) - width * 0.5;

        this._aPosition.setXYZ(
          index,
          x * 1.3,
          y * 1.3,
          0,
        );

        this._aHidePosition.setXYZ(
          index,
          randomFloat(-2000, 2000),
          randomFloat(-2000, 2000),
          randomFloat(1150, 1200),
        );

        this._aCoordinates.setXY(
          index,
          j,
          i,
        );

        this._aSelect.setX(
          index,
          1,
        );
        this._selectOffsetSpeeds[index] = randomFloat(0.055, 0.1);

        this._aDirection.setX(
          index,
          randomFloat(0, 1) <= 0.5 ? -1 : 1,
        );

        this._aSpeed.setX(
          index,
          randomFloat(0.3, 1),
        );

        this._aRadius.setX(
          index,
          randomFloat(0, 50),
        );

        this._aOffset.setX(
          index,
          randomFloat(-1000, 1000),
        );

        this._aPress.setX(
          index,
          randomFloat(0.6, 1),
        );

        index++;
      }
    }

    this._geometry.addAttribute( 'position', this._aPosition );
    this._geometry.addAttribute( 'a_hidePosition', this._aHidePosition );

    this._geometry.addAttribute( 'a_coordinates', this._aCoordinates );

    this._geometry.addAttribute( 'a_select', this._aSelect );
    this._geometry.addAttribute( 'a_direction', this._aDirection );
    this._geometry.addAttribute( 'a_speed', this._aSpeed );
    this._geometry.addAttribute( 'a_radius', this._aRadius );
    this._geometry.addAttribute( 'a_offset', this._aOffset );
    this._geometry.addAttribute( 'a_press', this._aPress );
  }

  _setupMaterial() {

    const maskTexture = States.resources.getTexture('particle_mask').media;
    const diffuse = this._type === 'project' ? States.resources.getTexture('spritesheet-project').media : States.resources.getTexture('spritesheet-experiment').media;
    diffuse.minFilter = THREE.LinearFilter;
    diffuse.flipY = false;

    this._material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        u_delta: { type: 'f', value: 0 },
        u_time: { type: 'f', value: 0 },
        u_mask: { type: 'f', value: 0 },
        u_progress: { type: 'f', value: 0 },
        uHide: { type: 'f', value: 1 },
        uPress: { type: 'f', value: 0 },
        uMouse: { type: 'v2', value: new THREE.Vector2() },
        uResolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uPerspective: { type: 'v2', value: new THREE.Vector2() },
        t_mask: { type: 't', value: maskTexture },
        tDiffuse: { type: 't', value: diffuse },
      },
      vertexShader: this._type === 'project' ? projectVertexShader : experimentVertexShader,
      fragmentShader: this._type === 'project' ? projectFragmentShader : experimentFragmentShader,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Points( this._geometry, this._material );
    this.add(this._mesh);
  }

  // State ---------------------

  select() {
    this._selectOffsetValue = 1;
    this._selectNeedsUpdate = true;

    TweenLite.killTweensOf(this._material.uniforms.u_mask);
    TweenLite.to(
      this._material.uniforms.u_mask,
      1,
      {
        value: 0,
        ease: 'Power4.easeOut',
      },
    );
  }

  deselect() {
    this._selectOffsetValue = 0;
    this._selectNeedsUpdate = true;

    TweenLite.killTweensOf(this._material.uniforms.u_mask);
    TweenLite.to(
      this._material.uniforms.u_mask,
      1,
      {
        value: 1,
        ease: 'Power4.easeOut',
      },
    );
  }

  show({ delay = 0 } = {}) {
    this.visible = true;

    TweenLite.killTweensOf(this._material.uniforms.uHide);
    TweenLite.to(
      this._material.uniforms.uHide,
      3,
      {
        delay: delay + 0.4,
        value: 0,
        ease: 'Power4.easeOut',
      },
    );
  }

  hide() {
    TweenLite.killTweensOf(this._material.uniforms.uHide);
    TweenLite.to(
      this._material.uniforms.uHide,
      3,
      {
        value: 1,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this.visible = false;
        },
      },
    );
  }

  // Events --------------------

  mousedown() {
    TweenLite.killTweensOf(this._material.uniforms.uPress);
    TweenLite.to(
      this._material.uniforms.uPress,
      1,
      {
        value: 1,
        ease: 'Elastic.easeOut',
      },
    );
  }

  mouseup() {
    TweenLite.killTweensOf(this._material.uniforms.uPress);
    TweenLite.to(
      this._material.uniforms.uPress,
      1,
      {
        value: 0,
        ease: 'Elastic.easeOut',
      },
    );
  }

  mousemove(mouse) {
    this._mouse = mouse;

    this._material.uniforms.uMouse.value.x = this._mouse.x;
    this._material.uniforms.uMouse.value.y = this._mouse.y;
  }

  resize(camera) {
    const perspectiveSize = getPerspectiveSize( camera, Math.abs(camera.position.z - this.position.z));

    this._material.uniforms.uResolution.value.x = window.innerWidth;
    this._material.uniforms.uResolution.value.y = window.innerHeight;

    this._material.uniforms.uPerspective.value.x = perspectiveSize.width;
    this._material.uniforms.uPerspective.value.y = perspectiveSize.height;
  }

  // Update --------------------

  update(time, delta, translation) {

    this._time = time;

    this._material.uniforms.u_delta.value = translation;
    this._material.uniforms.u_time.value = time;

    this._updateSelectedState();
    this._updateColor(translation);
  }

  _updateSelectedState() {
    if (this._selectNeedsUpdate) {

      this._selectNeedsUpdate = false;

      for (let i = 0; i < this._aSelect.count; i++) {
        this._aSelect.array[i] += ( this._selectOffsetValue - this._aSelect.array[i] ) * this._selectOffsetSpeeds[i];

        if ( Math.abs(this._selectOffsetValue - this._aSelect.array[i]) > 0.0001 ) {
          this._selectNeedsUpdate = true;
        }
      }

      this._aSelect.needsUpdate = true;
    }
  }

  _updateColor(translation) {

    States.global.progress = Math.abs( ( translation * 0.0001 ) % this._nbItems );
    this._material.uniforms.u_progress.value = States.global.progress;
  }
}
