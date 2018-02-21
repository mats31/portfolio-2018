import States from 'core/States';
import { selected } from 'core/decorators';
import { randomFloat } from 'utils/math';
import Canvas from './Canvas';
import vertexShader from './shaders/point.vs';
import fragmentShader from './shaders/point.fs';

@selected()
export default class Points extends THREE.Object3D {
  constructor() {
    super();

    this._time = 0;
    this._selectOffsetValue = 0;

    this._canvas = new Canvas();
    this._datas = this._canvas.getDataImage();
    this._nb = this._datas.length / 4;

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();

    this._selectNeedsUpdate = false;
    this._selectTimeout = null;
  }

  _setupGeometry() {

    this._geometry = new THREE.BufferGeometry();

    const width = 512;
    const height = 512;

    this._aColor = new THREE.BufferAttribute( new Float32Array( this._nb * 4 ), 4 );

    this._aPosition = new THREE.BufferAttribute( new Float32Array( this._nb * 3 ), 3 );

    this._aSelect = new THREE.BufferAttribute( new Float32Array( this._nb * 1 ), 1 );
    this._selectOffsetSpeeds = new Float32Array( this._nb );
    this._aDirection = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );
    this._aSpeed = new THREE.BufferAttribute( new Float32Array( this._nb ), 1 );

    let index = 0;
    let index4 = 0;
    for (let i = 0; i < height; i++) {
      const y = ( i ) - height * 0.5;
      for (let j = 0; j < width; j++) {
        const x = ( j ) - width * 0.5;

        this._aColor.setXYZW(
          index,
          this._datas[index4] / 255,
          this._datas[index4 + 1] / 255,
          this._datas[index4 + 2] / 255,
          this._datas[index4 + 3] / 255,
        );

        this._aPosition.setXYZ(
          index,
          x,
          y,
          0,
        );

        this._aSelect.setX(
          index,
          0,
        );
        this._selectOffsetSpeeds[index] = randomFloat(0.03, 0.1);

        this._aDirection.setX(
          index,
          randomFloat(0, 1) <= 0.5 ? -1 : 1,
        );

        this._aSpeed.setX(
          index,
          randomFloat(0.3, 1),
        );

        index++;
        index4 += 4;
      }
    }

    this._geometry.addAttribute( 'a_color', this._aColor );

    this._geometry.addAttribute( 'position', this._aPosition );

    console.log(this._aSelect);
    this._geometry.addAttribute( 'a_select', this._aSelect );
    this._geometry.addAttribute( 'a_direction', this._aDirection );
    this._geometry.addAttribute( 'a_speed', this._aSpeed );
  }

  _setupMaterial() {

    const maskTexture = States.resources.getTexture('particle_mask').media;

    this._material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        u_delta: { type: 'f', value: 0 },
        u_time: { type: 'f', value: 0 },
        t_mask: { type: 't', value: maskTexture },
      },
      vertexShader,
      fragmentShader,
    });

    console.log(this._material);
  }

  _setupMesh() {
    this._mesh = new THREE.Points( this._geometry, this._material );
    this.add(this._mesh);
  }

  // State ---------------------

  select() {
    this._selectOffsetValue = 1;
    this._selectNeedsUpdate = true;

    // clearTimeout(this._selectTimeout);
    // this._selectTimeout = setTimeout(() => {
    //   this._material.blending = 1;
    // }, 500);
    // this._material.blending = 1;
  }

  deselect() {
    this._selectOffsetValue = 0;
    this._selectNeedsUpdate = true;
    // this._material.blending = 2;
  }

  // Update --------------------

  update(time, delta) {

    this._time = time;

    this._material.uniforms.u_delta.value += delta;
    this._material.uniforms.u_time.value = time;


    if (this._selectNeedsUpdate) {

      this._selectNeedsUpdate = false;

      for (let i = 0; i < this._aSelect.count; i++) {
        this._aSelect.array[i] += ( this._selectOffsetValue - this._aSelect.array[i] ) * this._selectOffsetSpeeds[i];

        if ( Math.abs(this._selectOffsetValue - this._aSelect.array[i]) > 0.0001 ) {
          this._selectNeedsUpdate = true;
        }
      }

      this._aSelect.needsUpdate = true;
      console.log(1);
    }
  }
}
