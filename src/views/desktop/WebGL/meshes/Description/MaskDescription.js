import { active } from 'core/decorators';
import { createCanvas } from 'utils/canvas';
import { randomFloat } from 'utils/math';

const DEBUG = false;

@active()
export default class MaskDescription {
  constructor() {
    this._width = 256;
    this._height = 100;
    // this._pixelSize = 6;
    this._pixelWidth = 15;
    this._pixelHeight = 25;

    this.needsUpdate = false;

    this._dpi = Math.min( 2, window.devicePixelRatio );

    this._setupCanvas();

    if (DEBUG) {
      this._ctx.canvas.style.position = 'absolute';
      this._ctx.canvas.style.left = '0';
      this._ctx.canvas.style.top = '0';
      this._ctx.canvas.style.zIndex = '9999';
      document.body.appendChild(this._ctx.canvas);
    }
  }

  _setupCanvas() {
    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._ctx.fillStyle = 'white';

    this._points = [];
    this._pointsNeedsUpdate = false;
    for (let i = 0; i < this._width; i += this._pixelWidth) {

      for (let j = 0; j < this._height; j += this._pixelHeight) {
        const point = {
          x: i,
          y: j,
          width: 0,
          height: 0,
          color: randomFloat(-1, 1) >= 0 ? 'red' : 'green',
        };

        this._points.push(point);
      }
    }
  }

  // Getters ---------------------

  getTexture() {
    return this._ctx.canvas;
  }

  // State ----------------------

  activate() {
    this._pointsNeedsUpdate = true;

    for (let i = 0; i < this._points.length; i++) {
      TweenLite.killTweensOf(this._points[i]);
      TweenLite.to(
        this._points[i],
        1,
        {
          ease: 'Power4.easeOut',
          width: this._pixelWidth,
          height: this._pixelHeight,
          delay: randomFloat(0, 0.6),
        },
      );
    }
  }

  deactivate() {
    this._pointsNeedsUpdate = true;

    for (let i = 0; i < this._points.length; i++) {
      TweenLite.killTweensOf(this._points[i]);
      TweenLite.to(
        this._points[i],
        0.4,
        {
          ease: 'Power4.easeOut',
          width: 0,
          height: 0,
          delay: randomFloat(0, 0.2),
        },
      );
    }
  }

  focus() {
    const shuffled = this._points.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(this._points.length * 0.5));

    for (let i = 0; i < selected.length; i++) {
      TweenLite.killTweensOf(selected[i]);
      selected[i].width = 0;
      selected[i].height = 0;
      TweenLite.to(
        selected[i],
        0.5,
        {
          ease: 'Power4.easeOut',
          width: this._pixelWidth,
          height: this._pixelHeight,
          delay: randomFloat(0, 0.3),
        },
      );
    }
  }

  blur() {

  }

  // Update ----------------------

  update() {
    if (this.needsUpdate) {
      this._ctx.clearRect(0, 0, this._width, this._height);

      this._pointsNeedsUpdate = false;

      for (let i = 0; i < this._points.length; i++) {
        const x = this._points[i].x - this._points[i].width * 0.5;
        const y = this._points[i].y - this._points[i].height * 0.5;

        if ( this._points[i].width !== this._pixelWidth ||
          this._points[i].height !== this._pixelHeight ||
          this._points[i].width !== 0 ||
          this._points[i].height !== 0 ) {
          this._pointsNeedsUpdate = true;
        }

        // this._ctx.fillStyle = this._points[i].color;
        this._ctx.fillRect(x, y, this._points[i].width, this._points[i].height);
      }
    }

    this.needsUpdate = this._pointsNeedsUpdate;
  }
}
