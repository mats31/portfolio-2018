import { autobind } from 'core-decorators';
import { createDOM } from 'utils/dom';
import OrbitControls from 'helpers/3d/OrbitControls/OrbitControls'
import Points from './meshes/Points'
import template from './webgl.tpl.html';

export default class WebGL {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._clock = new THREE.Clock();
    this._mouse = new THREE.Vector2();

    this._timeout = null;

    this._delta = 0;
    this._deltaTarget = 0;

    this._setupWebGL(window.innerWidth, window.innerHeight);

    this._setupPoints();

    this._addEvents();
  }

  _setupWebGL(width, height) {
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 );
    this._camera.position.z = 1000;

    // this._controls = new OrbitControls(this._camera);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize( width, height );
    this._renderer.setClearColor( 0x000000 );

    this._el.appendChild(this._renderer.domElement);
  }

  _setupPoints() {
    this._points = new Points();
    this._scene.add(this._points);
  }

  _addEvents() {
    this._el.addEventListener('mousemove', this._onMousemove);
    Signals.onResize.add(this._onResize);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onMousemove(event) {
    this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._camera.aspect = vw / vh;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( vw, vh );
  }

  @autobind
  _onScrollWheel(event) {
    this._points.deselect();
    this._deltaTarget = event.deltaY;

    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      this._deltaTarget = 0;
      this._points.select();
    }, 250);
  }

  // Update --------------------------------------------------------------------
  update() {

    const time = this._clock.getElapsedTime();

    this._updateCamera();
    this._updatePoints(time);

    this._renderer.render(this._scene, this._camera);
  }

  _updateCamera() {
    this._camera.rotation.x += ( this._mouse.y * 0.02 - this._camera.rotation.x ) * 0.1;
    this._camera.rotation.y += ( this._mouse.x * -0.02 - this._camera.rotation.y ) * 0.1;
  }

  _updatePoints(time) {
    this._delta += ( this._deltaTarget - this._delta ) * 0.1;
    this._points.update(time, this._delta);
  }

}
