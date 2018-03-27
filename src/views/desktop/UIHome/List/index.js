import States from 'core/States';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import * as pages from 'core/pages';
import { createDOM } from 'utils/dom';
import { createCanvas, resizeCanvas } from 'utils/canvas';
import { distance2, map } from 'utils/math';
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

    this._mouse = new THREE.Vector2();

    this._lines = [];
    this._items = [];

    this._nbLines = 75;
    this._width = 50;
    this._height = this._nbLines * 10;

    this.needsUpdate = false;
    this._linesNeedsUpdate = false;

    this._ui = {
      itemContainer: this._el.querySelector('.js-UIHome__itemContainer'),
    };

    this._setupCanvas();

    this._addEvents();
  }

  _setupCanvas() {
    const width = 50;
    const extraWidth = 100;
    const x = this._width;

    for (let i = 0; i < this._nbLines; i++) {
      const y = i * 10;

      const line = {
        x,
        y,
        width,
        extraWidth,
        height: 1,
        progressWidth: 0,
        progressExtraWidth: 0,
        currentExtraWidth: 0,
      };

      this._lines.push(line);
    }

    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._el.appendChild(this._ctx.canvas);
  }

  _addEvents() {
    this._el.addEventListener('mouseenter', this._onMouseenter);
    this._el.addEventListener('mousemove', this._onMousemove);
    this._el.addEventListener('mouseleave', this._onMouseleave);
    Signals.onResize.add(this._onResize);
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }

  focus() {
    this._focusAnimationDone = false;

    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      0.7,
      {
        progressWidth: 1,
        ease: 'Power4.easeOut',
      },
      0.005,
      () => {
        this._linesNeedsUpdate = false;
        this._focusAnimationDone = true;
      },
    );

    TweenLite.killTweensOf(this._items);
    TweenMax.staggerTo(
      this._items,
      1,
      {
        autoAlpha: 0.5,
        ease: 'Power2.easeOut',
      },
      0.1,
    );
  }

  blur() {
    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      0.7,
      {
        progressWidth: 0,
        progressExtraWidth: 0,
        currentExtraWidth: 0,
        ease: 'Power4.easeOut',
      },
      -0.005,
      () => {
        this._linesNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._items);
    TweenMax.staggerTo(
      this._items,
      1,
      {
        autoAlpha: 0,
        ease: 'Power2.easeOut',
      },
      -0.1,
    );
  }

  updateState(page) {
    this._fillContent(page);
  }

  _fillContent(page) {

    this._items = [];

    while (this._ui.itemContainer.firstChild) {
      this._ui.itemContainer.removeChild(this._ui.itemContainer.firstChild);
    }

    if (page === pages.HOME) {
      for (let i = 0; i < projectList.projects.length; i++) {
        const project = projectList.projects[i];

        const div = document.createElement('div');
        div.classList.add('js-UIHome__item');
        div.classList.add('UIHome__item');
        div.innerHTML = project.title;
        this._items.push(div);
        this._ui.itemContainer.appendChild(div);
      }
    } else if (page === pages.EXPERIMENT) {
      for (let i = 0; i < experimentList.experiments.length; i++) {
        const experiment = experimentList.experiments[i];

        const div = document.createElement('div');
        div.classList.add('js-UIHome__item');
        div.classList.add('UIHome__item');
        div.innerHTML = experiment.title;
        this._items.push(div);
        this._ui.itemContainer.appendChild(div);
      }
    }

    this.resize();
  }

  // Events ------------------------------------

  @autobind
  _onMouseenter() {
    this.focus();
  }

  @autobind
  _onMousemove(event) {
    this._mouse.x = event.clientX;
    this._mouse.y = event.clientY;

    this._linesNeedsUpdate = true;
  }

  @autobind
  _onMouseleave() {
    this.blur();
  }

  @autobind
  _onResize() {
    this.resize();
  }

  resize() {
    this._height = this._nbLines * window.innerHeight * 0.01;

    const width = window.innerWidth * 0.02;
    const extraWidth = window.innerWidth * 0.03;
    this._width = width + extraWidth;
    const x = this._width;

    for (let i = 0; i < this._nbLines; i++) {
      const y = i * window.innerHeight * 0.01;

      this._lines[i].x = x;
      this._lines[i].y = y;
      this._lines[i].width = width;
      this._lines[i].extraWidth = extraWidth;
      this._lines[i].height = 1;
    }

    resizeCanvas(this._ctx, this._width, this._height, true, 2);
    this._elWidth = window.innerWidth * 0.2;
    this._elHeight = window.innerHeight;
    this._el.style.width = `${this._elWidth}px`;
    this._el.style.height = `${this._elHeight}px`;

    const customHeight = this._height - window.innerHeight * 0.028;
    for (let i = 0; i < this._items.length; i++) {
      const top = ( i / ( this._items.length - 1 ) ) * customHeight + ( window.innerHeight - this._height ) * 0.5;
      const right = this._width;
      this._items[i].style.right = `${right}px`;
      this._items[i].style.top = `${top}px`;
    }
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

      if (this.focused() && this._focusAnimationDone) {
        const relativeLinePointX = window.innerWidth - this._lines[i].x;
        const relativeLinePointy = this._lines[i].y + ( window.innerHeight - this._height ) * 0.5;

        const linePoint = { x: relativeLinePointX, y: relativeLinePointy };
        this._lines[i].progressExtraWidth = map( Math.min(this._elWidth, distance2( this._mouse, linePoint ) ), 0, this._elWidth, 1, 0 );
      }

      this._lines[i].currentExtraWidth += ( this._lines[i].progressExtraWidth - this._lines[i].currentExtraWidth ) * 0.1;

      const width = this._lines[i].width * this._lines[i].progressWidth + this._lines[i].extraWidth * this._lines[i].currentExtraWidth;
      const x = this._lines[i].x - width;
      const y = this._lines[i].y;
      const height = this._lines[i].height;

      this._ctx.fillStyle = 'white';
      this._ctx.fillRect(x, y, width, height);
      this._ctx.fill();
    }
  }
}
