import vertexShader from './shaders/point.vs';
import fragmentShader from './shaders/point.fs';

export default class Points extends THREE.Object3D {
  constructor() {
    super();

    this._nb = 5000;

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupGeometry() {
    this._geometry = new THREE.BufferGeometry();

    const positions = new Float32Array( this._nb * 3 );

    for (let i = 0, i2 = 0, i3 = 0; i < this._nb; i++, i2 += 2, i3 += 3) {
      positions[i3 + 0] = Math.random() * 50 - 25;
      positions[i3 + 1] = Math.random() * 50 - 25;
      positions[i3 + 2] = Math.random() * 50 - 25;
    }

    this._geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  }

  _setupMaterial() {
    this._material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {},
      vertexShader,
      fragmentShader,
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Points( this._geometry, this._material );
    this.add(this._mesh);
  }
}
