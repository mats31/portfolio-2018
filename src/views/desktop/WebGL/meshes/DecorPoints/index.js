import States from 'core/States';
import { randomFloat } from 'utils/math';
import vertexShader from './shaders/point.vs';
import fragmentShader from './shaders/point.fs';

export default class DecorPoints extends THREE.Object3D {
  constructor() {
    super();

    this._nb = 100;
    this._time = 0;
    this._direction = 1;

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();

    this._selectNeedsUpdate = false;
    this._selectTimeout = null;
  }

  _setupGeometry() {

    this._geometry = new THREE.BufferGeometry();

    this._aPosition = new THREE.BufferAttribute( new Float32Array( this._nb * 3 ), 3 );
    this._aSpeed = new THREE.BufferAttribute( new Float32Array( this._nb * 1 ), 1 );
    this._aOffset = new THREE.BufferAttribute( new Float32Array( this._nb * 1 ), 1 );
    this._aAlpha = new THREE.BufferAttribute( new Float32Array( this._nb * 1 ), 1 );

    for (let i = 0; i < this._nb; i++) {
      this._aPosition.setXYZ(
        i,
        randomFloat(-600, 600),
        randomFloat(-600, 600),
        0,
      );

      this._aSpeed.setX(
        i,
        randomFloat( 0.3, 1),
      );

      this._aOffset.setX(
        i,
        randomFloat(-1000, 1000),
      );

      this._aAlpha.setX(
        i,
        randomFloat(0.3, 0.6),
      );
    }

    this._geometry.addAttribute( 'position', this._aPosition );
    this._geometry.addAttribute( 'a_speed', this._aSpeed );
    this._geometry.addAttribute( 'a_offset', this._aOffset );
    this._geometry.addAttribute( 'a_alpha', this._aAlpha );
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
        uDirection: { type: 'f', value: 0 },
        t_mask: { type: 't', value: maskTexture },
      },
      vertexShader,
      fragmentShader,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Points( this._geometry, this._material );
    this.add(this._mesh);
  }

  // State ---------------------

  setDirection(delta) {
    this._direction = Math.sign(delta);
  }

  // Update --------------------

  update(time, delta) {
    // console.log(this._direction);
    this._material.uniforms.u_time.value += ( time - this._time ) * this._direction;
    this._material.uniforms.u_delta.value += delta;

    this._time = time;
  }
}
