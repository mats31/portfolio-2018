import raf from 'raf';
import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import UIHomeView from 'views/desktop/UIHome';
import TimelineView from 'views/desktop/Timeline';
import AboutView from 'views/desktop/About';
import ProjectView from 'views/desktop/ProjectView';
import WebglView from 'views/desktop/WebGL';
import dat from 'dat.gui';

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    window.GUI = new dat.GUI();

    console.info('desktop application initializing');
    this.el = document.getElementById('application');

    this._views = [];
    this._uiHome = this._setupHome();
    this._projectView = this._setupProject();
    this._timeline = this._setupTimeline();
    this._about = this._setupAbout();
    this._webgl = this._setupWebGL();

    this._views.push(this._uiHome, this._timeline, this._webgl);

    this._setupEvents();
    this._update();
  }

  _setupHome() {
    const view = new UIHomeView({
      parent: this.el,
    });

    return view;
  }

  _setupProject() {
    const view = new ProjectView({
      parent: this.el,
    });

    return view;
  }

  _setupTimeline() {
    const view = new TimelineView({
      parent: this.el,
    });

    return view;
  }

  _setupAbout() {
    const view = new AboutView({
      parent: this.el,
    });

    return view;
  }

  _setupWebGL() {
    const view = new WebglView({
      parent: this.el,
    });

    return view;
  }

  _setupEvents() {
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('scroll', this._onScroll);
    window.addEventListener('mousewheel', this._onScrollWheel);
    window.addEventListener('DOMMouseScroll', this._onScrollWheel);

    this._onResize();
  }

  // State ---------------------------------------------------------------------

  start() {
    Signals.onApplicationStart.dispatch();
  }

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        // document.body.style.overflow = 'hidden';
        this._uiHome.show();
        this._webgl.activate();
        this._projectView.hide();
        this._about.hide();
        break;
      case pages.EXPERIMENT:
        // document.body.style.overflow = 'hidden';
        this._uiHome.show();
        this._webgl.activate();
        this._projectView.hide();
        this._about.hide();
        break;
      case pages.PROJECT:
        document.body.style.cursor = 'inherit';
        this._uiHome.show();
        this._webgl.deactivate();

        this._projectView.updateProject();
        this._projectView.show();
        this._about.hide();
        break;
      case pages.ABOUT:
        // document.body.style.overflow = 'hidden';
        this._uiHome.show();
        this._webgl.activate();
        this._projectView.hide();
        this._about.show();
        break;
      default:
    }

    this._webgl.updateState(page);
    this._timeline.updateState(page);
    this._uiHome.updateState(page);
  }

  @autobind
  _onMousemove(event) {
    this._timeline.mousemove(event);
    this._webgl.mousemove(event);
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
  _onScrollWheel(event) {
    Signals.onScrollWheel.dispatch(event);
  }

  // Update --------------------------------------------------------------------
  @autobind
  _update() {
    this._uiHome.update();
    this._webgl.update();
    this._timeline.update();
    this._projectView.update();

    raf(this._update);
  }

}
