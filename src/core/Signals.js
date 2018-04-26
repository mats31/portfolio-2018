import Signal from 'min-signal';

class Signals {

  constructor() {

    // General
    this.onResize = new Signal();
    this.onScroll = new Signal();
    this.onScrollWheel = new Signal();
    this.onApplicationStart = new Signal();
    this.onSetLowMode = new Signal();

    // Assets
    this.onAssetLoaded = new Signal();
    this.onAssetsLoaded = new Signal();

    // Timeline
    this.onTimelineProjectHover = new Signal();

    // Points
    this.onColorStocked = new Signal();
  }
}

window.Signals = new Signals();

export default window.Signals;
