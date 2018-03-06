import * as pages from 'core/pages';
import { focused } from 'core/decorators';
import Description from './meshes/Description';
import Points from './meshes/Points';

@focused()
export default class Project {
  constructor(options) {

    this._raycaster = options.raycaster;

    this._setupPoints();
    this._setupDescription();
  }

  _setupPoints() {
    this._points = new Points();
  }

  _setupDescription() {
    this._description = new Description();
    this._description.position.set(200, -100, 300);
  }

  // Getters / Setters --------------------

  getPoints() {
    return this._points;
  }

  getDescription() {
    return this._description;
  }

  // State --------------------

  focus() {
    this._description.focus();
  }

  blur() {
    this._description.blur();
  }

  deselect() {
    this._points.deselect();
    this._description.hide();
  }

  select() {
    this._points.select();
    this._description.show();
  }

  updateState(page) {
    switch (page) {
      case pages.HOME:
        this._description.show();
        break;
      default:
    }
  }

  // Update --------------------

  update(time, delta, translation) {

    this._points.update(time, delta, translation);
    this._description.update(time);
  }
}
