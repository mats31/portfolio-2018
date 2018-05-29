/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
// import AudioController from 'helpers/AudioController'; /* exported AudioController */
import AssetLoader from 'core/AssetLoader';
import States from 'core/States';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
import Application from 'views/desktop/Application';
import LoaderView from 'views/common/Loader';

import 'stylesheets/main.scss';

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    const styles = [
      'background: linear-gradient(#FC466B, #3F5EFB)',
      'border: 1px solid #00ff00',
      'color: white',
      'display: block',
      'line-height: 20px',
      'text-align: center',
      'font-weight: bold',
    ].join(';');

    console.log('%c Big thanks to Célia for helping with the previews 😘', styles);
    console.log('%c Thanks Lionel for the de... wireframes 😘', styles);
    console.log('%c Life is over 9000 ❤️.', styles);
    console.log('%c Vie sur vous 🖖', styles);

    this._loader = this._setupLoader();
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  _setupLoader() {
    const view = new LoaderView({
      parent: document.body,
    });

    return view;
  }

  _start() {
    this._application = new Application();
    this._onLoadApplication();
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
    this._start();
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
