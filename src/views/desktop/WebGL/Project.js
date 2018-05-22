import * as pages from 'core/pages';
import { visible, focused } from 'core/decorators';
import Description from './meshes/Description';
import Points from './meshes/Points';

@visible()
@focused()
export default class Project {
  constructor(options) {

    this._raycaster = options.raycaster;

    this._page = null;

    this._setupPoints();
    this._setupDescription();
  }

  _setupPoints() {
    this._points = new Points({
      type: 'project',
    });
  }

  _setupDescription() {
    this._description = new Description({
      type: 'project',
    });
    this._description.position.set(-9.5, -6.25, 950);
  }

  // Getters / Setters --------------------

  getPoints() {
    return this._points;
  }

  getDescription() {
    return this._description;
  }

  // State --------------------

  show({ delay = 0 } = {}) {
    this._description.show({
      delay: delay + 1,
    });
    this._points.show({ delay });
  }

  hide() {
    this._description.hide();
    this._points.hide();
  }

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

  updateDescription(project) {
    this._description.updateProject(project);
  }

  updateState(page) {
    switch (page) {
      case pages.HOME:
        const delay = this._page ? 0 : 2.5;
        this.show({ delay });
        break;
      case pages.EXPERIMENT:
        this.hide();
        break;
      case pages.ABOUT:
        this.hide();
        break;
      default:
    }

    this._page = page;
  }

  // Events --------------------

  mousedown() {
    this._points.mousedown();
  }

  mouseup() {
    this._points.mouseup();
  }

  mousemove(mouse) {
    this._points.mousemove(mouse);
  }

  resize(camera) {
    this._points.resize(camera);
    this._description.resize();
  }

  // Update --------------------

  update(time, delta, translation, camera) {

    this._points.update(time, delta, translation);
    this._description.update(time, camera);
  }
}
