import * as pages from 'core/pages';
import States from 'core/States';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { autobind } from 'core-decorators';
import { toggle, active } from 'core/decorators';
import { createDOM } from 'utils/dom';
import { randomFloat } from 'utils/math';
import OrbitControls from 'helpers/3d/OrbitControls/OrbitControls'
import PostProcessing from './PostProcessing';
import Project from './Project';
import Experiment from './Experiment';
import IconProject from './IconProject';
import Background from './meshes/Background';
import Cloud from './meshes/Cloud';
import Foreground from './meshes/Foreground';
import DecorPoints from './meshes/DecorPoints';
import backgroundBufferFragmentShader from './meshes/Background/shaders/backgroundBufferPlane.fs';
import foregroundBufferFragmentShader from './meshes/Foreground/shaders/foregroundBufferPlane.fs';
import template from './webgl.tpl.html';


@active()
@toggle('scrolled', 'scroll', 'unscroll', false)
export default class WebGL {

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
    this._animateScrollTimeout = false;
    this._timelineProjectHover = false;

    this._type = 'project';
    this._mode = 'high';

    this._delta = 0;
    this._deltaTarget = 0;
    this._translation = 0;
    this._currentIndex = 0;
    this._previousDeltaY = 0;
    this._timelineProjectHoverIndex = 9999;

    this._setupWebGL(window.innerWidth, window.innerHeight);

    this._setupBackground();
    this._setupProject();
    this._setupExperiment();
    this._setupDecorPoints();
    this._setupCloud();
    this._setupPostProcessing();
    this._setupIconProject();

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

  _setupBackground() {
    this._background = new Background({
      renderer: this._renderer,
      width: 512,
      height: 512,
      bufferPlaneFragment: backgroundBufferFragmentShader,
    });
    this._background.getObject().position.z = -2000;
    this._scene.add(this._background.getObject());

    // this._foreground = new Foreground({
    //   renderer: this._renderer,
    //   width: 512,
    //   height: 512,
    //   bufferPlaneFragment: foregroundBufferFragmentShader,
    // });


    if (this._foreground) {
      this._foreground.getObject().position.z = 100;
      this._scene.add(this._foreground.getObject());
    }
  }

  _setupProject() {
    this._project = new Project({
      raycaster: this._raycaster,
    });

    this._scene.add(this._project.getPoints());
    this._scene.add(this._project.getDescription());
  }

  _setupExperiment() {
    this._experiment = new Experiment({
      raycaster: this._raycaster,
    });

    this._scene.add(this._experiment.getPoints());
    this._scene.add(this._experiment.getDescription());
  }

  _setupDecorPoints() {
    this._decorPoints = new DecorPoints();
    this._scene.add(this._decorPoints);
  }

  _setupCloud() {
    this._cloud = new Cloud({});
    this._cloud.position.z = -1000;
    this._scene.add(this._cloud);
  }

  _setupPostProcessing() {
    this._postProcessing = new PostProcessing({
      scene: this._scene,
      renderer: this._renderer,
      camera: this._camera,
    });
  }

  _setupIconProject() {
    this._iconProject = new IconProject({
      parent: this._el,
    });
  }

  _addEvents() {
    this._el.addEventListener('mousedown', this._onMousedown);
    this._el.addEventListener('mouseup', this._onMouseup);
    this._el.addEventListener('mouseleave', this._onMouseleave);
    this._el.addEventListener('click', this._onClick);
    Signals.onResize.add(this._onResize);
    Signals.onScrollWheel.add(this._onScrollWheel);
    Signals.onTimelineProjectHover.add(this._onTimelineProjectHover);
    Signals.onSetLowMode.add(this._onSetLowMode);
  }

  // State ---------------------------------------------------------------------

  activate() {}

  deactivate() {}

  scroll() {
    if (this._project.visible()) {
      this._project.deselect();
    }

    if (this._experiment.visible()) {
      this._experiment.deselect();
    }

    if (!this._animatedScrollTimeout) {
      this._postProcessing.animate(this._deltaTarget);

      this._shakeCamera();
    }

    this._animatedScrollTimeout = true;
    clearTimeout(this._animateScrollTimeout);
    this._animateScrollTimeout = setTimeout(() => {
      this._animatedScrollTimeout = false;
      this._animateScrollTimeout = false;
    }, 1500);
  }

  _shakeCamera() {

    let intervals = 0;

    clearInterval(this._cameraInterval);
    this._cameraInterval = setInterval( () => {

      if (intervals === 10) {
        clearInterval(this._cameraInterval);
        this._camera.position.x = 0;
        this._camera.position.y = 0;
        return false;
      }

      this._camera.position.x = randomFloat(-20, 20);
      this._camera.position.y = randomFloat(-20, 20);

      intervals++;

      return true;
    }, 50);
  }

