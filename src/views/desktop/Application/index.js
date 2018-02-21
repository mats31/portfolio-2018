import raf from 'raf';
import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import HomeView from 'views/desktop/Home';
import WebglView from 'views/desktop/WebGL';

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    console.info('desktop application initializing');
    this.el = document.getElementById('application');

    this._views = [];
    this._home = this._setupHome();
    this._webgl = this._setupWebGL();

    this._views.push(this._home, this._webgl);

    this._setupEvents();
    this._update();
  }

  _setupHome() {
    const view = new HomeView({
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
        // this._home.show();
        break;
      default:
        this._home.hide();
    }
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

    raf(this._update);
  }

}
