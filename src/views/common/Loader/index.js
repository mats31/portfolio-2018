import States from 'core/States';
import createDOM from 'utils/dom/createDOM';
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

    this.setupDOM();
    this.setupEvents();

    this.show();
  }

  setupDOM() {
    this.counter = document.createElement('div');
    this.el.appendChild(this.counter);
  }

  setupEvents() {
    // Signals.onAssetLoaded.add(this.onAssetsLoaded);
    // Signals.onAssetsLoaded.add(this.onAssetsLoaded);
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
  onAssetLoaded(percent) {
    const value = `${percent}%`;

    this.counter.innerHTML = value;
  }
  @autobind
  onAssetsLoaded(percent) {

    const value = `${percent}%`;

    this.counter.innerHTML = value;
    this.hide();
  }

}
