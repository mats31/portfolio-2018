import AbstractInstanced from 'helpers/3d/Instanced/AbstractInstanced';
import { visible } from 'core/decorators';
import { randomInteger, randomFloat } from 'utils/math';

@visible(true)
export default class BackgroundInstancedItem extends AbstractInstanced {
  constructor(options) {
    super(options);

    this._setupAttributes();
  }

  _setupAttributes() {
    const aPos = this.getAttribute('aPos');
    const aScale = this.getAttribute('aScale');
    this.aOffset = new THREE.InstancedBufferAttribute( new Float32Array( this._nb * 2 ), 2 );
    this.aSpeed = new THREE.InstancedBufferAttribute( new Float32Array( this._nb ), 1 );
    this.aStartPosition = new THREE.InstancedBufferAttribute( new Float32Array( this._nb ), 1 );
    this.aVertcalOffset = new THREE.InstancedBufferAttribute( new Float32Array( this._nb ), 1 );
    this.aDirection = new THREE.InstancedBufferAttribute( new Float32Array( this._nb ), 1 );

    for ( let i = 0; i < this._nb; i++) {
      aPos.setXYZW(i, 0, randomFloat(-100, 100), 0, randomFloat(0.08, 0.09));
      // aScale.setXYZ(i, randomFloat(10, 20), randomFloat(1, 3), 1);
      aScale.setXYZ(i, randomFloat(0, 20), randomFloat(0, 1.5), 1);
      this.aOffset.setXY(i, 1 / 4 * randomInteger(0, 4), 1 / 4 * randomInteger(0, 4));
      this.aSpeed.setX(i, randomFloat(0.2, 0.6));
      this.aStartPosition.setX(i, randomFloat(-500, 500));
      this.aVertcalOffset.setX(i, randomFloat(-10, 10));
      this.aDirection.setX(i, randomFloat(0, 1) > 0.5 ? -1 : 1);
    }

    this.setAttribute('aOffset', this.aOffset);
    this.setAttribute('aSpeed', this.aSpeed);
    this.setAttribute('aStartPosition', this.aStartPosition);
    this.setAttribute('aVertcalOffset', this.aVertcalOffset);
    this.setAttribute('aDirection', this.aDirection);

    aPos.needsUpdate = true;
    aScale.needsUpdate = true;
  }

  // State ------

  show() {
    TweenLite.killTweensOf(this._material.uniforms.uGlobalScale);
    TweenLite.to(
      this._material.uniforms.uGlobalScale,
      5,
      {
        value: 1,
        ease: 'Power4.easeOut',
      },
    );
  }

  hide() {
    TweenLite.killTweensOf(this._material.uniforms.uGlobalScale);
    TweenLite.to(
      this._material.uniforms.uGlobalScale,
      1,
      {
        value: 0,
        ease: 'Power4.easeOut',
      },
    );
  }

  setLowMode() {
    const aScale = this.getAttribute('aScale');

    for ( let i = 0; i < this._nb; i++) {
      // aScale.setXYZ(i, randomFloat(0, 30), randomFloat(0, 1.5), 1);
      this.aStartPosition.setX(i, randomFloat(-128, 128));
    }

    aScale.needsUpdate = true;
    this.aStartPosition.needsUpdate = true;

    this._material.uniforms.uRange.value = 250;
  }

  // Events -----

  touch() {

    if (this.visible) {
      this.hide();
    }
  }

  touchend() {
    this.show();
  }

  update(time) {
    this._material.uniforms.uTime.value = time;
  }
}