  unscroll() {
    this._deltaTarget = 0;
    this._delta = 0;
    this._timelineProjectHover = false;
    const remains = this._translation % 10000;
    let target = this._translation - remains;
    TweenLite.killTweensOf(this, { _translation: true });
    if (Math.abs(remains) <= 5000) {
      TweenLite.to(
        this,
        1,
        {
          _translation: this._translation - remains,
        },
      );
    } else {
      target = this._translation - ( 10000 - Math.abs(remains) );
      TweenLite.to(
        this,
        1,
        {
          _translation: this._translation - ( 10000 - Math.abs(remains) ),
        },
      );
    }

    const project = projectList.projects[Math.abs(target / 10000) % projectList.projects.length];
    this._project.updateDescription(project);

    const experiment = experimentList.experiments[Math.abs(target / 10000) % experimentList.experiments.length];
    this._experiment.updateDescription(experiment);

    if (this._project.visible()) {
      this._project.select();
      this._project.showDescription();
    }

    if (this._experiment.visible()) {
      this._experiment.select();
      this._experiment.showDescription();
    }
  }

  updateState(page) {

    this._project.updateState(page);
    this._experiment.updateState(page);
    this._iconProject.updateState(page);

    if (page === pages.HOME) {
      this._type = 'project';
      this._cloud.deactivate();
      this._background.show();
      this._iconProject.show();

      if (this._page === pages.EXPERIMENT) {
        this._resetTranslation();
      }
    } else if (page === pages.ABOUT) {
      this._cloud.activate();
      this._background.hide();
      this._iconProject.hide();
      this._resetTranslation();
    } else if (page === pages.EXPERIMENT) {
      this._type = 'experiment';
      this._cloud.deactivate();
      this._iconProject.show();

      if (this._page === pages.HOME) {
        this._resetTranslation();
      }
    } else {
      this._type = 'experiment';
      this._cloud.deactivate();
      this._iconProject.hide();
    }

    this._page = page;
  }

  _resetTranslation() {
    TweenLite.killTweensOf(this);
    this._translation = 0;
    this._delta = 0;
    this._deltaTarget = 0;
    const project = projectList.projects[0];
    this._project.updateDescription(project);

    const experiment = experimentList.experiments[0];
    this._experiment.updateDescription(experiment);

    this._project.select();
    this._experiment.select();
  }

  // Events --------------------------------------------------------------------

  mousemove(event) {
    this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

    this._project.mousemove(this._mouse);
    this._experiment.mousemove(this._mouse);
    this._iconProject.mousemove(event);
  }

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._camera.aspect = vw / vh;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( vw, vh );

