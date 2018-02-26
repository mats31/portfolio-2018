import Points from './meshes/Points';

export default class Project {
  constructor() {
    this._setupPoints();
  }

  _setupPoints() {
    this._points = new Points();
  }

  // Getters / Setters --------------------

  getPoints() {
    return this._points;
  }

  // State --------------------

  deselect() {
    this._points.deselect();
  }

  select() {
    this._points.select();
  }

  // Update --------------------

  update(time, delta, translation) {
    this._points.update(time, delta, translation);
  }
}
