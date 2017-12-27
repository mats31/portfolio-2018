import { autobind } from 'core-decorators';

export default class WebGL {

  // Setup ---------------------------------------------------------------------

  constructor() {
    this._setupWebGL(window.innerWidth, window.innerHeight);
  }

  _setupWebGL(width, height) {
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
    this._camera.position.z = 100;

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize( width, height );
    this._renderer.setClearColor( 0x000000 );
  }

  _setupEvents() {
    Signals.onResize.add(this._onResize);
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._camera.aspect = vw / vh;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( vw, vh );
  }

}
