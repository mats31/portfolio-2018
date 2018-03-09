import raf from 'raf';
import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import MobileUIHomeView from 'views/mobile/MobileUIHome';
import MobileTimelineView from 'views/mobile/MobileTimeline';
import MobileProjectView from 'views/mobile/MobileProjectView';
import MobileWebglView from 'views/mobile/MobileWebGL';
import dat from 'dat.gui';

export default class MobileAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    window.GUI = new dat.GUI();

    console.info('mobile application initializing');
    this.el = document.getElementById('application');

    this._views = [];
    // this._uiHome = this._setupHome();
    // this._projectView = this._setupProject();
    this._timeline = this._setupTimeline();
    this._webgl = this._setupWebGL();

    // this._views.push(this._uiHome, this._timeline, this._webgl);

    this._setupEvents();
    this._update();
  }

  _setupHome() {
    const view = new MobileUIHomeView({
      parent: this.el,
    });

    return view;
  }

  _setupProject() {
    const view = new MobileProjectView({
      parent: this.el,
    });

    return view;
  }

  _setupTimeline() {
    const view = new MobileTimelineView({
      parent: this.el,
    });

    return view;
  }

  _setupWebGL() {
    const view = new MobileWebglView({
      parent: this.el,
    });

    return view;
  }

  _setupEvents() {
    window.addEventListener('touchmove', this._onTouchmove);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('deviceorientation', this._onDeviceorientation);
    window.addEventListener('devicemotion', this._onDevicemotion);

    this._onResize();
  }

  // State ---------------------------------------------------------------------

  start() {}

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        // document.body.style.overflow = 'hidden';
        // this._uiHome.show();
        this._webgl.activate();
        // this._projectView.hide();
        break;
      case pages.EXPERIMENT:
        // document.body.style.overflow = 'hidden';
        // this._uiHome.show();
        this._webgl.activate();
        // this._projectView.hide();
        break;
      case pages.PROJECT:
        // document.body.style.cursor = 'inherit';
        // this._uiHome.show();
        this._webgl.deactivate();

        // this._projectView.updateProject();
        // this._projectView.show();
        break;
      default:
    }

    this._webgl.updateState(page);
    this._timeline.updateState(page);
    // this._uiHome.updateState(page);
  }

  @autobind
  _onTouchmove(event) {
    event.preventDefault();
    // this._timeline.touchmove(event);
    // this._webgl.touchmove(event);
  }

  @autobind
  _onResize() {
    Signals.onResize.dispatch( window.innerWidth, window.innerHeight );
  }

  @autobind
  _onDeviceorientation(event) {
    this._webgl.onDeviceorientation(event);
  }

  @autobind
  _onDevicemotion(event) {
    this._webgl.onDevicemotion(event);
  }

  // Update --------------------------------------------------------------------
  @autobind
  _update() {
    // this._uiHome.update();
    this._webgl.update();
    this._timeline.update();
    // this._projectView.update();

    raf(this._update);
  }

}
