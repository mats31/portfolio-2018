import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import MobileHomeView from 'views/mobile/MobileHome';

export default class MobileAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    console.info('mobile application initializing');
    this.el = document.getElementById('application');

    this._views = [];
    this._loader = this._setupLoader();
    this._home = this._setupHome();

    this._views.push(this._home);

    this._setupEvents();
  }

  _setupHome() {
    const view = new MobileHomeView({
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
        this._home.show();
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
  _onScrollWheel() {
    Signals.onScrollWheel.dispatch();
  }

}
