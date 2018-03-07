import States from 'core/States';
import * as pages from 'core/pages';
import { createDOM } from 'utils/dom';
import { visible } from 'core/decorators';
import { autobind } from 'core-decorators';
import template from './menu.tpl.html';
import './menu.scss';


@visible()
export default class DesktopNetworksView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      works: this._el.querySelector('.js-UIHome__menuWorks'),
      experiments: this._el.querySelector('.js-UIHome__menuExperiments'),
    };

    this._addEvents();
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }

  _addEvents() {
    this._ui.works.addEventListener('click', this._onWorksClick);
    this._ui.experiments.addEventListener('click', this._onExperimentsClick);
  }

  // Events ------------------------------------

  @autobind
  _onWorksClick() {
    States.router.navigateTo(pages.HOME);

    this._ui.works.classList.add('is-active');
    this._ui.experiments.classList.remove('is-active');
  }

  @autobind
  _onExperimentsClick() {
    States.router.navigateTo(pages.EXPERIMENT);

    this._ui.works.classList.remove('is-active');
    this._ui.experiments.classList.add('is-active');
  }
}
