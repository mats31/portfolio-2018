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


@visible(true)
@focused()
export default class DesktopListView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._mouse = new THREE.Vector2();

    this._lines = [];
    this._items = [];
    this._points = [];

    this._nbLines = 40;
    this._width = 50;
    this._height = this._nbLines * 10;

    this.needsUpdate = false;
    this._linesNeedsUpdate = false;
    this._pointsNeedsUpdate = false;
    this._itemsNeedsUpdate = false;

    this._ui = {
      itemContainer: this._el.querySelector('.js-UIHome__itemContainer'),
      listLabel: this._el.querySelector('.js-UIHome__listLabel'),
    };

    this._setupCanvas();

    this._addEvents();
  }

  _setupCanvas() {
    const width = 50;
    const extraWidth = 100;
    const x = this._width;

    this._mainLine = {
      x: 0,
      y: 0,
      height: 0,
      width: 1,
      progressHeight: 0,
      needsUpdate: false,
    };

    this._firstPoint = {
      x: 0,
      y: 0,
      radius: 0,
      progressFill: 0,
      needsUpdate: false,
    };

    for (let i = 0; i <= this._nbLines; i++) {
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
    this._ui.listLabel.addEventListener('mouseenter', this._onListMouseenter);
    this._el.addEventListener('mousemove', this._onMousemove);
    this._el.addEventListener('mouseleave', this._onMouseleave);
    Signals.onResize.add(this._onResize);
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    console.log('hide');
    this._el.style.display = 'none';
  }

  focus() {
    this._focusAnimationDone = false;
    this._el.style.pointerEvents = 'auto';

    TweenLite.killTweensOf(this._ui.listLabel);
    TweenLite.to(
      this._ui.listLabel,
      0.5,
      {
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this._firstPoint);
    this._firstPoint.needsUpdate = true;
    TweenLite.to(
      this._firstPoint,
      0.8,
      {
        progressFill: 1,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._firstPoint.needsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._mainLine);
    this._mainLine.needsUpdate = true;
    TweenMax.to(
      this._mainLine,
      1,
      {
        delay: 0.2,
        progressHeight: 1,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._mainLine.needsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      0.5,
      {
        delay: 0.3,
        progressWidth: 1,
        ease: 'Power4.easeOut',
      },
      0.01,
      () => {
        this._linesNeedsUpdate = false;
        this._focusAnimationDone = true;
      },
    );

    TweenLite.killTweensOf(this._points);
    this._pointsNeedsUpdate = true;
    TweenMax.staggerTo(
      this._points,
      0.9,
      {
        delay: 0.4,
        progressRadius: 1,
        ease: 'Power4.easeOut',
      },
      0.05,
      () => {
        this._pointsNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._itemsAnim);
    this._itemsNeedsUpdate = true;
    TweenMax.staggerTo(
      this._itemsAnim,
      1,
      {
        baseAlpha: 0.2,
        ease: 'Power2.easeOut',
      },
      0.1,
      () => {
        this._itemsNeedsUpdate = false;
      },
    );
  }

  blur() {
    this._el.style.pointerEvents = 'none';

    TweenLite.killTweensOf(this._ui.listLabel);
    TweenLite.to(
      this._ui.listLabel,
      0.5,
      {
        opacity: 0.5,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this._itemsAnim);
    this._itemsNeedsUpdate = true;
    TweenMax.staggerTo(
      this._itemsAnim,
      0.4,
      {
        baseAlpha: 0,
        extraAlpha: 0,
        currentAlpha: 0,
        ease: 'Power2.easeOut',
      },
      -0.1,
      () => {
        this._itemsNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._points);
    this._pointsNeedsUpdate = true;
    TweenMax.staggerTo(
      this._points,
      0.4,
      {
        progressRadius: 0,
        ease: 'Power4.easeOut',
      },
      -0.1,
      () => {
        this._pointsNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      0.3,
      {
        progressWidth: 0,
        progressExtraWidth: 0,
        currentExtraWidth: 0,
        ease: 'Power4.easeOut',
      },
      -0.01,
      () => {
        this._linesNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._mainLine);
    this._mainLine.needsUpdate = true;
    TweenMax.to(
      this._mainLine,
      0.8,
      {
        delay: 0.2,
        progressHeight: 0,
        ease: 'Expo.easeOut',
        onComplete: () => {
          this._mainLine.needsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._firstPoint);
    this._firstPoint.needsUpdate = true;
    TweenLite.to(
      this._firstPoint,
      0.4,
      {
        delay: 0.85,
        progressFill: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._firstPoint.needsUpdate = false;
        },
      },
    );
  }

  updateState(page) {
    if (page === pages.HOME || page === pages.EXPERIMENT) {
      this._fillContent(page);
    } else if (page === pages.PROJECT) {
      this._fillContent(pages.HOME);
    }
  }

  _fillContent(page) {

    this._items = [];
    this._itemsAnim = [];
    this._points = [];

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
        div.setAttribute('data-id', project.id);
        this._items.push(div);
        this._itemsAnim.push({
          baseAlpha: 0,
          extraAlpha: 0,
          currentAlpha: 0,
          currentColor: 0,
        });

        div.addEventListener('click', this._onProjectItemClick);

        this._ui.itemContainer.appendChild(div);

        const point = {
          x: 0,
          y: 0,
          radius: 0,
          extraRadius: 0,
          progressRadius: 0,
          progressExtraRadius: 0,
        };

        this._points.push(point);
      }
    } else if (page === pages.EXPERIMENT) {
      for (let i = 0; i < experimentList.experiments.length; i++) {
        const experiment = experimentList.experiments[i];

        const div = document.createElement('div');
        div.classList.add('js-UIHome__item');
        div.classList.add('UIHome__item');
        div.innerHTML = experiment.title;
        div.setAttribute('data-id', experiment.id);
        this._items.push(div);
        this._itemsAnim.push({
          baseAlpha: 0,
          extraAlpha: 0,
          currentAlpha: 0,
          currentColor: 0,
        });

        div.addEventListener('click', this._onExperimentItemClick);

        this._ui.itemContainer.appendChild(div);

        const point = {
          x: 0,
          y: 0,
          radius: 0,
          progressRadius: 0,
        };

        this._points.push(point);
      }
    }

    this.resize();
  }

  // Events ------------------------------------

  @autobind
  _onProjectItemClick(event) {
    for (let i = 0; i < projectList.projects.length; i++) {
      if (projectList.projects[i].id === event.target.getAttribute('data-id')) {
        States.router.navigateTo(pages.PROJECT, { id: projectList.projects[i].id });
      }
    }
  }

  @autobind
  _onExperimentItemClick(event) {
    for (let i = 0; i < experimentList.experiments.length; i++) {
      if (experimentList.experiments[i].id === event.target.getAttribute('data-id')) {
        window.open(experimentList.experiments[i].url, '_blank');
      }
    }
  }

  @autobind
  _onListMouseenter() {
    this.focus();
  }

  @autobind
  _onMousemove(event) {
    this._mouse.x = event.clientX;
    this._mouse.y = event.clientY;

    this.needsUpdate = true;
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
    this._elWidth = window.innerWidth * 0.3;
    this._elHeight = window.innerHeight;
    this._canvasTop = this._ctx.canvas.getBoundingClientRect().top;

    const heightMargin = window.innerHeight * 0.1;
    this._height = this._elHeight * 0.5 + heightMargin;

    const width = window.innerWidth - this._ui.listLabel.getBoundingClientRect().left + 30;
    const linesWidth = width * 0.4;
    const extraWidth = width * 0.4;
    this._extraMainLineWidth = window.innerWidth * 0.03;
    // this._width = width + extraWidth + this._extraMainLineWidth;
    this._width = width;
    const x = this._width;
    this._basePointRadius = 3;

    for (let i = 0; i <= this._nbLines; i++) {
      const y = (i / this._nbLines) * ( this._height - this._basePointRadius * 2 ) + heightMargin;

      this._lines[i].x = x;
      this._lines[i].y = y;
      this._lines[i].width = linesWidth;
      this._lines[i].extraWidth = extraWidth;
      this._lines[i].height = 1;
    }

    this._mainLine.x = this._width * 0.1;
    this._mainLine.y = this._basePointRadius * 4;
    this._mainLine.height = this._height - this._basePointRadius - this._basePointRadius * 4;
    this._mainLine.width = 1;

    this._firstPoint.x = this._width * 0.1;
    this._firstPoint.y = this._basePointRadius * 2;

    for (let i = 0; i < this._points.length; i++) {
      this._points[i].x = this._width * 0.1;
      this._points[i].radius = this._basePointRadius;
      this._points[i].extraRadius = this._basePointRadius;
      this._points[i].y = ( i / ( this._points.length - 1 ) ) * (this._height - heightMargin - this._points[i].radius - this._points[i].extraRadius) + heightMargin;
    }


    resizeCanvas(this._ctx, this._width, this._height, true, 2);
    this._ctx.strokeStyle = 'white';
    this._ctx.fillStyle = 'white';

    this._el.style.width = `${this._elWidth}px`;
    this._el.style.height = `${this._elHeight}px`;

    const customHeight = this._points.length > 0 ? this._points[this._points.length - 1].y - this._points[0].y : 0;
    for (let i = 0; i < this._items.length; i++) {
      const top = ( i / ( this._items.length - 1 ) ) * customHeight + this._points[0].y + this._canvasTop;
      const right = this._width + window.innerWidth * 0.05;
      // const right = this._width + window.innerWidth * 0.025;
      this._items[i].style.right = `${right}px`;
      this._items[i].style.top = `${top}px`;
    }

    // this._ui.listLabel.style.top = `${this._ctx.canvas.getBoundingClientRect().top - this._ui.listLabel.offsetHeight * 0.3}px`;
    // this._ui.listLabel.style.right = `${this._width - this._ui.listLabel.offsetWidth - this._width * 0.215}px`;
  }

  // Update ------------------------------------

  update() {
    if (this.needsUpdate) {
      this._ctx.clearRect( 0, 0, this._width, this._height );
      this._updateLines();
      this._updateMainLine();
      this._updateFirstPoint();
      this._updatePoints();
      this._updateTitles();
    }

    this.needsUpdate = this._linesNeedsUpdate || this._mainLine.needsUpdate || this._firstPoint.needsUpdate || this._pointsNeedsUpdate || this._itemsNeedsUpdate;
  }

  _updateLines() {
    for (let i = 0; i < this._lines.length; i++) {

      // if (this.focused()) {
        // const relativeLinePointX = window.innerWidth - this._lines[i].x;
        const relativeLinePointY = this._lines[i].y + this._canvasTop;

        // const linePoint = { x: relativeLinePointX, y: relativeLinePointY };
        // this._lines[i].progressExtraWidth = map( Math.min(this._elWidth, distance2( this._mouse, linePoint ) ), 0, this._elWidth, 1, 0 );
        this._lines[i].progressExtraWidth = map( Math.min(window.innerHeight * 0.1, Math.abs(relativeLinePointY - this._mouse.y) ), 0, window.innerHeight * 0.1, 1, 0 ) * this._lines[i].progressWidth;
      // }

      this._lines[i].currentExtraWidth += ( this._lines[i].progressExtraWidth - this._lines[i].currentExtraWidth ) * 0.1;

      const width = this._lines[i].width * this._lines[i].progressWidth + this._lines[i].extraWidth * this._lines[i].currentExtraWidth;
      const x = this._lines[i].x - width;
      const y = this._lines[i].y;
      const height = this._lines[i].height;

      this._ctx.beginPath();
      this._ctx.fillRect(x, y, width, height);
      this._ctx.fill();
      this._ctx.closePath();
    }
  }

  _updateMainLine() {
    const x = this._mainLine.x;
    const y = this._mainLine.y;
    const width = this._mainLine.width;
    const height = this._mainLine.height * this._mainLine.progressHeight;

    this._ctx.beginPath();
    this._ctx.fillRect(x, y, width, height);
    this._ctx.closePath();
  }

  _updateFirstPoint() {
    const x = this._firstPoint.x;
    const y = this._firstPoint.y;
    const radius = this._basePointRadius * 2;
    const length = Math.PI * 2 * this._firstPoint.progressFill;

    this._ctx.beginPath();
    this._ctx.arc(x, y, radius, 0, length, false);
    this._ctx.fill();
    this._ctx.closePath();
  }

  _updatePoints() {
    for (let i = 0; i < this._points.length; i++) {

      // if (this.focused()) {
        // const relativePointX = window.innerWidth - this._points[i].x;
        const relativePointY = this._points[i].y + this._canvasTop;

        // const relativePoint = { x: relativePointX, y: relativePointY };
        // this._points[i].progressExtraRadius = map( Math.min(this._elWidth, distance2( this._mouse, relativePoint ) ), 0, this._elWidth, 1, 0 );
        this._points[i].progressExtraRadius = map( Math.min(window.innerHeight * 0.1, Math.abs( this._mouse.y - relativePointY ) ), 0, window.innerHeight * 0.1, 1, 0 ) * this._points[i].progressRadius;
      // }

      const x = this._points[i].x;
      const y = this._points[i].y;
      const radius = this._points[i].radius * this._points[i].progressRadius + this._points[i].extraRadius * this._points[i].progressExtraRadius;

      this._ctx.beginPath();
      // this._ctx.strokeStyle = 'white';
      this._ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      this._ctx.fill();
      this._ctx.closePath();
    }
  }

  _updateTitles() {
    for (let i = 0; i < this._items.length; i++) {
      const relativePointY = this._items[i].getBoundingClientRect().top + this._items[i].offsetHeight * 0.5;
      const distance = Math.abs( this._mouse.y - relativePointY );
      const scale = map( Math.min(window.innerHeight * 0.2, distance ), 0, window.innerHeight * 0.2, 1.3, 1 );
      if (this.focused()) {
        this._itemsAnim[i].extraAlpha = map( Math.min(window.innerHeight * 0.3, distance ), 0, window.innerHeight * 0.3, 0.8, 0 );
        this._itemsAnim[i].currentColor = map( Math.min(window.innerHeight * 0.1, distance ), 0, window.innerHeight * 0.1, 255, 0 );
      }

      this._itemsAnim[i].currentAlpha += ( this._itemsAnim[i].extraAlpha - this._itemsAnim[i].currentAlpha ) * 0.05;

      // this._items[i].style.transform = `translate3d(0, -50%, 0) scale(${scale})`;
      this._items[i].style.opacity = this._itemsAnim[i].baseAlpha + this._itemsAnim[i].currentAlpha;
      this._items[i].style.color = `rgba(${this._itemsAnim[i].currentColor},${this._itemsAnim[i].currentColor},${this._itemsAnim[i].currentColor},1)`;
    }
  }
}
