import States from 'core/States';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './closeButton.tpl.html';
import './closeButton.scss';


@visible()
export default class CloseButtonView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._clickCallback = options.clickCallback;

    this._ui = {
      firstLine: this.el.querySelector('.js-closeButton__firstLine'),
      secondLine: this.el.querySelector('.js-closeButton__secondLine'),
      pointer: this.el.querySelector('.js-closeButton__pointer'),
    };
  }

  _addEvents() {
    this.el.addEventListener('click', this._onClick);
    this.el.addEventListener('mouseenter', this._onMouseenter);
    this.el.addEventListener('mouseleave', this._onMouseleave);
  }

  _removeEvents() {
    this.el.removeEventListener('click', this._onClick);
    this.el.removeEventListener('mouseenter', this._onMouseenter);
    this.el.removeEventListener('mouseleave', this._onMouseleave);
  }

  // State ---------------------

  show() {
    this._addEvents();

    TweenLite.killTweensOf(this._ui.firstLine);
    TweenLite.to(
      this._ui.firstLine,
      0.7,
      {
        scaleX: 0.8,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.secondLine);
    TweenLite.to(
      this._ui.secondLine,
      0.7,
      {
        delay: 0.15,
        scaleX: 0.8,
        ease: 'Power4.easeOut',
      },
    );
  }

  hide() {
    this._removeEvents();

    TweenLite.killTweensOf(this._ui.secondLine);
    TweenLite.to(
      this._ui.secondLine,
      0.7,
      {
        scaleX: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.firstLine);
    TweenLite.to(
      this._ui.firstLine,
      0.7,
      {
        delay: 0.1,
        scaleX: 0,
        ease: 'Power4.easeOut',
      },
    );
  }

  // Events --------------------

  @autobind
  _onClick() {
    this._clickCallback();
  }

  @autobind
  _onMouseenter() {
    TweenLite.killTweensOf(this._ui.firstLine);
    TweenLite.to(
      this._ui.firstLine,
      0.5,
      {
        scaleX: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.secondLine);
    TweenLite.to(
      this._ui.secondLine,
      0.5,
      {
        delay: 0.1,
        scaleX: 1,
        ease: 'Power4.easeOut',
      },
    );
  }

  @autobind
  _onMouseleave() {
    TweenLite.killTweensOf(this._ui.secondLine);
    TweenLite.to(
      this._ui.secondLine,
      0.5,
      {
        scaleX: 0.8,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.firstLine);
    TweenLite.to(
      this._ui.firstLine,
      0.5,
      {
        delay: 0.1,
        scaleX: 0.8,
        ease: 'Power4.easeOut',
      },
    );
  }
}
