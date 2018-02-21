import sono from 'sono';
import 'sono/effects/analyser';

class AudioController {
  constructor() {
    this._sounds = [];
  }

  createSound({ id, url, loop = false, useAnalyser = false }) {
    const sound = sono.create({
      url,
      loop,
    });

    sound.id = id;

    if (useAnalyser) {
      sound.analyser = sound.effects.add(sono.analyser());
    }

    this._sounds.push(sound);

    return sound;
  }

  getSound(id) {
    for (let i = 0; i < this._sounds.length; i++) {
      if (this._sounds[i].id === id) {
        return this._sounds[i];
      }
    }

    return null;
  }

  getAmplitude(id) {
    const sound = this.getSound(id);
    return sound.analyser.getWaveform();
  }

  getAverageAmplitude(id, _range) {
    const sound = this.getSound(id);
    const wave = sound.analyser.getWaveform();
    const range = _range || [0, 1];

    let sum = 0;
    const i = Math.floor(wave.length * range[0]);
    const length = Math.floor(i + wave.length * ( range[1] - range[0] ));

    for (let j = i; j < length; j++) {
      sum += wave[j];
    }

    // return sum / wave.length / 256;
    return sum / length;
  }

  playSound(id, { loop = false } = {}) {
    for (let i = 0; i < this._sounds.length; i++) {
      if (this._sounds[i].id === id) {
        if (loop) this._sounds[i].loop = true;
        this._sounds[i].play();
      }
    }
  }
}

window.AudioController = new AudioController();

export default window.AudioController;
