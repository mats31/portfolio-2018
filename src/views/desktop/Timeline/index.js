import States from 'core/States';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { createCanvas, createHexagone, resizeCanvas } from 'utils/canvas';
import { map } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, toggle } from 'core/decorators';
import template from './timeline.tpl.html';
import './timeline.scss';


@visible()
@toggle('scrolled', 'scroll', 'unscroll', false)
export default class TimelineView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._scrollWheelTimeout = null;

    this._needsUpdate = false;
    this._firstShow = false;
    this._hideAnimationDone = true;

    this._rotateX = 0;
    this._rotateY = 0;
    this._rotateZ = 0;

    this._width = window.innerWidth * 0.5;
    this._height = window.innerWidth * 0.5;
    this._timelineRadius = this._width * 0.42;
    this._baseLinesRadius = this._width * 0.46;
    this._endLinesRadius = this._width * 0.49;

    this._mouse = {
      x: 0,
      y: 0,
    };

    this._points = [];
    this._hexagones = [];
    for (let i = 0; i < projectList.projects.length; i++) {
      const radius = 0;
      const point = {
        x: Math.cos(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5,
        y: Math.sin(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5,
        radius,
        opacity: 0,
      };

      const hexagone = {
        x: Math.cos(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5,
        y: Math.sin(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5,
        size: 0,
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

    this._setupCanvas();
    this._addEvents();
  }

  _setupCanvas() {
    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._ctx.strokeStyle = 'white';
    this._el.appendChild(this._ctx.canvas);
  }

  _addEvents() {
    // this._el.addEventListener('mousemove', this._onMousemove);
    Signals.onResize.add(this._onResize);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

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
  }

  hide({ delay = 0 } = {}) {

    TweenLite.killTweensOf(this._el);
    TweenLite.to(
      this._el,
      0.9,
      {
        opacity: 1,
        ease: 'Power2.easeOut',
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
  }

  scroll() {
    this.show();
  }

  unscroll() {
    this.hide();
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._width = vw * 0.5;
    this._height = vw * 0.5;
    this._timelineRadius = this._width * 0.42;
    this._baseLinesRadius = this._width * 0.46;
    this._endLinesRadius = this._width * 0.49;

    for (let i = 0; i < projectList.projects.length; i++) {
      this._points[i].x = Math.cos(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5;
      this._points[i].y = Math.sin(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5;

      this._hexagones[i].x = Math.cos(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5;
      this._hexagones[i].y = Math.sin(Math.PI * 2 * ( i / projectList.projects.length ) ) * this._timelineRadius + this._width * 0.5;
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

  mousemove(event) {
    if (!this._hideAnimationDone) {
      this._orientationNeedsUpdate = true;
    }

    this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  }

  @autobind
  _onScrollWheel() {
    this.scroll();

    this._needsUpdate = true;

    clearTimeout(this._scrollWheelTimeout);
    this._scrollWheelTimeout = setTimeout(() => {
      this.unscroll();
    }, 100);
  }

  // Update --------------------------------------------------------------------

  update() {

    if (this._needsUpdate) {
      console.log(1);
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
    this._timeline.progress = States.global.progress / projectList.projects.length;
    const x = this._timeline.x;
    const y = this._timeline.y;
    const radius = this._timeline.radius;
    const startProgress = Math.PI * -0.5;
    const endProgress = Math.PI * 2 * this._timeline.progress - Math.PI * 0.5;
    this._ctx.beginPath();
    this._ctx.arc(x, y, radius, startProgress, endProgress);
    this._ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * this._timeline.opacity})`;
    this._ctx.lineWidth = 1;
    this._ctx.stroke();
  }

  _updatePoints() {
    for (let i = 0; i < this._points.length; i++) {
      const x = this._points[i].x;
      const y = this._points[i].y;
      const radius = this._points[i].radius;
      this._ctx.beginPath();
      this._ctx.arc(x, y, radius, 0, Math.PI * 2);
      this._ctx.strokeStyle = 'white';
      this._ctx.lineWidth = 1;
      this._ctx.stroke();

      createHexagone({
        x,
        y,
        size: 10 * this._hexagones[i].size,
        strokeColor: 'white',
        rotation: Math.PI * 2 * ( i / projectList.projects.length ) + Math.PI * 0.5,
        context: this._ctx,
      });
    }
  }

  _updateLines() {
    for (let i = 0; i < this._lines.length; i++) {
      const x1 = this._lines[i].x1;
      const y1 = this._lines[i].y1;
      const x2 = map(this._lines[i].size, 0, 1, this._lines[i].x1, this._lines[i].x2);
      const y2 = map(this._lines[i].size, 0, 1, this._lines[i].y1, this._lines[i].y2);

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

    this._el.style.webkitTransform = `translate3d(-50%, -50%, 0) rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._el.style.MozTransform = `translate3d(-50%, -50%, 0) rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._el.style.msTransform = `translate3d(-50%, -50%, 0) rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._el.style.OTransform = `translate3d(-50%, -50%, 0) rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;
    this._el.style.transform = `translate3d(-50%, -50%, 0) rotateX(${this._rotateX}deg) rotateY(${this._rotateY}deg) rotateZ(${this._rotateZ}deg)`;

    // this._el.style.webkitTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.MozTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.msTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.OTransform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
    // this._el.style.transform = `translate3d(-50%, -50%, 0) rotateZ(${this._rotateZ}deg)`;
  }
}
