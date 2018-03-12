import * as pages from 'core/pages';
import States from 'core/States';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { createDOM, letterParser } from 'utils/dom';
import { createCanvas, createHexagone, resizeCanvas } from 'utils/canvas';
import { distance2, map } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, toggle } from 'core/decorators';
import template from './timeline.tpl.html';
import './timeline.scss';


@visible()
export default class MobileTimelineView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._needsUpdate = false;
    this._type = null;

    this._width = window.innerWidth * 0.2;
    this._height = window.innerHeight;

    this._mouse = {
      x: 0,
      y: 0,
    };

    this._setupCanvas();
    this._addEvents();
  }

  _setupCanvas() {
    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._ctx.strokeStyle = 'white';
    this._ctx.fillStyle = 'white';
    this._el.appendChild(this._ctx.canvas);
  }

  _addEvents() {
    this._el.addEventListener('touchstart', this._onTouchstart);
    this._el.addEventListener('touchmove', this._onTouchmove);
    this._el.addEventListener('touchend', this._onTouchend);
    this._el.addEventListener('touchleave', this._onTouchleave);
    Signals.onResize.add(this._onResize);
  }

  // State ---------------------------------------------------------------------

  updateState(page) {
    switch (page) {
      case pages.HOME:
        this._updateDatas('project');
        break;
      case pages.EXPERIMENT:
        this._updateDatas('experiment');
        break;
      case pages.PROJECT:
        // this.hide();
        break;
      default:

    }

    this._page = page;
  }

  _updateDatas(type) {
    const datas = type === 'project' ? projectList.projects : experimentList.experiments;

    this._point = {
      x: this._width * 0.5,
      y: this._height * 0.1,
      radius: 0,
      needsUpdate: false,
    };

    this._line = {
      x1: this._width * 0.5,
      y1: this._height * 0.1,
      x2: this._width * 0.5,
      y2: this._height - this._height * 0.1,
      progress: 0,
      needsUpdate: false,
    };

    this._type = type;
  }

  show({ delay = 0 } = {}) {
    TweenLite.killTweensOf(this._point);
    this._point.needsUpdate = true;
    TweenLite.to(
      this._point,
      1,
      {
        radius: 5,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._point.needsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._line);
    this._line.needsUpdate = true;
    TweenLite.to(
      this._line,
      1.5,
      {
        progress: 1,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._line.needsUpdate = false;
        },
      },
    );
  }

  hide({ delay = 0 } = {}) {
    TweenLite.killTweensOf(this._point);
    this._point.needsUpdate = true;
    TweenLite.to(
      this._point,
      1,
      {
        radius: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._point.needsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._line);
    this._line.needsUpdate = true;
    TweenLite.to(
      this._line,
      1.5,
      {
        progress: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._line.needsUpdate = false;
        },
      },
    );
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    // const datas = this._type === 'project' ? projectList.projects : experimentList.experiments;

    if (this._type) {
      this._width = window.innerWidth * 0.2;
      this._height = window.innerHeight;

      this._point.x = this._width * 0.5;

      this._line.x1 = this._width * 0.5;
      this._line.y1 = 0;
      this._line.x2 = this._width * 0.5;
      this._line.y2 = this._height;

      this._ctx.strokeStyle = 'white';
      this._ctx.fillStyle = 'white';
      this._ctx.lineWidth = 2;
      this._needsUpdate = true;
    }
  }

  @autobind
  _onTouchstart() {
    console.log('show');
    this.show();
  }

  @autobind
  _onTouchmove(event) {
    this._mouse.x = event.touches[0].clientX;
    this._mouse.y = event.touches[0].clientY;
  }

  @autobind
  _onTouchend() {
    // this.hide();
  }

  @autobind
  _onTouchleave() {
    // this.hide();
  }

  // Update --------------------------------------------------------------------

  update() {

    if (this._type) {
      if (this._needsUpdate) {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._updatePoint();
        this._updateLine();
        // this._updateLines();
        // this._updateOrientation();
      }

      this._needsUpdate = this._point.needsUpdate ||
                          this._line.needsUpdate;
    }
  }

  _updatePoint() {
    // Points ---------------------
    const radius = this._point.radius;
    const x = this._point.x;
    const y = this._point.y;
    this._ctx.beginPath();
    this._ctx.arc(x, y, radius, 0, Math.PI * 2);
    this._ctx.fill();
  }

  _updateLine() {
    const x1 = this._line.x1;
    const y1 = this._line.y1;

    const x2 = map(this._line.progress, 0, 1, this._line.x1, this._line.x2);
    const y2 = map(this._line.progress, 0, 1, this._line.y1, this._line.y2);

    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.stroke();
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
