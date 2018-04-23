import { autobind } from 'core-decorators';
import * as pages from 'core/pages';
import Navigo from 'navigo';

export default class Router {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    this.updatePageCallback = options.updatePageCallback;
    this._assetsLoaded = false;

    this._setupRouter();
    this._setupEvents();
  }

  _setupRouter() {
    const root = `${window.location.protocol}//${window.location.host}`;
    const useHash = false;
    this.navigo = new Navigo(root, useHash);

    this.navigo.notFound(this._onRouteNotFound);
    this.navigo.on({
      '/': { as: pages.HOME, uses: this._onRouteHome },
      '/experiment': { as: pages.EXPERIMENT, uses: this._onRouteExperiment },
      '/about': { as: pages.ABOUT, uses: this._onRouteAbout },
      '/project/:id': { as: pages.PROJECT, uses: this._onRouteProject },
    });
  }

  _setupEvents() {
    Signals.onAssetsLoaded.add(this._onAssetsLoaded);
  }

  // State ---------------------------------------------------------------------

  navigateTo(id, options = {}) {
    this.navigo.navigate(this.navigo.generate(id, options));
  }

  getLastRouteResolved() {
    const lastRouteResolved = this.navigo.lastRouteResolved();

    if (!lastRouteResolved.params) {
      lastRouteResolved.params = null;
    }

    return lastRouteResolved;
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onAssetsLoaded() {
    this._assetsLoaded = true;
  }

  @autobind
  _onRouteNotFound() {
    this.updatePageCallback(pages.HOME);
  }

  @autobind
  _onRouteHome() {
    this.updatePageCallback(pages.HOME);
  }

  @autobind
  _onRouteExperiment() {
    this.updatePageCallback(pages.EXPERIMENT);
  }

  @autobind
  _onRouteAbout() {
    this.updatePageCallback(pages.ABOUT);
  }

  @autobind
  _onRouteProject() {
    this.updatePageCallback(pages.PROJECT);
  }

}
