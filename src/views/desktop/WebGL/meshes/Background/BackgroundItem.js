import AbstractInstanced from 'helpers/3d/Instanced/AbstractInstanced';

export default class BackgroundInstancedItems extends AbstractInstanced {
  constructor(options) {
    super(options);

    this._setupAttributes();
  }

  _setupAttributes() {
    const aPos = this.getAttribute('aPos');
    const aScale = this.getAttribute('aScale');

    for ( let i = 0; i < this._nb; i++) {
      aPos.setXYZW(i, 0, 0, 0, 1);
      aScale.setXYZ(i, 10, 10, 10);
    }

    aPos.needsUpdate = true;
    aScale.needsUpdate = true;
  }
}
