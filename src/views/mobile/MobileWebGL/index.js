import * as pages from 'core/pages';
import States from 'core/States';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { autobind } from 'core-decorators';
import { toggle, active } from 'core/decorators';
import { createDOM } from 'utils/dom';
import { angle2, distance2, map, randomFloat } from 'utils/math';
import OrbitControls from 'helpers/3d/OrbitControls/OrbitControls'
import PostProcessing from './PostProcessing';
import Project from './Project';
import Experiment from './Experiment';
import Background from './meshes/MobileBackground';
// import Cloud from './meshes/MobileCloud';
import DecorPoints from './meshes/DecorPoints';
import template from './webgl.tpl.html';
import backgroundBufferFragmentShader from './meshes/MobileBackground/shaders/backgroundBufferPlane.fs';

@active()
@toggle('scrolled', 'scroll', 'unscroll', false)
export default class MobileWebGL {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._clock = new THREE.Clock();
    this._mouse = new THREE.Vector2();
    this._raycaster = new THREE.Raycaster();

    this._scrollWheelTimeout = null;
    this._cameraInterval = null;
    this._page = null;

    this._animatedScrollTimeout = false;
    this._animateScrollTimeout = true;
    this._dragged = false;

    this._type = 'project';

    this._angle = 0;
    this._delta = 0;
    this._deltaTarget = 0;
    this._finalDelta = 0;
    this._translation = 0;

    this._setupWebGL(window.innerWidth, window.innerHeight);

    this._setupBackground();
    this._setupProject();
    this._setupExperiment();
    this._setupDecorPoints();
    // this._setupCloud();
    this._setupPostProcessing();

