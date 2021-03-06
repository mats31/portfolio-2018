import * as pages from 'core/pages';
import { visible, focused } from 'core/decorators';
import Description from './meshes/Description';
import MobilePoints from './meshes/MobilePoints';

@visible()
@focused()
export default class Experiment {
  constructor(options) {

    this._raycaster = options.raycaster;
    this._camera = options.camera;

    this._setupPoints();
    this._setupDescription();
  }

  _setupPoints() {
    this._points = new MobilePoints({
      type: 'experiment',
    });
  }

  _setupDescription() {
    this._description = new Description({
      type: 'experiment',
      camera: this._camera,
    });
  }

  // Getters / Setters --------------------

  getPoints() {
    return this._points;
  }

  getDescription() {
    return this._description;
  }

  // State --------------------

  show() {
    this._description.show({
      delay: 1,
    });
    this._points.show();
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

  updateDescription(experiment) {
    this._description.updateProject(experiment);
  }

  updateState(page) {
    switch (page) {
      case pages.HOME:
        this.hide();
        break;
      case pages.EXPERIMENT:
        this.show();
        break;
      default:
        this.hide();
    }
  }

  // Events --------------------

  resize() {
    this._points.resize();
    this._description.resize();
  }

  // Update --------------------

  update(time, delta, translation) {

    this._points.update(time, delta, translation);
    this._description.update(time);
  }
}
