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
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }
}