    this._addEvents();
  }

  _setupWebGL(width, height) {
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 3000 );
    this._camera.position.z = 1500;

    // this._controls = new OrbitControls(this._camera);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize( width, height );
    this._renderer.setClearColor( 0x000000 );

    this._el.appendChild(this._renderer.domElement);
  }

  _setupBackground() {
    this._background = new Background({
      renderer: this._renderer,
      width: 256,
      height: 256,
      bufferPlaneFragment: backgroundBufferFragmentShader,
    });
    this._scene.add(this._background.getObject());
  }

  _setupProject() {
    this._project = new Project({
      raycaster: this._raycaster,
      camera: this._camera,
    });

    if (this._project) this._scene.add(this._project.getPoints());
    if (this._project) this._scene.add(this._project.getDescription());
  }

  _setupExperiment() {
    this._experiment = new Experiment({
      raycaster: this._raycaster,
      camera: this._camera,
    });

    if (this._experiment) this._scene.add(this._experiment.getPoints());
    if (this._experiment) this._scene.add(this._experiment.getDescription());
  }

  _setupDecorPoints() {
    // this._decorPoints = new DecorPoints();
    if (this._decorPoints) this._scene.add(this._decorPoints);
  }

  _setupCloud() {
    this._cloud = new Cloud({});
    this._cloud.position.z = 0;
    this._scene.add(this._cloud);
  }

  _setupPostProcessing() {
    this._postProcessing = new PostProcessing({
      scene: this._scene,
      renderer: this._renderer,
      camera: this._camera,
    });
  }

  _addEvents() {
    this._el.addEventListener('click', this._onClick);
    // this._el.addEventListener('touchstart', this._onTouchstart);
    // this._el.addEventListener('touchmove', this._onTouchmove);
    // this._el.addEventListener('touchend', this._onTouchend);
    Signals.onResize.add(this._onResize);
    // Signals.onScroll.add(this._onScroll);
    // Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // Getters -------------------------------------------------------------------

  getElement() {
    return this._el;
  }

  // State ---------------------------------------------------------------------

  activate() {}

  deactivate() {}

  scroll() {
    if (this._project && this._project.visible()) {
      this._project.deselect();
    }

    if (this._experiment && this._experiment.visible()) {
      this._experiment.deselect();
    }

    if (this._decorPoints) this._decorPoints.setDirection(this._deltaTarget);

    // if (!this._animatedScrollTimeout) {
    if (!this._project.focused() && !this._experiment.focused()) {
      this._postProcessing.animate(this._deltaTarget);
      this._shakeCamera();
    }

    // this._animatedScrollTimeout = true;
    // clearTimeout(this._animateScrollTimeout);
    // this._animateScrollTimeout = setTimeout(() => {
    //   this._animatedScrollTimeout = false;
    //   this._animateScrollTimeout = false;
    // }, 1500);
  }

  _shakeCamera() {

    let intervals = 0;

    this._camera.position.x = randomFloat(-10, 10);
    this._camera.position.y = randomFloat(-10, 10);

    clearInterval(this._cameraInterval);
    this._cameraInterval = setInterval( () => {

      if (intervals === 10) {
        clearInterval(this._cameraInterval);
        this._camera.position.x = 0;
        this._camera.position.y = 0;
        return false;
      }

      this._camera.position.x = randomFloat(-10, 10);
      this._camera.position.y = randomFloat(-10, 10);

      intervals++;

      return true;
    }, 50);
  }

  unscroll() {
    this._deltaTarget = 0;
    this._delta = 0;
    let target = 0;

    if (this._project && this._project.visible()) {
      target = Math.round(this._translation * projectList.projects.length) / projectList.projects.length;
    } else {
      target = Math.round(this._translation * experimentList.experiments.length) / experimentList.experiments.length;
    }

    TweenLite.killTweensOf(this);
    TweenLite.to(
      this,
      1,
      {
        _translation: target,
      },
    );

    if (this._project.visible()) {
      const project = projectList.projects[Math.round(States.global.progress) % projectList.projects.length];
      this._project.updateDescription(project);
    } else if (this._experiment.visible()) {
      const experiment = experimentList.experiments[Math.round(States.global.progress) % experimentList.experiments.length];
      this._experiment.updateDescription(experiment);
    }

    if (this._project && this._project.visible()) {
      this._project.select();
    }

    if (this._experiment && this._experiment.visible()) {
      this._experiment.select();
    }
  }

  updateState(page) {
    if (this._project) this._project.updateState(page);
    if (this._experiment) this._experiment.updateState(page);

    this._angle = 0;
    this._delta = 0;
    this._deltaTarget = 0;
    this._finalDelta = 0;
    this._translation = 0;

    if (page === pages.EXPERIMENT) {
      if (this._cloud) this._cloud.activate();

      if (this._page === pages.HOME) {
        this._resetTranslation();
      }
    }

    if (page === pages.HOME) {
      this._type = 'project';
      if (this._background) this._background.show();
      if (this._cloud) this._cloud.activate();

      if (this._page === pages.EXPERIMENT) {
        this._resetTranslation();
      }
    } else if (this._page === pages.ABOUT) {
      this._background.hide();
    } else {
      if (this._page === pages.HOME) {
        this._resetTranslation();
      }

      this._type = 'experiment';
    }

    this._page = page;
  }

  _resetTranslation() {
    TweenLite.killTweensOf(this);
    this._translation = 0;
    this._delta = 0;
    this._finalDelta = 0;
    this._angle = 0;
    const project = projectList.projects[0];
    this._project.updateDescription(project);

    const experiment = experimentList.experiments[0];
    this._experiment.updateDescription(experiment);

    States.global.progress = 0;

    // this._disableEvents = true;
    // clearTimeout(this._intervalTimeout);
    // this._intervalTimeout = setTimeout(() => { this._disableEvents = false; }, 400);
  }

  // Events --------------------------------------------------------------------

  onDeviceorientation(event) {
    // this._camera.rotation.x = event.beta * 0.003 - 0.2
    let gamma = event.gamma;
    if (gamma > 29 || gamma < -29) {
      gamma = 0;
    }
    // if (gamma < 0) {
    //   gamma = map(gamma, -90, 0, 180, 90);
    // }

    this._camera.rotation.y = gamma * 0.001;
  }

  onDevicemotion(event) {
    // // this._camera.rotation.x = event.beta * 0.002;
    // console.log(event.acceleration.x);
    //
    // if (event.acceleration.x > 0.4 || event.acceleration.x < -0.4) {
    //   this._camera.rotation.y += event.acceleration.x * 0.01;
    // }
    // // this._camera.rotation.x += event.accelerationIncludingGravity.z * 0.0001;
  }

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._camera.aspect = vw / vh;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( vw, vh );

    if (this._postProcessing) this._postProcessing.resize();
    if (this._background) this._background.resize(this._camera);
    if (this._cloud) this._cloud.resize(this._camera);
    if (this._project) this._project.resize();
    if (this._experiment) this._experiment.resize();
  }

  @autobind
  _onScroll(event) {
    console.log(1);
  }

  // @autobind
  // _onScrollWheel(event) {
  //   if (this.active()) {
  //     TweenLite.killTweensOf(this, { _translation: true });
  //     this._deltaTarget = Math.min( 150, Math.max( -150, event.deltaY ) );
  //     this.scroll();
  //
  //     clearTimeout(this._scrollWheelTimeout);
  //     this._scrollWheelTimeout = setTimeout(() => {
  //       this.unscroll();
  //     }, 500);
  //   }
  // }

  // @autobind
  // _onClick() {
  //   if (this._project.focused()) {
  //   if (this._project.focused()) {
  //     const id = projectList.projects[Math.round(States.global.progress) * projectList.projects.length].id;
  //     console.log(Math.round(States.global.progress) * projectList.projects.length);
  //     States.router.navigateTo(pages.PROJECT, { id });
  //   }
  //
  //   if (this._experiment.focused()) {
  //     window.open(experimentList.experiments[Math.floor(States.global.progress)].url, '_blank');
  //   }
  // }

  // @autobind
  touchstart(event) {

    this._mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = -( event.touches[0].clientY / window.innerHeight ) * 2 + 1;

    this._updateCamera();
    this.scroll();

    this._background.touch();

    this._p1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    // const p2 = { x: window.screen.width * 0.5, y: window.screen.height * 0.5 };
    // let angle = angle2(this._p1, p2, true);

    // if (angle < 0) {
    //   angle = 360 + angle;
    // }

    // angle = ( angle - 90 ) % 360;

    // if (angle < 0) {
    //   angle = map( angle, -90, 0, 270, 360);
    // }

    // this._angle = angle;
  }

  // @autobind
  touchmove(event) {
    this._dragged = true;
    this._mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = -( event.touches[0].clientY / window.innerHeight ) * 2 + 1;

    const p2 = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    let angle = angle2(this._p1, p2, true);

    if (angle < 0) {
      angle = 360 + angle;
    }

    angle = ( angle - 90 ) % 360;

    if (angle < 0) {
      angle = map( angle, -90, 0, 270, 360);
    }

    const factor = angle - this._angle >= 0 ? 1 : -1;

    this._deltaTarget = distance2(this._p1, { x: event.touches[0].clientX, y: event.touches[0].clientY }) * factor;

    this._p1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };

    this._angle = angle;
  }

  // @autobind
  touchend() {
    this.unscroll();

    this._background.touchend();

    if (!this._dragged) {
      if (this._project && this._project.focused() && this._project.visible()) {
        const id = projectList.projects[Math.round(States.global.progress) % projectList.projects.length].id;
        States.router.navigateTo(pages.PROJECT, { id });
      } else if (this._experiment && this._experiment.focused() && this._experiment.visible()) {
        window.open(experimentList.experiments[Math.round(States.global.progress) % experimentList.experiments.length].url, '_blank');
      }
    }
    this._dragged = false;
  }

  @autobind
  _onSetLowMode() {
    if (this._cloud) this._cloud.setLowMode();
    if (this._background) this._background.setLowMode();

    this._mode = 'low';
  }

  // Update --------------------------------------------------------------------

  update() {

    if (this.active()) {

      const time = this._clock.getElapsedTime();
      const delta = this._clock.getDelta();

      // this._updateCamera();
      this._updatePoints(time);
      this._updateDecorPoints(time);

      if (this._background) this._background.update(time);
      if (this._cloud) this._cloud.update(time);

      // this._renderer.render(this._scene, this._camera);
      this._postProcessing.update(delta);
    }
  }

  _updateCamera() {
    const object = this._type === 'project' ? this._project.getDescription() : this._experiment.getDescription();

    this._raycaster.setFromCamera( this._mouse, this._camera );
    const intersects = this._raycaster.intersectObjects( object.children, true );

    for (let i = 0; i < intersects.length; i++) {

      if (intersects[i].object.parent.name === 'description') {
        console.info('description');
        if (this._project.visible()) {
          this._project.focus();
        }

        if (this._experiment.visible()) {
          this._experiment.focus();
        }

        document.body.style.cursor = 'pointer';
        return;
      }
    }

    document.body.style.cursor = 'inherit';

    if (this._project.visible()) {
      this._project.blur();
    }

    if (this._experiment.visible()) {
      this._experiment.blur();
    }
  }

  _updatePoints(time) {
    this._delta += ( this._deltaTarget * 20 - this._delta ) * 0.1;
    this._finalDelta += this._delta;
    if (this.scrolled()) {
      this._translation = this._angle / 360;
    }

    if (this._project && this._project.visible()) {
      this._project.update(time, this._finalDelta, this._translation);
    }

    if (this._experiment && this._experiment.visible()) {
      this._experiment.update(time, this._finalDelta, this._translation);
    }
  }

  _updateDecorPoints(time) {
    if (this._decorPoints) this._decorPoints.update(time, this._finalDelta);
  }

}
