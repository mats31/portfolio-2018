import { createDOM } from 'utils/dom';
import { visible } from 'core/decorators';
import template from './networks.tpl.html';
import './networks.scss';


@visible()
export default class DesktopNetworksView {
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
