import States from 'core/States';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './project_description.tpl.html';
import './project_description.scss';


@visible()
export default class DesktopProjectDescriptioView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      title: this._el.querySelector('.js-UIHome__projectDescriptionTitle'),
      subtitle: this._el.querySelector('.js-UIHome__projectDescriptionSubtitle'),
    };

    this._project = null;
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }

  updateProject(project) {

    if (project !== this._project) {
      this._project = project;
      this._ui.title.innerHTML = project.title;
      this._ui.subtitle.innerHTML = project.subtitle;
    }
  }
}
