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
    window.GUI.destroy();

    console.info('mobile application initializing');
    this.el = document.getElementById('application');

    this._views = [];
    this._uiHome = this._setupHome();
    this._projectView = this._setupProject();
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
    this._webgl.getElement().addEventListener('touchstart', this._onTouchstart);
    this._webgl.getElement().addEventListener('touchmove', this._onTouchmove);
    this._webgl.getElement().addEventListener('touchend', this._onTouchend);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('scroll', this._onScroll);
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
        window.addEventListener('touchmove', this._onWindowTouchmove);
        document.body.style.overflow = 'hidden';
        this._uiHome.show();
        this._webgl.activate();
        this._projectView.hide();
        break;
      case pages.EXPERIMENT:
        window.addEventListener('touchmove', this._onWindowTouchmove);
        document.body.style.overflow = 'hidden';
        this._uiHome.show();
        this._webgl.activate();
        this._projectView.hide();
        break;
      case pages.PROJECT:
        window.removeEventListener('touchmove', this._onWindowTouchmove);
        document.body.style.overflow = 'hidden';
        this._uiHome.show();
        this._timeline.hide();
        this._webgl.deactivate();

        this._projectView.updateProject();
        this._projectView.show();
        break;
      case pages.ABOUT:
        window.removeEventListener('touchmove', this._onWindowTouchmove);
        document.body.style.overflow = 'hidden';
        this._uiHome.show();
        this._timeline.hide();
        this._webgl.deactivate();
        this._projectView.hide();
      default:
    }

    this._webgl.updateState(page);
    this._timeline.updateState(page);
    this._uiHome.updateState(page);
  }

  @autobind
  _onWindowTouchmove(event) {
    // event.preventDefault();
    this._uiHome.removeScrollMessage();
  }

  @autobind
  _onTouchstart(event) {
    this._timeline.touchstart(event);
    this._webgl.touchstart(event);
  }

  @autobind
  _onTouchmove(event) {
    event.preventDefault();
    this._timeline.touchmove(event);
    this._webgl.touchmove(event);
  }

  @autobind
  _onTouchend(event) {
    this._timeline.touchend(event);
    this._webgl.touchend(event);
  }

  @autobind
  _onResize() {
    Signals.onResize.dispatch( window.innerWidth, window.innerHeight );
  }

  @autobind
  _onScroll() {
    Signals.onScroll.dispatch();
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
    this._projectView.update();

    raf(this._update);
  }

}
