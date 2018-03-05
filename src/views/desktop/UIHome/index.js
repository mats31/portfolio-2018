import States from 'core/States';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import ProjectDescription from './ProjectDescription';
import template from './ui_home.tpl.html';
import './ui_home.scss';


@visible()
export default class DesktopHomeView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._setupProjectDescription();

    this._setupEvents();
  }

  _setupProjectDescription() {
    this._projectDescription = new ProjectDescription({
      parent: this._el,
    });

    this._projectDescription.updateProject(projectList.projects[0]);
  }

  _setupEvents() {
    Signals.onResize.add(this._onResize);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {
    this._el.style.display = 'none';
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    console.log('width: ', vw);
    console.log('height: ', vh);
  }

  // Update --------------------------------------------------------------------
  update() {
    const index = Math.floor( ( States.global.progress + (1 / projectList.projects.length) * 2 ) % projectList.projects.length );
    this._projectDescription.updateProject(projectList.projects[index]);
  }

}
