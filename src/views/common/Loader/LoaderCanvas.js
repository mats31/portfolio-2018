import { createCanvas, resizeCanvas } from 'utils/canvas';

export default class LoaderCanvas {
  constructor(options) {
    this._parent = options.parent;

    this._width = 200;
    this._height = 200;
    this._nbLines = 30;
    this._progress = 0;
    this._currentRotation = 0;

    this.needsUpdate = false;

    this._setupCanvas();
  }

  _setupCanvas() {
    this._lines = [];
    this._lineNeedsUpdate = false;

    for (let i = 0; i < this._nbLines; i++) {
      const line = {
        x1: Math.cos( Math.PI * 2 * ( i / this._nbLines ) ) * this._width * 0.4 + this._width * 0.5,
        y1: Math.sin( Math.PI * 2 * ( i / this._nbLines ) ) * this._height * 0.4 + this._height * 0.5,
        x2: Math.cos( Math.PI * 2 * ( i / this._nbLines ) ) * this._width * 0.5 + this._width * 0.5,
        y2: Math.sin( Math.PI * 2 * ( i / this._nbLines ) ) * this._height * 0.5 + this._height * 0.5,
      };

      this._lines.push(line);
    }

    this._orientationNeedsUpdate = false;

    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._ctx.strokeStyle = 'white';
    this._parent.appendChild(this._ctx.canvas);
  }

  // State ---------------

  // Update --------------

  update() {
    if (this.needsUpdate) {
      this._ctx.clearRect(0, 0, this._width, this._height);

      this._updateOrientation();
      this._updateLines();

      // this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.needsUpdate = this._lineNeedsUpdate || this._orientationNeedsUpdate;
  }

  _updateOrientation() {
    const target = this._progress * 180;
    this._currentRotation += ( target - this._currentRotation ) * 0.05;

    this._ctx.canvas.style.transform = `rotate3d(0,0,1,${this._currentRotation}deg)`;
    this._ctx.canvas.style.OTransform = `rotate3d(0,0,1,${this._currentRotation}deg)`;
    this._ctx.canvas.style.msTransform = `rotate3d(0,0,1,${this._currentRotation}deg)`;
    this._ctx.canvas.style.MozTransform = `rotate3d(0,0,1,${this._currentRotation}deg)`;
    this._ctx.canvas.style.webkitTransform = `rotate3d(0,0,1,${this._currentRotation}deg)`;

    if (Math.abs(target - this._currentRotation) < 0.1) {
      this._orientationNeedsUpdate = false;
    }
  }

  _updateLines() {
    for (let i = 0; i < this._lines.length * this._progress; i++) {
      this._ctx.beginPath();
      this._ctx.moveTo(this._lines[i].x1, this._lines[i].y1);
      this._ctx.lineTo(this._lines[i].x2, this._lines[i].y2);
      this._ctx.stroke();
    }

    this._lineNeedsUpdate = false;
  }

  updateValue(value) {
    this._progress = value;
    this._lineNeedsUpdate = true;
    this._orientationNeedsUpdate = true;
  }
}
