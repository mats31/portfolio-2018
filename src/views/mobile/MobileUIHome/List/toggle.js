import { opened } from 'core/decorators';
import { autobind } from 'core-decorators';

@opened()
export default class Toggle {
  constructor(options) {
    this.el = options.el;
    this._callback = options.callback;

    this._setupToggle();
    this._addEvents();
  }

  _setupToggle() {
    this._firstLine = document.createElement('div');
    this._firstLine.classList.add('list__toggleLine');
    this._firstLine.classList.add('list__toggleLine1');

    this._secondLine = document.createElement('div');
    this._secondLine.classList.add('list__toggleLine');
    this._secondLine.classList.add('list__toggleLine2');

    this._thirdLine = document.createElement('div');
    this._thirdLine.classList.add('list__toggleLine');
    this._thirdLine.classList.add('list__toggleLine3');
    this._thirdLine.classList.add('js-list__toggleLine3');

    this._fourthLine = document.createElement('div');
    this._fourthLine.classList.add('list__toggleLine');
    this._fourthLine.classList.add('list__toggleLine4');
    this._fourthLine.classList.add('js-list__toggleLine4');

    this.el.appendChild(this._firstLine);
    this.el.appendChild(this._secondLine);
    this.el.appendChild(this._thirdLine);
    this.el.appendChild(this._fourthLine);
  }

  _addEvents() {
    this.el.addEventListener('click', this._onClick);
  }

  // State --------

  open() {
    TweenLite.killTweensOf(this._firstLine);
    TweenLite.to(
      this._firstLine,
      1,
      {
        x: -window.innerWidth,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._fourthLine);
    TweenLite.to(
      this._fourthLine,
      1,
      {
        x: -window.innerWidth,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._secondLine);
    TweenLite.to(
      this._secondLine,
      1,
      {
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%',
        rotation: '45deg',
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._thirdLine);
    TweenLite.to(
      this._thirdLine,
      1,
      {
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%',
        rotation: '-45deg',
        ease: 'Power4.easeOut',
      },
    );
  }

  close() {
    TweenLite.killTweensOf(this._firstLine);
    TweenLite.to(
      this._firstLine,
      1,
      {
        x: 0,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._fourthLine);
    TweenLite.to(
      this._fourthLine,
      1,
      {
        x: 0,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._secondLine);
    TweenLite.to(
      this._secondLine,
      1,
      {
        left: '5px',
        top: '33.33%',
        x: '0%',
        y: '0%',
        rotation: '0',
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._thirdLine);
    TweenLite.to(
      this._thirdLine,
      1,
      {
        left: '-3px',
        top: '66.66%',
        x: '0%',
        y: '0%',
        rotation: '0',
        ease: 'Power4.easeOut',
      },
    );
  }

  // Events --------

  @autobind
  _onClick() {
    this._callback();
  }
}
