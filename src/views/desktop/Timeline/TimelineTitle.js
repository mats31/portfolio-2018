import * as pages from 'core/pages';
import States from 'core/States';
import projectList from 'config/project-list';
import { letterParser } from 'utils/dom';
import { createCanvas, createHexagone, resizeCanvas } from 'utils/canvas';
import { randomFloat } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, toggle } from 'core/decorators';


@visible()
export default class TimelineTitleView {
  constructor(options) {
    this._el = options.el;

    this._currentTitle = null;
    this._changingTitle = false;
  }

  // State ---------------------------------------------------------------------

  updateType(type) {
    this._type = type;
  }

  updateTitle(title) {

    if (title !== this._currentTitle) {

      this._changingTitle = true;

      if (!this.visible()) {
        this._parseText(title);
        this.show();
      } else {
        this.hide({ updateText: true });
      }

      this._currentTitle = title;
    }

    if (!this._changingTitle) {
      this.show();
    }
  }

  show() {
    const letters = this._el.querySelectorAll('.js-textContainer__letter');

    for (let i = 0; i < letters.length; i++) {
      TweenLite.killTweensOf(letters[i]);
      TweenLite.fromTo(
        letters[i],
        0.25,
        {
          scale: 2,
          opacity: 0,
        },
        {
          delay: randomFloat(0, 0.25),
          opacity: 1,
          scale: 1,
          ease: 'Power2.easeOut',
        },
      );
    }

    // TweenLite.killTweensOf(this._onHideComplete);
  }

  hide({ updateText = false } = {}) {
    const letters = this._el.querySelectorAll('.js-textContainer__letter');

    for (let i = 0; i < letters.length; i++) {
      TweenLite.killTweensOf(letters[i]);
      TweenLite.to(
        letters[i],
        0.25,
        {
          delay: randomFloat(0, 0.25),
          opacity: 0,
          scale: 0,
          ease: 'Power2.easeOut',
          // onComplete: () => {
          //   if (updateText) {
          //     this._onHideComplete();
          //   }
          // },
        },
      );
    }

    // TweenLite.killTweensOf(this._onHideComplete);
    if (updateText) {
      TweenLite.delayedCall(0.2, this._onHideComplete);
    }
  }

  @autobind
  _onHideComplete() {
    this._changingTitle = false;
    this._parseText(this._currentTitle);
    this.show();
  }

  _parseText(text) {
    this._el.innerHTML = text;
    const element = letterParser(this._el)[0];

    for (let i = 0; i < element.childNodes.length; i++) {
      if (element.childNodes[i].textContent === ' ') {
        element.childNodes[i].style.width = '10px';
      }
    }
  }

  // Events ---------------------------------------------------------------------
}
