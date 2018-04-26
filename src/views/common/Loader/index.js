import States from 'core/States';
import raf from 'raf';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './loader.tpl.html';
import './loader.scss';


@visible()
export default class LoaderView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._callsColorsStocked = 0;
    this._previousDate = null;

    this._values = [];

    this._assetsLoaded = false;

    this.setupDOM();
    this.setupEvents();

    this.show();
  }

  setupDOM() {
    this.counter = document.createElement('div');
    this.el.appendChild(this.counter);
  }

  setupEvents() {
    Signals.onAssetLoaded.add(this.onAssetsLoaded);
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
    Signals.onColorStocked.add(this._onColorStocked);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {

    TweenLite.to(
      this.el,
      2,
      {
        delay,
        opacity: 0,
        onComplete: () => { this.el.style.display = 'none'; },
      },
    );
  }

  // Events --------------------------------------------------------------------
  @autobind
  _onColorStocked() {
    if (this._assetsLoaded && this._callsColorsStocked === 1) {
      TweenLite.delayedCall(0.8, this._checkFPS );
    }

    this._callsColorsStocked++;
  }

  @autobind
  onAssetLoaded(percent) {
    const value = `${percent}%`;

    this.counter.innerHTML = value;
  }
  @autobind
  onAssetsLoaded(percent) {

    const value = `${percent}%`;

    this.counter.innerHTML = value;

    this._assetsLoaded = true;
  }

  // Update -----------

  @autobind
  _checkFPS() {
    this._raf = raf(this._checkFPS);

    const date = Date.now();

    if (!this._previousDate) {
      this._previousDate = date;
      return;
    }

    this._values.push(date - this._previousDate);

    if (this._values.length >= 150) {
      this._stopCheckFPS();

      return;
    }

    this._previousDate = date;
  }

  _stopCheckFPS() {

    let sum = 0;
    for (let i = 0; i < this._values.length; i++) {
      sum += this._values[i];
    }

    const average = sum / this._values.length;

    // if (average > 22.22222222) {
      Signals.onSetLowMode.dispatch();
    // }

    console.log('hide loader');
    this.hide();

    raf.cancel(this._raf);
  }

}
