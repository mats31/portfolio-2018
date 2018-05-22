import States from 'core/States';
import * as pages from 'core/pages';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './scroll.tpl.html';
import './scroll.scss';


@visible()
export default class DesktopScrollView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._scrollHide = false;
  }

  // State ---------------------------------------------------------------------

  show() {
    if (!this._scrollHide) {
      this._el.style.display = 'block';

      TweenLite.to(
        this._el,
        1,
        {
          opacity: 1,
          ease: 'Power2.easeOut',
        },
      );
    }
  }

  hide() {
    TweenLite.to(
      this._el,
      1,
      {
        opacity: 0,
        ease: 'Power2.easeOut',
        onComplete: () => {
          this._el.style.display = 'none';
        },
      },
    );
  }

  // Events --------------------------------------------------------------------

  resize() {
    if (window.innerWidth > window.innerHeight) {
      this._el.style.top = `${window.innerHeight * 0.85}px`;
    } else {
      this._el.style.top = `${window.innerHeight * 0.9}px`;
    }
  }

  onTouchmove() {
    this.hide();

    if (States.router.getLastRouteResolved().name !== pages.PROJECT) {
      this._scrollHide = true;
    }
  }
}
