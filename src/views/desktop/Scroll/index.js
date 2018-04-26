import States from 'core/States';
import * as pages from 'core/pages';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { map, randomFloat } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, active } from 'core/decorators';
import CloseButton from 'views/common/CloseButton';
import template from './scroll.tpl.html';
import './scroll.scss';

export default class DesktopScrollView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._addEvents();
  }

  _addEvents() {
    this.el.addEventListener('scroll', this._onScroll);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {}

  hide({ delay = 0 } = {}) {}

  // Events --------------------------------------------------------------------

  @autobind
  _onScroll(event) {
    console.log(1);
  }

}
