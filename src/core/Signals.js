import Signal from 'min-signal';

class Signals {

  constructor() {

    // Assets
    this.onAssetLoaded = new Signal();
    this.onAssetsLoaded = new Signal();
    this.onScrollWheel = new Signal();

    // General
    this.onResize = new Signal();
    this.onScroll = new Signal();
  }
}

window.Signals = new Signals();

export default window.Signals;
