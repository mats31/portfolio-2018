import States from 'core/States';
import * as pages from 'core/pages';
import { createDOM } from 'utils/dom';
import { createCanvas, resizeCanvas } from 'utils/canvas';
import { visible, focused } from 'core/decorators';
import { autobind } from 'core-decorators';
import template from './list.tpl.html';
import './list.scss';


@visible()
@focused()
export default class DesktopListView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._lines = [];

    this._nbLines = 5;

    this.needsUpdate = false;
    this._linesNeedsUpdate = false;

    this._setupCanvas();

    this._addEvents();
  }

  _setupCanvas() {

    for (let i = 0; i < this._nbLines; i++) {
      const x = 0;
      const y = i * 10;

      const line = {
        x,
        y,
        width: 0,
        height: 1,
        progressWidth: 0,
      };

      this._lines.push(line);
    }

    this._width = window.innerWidth * 0.2;
    this._height = window.innerHeight;

    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._el.appendChild(this._ctx.canvas);
  }

  _addEvents() {
    this._el.addEventListener('mouseenter', this._onMouseenter);
    this._el.addEventListener('mouseleave', this._onMouseleave);
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }

  focus() {
    console.log('focus');
    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      1,
      {
        progressWidth: 1,
        ease: 'Power4.easeOut',
      },
      0.1,
      () => {
        this._linesNeedsUpdate = false;
      },
    );
  }

  blur() {
    console.log('blur');
    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      1,
      {
        progressWidth: 0,
        ease: 'Power4.easeOut',
      },
      0.1,
      () => {
        this._linesNeedsUpdate = false;
      },
    );
  }

  // Events ------------------------------------

  @autobind
  _onMouseenter() {
    this.focus();
  }

  @autobind
  _onMouseleave() {
    this.focus();
  }

  // Update ------------------------------------

  update() {
    if (this.needsUpdate) {
      this._ctx.clearRect( 0, 0, this._width, this._height );
      this._updateLines();
    }

    this.needsUpdate = this._linesNeedsUpdate;
  }

  _updateLines() {
    for (let i = 0; i < this._lines.length; i++) {
      const x = this._lines[i].x;
      const y = this._lines[i].y;
      const width = this._lines[i].width * this._lines[i].progressWidth;
      const height = this._lines[i].height;

      this._ctx.fillStyle = 'white';
      this._ctx.fillRect(x, y, width, height);

      console.log(x);
      console.log(y);
      console.log(width);
      console.log(height);
    }
  }
}
