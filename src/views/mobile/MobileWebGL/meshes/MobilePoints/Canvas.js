import States from 'core/States';
import { createCanvas } from 'utils/canvas';

const DEBUG = false;

export default class Canvas {
  constructor() {
    this._width = 512;
    this._height = 512;

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

    this._radialImg = States.resources.getImage('radial_cloud').media;
  }

  getDataImage(img) {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._ctx.beginPath();
    this._ctx.drawImage(img, 0, 0, this._width / this._dpi, this._height / this._dpi);
    this._ctx.closePath();

    const imgData = this._ctx.getImageData(0, 0, this._width, this._height);
    const iData = imgData.data;
    const length = this._width * this._height;
    const datas = new Float32Array(length * 4);
    for (let i = 0, i4 = 0; i < length; i++, i4 += 4) {
      datas[i4] = iData[i4];
      datas[i4 + 1] = iData[i4 + 1];
      datas[i4 + 2] = iData[i4 + 2];
      datas[i4 + 3] = iData[i4 + 3];
    }

    return datas;
  }

  getRadialImage() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._ctx.beginPath();
    this._ctx.drawImage(this._radialImg, 0, 0, this._width / this._dpi, this._height / this._dpi);
    this._ctx.closePath();

    const imgData = this._ctx.getImageData(0, 0, this._width, this._height);
    const iData = imgData.data;
    const length = this._width * this._height;
    const datas = new Float32Array(length * 4);
    for (let i = 0, i4 = 0; i < length; i++, i4 += 4) {
      datas[i4] = iData[i4];
      datas[i4 + 1] = iData[i4 + 1];
      datas[i4 + 2] = iData[i4 + 2];
      datas[i4 + 3] = iData[i4 + 3];
    }

    return datas;
  }

  // Update --------------------
  update() {
    // this._updateCurrentImg();
    // this._updateNextImg();
  }

  _updateCurrentImg() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._ctx.beginPath();
    this._ctx.drawImage(this._currentImg.img, 0, 0, this._width / this._dpi, this._height / this._dpi, 0, 0, this._width / this._dpi, this._height / this._dpi);
    this._ctx.closePath();
  }

  _updateNextImg() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._ctx.beginPath();
    this._ctx.drawImage(this._nextImg.img, 0, 0, this._width / this._dpi, this._height / this._dpi, 0, 0, this._width / this._dpi, this._height / this._dpi);
    this._ctx.closePath();
  }
}
