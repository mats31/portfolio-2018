import States from 'core/States';
import * as pages from 'core/pages';
import { createDOM } from 'utils/dom';
import { visible } from 'core/decorators';
import template from './title.tpl.html';
import './title.scss';


@visible()
export default class DesktopTitleView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._addEvents();
  }

  _addEvents() {
    this._el.addEventListener('click', this._onClick);
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }

  // Events --------------------------------------------------------------------

  _onClick() {
    const lastRouteName = States.router.getLastRouteResolved().name;

    if (lastRouteName === pages.ABOUT) {
      States.router.navigateTo(pages.HOME);
    } else {
      States.router.navigateTo(pages.ABOUT);
    }
  }
}
