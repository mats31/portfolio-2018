import * as pages from 'core/pages';
import States from 'core/States';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { createDOM, letterParser } from 'utils/dom';
import { createCanvas, createHexagone, resizeCanvas } from 'utils/canvas';
import { distance2, map } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, toggle, active } from 'core/decorators';
import TimelineTitle from './TimelineTitle';
import template from './timeline.tpl.html';
import './timeline.scss';


@visible()
@active()
@toggle('scrolled', 'scroll', 'unscroll', false)
export default class TimelineView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      title: this._el.querySelector('.js-timeline__title'),
    };

    this._scrollWheelTimeout = null;
    this._page = null;

    this._needsUpdate = false;
    this._firstShow = false;
    this._hideAnimationDone = true;
    this._touched = false;

    this._rotateX = 0;
    this._rotateY = 0;
    this._rotateZ = 0;
    this._currentIndex = null;

    this._width = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    this._height = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    this._timelineRadius = this._width * 0.33;
    this._baseLinesRadius = this._width * 0.37;
    this._endLinesRadius = this._width * 0.4;

    this._type = null;

    this._mouse = {
      x: 0,
      y: 0,
    };

    this._setupTitle();
    this._setupCanvas();
    this._addEvents();
  }

  _setupTitle() {
    this._title = new TimelineTitle({
      el: this._ui.title,
    });

    // this._title.updateTitle(projectList.projects[0].title);
  }

  _setupCanvas() {
    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._ctx.strokeStyle = 'white';
    this._el.appendChild(this._ctx.canvas);
  }

  _addEvents() {
    // this._el.addEventListener('touchstart', this._onTouchstart);
    // this._el.addEventListener('touchmove', this._onTouchmove);
    // this._el.addEventListener('touchend', this._onTouchend);
    Signals.onResize.add(this._onResize);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

  updateState(page) {
    switch (page) {
      case pages.HOME:
        this._updateDatas('project');
        this.activate();
        break;
      case pages.EXPERIMENT:
        this._updateDatas('experiment');
        this.activate();
        break;
      case pages.PROJECT:
        this.deactivate();
        this.hide();
        break;
      default:

    }

    this._page = page;
  }

  _updateDatas(type) {
    const datas = type === 'project' ? projectList.projects : experimentList.experiments;

    this._points = [];
    this._hexagones = [];
    for (let i = 0; i < datas.length; i++) {
      const radius = 0;
      const point = {
        x: Math.cos(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5,
        y: Math.sin(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5,
        radius,
        opacity: 0,
      };

      const hexagone = {
        x: Math.cos(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5,
        y: Math.sin(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5,
        size: 0,
        sizeTarget: 0,
        globalSize: 0,
        opacity: 0,
      };

      this._points.push(point);
      this._hexagones.push(hexagone);
    }

    this._pointsNeedsUpdate = false;
    this._hexagonesNeedsUpdate = false;

    this._nbLines = 150;
    this._lines = [];
    for (let i = 0; i < this._nbLines; i++) {
      const line = {
        x1: Math.cos(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._baseLinesRadius + this._width * 0.5,
        y1: Math.sin(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._baseLinesRadius + this._width * 0.5,
        x2: Math.cos(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._endLinesRadius + this._width * 0.5,
        y2: Math.sin(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._endLinesRadius + this._width * 0.5,
        opacity: 0,
        size: 0,
      };

      this._lines.push(line);
    }
    this._linesNeedsUpdate = false;

    this._timeline = {
      x: this._width * 0.5,
      y: this._height * 0.5,
      progress: 0,
      opacity: 1,
      radius: this._timelineRadius,
    };
    this._timelineNeedsUpdate = false;

    this._type = type;
  }

  show({ delay = 0 } = {}) {
    this._hideAnimationDone = false;
    this._el.style.display = 'block';

    TweenLite.killTweensOf(this._el);
    TweenLite.to(
      this._el,
      0.9,
      {
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this);
    this._orientationNeedsUpdate = true;
    if (!this._firstShow) {
      TweenLite.fromTo(
        this,
        1.75,
        {
          _rotateZ: -50,
        },
        {
          _rotateZ: 0,
          ease: 'Power4.easeOut',
          onComplete: () => {
            this._orientationNeedsUpdate = false;
          },
        },
      );

      this._firstShow = true;
    } else {
      TweenLite.to(
        this,
        1.75,
        {
          _rotateZ: 0,
          ease: 'Power4.easeOut',
          onComplete: () => {
            this._orientationNeedsUpdate = false;
          },
        },
      );
    }

    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      0.5,
      {
        size: 1,
        ease: 'Power4.easeOut',
      },
      0.005,
      () => {
        this._linesNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._points);
    this._pointsNeedsUpdate = true;
    TweenMax.staggerTo(
      this._points,
      1,
      {
        radius: 2,
        ease: 'Power4.easeOut',
      },
      0.29,
      () => {
        this._pointsNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._hexagones);
    this._hexagonesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._hexagones,
      1.5,
      {
        globalSize: 1,
        ease: 'Power4.easeOut',
      },
      0.29,
      () => {
        this._hexagonesNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._timeline);
    this._timelineNeedsUpdate = true;
    TweenMax.to(
      this._timeline,
      1,
      {
        opacity: 1,
        ease: 'Power2.easeOut',
        onComplete: () => {
          this._timelineNeedsUpdate = false;
        },
      },
    );

    this._title.show();
  }

  hide({ delay = 0 } = {}) {

    TweenLite.killTweensOf(this._el);
    TweenLite.to(
      this._el,
      0.9,
      {
        opacity: 0,
        ease: 'Power2.easeOut',
        onUpdate: () => {
          this._needsUpdate = true;
        },
        onComplete: () => {
          this._hideAnimationDone = true;
          this._el.style.display = 'none';
          this._pointsNeedsUpdate = false;
          this._linesNeedsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this);
    this._orientationNeedsUpdate = true;
    TweenLite.to(
      this,
      1.75,
      {
        _rotateZ: -50,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._orientationNeedsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._lines);
    this._linesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._lines,
      0.5,
      {
        size: 0,
        ease: 'Power4.easeOut',
      },
      -0.0025,
      () => {
        this._linesNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._points);
    this._pointsNeedsUpdate = true;
    TweenMax.staggerTo(
      this._points,
      1,
      {
        radius: 0,
        ease: 'Power4.easeOut',
      },
      -0.1,
      () => {
        this._pointsNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._hexagones);
    this._hexagonesNeedsUpdate = true;
    TweenMax.staggerTo(
      this._hexagones,
      1,
      {
        globalSize: 0,
        ease: 'Power4.easeOut',
      },
      -0.1,
      () => {
        this._hexagonesNeedsUpdate = false;
      },
    );

    TweenLite.killTweensOf(this._timeline);
    this._timelineNeedsUpdate = true;
    TweenMax.to(
      this._timeline,
      1,
      {
        opacity: 0,
        ease: 'Power2.easeOut',
        onComplete: () => {
          this._timelineNeedsUpdate = false;
        },
      },
    );

    this._title.hide({
      updateTitle: false,
    });
  }

  scroll() {
    if (this._page !== pages.PROJECT) {
      this.show();
    }
  }

  unscroll() {
    this.hide();
  }

  // Events --------------------------------------------------------------------

  touchstart(event) {
    this._touched = true;

    // this._touchTimeout = setTimeout(() => {
    this.show();
    // }, 300);
  }

  touchmove(event) {
    if (!this._hideAnimationDone) {
      this._orientationNeedsUpdate = true;
    }

    this._mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = -( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
  }

  touchend(event) {
    this._touched = false;

    this.hide();
  }

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    const datas = this._type === 'project' ? projectList.projects : experimentList.experiments;

    if (this._type) {
      this._width = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
      this._height = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
      this._timelineRadius = this._width * 0.33;
      this._baseLinesRadius = this._width * 0.37;
      this._endLinesRadius = this._width * 0.4;

      for (let i = 0; i < datas.length; i++) {
        this._points[i].x = Math.cos(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5;
        this._points[i].y = Math.sin(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5;

        this._hexagones[i].x = Math.cos(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5;
        this._hexagones[i].y = Math.sin(Math.PI * 2 * ( i / datas.length ) - Math.PI * 0.5 ) * this._timelineRadius + this._width * 0.5;
      }

      for (let i = 0; i < this._nbLines; i++) {
        this._lines[i].x1 = Math.cos(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._baseLinesRadius + this._width * 0.5;
        this._lines[i].y1 = Math.sin(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._baseLinesRadius + this._width * 0.5;
        this._lines[i].x2 = Math.cos(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._endLinesRadius + this._width * 0.5;
        this._lines[i].y2 = Math.sin(Math.PI * 2 * ( i / this._nbLines ) - Math.PI * 0.5 ) * this._endLinesRadius + this._width * 0.5;
      }

      this._timeline = {
        x: this._width * 0.5,
        y: this._height * 0.5,
        progress: 0,
        opacity: 0,
        radius: this._timelineRadius,
      };

      resizeCanvas(this._ctx, this._width, this._height, true, 2);

      this._ctx.strokeStyle = 'white';
      this._needsUpdate = true;
    }
  }

  // mousemove(event) {
  //   if (!this._hideAnimationDone) {
  //     this._orientationNeedsUpdate = true;
  //   }
  //
  //   this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  //   this._mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  // }

  @autobind
  _onScrollWheel() {
    this.scroll();

    this._needsUpdate = true;

    clearTimeout(this._scrollWheelTimeout);
    this._scrollWheelTimeout = setTimeout(() => {
      this.unscroll();
    }, 500);
  }

  // Update --------------------------------------------------------------------

  update() {

    if (this._needsUpdate && this.active()) {
      this._ctx.clearRect(0, 0, this._width, this._height);
      this._updateTimeline();
      this._updatePoints();
      this._updateLines();
      this._updateOrientation();
    }

    this._needsUpdate = this._pointsNeedsUpdate ||
                        this._hexagonesNeedsUpdate ||
                        this._linesNeedsUpdate ||
                        this._timelineNeedsUpdate ||
                        this._orientationNeedsUpdate;
  }

  _updateTimeline() {
    const datas = this._type === 'project' ? projectList.projects : experimentList.experiments;
    this._timeline.progress = States.global.progress / datas.length;
    const x = this._timeline.x;
    const y = this._timeline.y;
    const radius = this._timeline.radius;
    const startProgress = Math.PI * -0.5;
    const endProgress = Math.PI * 2 * this._timeline.progress - Math.PI * 0.5;
    this._ctx.beginPath();
    this._ctx.arc(x, y, radius, startProgress, endProgress);
    this._ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * this._timeline.opacity})`;
    this._ctx.lineWidth = 2;
    this._ctx.stroke();
  }

  _updatePoints() {
    const datas = this._type === 'project' ? projectList.projects : experimentList.experiments;

    for (let i = 0; i < this._points.length; i++) {

      // Points ---------------------
      const x = this._points[i].x;
      const y = this._points[i].y;
      const radius = this._points[i].radius;
      this._ctx.beginPath();
      this._ctx.arc(x, y, radius, 0, Math.PI * 2);
      this._ctx.strokeStyle = 'white';
      this._ctx.lineWidth = 2;
      this._ctx.stroke();

      // Hexagones ---------------------

      const progress = this._timeline.progress % (1 - (1 / this._points.length) * 0.5);
      if (progress >= i / this._points.length - (1 / this._points.length) * 0.5 && progress <= (1 / this._points.length) * ( i + 1 ) - (1 / this._points.length) * 0.5 ) {
        this._hexagones[i].sizeTarget = 1;
        if (this.visible()) {
          this._title.updateTitle(datas[i].title);
        }
      } else {
        this._hexagones[i].sizeTarget = 0;
      }

      this._hexagones[i].size += ( this._hexagones[i].sizeTarget - this._hexagones[i].size ) * 0.2;

      createHexagone({
        x,
        y,
        size: 10 * this._hexagones[i].size * this._hexagones[i].globalSize,
        strokeColor: 'white',
        rotation: Math.PI * 2 * ( i / datas.length ) + Math.PI * 0.5,
        context: this._ctx,
      });
    }
  }

  _updateLines() {

    for (let i = 0; i < this._lines.length; i++) {
      const distanceToPoint = distance2({
        x: this._lines[i].x1,
        y: this._lines[i].y1,
      }, {
        x: this._timeline.x + this._timeline.radius * Math.cos(Math.PI * 2 * this._timeline.progress - Math.PI * 0.5),
        y: this._timeline.y + this._timeline.radius * Math.sin(Math.PI * 2 * this._timeline.progress - Math.PI * 0.5),
      });
      const scaleFactor = map( Math.max(0, Math.abs(distanceToPoint - this._width) ), 100, this._width, 0, 0.8 );

      const x1 = this._lines[i].x1;
      const y1 = this._lines[i].y1;

      const x2 = map(this._lines[i].size, 0, 1 - scaleFactor, this._lines[i].x1, this._lines[i].x2);
      const y2 = map(this._lines[i].size, 0, 1 - scaleFactor, this._lines[i].y1, this._lines[i].y2);

      this._ctx.beginPath();
      this._ctx.moveTo(x1, y1);
      this._ctx.lineTo(x2, y2);
      this._ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this._ctx.stroke();
    }
  }

  _updateOrientation() {
    this._rotateX = this._mouse.y * 30;
    this._rotateY = this._mouse.x * 30;

    this._ctx.canvas.style.webkitTransform = `rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._ctx.canvas.style.MozTransform = `rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._ctx.canvas.style.msTransform = `rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._ctx.canvas.style.OTransform = `rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._ctx.canvas.style.transform = `rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;

    // this._el.style.webkitTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.MozTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.msTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.OTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.transform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
  }
}