    this._background.resize(this._camera);
    if (this._postProcessing) this._postProcessing.resize();
    if (this._foreground) this._foreground.resize(this._camera);
    if (this._cloud) this._cloud.resize(this._camera);
    if (this._project) this._project.resize(this._camera);
    if (this._experiment) this._experiment.resize(this._camera);
  }

  @autobind
  _onScroll(event) {}

  @autobind
  _onScrollWheel(event) {

    if (this.active() && !this._cloud.active() && !this._timelineProjectHover) {

      let baseDeltaY = event.deltaY * 4;
      let delay = 500;
      let range = 150;


      if (States.OS === 'MAC') {
        if (event.deltaMode === 1) {
          baseDeltaY = event.deltaY * 30;
          delay = 1200;
          range = 120;
        } else if (event.deltaY % 1 !== 0) {
          delay = 800;
        }
      } else if (event.deltaMode === 1) {
        baseDeltaY = event.deltaY * 90;
        delay = 1000;
        range = 1200;
      } else {
        baseDeltaY = event.deltaY * 15;
        range = 300;
        delay = 1200;
      }

      // if (this._previousDeltaY === baseDeltaY) {
      //   baseDeltaY = 0;
      // }

      this._decorPoints.setDirection(this._deltaTarget);

      TweenLite.killTweensOf(this, { _translation: true });
      this._deltaTarget = Math.min( range, Math.max( -range, baseDeltaY ) );
      this.scroll();

      clearTimeout(this._scrollWheelTimeout);
      this._scrollWheelTimeout = setTimeout(() => {
        this.unscroll();
      }, delay);

      this._previousDeltaY = baseDeltaY;
    }
  }

  @autobind
  _onMousedown() {
    this._project.mousedown();
    this._experiment.mousedown();

    this._iconProject.focus();
  }

  @autobind
  _onMouseup() {
    this._project.mouseup();
    this._experiment.mouseup();

    this._iconProject.blur();
  }

  @autobind
  _onMouseleave() {
    this._project.mouseup();
    this._experiment.mouseup();
  }

  @autobind
  _onClick() {
    if (this._project.focused()) {
      const id = projectList.projects[Math.floor(States.global.progress)].id;
      States.router.navigateTo(pages.PROJECT, { id });
    }

    if (this._experiment.focused()) {
      window.open(experimentList.experiments[Math.floor(States.global.progress)].url, '_blank');
    }
  }

  @autobind
  _onTimelineProjectHover(i) {

    if (this._type === 'project') {
      this._currentIndex = Math.floor( Math.abs(this._translation / ( projectList.projects.length * 10000 ) ) * projectList.projects.length + 0.01);
    } else {
      this._currentIndex = Math.floor( Math.abs(this._translation / ( experimentList.experiments.length * 10000 ) ) * experimentList.experiments.length + 0.01);
    }

    if (i !== this._currentIndex) {
      this._timelineProjectHover = true;
      this.scroll();
      clearTimeout(this._scrollWheelTimeout);

      const target = i * -10000;
      const distance = Math.abs( this._translation - target );
      let delay = 1.2;

      if (distance > 20000) {
        delay = 1.5;
      } else if (distance > 10000) {
        delay = 1.8;
      }

      TweenLite.killTweensOf(this, { _translation: true });
      TweenLite.to(
        this,
        delay,
        {
          _translation: target,
          ease: 'Power4.easeOut',
        },
      );

      TweenLite.killTweensOf(this._onDelayedTimelineProjectHover);
      TweenLite.delayedCall(delay - 0.3, this._onDelayedTimelineProjectHover);
    }

    this._timelineProjectHoverIndex = i;
  }

  @autobind
  _onDelayedTimelineProjectHover() {
    this.unscroll();
  }

  @autobind
  _onSetLowMode() {
    this._cloud.setLowMode();
    this._background.setLowMode();
    // this._scene.remove(this._cloud);
    // this._scene.remove(this._background.getObject());
    // this._scene.remove(this._project.getPoints());

    this._mode = 'low';
  }

  // Update --------------------------------------------------------------------

  update() {

    const time = this._clock.getElapsedTime();

    if (this.active()) {

      const delta = this._clock.getDelta();

      this._updateCamera();
      this._updatePoints(time);
      this._background.update(time);
      if (this._iconProject) this._iconProject.update();
      // if (this._mode === 'high') this._background.update(time);
      if (this._foreground) this._foreground.update(time);
      if (this._cloud) this._cloud.update(time);

      // this._renderer.render(this._scene, this._camera);
      this._postProcessing.update(delta);
    }

    if (this._page !== pages.PROJECT) this._updateDecorPoints(time);
  }

  _updateCamera() {
    this._camera.rotation.x += ( this._mouse.y * 0.1 - this._camera.rotation.x ) * 0.11;
    this._camera.rotation.y += ( this._mouse.x * -0.1 - this._camera.rotation.y ) * 0.11;

    const object = this._type === 'project' ? this._project.getDescription() : this._experiment.getDescription();

    this._raycaster.setFromCamera( this._mouse, this._camera );
    const intersects = this._raycaster.intersectObjects( object.children, true );

    for (let i = 0; i < intersects.length; i++) {

      if (intersects[i].object.parent.name === 'description') {
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
    this._deltaTarget += -this._deltaTarget * 0.1;
    this._delta += ( this._deltaTarget - this._delta ) * 0.1;
    this._translation -= this._delta * 2;

    if (this._type === 'project') {
      if (this._translation > 0) {
        this._translation = -10000 * projectList.projects.length;
      } else if (this._translation < -10000 * projectList.projects.length) {
        this._translation = 0;
      }
    } else if (this._translation > 0) {
      this._translation = -10000 * experimentList.experiments.length;
    } else if (this._translation < -10000 * experimentList.experiments.length) {
      this._translation = 0;
    }

    // if (this._translation > 0) {
    //   this._translation = this._type === 'project' ? -10000 * projectList.projects.length : -10000 * experimentList.experiments.length;
    // }

    if (this._project.visible()) {
      this._project.update(time, this._delta, this._translation, this._camera);
    }

    if (this._experiment.visible()) {
      this._experiment.update(time, this._delta, this._translation, this._camera);
    }
  }

  _updateDecorPoints(time) {
    this._decorPoints.update(time, this._delta);
  }

}
