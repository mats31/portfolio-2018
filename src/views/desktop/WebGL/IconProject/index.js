import projectList from 'config/project-list';
import States from 'core/States';
import * as pages from 'core/pages';
import { createCanvas, resizeCanvas } from 'utils/canvas';
import { visible, focused } from 'core/decorators';

@visible()
@focused()
export default class IconProject {
  constructor(options) {
    this._parent = options.parent;

    this._width = 50;
    this._height = 50;

    this.needsUpdate = false;

    this._setupCanvas();
    this._setupShapes();
  }

  _setupCanvas() {
    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._ctx.canvas.style.position = 'absolute';
    this._ctx.canvas.style.top = '0';
    this._ctx.canvas.style.left = '0';
    this._ctx.canvas.style.zIndex = 99999;
    this._ctx.canvas.style.display = 'none';
    this._parent.appendChild(this._ctx.canvas);

    this._ctx.strokeStyle = 'white';
    this._ctx.lineWidth = '2';
  }

  _setupShapes() {
    this._circle = {
      x: this._width * 0.5,
      y: this._height * 0.5,
      progress: 0,
      needsUpdate: false,
    };
  }

  // State --------

  show() {
    this._ctx.canvas.style.display = 'block';
  }

  hide() {
    this._ctx.canvas.style.display = 'none';

    this.blur();

    this._circle.progress = 0;
  }

  focus() {
    this.show();

    this._circle.needsUpdate = true;
    TweenLite.killTweensOf(this._circle);
    TweenLite.to(
      this._circle,
      2,
      {
        progress: 1,
        onComplete: () => {
          const id = projectList.projects[Math.floor(States.global.progress)].id;
          States.router.navigateTo(pages.PROJECT, { id });

          this._circle.needsUpdate = false;
          this.hide();
        },
      },
    );
  }

  blur() {
    this._circle.needsUpdate = true;
    TweenLite.killTweensOf(this._circle);
    TweenLite.to(
      this._circle,
      1,
      {
        progress: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._circle.needsUpdate = false;
          this.hide();
        },
      },
    );
  }
  // Events -------

  mousemove(event) {
    const x = event.clientX - this._width * 0.5;
    const y = event.clientY - this._height * 0.5;

    this._ctx.canvas.style.webkitTransform = `translate3d(${x}px, ${y}px, 0)`;
    this._ctx.canvas.style.MozTransform = `translate3d(${x}px, ${y}px, 0)`;
    this._ctx.canvas.style.msTransform = `translate3d(${x}px, ${y}px, 0)`;
    this._ctx.canvas.style.OTransform = `translate3d(${x}px, ${y}px, 0)`;
    this._ctx.canvas.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  // Update -------

  update() {

    this._ctx.clearRect(0, 0, this._width, this._height);

    if (this.needsUpdate) {
      this._updateCircle();
    }

    this.needsUpdate = this._circle.needsUpdate;
  }

  _updateCircle() {
    const x = this._circle.x;
    const y = this._circle.y;
    const radius = this._width * 0.45;
    const progress = this._circle.progress;

    this._ctx.beginPath();
    this._ctx.arc(x, y, radius, 0, 2 * Math.PI * progress);
    this._ctx.stroke();
  }
}
