import { autobind } from 'core-decorators';
import * as pages from 'core/pages';
import Navigo from 'navigo';

export default class Router {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    this.updatePageCallback = options.updatePageCallback;
    this._assetsLoaded = false;

    this.setupRouter();
    this.setupEvents();
  }

  setupRouter() {
    const root = `${window.location.protocol}//${window.location.host}`;
    const useHash = true;
    this.navigo = new Navigo(root, useHash);

    this.navigo.notFound(this._onRouteNotFound);
    this.navigo.on({
      '/': { as: pages.PROJECTS, uses: this._onRouteProjects },
      '/projects': { as: pages.PROJECTS, uses: this._onRouteProjects },
      '/lab': { as: pages.LAB, uses: this._onRouteLab },
      '/blog': { as: pages.BLOG, uses: this._onRouteBlog },
    });
  }

  setupEvents() {
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
    this.updatePageCallback(pages.PROJECTS);
  }

  @autobind
  _onRouteProjects() {
    this.updatePageCallback(pages.PROJECTS);
  }

  @autobind
  _onRouteLab() {
    this.updatePageCallback(pages.LAB);
  }

  @autobind
  _onRouteBlog() {
    this.updatePageCallback(pages.BLOG);
  }

}
