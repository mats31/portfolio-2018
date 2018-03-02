import States from 'core/States';
import projectList from 'config/project-list';
import { letterParser } from 'utils/dom';
import { createCanvas, createHexagone, resizeCanvas } from 'utils/canvas';
import { randomFloat } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, toggle } from 'core/decorators';
import template from './timeline.tpl.html';
import './timeline.scss';


@visible()
export default class TimelineTitleView {
  constructor(options) {
    this._el = options.el;

    this._currentTitle = null;
  }

  // State ---------------------------------------------------------------------

  updateTitle(title) {

    if (title !== this._currentTitle) {
      if (this._el.textContent === '') {
        this._el.innerHTML = title;
        letterParser(this._el);

        this.show();

      } else {
        this.hide();
      }

      this._currentTitle = title;
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
        },
        {
          delay: randomFloat(0, 0.25),
          opacity: 1,
          scale: 1,
          ease: 'Power2.easeOut',
        },
      );
    }
  }

  hide() {
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
          onComplete: () => {
            if (i === letters.length - 1) {
              this._onHideComplete();
            }
          },
        },
      );
    }
  }

  _onHideComplete() {
    this._el.innerHTML = this._currentTitle;
    letterParser(this._el);
    this.show();
  }
}
