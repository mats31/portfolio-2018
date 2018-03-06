import States from 'core/States';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './project_view.tpl.html';
import './project_view.scss';


@visible()
export default class DesktopProjectView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      mediaContainer: this._el.querySelector('.js-project__medias'),
      title: this._el.querySelector('.js-project__viewTitle'),
      description: this._el.querySelector('.js-project__viewDescription'),
    };
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

  updateProject() {
    const project = projectList.getProject(States.router.getLastRouteResolved().params.id);

    this._ui.title.innerHTML = project.title;
    this._ui.description.innerHTML = project.description;

    for (let i = 0; i < project.medias.length; i++) {
      const media = project.medias[i];

      if (media.type === 'image') {
        const img = new Image();
        img.classList.add('js-project__viewImg');
        img.classList.add('project__viewImg');
        img.src = media.url;
        this._ui.mediaContainer.appendChild(img);
      }
    }
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
