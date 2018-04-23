import States from 'core/States';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { map, randomFloat } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, active } from 'core/decorators';
import template from './about.tpl.html';
import './about.scss';


@visible()
@active()
export default class DesktopAboutView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {};
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._el.style.display = 'block';
    // TweenLite.to(
    //   this._el,
    //   0.6,
    //   {
    //     opacity: 1,
    //     ease: 'Power2.easeOut',
    //   },
    // );
  }

  hide({ delay = 0 } = {}) {
    this._el.style.display = 'none';
    // TweenLite.to(
    //   this._el,
    //   0.6,
    //   {
    //     // delay: 0.4,
    //     opacity: 0,
    //     ease: 'Power2.easeOut',
    //     onComplete: () => {
    //       this._el.style.display = 'none';
    //     },
    //   },
    // );
  }

}
