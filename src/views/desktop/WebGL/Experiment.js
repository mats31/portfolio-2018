import * as pages from 'core/pages';
import { visible, focused } from 'core/decorators';
import Description from './meshes/Description';
import Points from './meshes/Points';

@visible()
@focused()
export default class Experiment {
  constructor(options) {

    this._raycaster = options.raycaster;

    this._setupPoints();
    this._setupDescription();
  }

  _setupPoints() {
    this._points = new Points({
      type: 'experiment',
    });
  }

  _setupDescription() {
    this._description = new Description();
    this._description.position.set(-200, -100, 300);
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
    this._description.show();
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

  select(experiment) {
    this._points.select();
    this._description.updateExperiment(experiment);
    this._description.show();
  }

  updateState(page) {
    switch (page) {
      case pages.HOME:
        this.hide();
        break;
      case pages.EXPERIMENT:
        this.show();
        break;
      case pages.ABOUT:
        this.hide();
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
