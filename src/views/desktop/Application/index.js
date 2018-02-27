import raf from 'raf';
import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import HomeView from 'views/desktop/Home';
import TimelineView from 'views/desktop/Timeline';
import WebglView from 'views/desktop/WebGL';
import dat from 'dat.gui';

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    window.GUI = new dat.GUI();

    console.info('desktop application initializing');
    this.el = document.getElementById('application');

    this._views = [];
    this._home = this._setupHome();
    this._timeline = this._setupTimeline();
    this._webgl = this._setupWebGL();

    this._views.push(this._home, this._timeline, this._webgl);

    this._setupEvents();
    this._update();
  }

  _setupHome() {
    const view = new HomeView({
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

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        // this._timeline.show();
        break;
      default:
        this._home.hide();
    }
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
    this._webgl.update();
    this._timeline.update();

    raf(this._update);
  }

}
