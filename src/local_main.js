/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
// import AudioController from 'helpers/AudioController'; /* exported AudioController */
import AssetLoader from 'core/AssetLoader';
import States from 'core/States';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
import LoaderView from 'views/common/Loader';

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    this._loader = this._setupLoader();
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  _setupLoader() {
    const view = new LoaderView({
      parent: document.body,
    });

    return view;
  }

  start() {

    if (!States.MOBILE) {
        import('views/desktop/Application').then((App) => {
          import('stylesheets/main.scss').then(() => {
            this._application = new App();
            this._onLoadApplication();
          });
        });
    } else {
        import('views/mobile/MobileApplication').then((App) => {
          import('stylesheets/mobile_main.scss').then(() => {
            this._application = new App();
            this._onLoadApplication();
          });
        });
    }
  }

  _onLoadApplication() {
    States.router = new Router({
      updatePageCallback: this.updatePage,
    });

    States.router.navigo.resolve();
    this._application.start();
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {
    this.start();
  }

  @autobind
  updatePage(page) {
    if (this._application) {
      this._application.updatePage(page);
    }
  }
}

domready(() => {

  new Main();
});
