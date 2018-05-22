import States from 'core/States';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { selected } from 'core/decorators';
import { randomFloat } from 'utils/math';
import Canvas from './Canvas';
import projectVertexShader from './shaders/projectPoint.vs';
import projectFragmentShader from './shaders/projectPoint.fs';
import experimentVertexShader from './shaders/experimentPoint.vs';
import experimentFragmentShader from './shaders/experimentPoint.fs';

@selected()
export default class MobilePoints extends THREE.Object3D {
  constructor(options) {
    super();

    this._colors = [];

    this._time = 0;
    this._selectOffsetValue = 0;
    this._lastTranslation = 0;
    this._currentIndex = 0;
    this._correction = 0;
    States.global.progress = 0;
    this._nextIndex = 1;

    this._type = options.type;
    this._canvas = new Canvas();
    this._setupColors();
    this._radialDatas = this._canvas.getRadialImage();
    this._nb = this._colors[0].length / 4;
    // this._nb = ( this._colors[0].length / 4 ) / 16;

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();

    this._selectNeedsUpdate = false;
    this._selectTimeout = null;
    this.visible = false;
    // this._calledNext = true;

    Signals.onColorStocked.dispatch();
    console.log('colorstocked dispatch');
  }

  _setupColors() {

    if (this._type === 'project') {
      for (let i = 0; i < projectList.projects.length; i++) {
        this._colors.push( this._canvas.getDataImage( States.resources.getImage(`${projectList.projects[i].id}-preview`).media ) );
        // console.log(this._colors);
      }
    } else {
      for (let i = 0; i < experimentList.experiments.length; i++) {
        this._colors.push( this._canvas.getDataImage( States.resources.getImage(`${experimentList.experiments[i].id}-preview`).media ) );
      }
    }
  }

  _setupGeometry() {

    this._geometry = new THREE.BufferGeometry();

    const width = 512;
    const height = 512;

    this._aRadialColor = new THREE.BufferAttribute( new Float32Array( this._nb * 4 ), 4 );

    this._aPosition = new THREE.BufferAttribute( new Float32Array( this._nb * 3 ), 3 );
    this._aHidePosition = new THREE.BufferAttribute( new Float32Array( this._nb * 3 ), 3 );

    this._aSelect = new THREE.BufferAttribute( new Float32Array( this._nb * 1 ), 1 );
    this._selectOffsetSpeeds = new Float32Array( this._nb );
    this._aDirection = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aSpeed = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aRadius = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aOffset = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );

    for (let k = 0; k < this._colors.length; k++) {
      this[`aColor${k}`] = new THREE.BufferAttribute( new Float32Array( this._nb * 4 ), 4 );
    }

    let index = 0;
    let index4 = 0;
    for (let i = 0; i < height; i += 1) {
      const y = i - height * 0.5;
      // const y = ( height - i ) - height * 0.5;
      for (let j = 0; j < width; j += 1) {
        // const x = ( j ) - width * 0.5;
        const x = ( width - j ) - width * 0.5;

        this._aRadialColor.setXYZW(
          index,
          this._radialDatas[index4] / 255,
          this._radialDatas[index4 + 1] / 255,
          this._radialDatas[index4 + 2] / 255,
          this._radialDatas[index4 + 3] / 255,
        );

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

        this._aSelect.setX(
          index,
          1,
        );
        this._selectOffsetSpeeds[index] = randomFloat(0.1, 0.2);

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

        index++;
        index4 += 4;
      }
    }

    // console.log(index);
    // console.log(this._nb);

    index = 0;
    index4 = 0;
    for (let k = 0; k < this._colors.length; k++) {

      for (let i = 0; i < height; i += 1) {

        for (let j = 0; j < width; j += 1) {

          this[`aColor${k}`].setXYZW(
            index,
            this._colors[k][index4] / 255,
            this._colors[k][index4 + 1] / 255,
            this._colors[k][index4 + 2] / 255,
            this._colors[k][index4 + 3] / 255,
          );

          index++;
          index4 += 4;
        }
      }

      index = 0;
      index4 = 0;
    }

    // this._geometry.addAttribute( 'a_color', this._aColor );
    // this._geometry.addAttribute( 'a_nextColor', this._aNextColor );
    this._geometry.addAttribute( 'a_radialColor', this._aRadialColor );

    this._geometry.addAttribute( 'position', this._aPosition );
    this._geometry.addAttribute( 'a_hidePosition', this._aHidePosition );

    this._geometry.addAttribute( 'a_select', this._aSelect );
    this._geometry.addAttribute( 'a_direction', this._aDirection );
    this._geometry.addAttribute( 'a_speed', this._aSpeed );
    this._geometry.addAttribute( 'a_radius', this._aRadius );
    this._geometry.addAttribute( 'a_offset', this._aOffset );

    for (let k = 0; k < this._colors.length; k++) {
      this._geometry.addAttribute( `a_color${k}`, this[`aColor${k}`] );
    }
  }

  _setupMaterial() {

    const maskTexture = States.resources.getTexture('particle_mask').media;

    this._material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      // blending: THREE.AdditiveBlending,
      uniforms: {
        u_delta: { type: 'f', value: 0 },
        u_time: { type: 'f', value: 0 },
        u_mask: { type: 'f', value: 0 },
        u_progress: { type: 'f', value: 0 },
        uHide: { type: 'f', value: 1 },
        t_mask: { type: 't', value: maskTexture },
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

    // TweenLite.killTweensOf(this);
    //
    // if (States.global.progress % 1 <= 0.5) {
    //   console.log(( States.global.progress % 1 ) * -1);
    //   TweenLite.to(
    //     this,
    //     1,
    //     {
    //       _correction: ( States.global.progress % 1 ) * -1,
    //       onComplete: () => {
    //         console.log(States.global.progress);
    //       },
    //     },
    //   );
    // } else {
    //   console.log(1 - ( States.global.progress % 1 ));
    //   TweenLite.to(
    //     this,
    //     1,
    //     {
    //       _correction: 1 - ( States.global.progress % 1 ),
    //       onComplete: () => {
    //         console.log(States.global.progress);
    //       },
    //     },
    //   );
    // }

    TweenLite.killTweensOf(this._material.uniforms.u_mask);
    TweenLite.to(
      this._material.uniforms.u_mask,
      1,
      {
        value: 0,
        ease: 'Power4.easeOut',
      },
    );

    // clearTimeout(this._selectTimeout);
    // this._selectTimeout = setTimeout(() => {
    //   this._material.blending = 1;
    // }, 500);
    // this._material.blending = 1;
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

  show() {
    this.visible = true;

    TweenLite.killTweensOf(this._material.uniforms.uHide);
    TweenLite.to(
      this._material.uniforms.uHide,
      2,
      {
        delay: 0.35,
        value: 0,
        ease: 'Power4.easeOut',
      },
    );
  }

  hide() {
    TweenLite.killTweensOf(this._material.uniforms.uHide);
    TweenLite.to(
      this._material.uniforms.uHide,
      2,
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

  resize() {
    if (window.innerWidth > window.innerHeight) {
      this.scale.set(1.6, 1.6, 1);
    } else {
      this.scale.set(1, 1, 1);
    }
  }
  // Update --------------------

  update(time, delta, translation) {

    this._time = time;

    this._material.uniforms.u_delta.value = delta;
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

    States.global.progress = translation * this._colors.length;
    if (this._type === 'experiment') {
      console.log(translation);
    }

    // console.log(translation);
    this._material.uniforms.u_progress.value = States.global.progress;
  }
}
