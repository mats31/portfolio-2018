/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
// import AudioController from 'helpers/AudioController'; /* exported AudioController */
import AssetLoader from 'core/AssetLoader';
import States from 'core/States';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
import MobileApplication from 'views/mobile/MobileApplication';
import LoaderView from 'views/common/Loader';

import 'stylesheets/main.scss';

class MobileMain {

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

  _start() {
    this._application = new MobileApplication();
    this._onLoadApplication();
  }

  _onLoadApplication() {
    States.router = new Router({
      updatePageCallback: this.updatePage,
    });

    States.router.navigo.resolve();
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {
    this._start();
  }

  @autobind
  updatePage(page) {
    if (this.application) {
      this.application.updatePage(page);
    }
  }
}

domready(() => {
  new MobileMain();
});
